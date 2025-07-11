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

        {/* Rating and Feedback */}
        {canSubmit && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evaluation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  What did you think about this {currentContent.type}?
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

              {/* Submit Button */}
              <Button
                onClick={handleComplete}
                disabled={rating === 0 || feedback.trim().length < 10}
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