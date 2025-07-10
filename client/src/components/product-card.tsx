import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star } from "lucide-react";
import { AppProduct } from "@/types";

interface ProductCardProps {
  product: AppProduct;
  onSelect: () => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <Card 
      className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <CardContent className="p-0">
        {/* Instagram-style square image */}
        <div className="aspect-square w-full relative">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Overlay with category badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
        
        {/* Product details and button */}
        <div className="p-3 space-y-3">
          <div className="text-center">
            <p className="text-sm text-neutral-600 mb-1">3 etapas de evaluación</p>
            <div className="flex items-center justify-center gap-1 text-primary">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-sm font-semibold">
                ${product.minEarning} - ${product.maxEarning}
              </span>
            </div>
          </div>
          
          {/* Call to action button */}
          <Button 
            onClick={onSelect}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-center gap-2">
              <span>Evaluar Producto</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
