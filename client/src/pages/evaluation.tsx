import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AppQuestion, AppEvaluation } from "@/types";
import QuestionMultipleChoice from "@/components/question-multiple-choice";
import QuestionStarRating from "@/components/question-star-rating";
import QuestionFreeText from "@/components/question-free-text";

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export default function Evaluation() {
  const [, setLocation] = useLocation();
  const { user, currentProduct, setCurrentEvaluation } = useAppState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStage, setCurrentStage] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [stageAnswers, setStageAnswers] = useState<Record<number, any>>({});
  const [draftId, setDraftId] = useState<number | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnings, setEarnings] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);
  const [showStageComplete, setShowStageComplete] = useState(false);
  const [allAnswers, setAllAnswers] = useState<Record<string, any>>({});

  // Load draft on mount
  const { data: draftData, isLoading: draftLoading } = useQuery({
    queryKey: [`/api/evaluations/draft?userId=${user?.id}&productId=${currentProduct?.id}`],
    enabled: !!user?.id && !!currentProduct?.id,
    retry: false,
  });



  // Get questions for current stage
  const { data: questions = [], isLoading: questionsLoading } = useQuery<AppQuestion[]>({
    queryKey: [`/api/products/${currentProduct?.id}/questions?stage=${currentStage}`],
    enabled: !!currentProduct?.id,
  });

  // Save draft mutation with retry logic
  const { mutate: saveDraft } = useMutation({
    mutationFn: async (payload: any) => {
      const response = await apiRequest("POST", "/api/evaluations/draft", payload);
      return response.json();
    },
    onSuccess: (data) => {
      setDraftId(data.draftId);
      toast({
        title: "Progreso guardado",
        description: "Tus respuestas han sido guardadas automáticamente",
      });
      setRetryCount(0);
    },
    onError: () => {
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        // Retry with exponential backoff
        setTimeout(() => {
          saveDraft({
            draftId,
            userId: user?.id,
            productId: currentProduct?.id,
            stage: currentStage,
            partialAnswers: { ...allAnswers, [`stage_${currentStage}`]: stageAnswers }
          });
        }, Math.pow(2, retryCount) * 1000);
      } else {
        toast({
          title: "Error al guardar progreso",
          description: "Revisa tu conexión. Puedes reintentar manualmente.",
          variant: "destructive",
        });
      }
    },
  });

  // Complete evaluation mutation
  const { mutate: completeEvaluation } = useMutation({
    mutationFn: async (answers: Record<string, any>) => {
      const response = await apiRequest("POST", "/api/evaluations", {
        userId: user?.id,
        productId: currentProduct?.id,
        answers,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setEarnings(data.earning);
      setShowCompletionModal(true);
      // Delete draft
      if (draftId) {
        apiRequest("DELETE", `/api/evaluations/draft/${draftId}`, {});
      }
      // Invalidate user data to refresh balance
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  // Load draft data on component mount
  useEffect(() => {
    if (draftData?.draft) {
      const draft = draftData.draft;
      setDraftId(draft.draftId);
      setCurrentStage(draft.stage);
      setAllAnswers(draft.partialAnswers || {});
      
      const stageAnswers = draft.partialAnswers?.[`stage_${draft.stage}`] || {};
      setStageAnswers(stageAnswers);
      
      // Calculate current question index and answered count
      const answeredQuestions = Object.keys(stageAnswers).length;
      setAnsweredCount(answeredQuestions);
      setCurrentQuestionIndex(answeredQuestions);
    }
  }, [draftData]);

  // Create debounced save function
  const debouncedSave = useCallback(
    debounce((stageAnswers: Record<number, any>) => {
      const updatedAllAnswers = {
        ...allAnswers,
        [`stage_${currentStage}`]: stageAnswers
      };
      const payload = {
        draftId,
        userId: user?.id,
        productId: currentProduct?.id,
        stage: currentStage,
        partialAnswers: updatedAllAnswers
      };
      saveDraft(payload);
    }, 500),
    [draftId, user?.id, currentProduct?.id, currentStage, allAnswers]
  );

  // Auto-save when answers change
  useEffect(() => {
    if (Object.keys(stageAnswers).length > 0) {
      debouncedSave(stageAnswers);
    }
  }, [stageAnswers]);

  const handleBack = () => {
    setLocation("/main");
  };

  const handleAnswerChange = (questionId: number, answer: any, questionType: string) => {
    // Check if this is a new answer
    const isNewAnswer = !stageAnswers[questionId];
    
    setStageAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));

    // Auto-advance for single-choice and star-rating questions
    if (questionType === 'multiple_choice' || questionType === 'star_rating') {
      // Update answered count only if this is a new answer
      if (isNewAnswer) {
        setAnsweredCount(prev => prev + 1);
      }
      
      // Show success toast
      toast({
        title: "Progreso guardado",
        description: "Tu respuesta ha sido registrada",
      });

      // Auto-advance with smooth animation
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          // All questions answered - show stage complete
          setShowStageComplete(true);
        }
      }, 300);
    }
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion || !stageAnswers[currentQuestion.id]) {
      return; // Don't advance if no answer
    }

    setAnsweredCount(prev => prev + 1);
    
    // Show success toast
    toast({
      title: "Progreso guardado",
      description: "Tu respuesta ha sido registrada",
    });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions answered - show stage complete
      setShowStageComplete(true);
    }
  };

  const handleNextStage = () => {
    if (currentStage < 3) {
      setCurrentStage(currentStage + 1);
      setCurrentQuestionIndex(0);
      setAnsweredCount(0);
      setShowStageComplete(false);
      setStageAnswers(allAnswers[`stage_${currentStage + 1}`] || {});
    } else {
      // Complete evaluation
      const finalAnswers = {
        ...allAnswers,
        [`stage_${currentStage}`]: stageAnswers
      };
      completeEvaluation(finalAnswers);
    }
  };

  const isStageComplete = () => {
    return answeredCount === questions.length;
  };

  const canContinue = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return false;
    
    const answer = stageAnswers[currentQuestion.id];
    if (currentQuestion.type === 'free_text') {
      return answer && answer.trim() !== '';
    }
    return answer !== undefined && answer !== '';
  };

  const handleModalClose = () => {
    setShowCompletionModal(false);
    setLocation("/wallet");
  };

  if (!currentProduct) {
    return <div>No product selected</div>;
  }

  if (draftLoading || questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  // Hide total product count from users for better UX
  const progressPercentage = (answeredCount / questions.length) * 100;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={handleBack} className="text-neutral-600 hover:text-neutral-800">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-neutral-800">
                Evaluación de Producto
              </h2>
              <p className="text-sm text-neutral-600">Etapa {currentStage} de 3</p>
            </div>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progressPercentage} className="h-2" />

        {/* Product Info - Instagram style */}
        <Card className="mx-4 mt-4 border border-neutral-200">
          <CardContent className="p-0">
            {/* Instagram-style square image */}
            <div className="aspect-square w-full">
              <img 
                src={currentProduct.imageUrl} 
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-neutral-600">
                Evaluación en progreso • {answeredCount}/{questions.length} respondidas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Questions Area */}
        <div className="p-4 pb-24">
          {showStageComplete ? (
            // Stage Completion View
            <Card className="border border-neutral-200">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                  Has completado la Etapa {currentStage}
                </h3>
                <p className="text-neutral-600 mb-6">
                  Todas las preguntas han sido respondidas correctamente
                </p>
                <Button
                  onClick={handleNextStage}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold text-lg"
                >
                  {currentStage < 3 ? "Siguiente etapa" : "Finalizar evaluación"}
                </Button>
              </CardContent>
            </Card>
          ) : currentQuestion ? (
            // Single Question View
            <Card className="border border-neutral-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-neutral-800 mb-4">
                  {currentQuestion.questionNumber}. {currentQuestion.question}
                </h3>
                
                {currentQuestion.type === "multiple_choice" && (
                  <QuestionMultipleChoice
                    question={currentQuestion}
                    value={stageAnswers[currentQuestion.id]}
                    onChange={(value) => handleAnswerChange(currentQuestion.id, value, currentQuestion.type)}
                  />
                )}
                
                {currentQuestion.type === "star_rating" && (
                  <QuestionStarRating
                    question={currentQuestion}
                    value={stageAnswers[currentQuestion.id]}
                    onChange={(value) => handleAnswerChange(currentQuestion.id, value, currentQuestion.type)}
                  />
                )}
                
                {currentQuestion.type === "free_text" && (
                  <>
                    <QuestionFreeText
                      question={currentQuestion}
                      value={stageAnswers[currentQuestion.id]}
                      onChange={(value) => handleAnswerChange(currentQuestion.id, value, currentQuestion.type)}
                    />
                    <Button
                      onClick={handleNextQuestion}
                      disabled={!canContinue()}
                      className="w-full mt-4 bg-primary text-white py-3 px-6 rounded-lg font-semibold disabled:bg-neutral-300 disabled:cursor-not-allowed"
                    >
                      Continuar
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-600">No hay preguntas disponibles</p>
            </div>
          )}
        </div>


      </div>

      {/* Completion Modal */}
      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-primary h-8 w-8" />
            </div>
            <DialogTitle className="text-xl font-bold text-neutral-800">
              ¡Completado!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-lg text-neutral-700">
              Has ganado <span className="font-bold text-primary">R$ {earnings}</span>
            </p>
            <Button
              onClick={handleModalClose}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold"
            >
              Ver mi saldo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
