import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Info } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { AppTransaction, AppStats } from "@/types";

export default function Wallet() {
  const [, setLocation] = useLocation();
  const { user } = useAppState();

  const { data: transactions = [] } = useQuery<AppTransaction[]>({
    queryKey: ["/api/transactions", user?.id],
    enabled: !!user?.id,
  });

  const { data: stats } = useQuery<AppStats>({
    queryKey: ["/api/users", user?.id, "stats"],
    enabled: !!user?.id,
  });

  const handleBack = () => {
    setLocation("/main");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Ayer";
    if (diffDays < 1) return "Hace unas horas";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="text-neutral-600 hover:text-neutral-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-neutral-800">Mi Billetera</h2>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-primary to-secondary mx-4 mt-4 text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-2">Saldo disponible</p>
            <p className="text-4xl font-bold mb-4">R$ {user?.balance || "0.00"}</p>
            <div className="bg-white/20 rounded-lg p-3 text-sm flex items-center justify-center">
              <Info className="h-4 w-4 mr-2" />
              Saque disponible después de 7 días
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="mx-4 mt-4 grid grid-cols-2 gap-4">
        <Card className="border border-neutral-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats?.totalEvaluations || 0}</p>
              <p className="text-sm text-neutral-600">Evaluaciones</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-neutral-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{stats?.todayEvaluations || 0}</p>
              <p className="text-sm text-neutral-600">Hoy</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Historial de transacciones</h3>
        
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="border border-neutral-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-neutral-800">{transaction.description}</p>
                    <p className="text-sm text-neutral-600">{transaction.type === 'welcome_bonus' ? 'Registro completado' : 'Evaluación completada'}</p>
                    <p className="text-xs text-neutral-400">{formatDate(transaction.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">+R$ {transaction.amount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
