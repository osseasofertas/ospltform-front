import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, HelpCircle, Headphones, Clock } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAppState();

  const handleBack = () => {
    setLocation("/main");
  };

  const handleLogout = () => {
    logout();
    setLocation("/welcome");
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
          <h2 className="text-xl font-semibold text-neutral-800">Mi Perfil</h2>
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
                <Badge className="mt-2 bg-accent/10 text-accent">Cuenta Demo</Badge>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Nombre:</span>
                <span className="text-neutral-800 font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Correo:</span>
                <span className="text-neutral-800 font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Registrado:</span>
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
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Retiro de fondos</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600">Estado del retiro</p>
                <p className="text-sm font-medium text-accent">
                  {canWithdraw() ? "Disponible" : `Disponible en ${getDaysUntilWithdrawal()} días`}
                </p>
              </div>
              <Badge className="bg-accent/10 text-accent">
                <Clock className="h-3 w-3 mr-1" />
                {canWithdraw() ? "Listo" : "Pendiente"}
              </Badge>
            </div>
            <Button
              disabled={!canWithdraw()}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
              Solicitar retiro
            </Button>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              Los retiros se habilitan 7 días después del registro
            </p>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="border border-neutral-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Soporte</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between p-3 border border-neutral-200 hover:border-primary"
              >
                <div className="flex items-center">
                  <HelpCircle className="text-primary h-4 w-4 mr-3" />
                  <span className="text-neutral-700">Preguntas frecuentes</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-neutral-400" />
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-between p-3 border border-neutral-200 hover:border-primary"
              >
                <div className="flex items-center">
                  <Headphones className="text-primary h-4 w-4 mr-3" />
                  <span className="text-neutral-700">Contactar soporte</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-neutral-400" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <div className="mt-6">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
