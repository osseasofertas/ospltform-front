import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/hooks/use-app-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, UserCheck, ArrowRight } from "lucide-react";

export default function KYCSuccess() {
  const [, setLocation] = useLocation();
  const { user, updateUserVerification } = useAppState();
  const [kycData, setKycData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const processKYCSuccess = async () => {
      try {
        console.log("=== KYC Success Processing ===");
        
        // Get KYC data from localStorage
        const storedData = localStorage.getItem('kyc_package');
        if (storedData) {
          const data = JSON.parse(storedData);
          setKycData(data);
          console.log("KYC package data:", data);
          
          // Update user verification status in backend
          await updateUserVerification();
          
          // Clear localStorage
          localStorage.removeItem('kyc_package');
          
          setIsSuccess(true);
          console.log("=== KYC Success Processing Complete ===");
        } else {
          console.log("No KYC package data found");
          setIsSuccess(false);
        }
      } catch (error) {
        console.error("KYC success processing error:", error);
        setIsSuccess(false);
      } finally {
        setIsProcessing(false);
      }
    };

    processKYCSuccess();
  }, [updateUserVerification]);

  const handleContinue = () => {
    setLocation("/main");
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
                    Account Verified
                  </span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  You can now access all features of the application
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
                <p className="text-red-800 text-sm">
                  There was an issue processing your KYC approval. Please contact support.
                </p>
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