import { useState, useEffect } from "react";
import { useAppState } from "@/hooks/use-app-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileImage, CheckCircle, AlertCircle } from "lucide-react";

export default function Verification() {
  const { user, updateVerification, checkAutoVerification } = useAppState();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Check auto-verification on component mount
  useEffect(() => {
    checkAutoVerification();
  }, [checkAutoVerification]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select an image file (JPG, PNG, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setErrorMessage('');

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      await updateVerification(selectedFile);
      setUploadStatus('success');
      
      // Start verification animation
      setIsVerifying(true);
      
      // Simulate verification process
      setTimeout(() => {
        setIsVerifying(false);
      }, 3000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleApproveKYC = () => {
    // Store user data for KYC approval
    const kycData = {
      userId: user?.id,
      userEmail: user?.email,
      userName: user?.name,
      type: 'kyc_approval',
      price: 9.99
    };
    
    localStorage.setItem('kyc_package', JSON.stringify(kycData));
    
    // Redirect to KYC approval payment
    // After payment, user will be redirected to a URL that automatically approves KYC
    window.location.href = `https://pay.speedsellx.com/6884620A4A783`;
  };

  // Calculate time remaining for auto-verification
  const getTimeRemaining = () => {
    if (!user?.verifiedDate) return null;
    
    const uploadDate = new Date(user.verifiedDate);
    const now = new Date();
    const hoursDiff = (now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60);
    const remainingHours = Math.max(0, 34 - hoursDiff);
    
    if (remainingHours <= 0) return null;
    
    const hours = Math.floor(remainingHours);
    const minutes = Math.floor((remainingHours - hours) * 60);
    
    return { hours, minutes };
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Account Verification Required
          </CardTitle>
          <CardDescription className="text-gray-600">
            Please upload a valid identification document to verify your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Account Information</h3>
            <p className="text-sm text-gray-600">Name: {user?.name}</p>
            <p className="text-sm text-gray-600">Email: {user?.email}</p>
            {user?.verifiedDate && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Document uploaded: {new Date(user.verifiedDate).toLocaleString()}
                </p>
                {timeRemaining && (
                  <p className="text-sm text-blue-600 font-medium">
                    ⏰ Auto-verification in: {timeRemaining.hours}h {timeRemaining.minutes}m
                  </p>
                )}
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <Label htmlFor="document-upload" className="text-sm font-medium text-gray-700">
              Upload Identification Document
            </Label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                id="document-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="document-upload" className="cursor-pointer">
                {preview ? (
                  <div className="space-y-2">
                    <img 
                      src={preview} 
                      alt="Document preview" 
                      className="mx-auto max-h-32 rounded border"
                    />
                    <p className="text-sm text-gray-600">
                      {selectedFile?.name}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to select an image file
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                )}
              </label>
            </div>

            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {uploadStatus === 'success' && !isVerifying && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Document uploaded successfully! Your account is being reviewed.
                </AlertDescription>
              </Alert>
            )}

            {isVerifying && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-blue-800 font-medium">Verifying Document</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-700">Checking document format...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span className="text-sm text-blue-700">Validating information...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span className="text-sm text-blue-700">Processing verification...</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-3 text-center">
                  This process usually takes a few moments
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || isVerifying}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>

            <Button
              onClick={handleApproveKYC}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
            >
              🔓 Approve KYC ($9.99)
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Accepted Documents:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Government-issued ID (Driver's License, Passport)</li>
              <li>• National ID Card</li>
              <li>• Student ID (if applicable)</li>
            </ul>
            <p className="text-xs text-blue-700 mt-2">
              Your document will be reviewed within 24-48 hours.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 