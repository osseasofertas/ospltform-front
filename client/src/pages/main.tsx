import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { useLocation } from "wouter";
import { AppProduct } from "@/types";
import ProductCard from "@/components/product-card";

export default function Main() {
  const { user, setCurrentProduct } = useAppState();
  const [, setLocation] = useLocation();

  const { data: products = [], isLoading } = useQuery<AppProduct[]>({
    queryKey: ["/api/products"],
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

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-800">
              Elige un producto para evaluar
            </h2>
            <p className="text-sm text-neutral-600">Gana hasta R$ 4,00 por evaluación</p>
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

      {/* Product List */}
      <div className="p-4 space-y-4">
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
