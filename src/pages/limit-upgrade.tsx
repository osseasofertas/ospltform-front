import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star, Zap } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";

export default function LimitUpgrade() {
  const [, setLocation] = useLocation();
  const { user } = useAppState();

  const handleBack = () => {
    setLocation("/main");
  };

  const handleSelectPackage = (packageType: "basic" | "premium") => {
    const packageData = {
      type: packageType,
      currentLimit: user?.evaluationLimit || 10,
      newLimit: packageType === "basic" ? (user?.evaluationLimit || 10) + 5 : (user?.evaluationLimit || 10) + 10,
      price: packageType === "basic" ? 10.00 : 19.99,
    };
    
    // Store package data in localStorage for payment page
    localStorage.setItem("selectedPackage", JSON.stringify(packageData));
    
    // Redirect to payment page
    setLocation("/payment");
  };

  if (!user) {
    setLocation("/main");
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-neutral-600 hover:text-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-neutral-800">Upgrade Limit</h2>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="p-4">
        {/* Current Status */}
        <Card className="border border-neutral-200 mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {user.evaluationLimit} evaluations/day
              </p>
              <p className="text-sm text-neutral-600 mt-1">
                Your current daily limit
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Package Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-800 text-center">
            Choose your upgrade package
          </h3>

          {/* Basic Package */}
          <Card className="border-2 border-neutral-200 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6" onClick={() => handleSelectPackage("basic")}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-800">Basic Upgrade</h4>
                    <p className="text-sm text-neutral-600">Perfect for casual users</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-neutral-800">$10.00</p>
                  <p className="text-sm text-neutral-600">One-time payment</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm">+5 evaluations per day</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm">New limit: {user.evaluationLimit + 5} evaluations/day</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm">Instant activation</span>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Select Basic Package
              </Button>
            </CardContent>
          </Card>

          {/* Premium Package */}
          <Card className="border-2 border-primary hover:border-primary/80 transition-colors cursor-pointer relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                BEST VALUE
              </span>
            </div>
            <CardContent className="p-6" onClick={() => handleSelectPackage("premium")}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-800">Premium Upgrade</h4>
                    <p className="text-sm text-neutral-600">Best value for serious earners</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-neutral-800">$19.99</p>
                  <p className="text-sm text-neutral-600">One-time payment</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm">+10 evaluations per day</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm">New limit: {user.evaluationLimit + 10} evaluations/day</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm">Instant activation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-primary font-semibold">Save $0.01 compared to Basic</span>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90">
                Select Premium Package
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600">
            All upgrades are permanent and will be applied immediately after payment.
          </p>
        </div>
      </div>
    </div>
  );
} 