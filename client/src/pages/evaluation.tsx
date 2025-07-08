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
  const [stageAnswers, setStageAnswers] = useState<Record<number, any>>({});
  const [allAnswers, setAllAnswers] = useState<Record<string, any>>({});
  const [draftId, setDraftId] = useState<number | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnings, setEarnings] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);

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
      setStageAnswers(draft.partialAnswers?.[`stage_${draft.stage}`] || {});
    }
  }, [draftData]);

  // Auto-save when answers change with debouncing
  useEffect(() => {
    if (Object.keys(stageAnswers).length > 0) {
      const updatedAllAnswers = {
        ...allAnswers,
        [`stage_${currentStage}`]: stageAnswers
      };
      setAllAnswers(updatedAllAnswers);
      
      // Debounce the save operation
      const timeoutId = setTimeout(() => {
        const payload = {
          draftId,
          userId: user?.id,
          productId: currentProduct?.id,
          stage: currentStage,
          partialAnswers: updatedAllAnswers
        };
        saveDraft(payload);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [stageAnswers, currentStage, allAnswers]);

  const handleBack = () => {
    setLocation("/main");
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setStageAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextStage = () => {
    if (currentStage < 3) {
      setCurrentStage(currentStage + 1);
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
    return questions.every(q => stageAnswers[q.id] !== undefined && stageAnswers[q.id] !== "");
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

  const totalProducts = 4; // This could come from app state
  const currentProductIndex = 1; // This could be calculated from current product
  const answeredQuestions = Object.keys(stageAnswers).length;
  const totalStageQuestions = questions.length;
  const progressPercentage = ((currentStage - 1) / 3) * 100 + (answeredQuestions / (totalStageQuestions * 3)) * 100;

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
                Producto {currentProductIndex} de {totalProducts}
              </h2>
              <p className="text-sm text-neutral-600">Etapa {currentStage} de 3</p>
            </div>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progressPercentage} className="h-2" />

        {/* Product Info */}
        <Card className="mx-4 mt-4 border border-neutral-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <img 
                src={currentProduct.imageUrl} 
                alt={currentProduct.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="ml-4">
                <h3 className="font-semibold text-neutral-800">{currentProduct.name}</h3>
                <p className="text-sm text-neutral-600">
                  Evaluación en progreso • {answeredQuestions}/{totalStageQuestions} respondidas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="p-4 space-y-6 pb-24">
          {questions.map((question) => (
            <Card key={question.id} className="border border-neutral-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-neutral-800 mb-4">
                  {question.questionNumber}. {question.question}
                </h3>
                
                {question.type === "multiple_choice" && (
                  <QuestionMultipleChoice
                    question={question}
                    value={stageAnswers[question.id]}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                  />
                )}
                
                {question.type === "star_rating" && (
                  <QuestionStarRating
                    question={question}
                    value={stageAnswers[question.id]}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                  />
                )}
                
                {question.type === "free_text" && (
                  <QuestionFreeText
                    question={question}
                    value={stageAnswers[question.id]}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4">
          <Button
            onClick={handleNextStage}
            disabled={!isStageComplete()}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-primary/90 disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {currentStage < 3 ? "Siguiente etapa" : "Finalizar evaluación"}
          </Button>
          <p className="text-xs text-neutral-500 mt-2 text-center">
            Progreso guardado automáticamente
          </p>
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
