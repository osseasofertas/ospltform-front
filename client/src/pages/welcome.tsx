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
  const [formData, setFormData] = useState({
    email: "",
  });

  // Popular email domains for English-speaking countries
  const emailMasks = [
    "@gmail.com",
    "@yahoo.com", 
    "@outlook.com",
    "@hotmail.com",
    "@icloud.com",
    "@aol.com",
    "@protonmail.com"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/login", { ...formData, password: "default" });
      const data = await response.json();

      setUser(data.user);
      toast({
        title: "Welcome!",
        description: "You've successfully logged in",
      });
      setLocation("/main");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem with your login",
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
            Log in to your account
          </p>
        </div>

        {/* Form */}
        <Card className="bg-white rounded-2xl shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <p className="text-xs text-neutral-500 mt-1">
                  Fill in with your payment email
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {emailMasks.map((mask) => (
                    <button
                      key={mask}
                      type="button"
                      onClick={() => {
                        const username = formData.email.split('@')[0];
                        setFormData({ ...formData, email: username + mask });
                      }}
                      className="px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded hover:bg-neutral-200 transition-colors"
                    >
                      {mask}
                    </button>
                  ))}
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-primary/90 shadow-lg"
              >
                {isLoading ? "Loading..." : "Log in"}
              </Button>
            </form>
            
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
