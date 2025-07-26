import { Switch, Route, useLocation } from "wouter";
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
import BottomNavigation from "@/components/bottom-navigation";
import ProtectedRoute from "@/components/protected-route";
import { useAppState } from "@/hooks/use-app-state";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";

function Router() {
  const { user } = useAppState();
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Switch>
        <Route path="/" component={Welcome} />
        <Route path="/welcome" component={Welcome} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/main" component={user ? Main : Login} />
        <Route path="/evaluation" component={user ? Evaluation : Login} />
        <Route path="/results" component={user ? Results : Login} />
        <Route path="/wallet" component={user ? Wallet : Login} />
        <Route path="/profile" component={user ? Profile : Login} />
        <Route path="/support" component={user ? Support : Login} />
        <Route path="/limit-upgrade" component={user ? LimitUpgrade : Login} />
        <Route path="/payment" component={user ? Payment : Login} />
        <Route path="/payment-success" component={PaymentSuccess} />
        <Route path="/verification" component={user ? Verification : Login} />
        <Route path="/kyc-success" component={KYCSuccess} />
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
