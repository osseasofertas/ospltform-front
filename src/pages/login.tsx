import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAppState } from "@/hooks/use-app-state";
import api from "@/lib/api";

export default function Login() {
  const [, setLocation] = useLocation();
  const { fetchUser } = useAppState();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Call the backend login API
      const response = await api.post("/auth/login", formData);
      
      // Check if the response has the expected data structure
      if (response.data && response.data.access_token) {
        // Save the access_token in localStorage
        localStorage.setItem("access_token", response.data.access_token);
        
        // Save refresh_token if provided
        if (response.data.refresh_token) {
          localStorage.setItem("refresh_token", response.data.refresh_token);
        }
        
        // Fetch the authenticated user data and update the global state
        await fetchUser();
        
        // Check if user is verified
        const userData = await api.get("/user/me");
        if (userData.data && !userData.data.isVerified) {
          setLocation("/verification");
        } else {
          setLocation("/main");
        }
      } else {
        console.log("Login response:", response.data);
        setError("Login completed but no token received. Please try again.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 401) {
          setError("Incorrect email or password.");
        } else if (status === 400) {
          setError(data?.message || "Invalid login data. Please check your information.");
        } else if (status === 422) {
          setError("Please fill in all required fields correctly.");
        } else {
          setError(`Login failed (${status}). Please try again.`);
        }
      } else if (err.request) {
        // Network error
        setError("Network error. Please check your connection and try again.");
      } else {
        // Other error
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary p-6 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img src="/onlylogo.png" alt="OnlyCash Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
          <p className="text-white/90 text-lg">Access your account</p>
        </div>
        <Card className="bg-white rounded-2xl shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" required />
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">Password</Label>
                <Input id="password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Your password" required />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" disabled={isLoading} className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-primary/90 shadow-lg">
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <p className="text-sm text-neutral-500 text-center mt-2">
                Don't have an account?{' '}
                <span className="text-primary cursor-pointer underline" onClick={() => setLocation('/register')}>Register</span>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 