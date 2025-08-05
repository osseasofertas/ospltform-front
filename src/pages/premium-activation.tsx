import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function PremiumActivation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, becomePremiumReviewer } = useAppState();
  const [isActivating, setIsActivating] = useState(false);
  const [activationStatus, setActivationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Auto-activate premium status when page loads
    handleActivatePremium();
  }, []);

  const handleActivatePremium = async () => {
    if (!user) {
      setActivationStatus('error');
      toast({
        title: "Authentication required",
        description: "Please log in to activate premium status.",
        variant: "destructive",
      });
      return;
    }

    setIsActivating(true);
    try {
      await becomePremiumReviewer();
      setActivationStatus('success');
      toast({
        title: "Premium activated successfully!",
        description: "You are now a premium reviewer with queue advantages!",
      });
    } catch (error) {
      console.error("Premium activation error:", error);
      setActivationStatus('error');
      toast({
        title: "Activation failed",
        description: "Failed to activate premium status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActivating(false);
    }
  };

  const handleGoToWallet = () => {
    setLocation("/wallet");
  };

  const handleGoToMain = () => {
    setLocation("/main");
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Crown className="h-16 w-16 text-yellow-600 mx-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-neutral-800">
            Premium Activation
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {activationStatus === 'idle' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-neutral-600">
                Activating your premium status...
              </p>
            </div>
          )}

          {activationStatus === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Premium Activated!
                </h3>
                <p className="text-neutral-600 mb-4">
                  Congratulations! You are now a premium reviewer with priority access to the withdrawal queue.
                </p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={handleGoToWallet} 
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Go to Wallet
                </Button>
                <Button 
                  onClick={handleGoToMain} 
                  variant="outline" 
                  className="w-full"
                >
                  Go to Main Page
                </Button>
              </div>
            </div>
          )}

          {activationStatus === 'error' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Activation Failed
                </h3>
                <p className="text-neutral-600 mb-4">
                  There was an error activating your premium status. Please try again.
                </p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={handleActivatePremium} 
                  disabled={isActivating}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {isActivating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Activating...
                    </>
                  ) : (
                    "Try Again"
                  )}
                </Button>
                <Button 
                  onClick={handleGoToMain} 
                  variant="outline" 
                  className="w-full"
                >
                  Go to Main Page
                </Button>
              </div>
            </div>
          )}

          <div className="text-center pt-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-500">
              Thank you for choosing premium membership!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 