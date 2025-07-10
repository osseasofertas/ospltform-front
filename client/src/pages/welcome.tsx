import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/hooks/use-app-state";
import { apiRequest } from "@/lib/queryClient";
import { Shield } from "lucide-react";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { setUser } = useAppState();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      const response = await apiRequest("POST", endpoint, formData);
      const data = await response.json();

      setUser(data.user);
      toast({
        title: isRegistering ? "Account created!" : "Welcome!",
        description: isRegistering 
          ? "You've received $50.00 initial bonus" 
          : "You've successfully logged in",
      });
      setLocation("/main");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem with your request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/demo", {});
      const data = await response.json();

      setUser(data.user);
      toast({
        title: "Demo account activated",
        description: "You can explore all features",
      });
      setLocation("/main");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not create demo account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary p-6 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="text-primary text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to SafeMoney</h1>
          <p className="text-white/90 text-lg">
            {isRegistering ? "Sign up and receive $50.00 initial bonus" : "Log in to your account"}
          </p>
        </div>

        {/* Form */}
        <Card className="bg-white rounded-2xl shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-primary/90 shadow-lg"
              >
                {isLoading ? "Loading..." : isRegistering ? "Create account" : "Log in"}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm text-neutral-600 hover:text-primary"
              >
                {isRegistering ? "Already have an account? Log in" : "Don't have an account? Sign up"}
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-neutral-200">
              <Button
                onClick={handleDemo}
                disabled={isLoading}
                variant="outline"
                className="w-full bg-neutral-100 text-neutral-700 py-3 px-6 rounded-lg font-medium hover:bg-neutral-200"
              >
                Try with demo account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
