import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { AppQuestion } from "@/types";
import { getQuestionsByStage } from "@/data/questions";
import QuestionMultipleChoice from "@/components/question-multiple-choice";
import QuestionStarRating from "@/components/question-star-rating";
import QuestionFreeText from "@/components/question-free-text";

// Frontend-only evaluation component

export default function Evaluation() {
  const [, setLocation] = useLocation();
  const { user, currentProduct, completeEvaluation, incrementDailyEvaluations } = useAppState();
  const { toast } = useToast();
  
  const [currentStage, setCurrentStage] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [stageAnswers, setStageAnswers] = useState<Record<number, any>>({});
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnings, setEarnings] = useState<string>("");
  const [showStageComplete, setShowStageComplete] = useState(false);
  const [allAnswers, setAllAnswers] = useState<Record<string, any>>({});

  // Frontend-only questions - no API call needed
  const questions = currentProduct ? getQuestionsByStage(currentProduct.id, currentStage) : [];
  const isLoading = false;

  // Frontend-only save function - saves to localStorage via Zustand
  const saveDraftToLocalStorage = (answers: Record<string, any>) => {
    if (currentProduct && user) {
      const draftKey = `evaluation_draft_${user.id}_${currentProduct.id}`;
      const draftData = {
        userId: user.id,
        productId: currentProduct.id,
        stage: currentStage,
        answers: answers,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
    }
  };

  // Frontend-only completion function
  const completeEvaluationLocal = (finalAnswers: Record<string, any>) => {
    if (currentProduct && user) {
      // Calculate random earning within product range
      const minEarning = parseFloat(currentProduct.minEarning);
      const maxEarning = parseFloat(currentProduct.maxEarning);
      const earning = (minEarning + (Math.random() * (maxEarning - minEarning))).toFixed(2);
      
      // Use the app state function to handle completion
      completeEvaluation(currentProduct.id, earning);
      incrementDailyEvaluations();
      
      setEarnings(earning);
      setShowCompletionModal(true);
      
      // Clear draft from localStorage
      const draftKey = `evaluation_draft_${user.id}_${currentProduct.id}`;
      localStorage.removeItem(draftKey);
      
      toast({
        title: "Evaluation completed!",
        description: `You earned $${earning} for this evaluation`,
      });
    }
  };

  // Load draft data from localStorage on component mount
  useEffect(() => {
    if (currentProduct && user) {
      const draftKey = `evaluation_draft_${user.id}_${currentProduct.id}`;
      const savedDraft = localStorage.getItem(draftKey);
      
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setCurrentStage(draft.stage || 1);
          setAllAnswers(draft.answers || {});
          
          const stageAnswers = draft.answers?.[`stage_${draft.stage || 1}`] || {};
          setStageAnswers(stageAnswers);
          
          // Calculate current question index and answered count
          const answeredQuestions = Object.keys(stageAnswers).length;
          setAnsweredCount(answeredQuestions);
          setCurrentQuestionIndex(answeredQuestions);
        } catch (error) {
          console.error("Error loading draft from localStorage:", error);
        }
      }
    }
  }, [currentProduct, user]);

  // Auto-save to localStorage when answers change
  useEffect(() => {
    if (Object.keys(stageAnswers).length > 0) {
      const updatedAllAnswers = {
        ...allAnswers,
        [`stage_${currentStage}`]: stageAnswers
      };
      setAllAnswers(updatedAllAnswers);
      saveDraftToLocalStorage(updatedAllAnswers);
    }
  }, [stageAnswers, currentStage]);

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
        title: "Answer saved",
        description: "Your progress is automatically saved",
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
      title: "Answer saved", 
      description: "Your progress is automatically saved",
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
      completeEvaluationLocal(finalAnswers);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading questions...</p>
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
                Product Evaluation
              </h2>
              <p className="text-sm text-neutral-600">Stage {currentStage} of 3</p>
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
                Evaluation in progress • {answeredCount}/{questions.length} answered
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
                  You have completed Stage {currentStage}
                </h3>
                <p className="text-neutral-600 mb-6">
                  All questions have been answered correctly
                </p>
                <Button
                  onClick={handleNextStage}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold text-lg"
                >
                  {currentStage < 3 ? "Next stage" : "Finish evaluation"}
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
                      Continue
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-600">No questions available</p>
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
              Completed!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-lg text-neutral-700">
              You earned <span className="font-bold text-primary">${earnings}</span>
            </p>
            <Button
              onClick={handleModalClose}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold"
            >
              View my balance
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
