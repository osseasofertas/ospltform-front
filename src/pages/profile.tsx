import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, HelpCircle, Headphones, Clock } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user } = useAppState();

  const handleBack = () => {
    setLocation("/main");
  };

  const canWithdraw = () => {
    if (!user?.registrationDate) return false;
    const registrationDate = new Date(user.registrationDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - registrationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 7;
  };

  const getDaysUntilWithdrawal = () => {
    if (!user?.registrationDate) return 7;
    const registrationDate = new Date(user.registrationDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - registrationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - diffDays);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="text-neutral-600 hover:text-neutral-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-neutral-800">My Profile</h2>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="p-4">
        {/* Profile Info */}
        <Card className="border border-neutral-200 mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <User className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800">{user?.name}</h3>
              <p className="text-sm text-neutral-600">{user?.email}</p>
              {user?.isDemo && (
                <Badge className="mt-2 bg-accent/10 text-accent">Demo Account</Badge>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Name:</span>
                <span className="text-neutral-800 font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Email:</span>
                <span className="text-neutral-800 font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Registered:</span>
                <span className="text-neutral-800 font-medium">
                  {user?.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Section */}
        <Card className="border border-neutral-200 mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Fund Withdrawal</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600">Withdrawal status</p>
                <p className="text-sm font-medium text-accent">
                  {canWithdraw() ? "Available" : `Available in ${getDaysUntilWithdrawal()} days`}
                </p>
              </div>
              <Badge className="bg-accent/10 text-accent">
                <Clock className="h-3 w-3 mr-1" />
                {canWithdraw() ? "Ready" : "Pending"}
              </Badge>
            </div>
            <Button
              disabled={!canWithdraw()}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
              Request withdrawal
            </Button>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              Withdrawals are enabled 7 days after registration
            </p>
          </CardContent>
        </Card>

      


      </div>
    </div>
  );
}
