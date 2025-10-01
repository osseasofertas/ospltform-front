import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const [location, setLocation] = useLocation();
  const { user, updateEvaluationLimit } = useAppState();
  const [isUpdating, setIsUpdating] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [packageInfo, setPackageInfo] = useState<any>(null);
  
  // Prevent multiple increments when reloading/visiting the success page again
  const hasAppliedUpgrade = (userId: number, targetLimit: number) => {
    try {
      const key = `limitUpgrade:${userId}:${targetLimit}`;
      return localStorage.getItem(key) === 'applied';
    } catch {
      return false;
    }
  };

  const markUpgradeApplied = (userId: number, targetLimit: number) => {
    try {
      const key = `limitUpgrade:${userId}:${targetLimit}`;
      localStorage.setItem(key, 'applied');
    } catch {}
  };

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (!user) {
        setLocation("/main");
        return;
      }

      try {
        // Prefer path-based format: /payment-success-5 or /payment-success-10
        const path = location || window.location.pathname;
        let inferredNewLimit: number | null = null;
        if (path.endsWith("/payment-success-5")) {
          inferredNewLimit = (user.evaluationLimit || 10) + 5;
        } else if (path.endsWith("/payment-success-10")) {
          inferredNewLimit = (user.evaluationLimit || 10) + 10;
        }

        let packageData: any;
        if (inferredNewLimit !== null) {
          // Build minimal package data for UI
          packageData = {
            type: inferredNewLimit - (user.evaluationLimit || 10) === 5 ? "basic" : "premium",
            currentLimit: user.evaluationLimit || 10,
            newLimit: inferredNewLimit,
            price: 0,
          };
        } else {
          // Fallback to legacy query params
          const urlParams = new URLSearchParams(window.location.search);
          const type = urlParams.get("type");
          const current = urlParams.get("current");
          const newLimitParam = urlParams.get("new");
          const price = urlParams.get("price");

          if (!type || !current || !newLimitParam) {
            console.error("Missing package data");
            setLocation("/main");
            return;
          }

          packageData = {
            type,
            currentLimit: parseInt(current),
            newLimit: parseInt(newLimitParam),
            price: price ? parseFloat(price) : 0,
          };
        }

        setPackageInfo(packageData);

        // Idempotency: skip if already applied or current limit >= target
        const currentLimit = user.evaluationLimit || 10;
        const targetLimit = packageData.newLimit;
        const alreadyApplied = hasAppliedUpgrade(user.id, targetLimit);
        if (alreadyApplied || currentLimit >= targetLimit) {
          console.log('Skipping limit update (idempotent):', { alreadyApplied, currentLimit, targetLimit });
        } else {
          await updateEvaluationLimit(targetLimit);
          markUpgradeApplied(user.id, targetLimit);
        }
        
        // Clear stored package data
        localStorage.removeItem("selectedPackage");
        
        setUpdateSuccess(true);
        setIsUpdating(false);

        // Show success message
        setTimeout(() => {
          alert(`Payment successful! Your daily limit has been increased to ${packageData.newLimit} evaluations.`);
        }, 1000);

      } catch (error) {
        console.error("Error updating evaluation limit:", error);
        setIsUpdating(false);
        alert("Failed to update your evaluation limit. Please contact support.");
      }
    };

    handlePaymentSuccess();
  }, [user, updateEvaluationLimit, setLocation]);

  const handleBackToMain = () => {
    setLocation("/main");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex flex-col justify-center p-6">
      <div className="max-w-md mx-auto w-full text-center">
        {isUpdating && (
          <>
            <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Processing Payment...</h1>
            <p className="text-xl text-white/80 mb-8">
              Please wait while we update your account.
            </p>
          </>
        )}

        {updateSuccess && packageInfo && (
          <>
            <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="text-green-600 h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-xl text-white mb-2">Your daily limit has been increased to</p>
            <p className="text-4xl font-bold text-white mb-8">
              {packageInfo.newLimit} evaluations
            </p>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
              <CardContent className="p-4">
                <div className="space-y-2 text-white/90">
                  <div className="flex justify-between items-center">
                    <span>Package:</span>
                    <span className="font-semibold">
                      {packageInfo.type === "basic" ? "Basic Upgrade" : "Premium Upgrade"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Amount Paid:</span>
                    <span className="font-semibold">${packageInfo.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Previous Limit:</span>
                    <span>{packageInfo.currentLimit} evaluations/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>New Limit:</span>
                    <span className="font-semibold text-green-400">
                      {packageInfo.newLimit} evaluations/day
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleBackToMain}
              className="w-full bg-white text-primary py-3 px-6 rounded-lg font-semibold text-lg hover:bg-neutral-100 shadow-lg"
            >
              Continue Evaluating
            </Button>
          </>
        )}
      </div>
    </div>
  );
} 