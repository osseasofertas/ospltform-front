import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";

export default function Results() {
  const [, setLocation] = useLocation();
  const { user, currentContent } = useAppState();

  // Get the actual earning from the completed evaluation
  const actualEarning = currentContent ? 
    (parseFloat(currentContent.minEarning) + Math.random() * (parseFloat(currentContent.maxEarning) - parseFloat(currentContent.minEarning))).toFixed(2) : 
    "3.25";

  // Calculate stage earnings for photos (ensure sum equals total)
  const totalEarning = parseFloat(actualEarning);
  const stage1Earning = currentContent?.type === "photo" ? (totalEarning / 3).toFixed(2) : "0.00";
  const stage2Earning = currentContent?.type === "photo" ? (totalEarning / 3).toFixed(2) : "0.00";
  // Calculate stage 3 to ensure exact sum
  const stage3Earning = currentContent?.type === "photo" ? 
    (totalEarning - parseFloat(stage1Earning) - parseFloat(stage2Earning)).toFixed(2) : "0.00";

  const handleViewWallet = () => {
    setLocation("/wallet");
  };

  const handleContinueEvaluating = () => {
    setLocation("/main");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex flex-col justify-center p-6">
      <div className="max-w-md mx-auto w-full text-center">
        {/* Success Icon */}
        <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="text-primary h-12 w-12" />
        </div>
        
        {/* Success Message */}
        <h1 className="text-3xl font-bold text-white mb-4">Completed!</h1>
        <p className="text-xl text-white mb-2">You earned</p>
        <p className="text-4xl font-bold text-white mb-8">${actualEarning}</p>
        
        {/* Content Type Info */}
        {currentContent && (
          <div className="mb-6">
            <p className="text-white/80 text-sm">
              {currentContent.type === "photo" ? "Photo Evaluation" : "Video Evaluation"}
            </p>
            <p className="text-white/60 text-xs">
              {currentContent.title}
            </p>
          </div>
        )}
        
        {/* Earnings Breakdown */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-4">
            <div className="space-y-2 text-white/90">
              {currentContent?.type === "photo" ? (
                <>
                  <div className="flex justify-between items-center">
                    <span>Stage 1 completed</span>
                    <span>${stage1Earning}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Stage 2 completed</span>
                    <span>${stage2Earning}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Stage 3 completed</span>
                    <span>${stage3Earning}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <span>Video evaluation completed</span>
                  <span>${actualEarning}</span>
                </div>
              )}
              <div className="border-t border-white/20 pt-2 mt-2">
                <div className="flex justify-between items-center text-white font-semibold">
                  <span>Total earned</span>
                  <span>${actualEarning}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={handleViewWallet}
            className="w-full bg-white text-primary py-3 px-6 rounded-lg font-semibold text-lg hover:bg-neutral-100 shadow-lg"
          >
            View my balance
          </Button>
          <Button
            onClick={handleContinueEvaluating}
            variant="outline"
            className="w-full bg-white/20 text-white py-3 px-6 rounded-lg font-semibold border border-white/30 hover:bg-white/30"
          >
            Continue evaluating
          </Button>
        </div>
      </div>
    </div>
  );
}
