import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AppQuestion, AppEvaluation } from "@/types";
import QuestionMultipleChoice from "@/components/question-multiple-choice";
import QuestionStarRating from "@/components/question-star-rating";
import QuestionFreeText from "@/components/question-free-text";

export default function Evaluation() {
  const [, setLocation] = useLocation();
  const { user, currentProduct, setCurrentEvaluation } = useAppState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStage, setCurrentStage] = useState(1);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [evaluation, setEvaluation] = useState<AppEvaluation | null>(null);

  // Create or get evaluation
  const { mutate: createEvaluation } = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/evaluations", {
        userId: user?.id,
        productId: currentProduct?.id,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setEvaluation(data);
      setCurrentEvaluation(data);
      if (data.currentStage > 1) {
        setCurrentStage(data.currentStage);
      }
    },
  });

  // Get questions for current stage
  const { data: questions = [], isLoading } = useQuery<AppQuestion[]>({
    queryKey: ["/api/questions", currentProduct?.id, currentStage],
    enabled: !!currentProduct?.id,
  });

  // Save answers mutation
  const { mutate: saveAnswers } = useMutation({
    mutationFn: async (stageAnswers: Record<number, any>) => {
      await apiRequest("POST", "/api/evaluations/save-answers", {
        evaluationId: evaluation?.id,
        stage: currentStage,
        answers: stageAnswers,
      });
    },
    onSuccess: () => {
      toast({
        title: "Progreso guardado",
        description: "Tus respuestas han sido guardadas automáticamente",
      });
    },
  });

  useEffect(() => {
    if (user && currentProduct && !evaluation) {
      createEvaluation();
    }
  }, [user, currentProduct, evaluation, createEvaluation]);

  // Auto-save answers
  useEffect(() => {
    if (answers && Object.keys(answers).length > 0) {
      const timeoutId = setTimeout(() => {
        saveAnswers(answers);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [answers, saveAnswers]);

  const handleBack = () => {
    setLocation("/main");
  };

  const handleNextStage = () => {
    if (currentStage < 3) {
      setCurrentStage(currentStage + 1);
      setAnswers({});
    } else {
      // Complete evaluation
      const earnings = (Math.random() * 2.5 + 1.5).toFixed(2);
      
      apiRequest("POST", `/api/evaluations/${evaluation?.id}/complete`, {
        userId: user?.id,
        earnings,
      }).then(() => {
        toast({
          title: "¡Evaluación completada!",
          description: `Has ganado R$ ${earnings}`,
        });
        setLocation("/results");
      });
    }
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const isStageComplete = () => {
    return questions.every(q => answers[q.id] !== undefined);
  };

  if (!currentProduct) {
    return <div>No product selected</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentStage - 1) / 3) * 100 + (currentStage === 3 ? 100 : 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="text-neutral-600 hover:text-neutral-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-neutral-800">Producto 1 de 4</h2>
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
              <p className="text-sm text-neutral-600">Evaluación en progreso</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="p-4 space-y-6">
        {questions.map((question) => (
          <Card key={question.id} className="border border-neutral-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-neutral-800 mb-4">
                {question.questionNumber}. {question.question}
              </h3>
              
              {question.type === "multiple_choice" && (
                <QuestionMultipleChoice
                  question={question}
                  value={answers[question.id]}
                  onChange={(value) => handleAnswerChange(question.id, value)}
                />
              )}
              
              {question.type === "star_rating" && (
                <QuestionStarRating
                  question={question}
                  value={answers[question.id]}
                  onChange={(value) => handleAnswerChange(question.id, value)}
                />
              )}
              
              {question.type === "free_text" && (
                <QuestionFreeText
                  question={question}
                  value={answers[question.id]}
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
          {currentStage < 3 ? "Siguiente etapa" : "Completar evaluación"}
        </Button>
      </div>
    </div>
  );
}
