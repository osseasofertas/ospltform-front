import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, UserCheck, ArrowRight } from "lucide-react";

export default function KYCSuccess() {
  const [, setLocation] = useLocation();
  const { user, updateUserVerification, fetchUser } = useAppState();
  const { toast } = useToast();
  const [kycData, setKycData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const processKYCSuccess = async () => {
      try {
        console.log("=== KYC Success Processing ===");
        
        // First, ensure we have the latest user data
        await fetchUser();
        
        // Check if user is logged in
        if (!user) {
          console.log("No user logged in");
          setIsSuccess(false);
          setIsProcessing(false);
          return;
        }
        
        console.log("Current logged user:", user);
        
        // Get KYC data from localStorage (optional, for display purposes)
        const storedData = localStorage.getItem('kyc_package');
        if (storedData) {
          const data = JSON.parse(storedData);
          setKycData(data);
          console.log("KYC package data found:", data);
          
          // Clear localStorage after reading
          localStorage.removeItem('kyc_package');
        } else {
          console.log("No KYC package data found, but proceeding with verification");
        }
        
        // Always proceed with verification if user is logged in
        console.log("Proceeding with user verification");
        console.log("Current verification status:", user.isVerified);
        
        // Update user verification status in backend (even if already verified)
        await updateUserVerification();
        
        setIsSuccess(true);
        console.log("=== KYC Success Processing Complete ===");
        
        // Show success toast
        toast({
          title: "Verification Successful! / Verificação Concluída!",
          description: "Your account has been verified successfully. / Sua conta foi verificada com sucesso.",
          variant: "default",
        });
        
              } catch (error) {
          console.error("KYC success processing error:", error);
          setIsSuccess(false);
          
          // Show error toast
          toast({
            title: "Verification Error / Erro na Verificação",
            description: "There was an issue processing your verification. Please try again. / Houve um problema ao processar sua verificação. Tente novamente.",
            variant: "destructive",
          });
      } finally {
        setIsProcessing(false);
      }
    };

    // Add a small delay to ensure user data is loaded
    const timer = setTimeout(() => {
      processKYCSuccess();
    }, 1000);

    return () => clearTimeout(timer);
  }, [updateUserVerification, user, fetchUser]);

  const handleContinue = async () => {
    try {
      // Show loading toast
      toast({
        title: "Redirecting... / Redirecionando...",
        description: "Please wait while we redirect you to the main page. / Aguarde enquanto redirecionamos você para a página principal.",
      });
      
      // Ensure user data is fresh before navigation
      await fetchUser();
      
      // Wait a bit more to ensure the state is properly updated
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Check if user is properly loaded and verified
      console.log("Navigation check - User:", user);
      console.log("Navigation check - User verified:", user?.isVerified);
      
      if (user && user.isVerified) {
        console.log("User is verified, navigating to main");
        setLocation("/main");
      } else {
        console.log("User not properly loaded, trying again");
        // If user is not properly loaded, try one more time
        await fetchUser();
        setTimeout(() => {
          console.log("Fallback navigation to main");
          setLocation("/main");
        }, 100);
      }
    } catch (error) {
      console.error("Error fetching user before navigation:", error);
      // Fallback: navigate anyway
      setLocation("/main");
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing KYC approval...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            KYC Approval Successful!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your account has been verified and approved
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isSuccess ? (
            <>
              {/* Success Message */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <UserCheck className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    Account Verification Successful
                  </span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Your account has been verified and you can now access all features
                </p>
                <p className="text-green-600 text-xs mt-2">
                  Verification completed at: {new Date().toLocaleString()}
                </p>
              </div>

              {/* Package Details */}
              {kycData && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Payment Details</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Package:</span> KYC Approval</p>
                    <p><span className="font-medium">Price:</span> ${kycData.price}</p>
                    <p><span className="font-medium">User:</span> {kycData.userName}</p>
                    <p><span className="font-medium">Email:</span> {kycData.userEmail}</p>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <Button
                onClick={handleContinue}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Continue to App
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          ) : (
            <>
              {/* Error Message */}
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-red-800 text-sm font-medium mb-2">
                  There was an issue processing your KYC approval.
                </p>
                <p className="text-red-700 text-xs">
                  This could be due to:
                </p>
                <ul className="text-red-700 text-xs list-disc list-inside mt-1 space-y-1">
                  <li>User session expired</li>
                  <li>Data mismatch between payment and current user</li>
                  <li>Backend verification failed</li>
                </ul>
                <p className="text-red-700 text-xs mt-2">
                  Please contact support if the issue persists.
                </p>
              </div>

              {/* Debug Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">Debug Information</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Current User ID: {user?.id || 'Not logged in'}</p>
                  <p>Current User Email: {user?.email || 'Not logged in'}</p>
                  <p>User Verification Status: {user?.isVerified ? 'Verified' : 'Not Verified'}</p>
                  <p>KYC Data: {kycData ? JSON.stringify(kycData, null, 2) : 'No data found'}</p>
                </div>
              </div>

              {/* Retry Button */}
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 