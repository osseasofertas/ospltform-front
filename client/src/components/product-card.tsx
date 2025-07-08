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
        <div className="flex">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-20 h-20 object-cover"
          />
          <div className="flex-1 p-4">
            <h3 className="font-semibold text-neutral-800 mb-1">{product.name}</h3>
            <p className="text-sm text-neutral-600 mb-2">{product.category} · 3 etapas</p>
            <div className="flex items-center justify-between">
              <span className="text-primary font-semibold">
                Gana entre R$ {product.minEarning} y R$ {product.maxEarning}
              </span>
              <ChevronRight className="text-neutral-400 h-4 w-4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
