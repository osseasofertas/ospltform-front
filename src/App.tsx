import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "@/pages/welcome";
import Main from "@/pages/main";
import Evaluation from "@/pages/evaluation";
import Results from "@/pages/results";
import Wallet from "@/pages/wallet";
import Profile from "@/pages/profile";
import Support from "@/pages/support";
import LimitUpgrade from "@/pages/limit-upgrade";
import Payment from "@/pages/payment";
import PaymentSuccess from "@/pages/payment-success";
import Verification from "@/pages/verification";
import KYCSuccess from "@/pages/kyc-success";
import PremiumActivation from "@/pages/premium-activation";
import BottomNavigation from "@/components/bottom-navigation";
import ProtectedRoute from "@/components/protected-route";
import { useAppState } from "@/hooks/use-app-state";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";

function Router() {
  const { user, fetchUser } = useAppState();
  const [location] = useLocation();

  // Check if user needs to be fetched on app load
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      console.log("Token found but no user, fetching user data");
      fetchUser();
    }
  }, [user, fetchUser]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Switch>
        <Route path="/" component={Welcome} />
        <Route path="/welcome" component={Welcome} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/main" component={user && user.isVerified ? Main : user ? Verification : Login} />
        <Route path="/evaluation" component={user && user.isVerified ? Evaluation : user ? Verification : Login} />
        <Route path="/results" component={user && user.isVerified ? Results : user ? Verification : Login} />
        <Route path="/wallet" component={user && user.isVerified ? Wallet : user ? Verification : Login} />
        <Route path="/profile" component={user && user.isVerified ? Profile : user ? Verification : Login} />
        <Route path="/support" component={user && user.isVerified ? Support : user ? Verification : Login} />
        <Route path="/limit-upgrade" component={user && user.isVerified ? LimitUpgrade : user ? Verification : Login} />
        <Route path="/payment" component={user && user.isVerified ? Payment : user ? Verification : Login} />
        <Route path="/payment-success" component={PaymentSuccess} />
        <Route path="/payment-success-5" component={PaymentSuccess} />
        <Route path="/payment-success-10" component={PaymentSuccess} />
        <Route path="/verification" component={user ? Verification : Login} />
        <Route path="/kyc-success" component={KYCSuccess} />
        <Route path="/premium-activation" component={user && user.isVerified ? PremiumActivation : user ? Verification : Login} />
        <Route component={NotFound} />
      </Switch>
      {user && location !== '/verification' && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
