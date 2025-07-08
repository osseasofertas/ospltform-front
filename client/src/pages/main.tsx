import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, AlertCircle, User, HelpCircle, TrendingUp } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { useLocation } from "wouter";
import { AppProduct, AppStats } from "@/types";
import ProductCard from "@/components/product-card";

export default function Main() {
  const { user, setCurrentProduct } = useAppState();
  const [, setLocation] = useLocation();

  const { data: products = [], isLoading, error } = useQuery<AppProduct[]>({
    queryKey: [`/api/products?userId=${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: stats } = useQuery<AppStats>({
    queryKey: ["/api/users", user?.id, "stats"],
    enabled: !!user?.id,
  });

  const handleProductSelect = (product: AppProduct) => {
    setCurrentProduct(product);
    setLocation("/evaluation");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  // Handle daily limit reached
  if (error && (error as any).message?.includes("Límite diario")) {
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-800">
                Evaluaciones
              </h2>
              <p className="text-sm text-neutral-600">Límite diario alcanzado</p>
            </div>
            <button
              onClick={() => setLocation("/wallet")}
              className="text-primary hover:text-primary-600 transition-colors"
            >
              <Wallet className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Limit Message */}
        <div className="p-4">
          <Card className="border border-orange-200 bg-orange-50">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-orange-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Límite diario alcanzado
              </h3>
              <p className="text-neutral-600 mb-4">
                Has completado 25 evaluaciones hoy. Vuelve mañana para continuar ganando dinero evaluando productos.
              </p>
              <p className="text-sm text-neutral-500">
                El límite se restablece a las 00:00 horas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="px-4 py-6">
          {/* Welcome section */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">¡Hola, {user?.name || 'Usuario'}!</h1>
              <p className="text-white/80 text-sm">Gana dinero evaluando productos</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">R$ {user?.balance || "0.00"}</p>
              <p className="text-white/80 text-xs">Saldo disponible</p>
            </div>
          </div>

          {/* Quick access menu */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setLocation('/wallet')}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/30 transition-colors"
            >
              <Wallet className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Mi Billetera</span>
            </button>
            <button
              onClick={() => setLocation('/profile')}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/30 transition-colors"
            >
              <User className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Perfil</span>
            </button>
            <button
              onClick={() => setLocation('/support')}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/30 transition-colors"
            >
              <HelpCircle className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Soporte</span>
            </button>
          </div>

          {/* Detailed daily progress */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso diario</span>
              <span className="text-sm">{stats?.todayEvaluations || 0}/25 evaluaciones</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${Math.min(((stats?.todayEvaluations || 0) / 25) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-white/80">
              <span>Completadas: {stats?.todayEvaluations || 0}</span>
              <span>Restantes: {25 - (stats?.todayEvaluations || 0)}</span>
            </div>
            {(stats?.todayEvaluations || 0) >= 25 && (
              <div className="mt-2 text-center">
                <span className="text-xs bg-white/30 px-2 py-1 rounded-full">
                  🎉 ¡Límite diario alcanzado!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products section header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-neutral-800">
          Productos Disponibles
        </h2>
        <p className="text-sm text-neutral-600">Selecciona un producto para comenzar a evaluar</p>
      </div>

      {/* Product Grid - Instagram Style */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={() => handleProductSelect(product)}
          />
        ))}
      </div>
    </div>
  );
}
