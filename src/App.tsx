import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "@/pages/welcome";
import Main from "@/pages/main";
import Evaluation from "@/pages/evaluation";
import Results from "@/pages/results";
import Wallet from "@/pages/wallet";
import Profile from "@/pages/profile";
import Support from "@/pages/support";
import BottomNavigation from "@/components/bottom-navigation";
import { useAppState } from "@/hooks/use-app-state";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";

function Router() {
  const { user } = useAppState();

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
        <Route component={NotFound} />
      </Switch>
      {user && <BottomNavigation />}
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
