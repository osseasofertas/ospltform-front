import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary p-6 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img
              src="/onlylogo.png"
              alt="OnlyCash Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to OnlyCash
          </h1>
          <p className="text-white/90 text-lg">Access or create your account</p>
        </div>
        <Card className="bg-white rounded-2xl shadow-xl">
          <CardContent className="p-6 flex flex-col gap-4">
            <Button
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-primary/90 shadow-lg"
              onClick={() => setLocation("/login")}
            >
              Login
            </Button>
              <Button
              variant="outline"
              className="w-full py-3 px-6 rounded-lg font-semibold text-lg"
              onClick={() => setLocation("/register")}
              >
              Register
              </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
