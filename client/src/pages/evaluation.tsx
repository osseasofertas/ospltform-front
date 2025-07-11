import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Trophy, Star, Play, Pause } from "lucide-react";
import { useLocation } from "wouter";
import { useAppState } from "@/hooks/use-app-state";
import { toast } from "@/hooks/use-toast";

export default function Evaluation() {
  const [, setLocation] = useLocation();
  const { user, currentContent, completeEvaluation, incrementDailyEvaluations } = useAppState();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [improvements, setImprovements] = useState<string>("");
  const [photoAnswers, setPhotoAnswers] = useState<{[key: number]: number}>({});
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnings, setEarnings] = useState<string>("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!currentContent || !user) {
      setLocation("/");
      return;
    }
  }, [currentContent, user, setLocation]);

  const handleVideoPlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoPause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
    setIsPlaying(false);
  };

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleComplete = () => {
    if (!currentContent || !user) return;

    // For photos, check if all questions are answered
    if (currentContent.type === "photo") {
      if (Object.keys(photoAnswers).length < 3) {
        toast({
          title: "Complete all questions",
          description: "Please answer all 3 questions before submitting",
          variant: "destructive"
        });
        return;
      }
    } else {
      // For videos, check rating and feedback
      if (rating === 0) {
        toast({
          title: "Rating required",
          description: "Please provide a rating before submitting",
          variant: "destructive"
        });
        return;
      }

      if (feedback.trim().length < 10) {
        toast({
          title: "Feedback required",
          description: "Please provide at least 10 characters of feedback",
          variant: "destructive"
        });
        return;
      }
    }

    // Calculate random earning within content range
    const minEarning = parseFloat(currentContent.minEarning);
    const maxEarning = parseFloat(currentContent.maxEarning);
    const earning = (minEarning + (Math.random() * (maxEarning - minEarning))).toFixed(2);
    
    // Complete evaluation
    completeEvaluation(currentContent.id, earning);
    incrementDailyEvaluations();
    
    setEarnings(earning);
    setShowCompletionModal(true);
    
    toast({
      title: "Evaluation completed!",
      description: `You earned $${earning} for this evaluation`,
    });
  };

  const handleReturnHome = () => {
    setLocation("/");
  };

  if (!currentContent) {
    return null;
  }

  const canSubmit = currentContent.type === "photo" || (currentContent.type === "video" && videoEnded);

  // Photo evaluation questions
  const photoQuestions = [
    {
      id: 1,
      question: "How much did this photo provoke your imagination without showing everything?",
      options: [
        { value: 5, label: "Very good – Left me wanting more" },
        { value: 4, label: "Good – Made me curious" },
        { value: 3, label: "Average – Could be bolder" },
        { value: 2, label: "Poor – Didn't feel much" },
        { value: 1, label: "Very poor – Not provocative" }
      ]
    },
    {
      id: 2,
      question: "Did the way the body was shown seem tempting or forced?",
      options: [
        { value: 5, label: "Very good – Natural, sensual and perfect" },
        { value: 4, label: "Good – Really caught my attention" },
        { value: 3, label: "Average – Pretty, but no impact" },
        { value: 2, label: "Poor – Pose was kind of dull" },
        { value: 1, label: "Very poor – Not attractive" }
      ]
    },
    {
      id: 3,
      question: "Would this photo make you click to see more or scroll past in the feed?",
      options: [
        { value: 5, label: "Very good – Would stop immediately to see" },
        { value: 4, label: "Good – Caught attention" },
        { value: 3, label: "Average – Maybe, but missing something" },
        { value: 2, label: "Poor – Didn't hold my gaze" },
        { value: 1, label: "Very poor – Would scroll right past" }
      ]
    }
  ];

  const handlePhotoAnswer = (questionId: number, value: number) => {
    setPhotoAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="p-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-neutral-800">
              {currentContent.type === "photo" ? "Rate Photo" : "Watch & Rate Video"}
            </h1>
            <p className="text-sm text-neutral-600">
              Single evaluation • ${currentContent.minEarning} - ${currentContent.maxEarning}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Content Display */}
        <Card>
          <CardContent className="p-0">
            {currentContent.type === "photo" ? (
              <div className="aspect-square w-full">
                <img 
                  src={currentContent.url} 
                  alt={currentContent.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={currentContent.url}
                  className="w-full aspect-video rounded-lg bg-black"
                  onEnded={handleVideoEnded}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  controls={false}
                />
                
                {/* Custom video controls */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {!isPlaying && !videoEnded && (
                    <Button
                      onClick={handleVideoPlay}
                      size="lg"
                      className="rounded-full w-16 h-16 bg-white/90 hover:bg-white text-black"
                    >
                      <Play className="h-8 w-8 ml-1" />
                    </Button>
                  )}
                </div>

                {/* Video message */}
                {!videoEnded && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⏳ Please watch the entire video before rating options become available
                    </p>
                  </div>
                )}

                {videoEnded && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ Video completed! You can now rate and provide feedback
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evaluation Forms */}
        {canSubmit && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evaluation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentContent.type === "photo" ? (
                // Photo evaluation questions
                <div className="space-y-8">
                  {photoQuestions.map((question, index) => (
                    <div key={question.id} className="space-y-4">
                      <h3 className="font-medium text-neutral-800">
                        {index + 1}. {question.question}
                      </h3>
                      <div className="space-y-3">
                        {question.options.map((option) => (
                          <label
                            key={option.value}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                              photoAnswers[question.id] === option.value
                                ? "border-primary bg-primary/5"
                                : "border-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option.value}
                              checked={photoAnswers[question.id] === option.value}
                              onChange={() => handlePhotoAnswer(question.id, option.value)}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                              photoAnswers[question.id] === option.value
                                ? "border-primary bg-primary"
                                : "border-neutral-300"
                            }`}>
                              {photoAnswers[question.id] === option.value && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                            <span className="text-sm text-neutral-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Video evaluation (star rating + feedback)
                <div className="space-y-6">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Overall Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleStarClick(star)}
                          className="focus:outline-none transition-all duration-150"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-neutral-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="text-sm text-neutral-600 mt-2">
                        You rated this {rating} out of 5 stars
                      </p>
                    )}
                  </div>

                  {/* Feedback */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      What did you think about this video?
                    </label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share your thoughts about the content..."
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Improvements */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      What could be improved? (Optional)
                    </label>
                    <Textarea
                      value={improvements}
                      onChange={(e) => setImprovements(e.target.value)}
                      placeholder="Suggestions for improvement..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleComplete}
                disabled={
                  currentContent.type === "photo" 
                    ? Object.keys(photoAnswers).length < 3
                    : rating === 0 || feedback.trim().length < 10
                }
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3"
              >
                Submit Evaluation & Earn ${currentContent.minEarning} - ${currentContent.maxEarning}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Video controls overlay when playing */}
        {currentContent.type === "video" && isPlaying && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <Button
              onClick={handleVideoPause}
              className="rounded-full bg-black/80 hover:bg-black text-white"
            >
              <Pause className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
                <span className="text-xl">Evaluation Complete!</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-green-600">
              +${earnings}
            </div>
            <p className="text-neutral-600">
              Great job! Your evaluation has been submitted and your earning has been added to your balance.
            </p>
            
            <Button
              onClick={handleReturnHome}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold"
            >
              Return to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}