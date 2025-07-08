import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, AlertCircle } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { useLocation } from "wouter";
import { AppProduct } from "@/types";
import ProductCard from "@/components/product-card";

export default function Main() {
  const { user, setCurrentProduct } = useAppState();
  const [, setLocation] = useLocation();

  const { data: products = [], isLoading, error } = useQuery<AppProduct[]>({
    queryKey: [`/api/products?userId=${user?.id}`],
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
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-800">
              Productos Disponibles
            </h2>
            <p className="text-sm text-neutral-600">Elige y evalúa productos para ganar dinero</p>
          </div>
          <Badge className="bg-primary/10 text-primary">
            {user?.dailyEvaluationsUsed || 0}/25 disponibles
          </Badge>
        </div>
      </div>

      {/* Balance Quick View */}
      <Card className="bg-gradient-to-r from-primary to-secondary mx-4 mt-4 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Saldo disponible</p>
              <p className="text-2xl font-bold">R$ {user?.balance || "0.00"}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Wallet className="text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

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
