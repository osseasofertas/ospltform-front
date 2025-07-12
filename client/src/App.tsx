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

function Router() {
  const { user } = useAppState();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Switch>
        <Route path="/" component={user ? Main : Welcome} />
        <Route path="/welcome" component={Welcome} />
        <Route path="/main" component={Main} />
        <Route path="/evaluation" component={Evaluation} />
        <Route path="/results" component={Results} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/profile" component={Profile} />
        <Route path="/support" component={Support} />
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
