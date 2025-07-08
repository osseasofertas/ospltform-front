import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { AppProduct } from "@/types";

interface ProductCardProps {
  product: AppProduct;
  onSelect: () => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <Card 
      className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onSelect}
    >
      <CardContent className="p-0">
        {/* Instagram-style square image */}
        <div className="aspect-square w-full">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Product details below image */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">{product.category} · 3 etapas</p>
              <span className="text-primary font-semibold text-sm">
                Gana entre R$ {product.minEarning} y R$ {product.maxEarning}
              </span>
            </div>
            <ChevronRight className="text-neutral-400 h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
