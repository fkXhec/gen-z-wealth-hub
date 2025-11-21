import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    category: string;
    risk: number;
    return: string;
    icon: LucideIcon;
    impact?: boolean;
    passion?: boolean;
    description: string;
    currentValue?: number;
    invested?: boolean;
    performance?: number;
  };
  onInvest: (productId: number) => void;
}

const ProductCard = ({ product, onInvest }: ProductCardProps) => {
  return (
    <Card className="group flex-shrink-0 w-80 p-6 border-2 border-border bg-gradient-card hover:border-accent transition-all duration-500 hover:shadow-glow overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
              <product.icon className="h-7 w-7 text-accent group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg group-hover:text-accent transition-colors duration-300">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.category}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">Risque {product.risk}/6</Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>

        {/* Tags */}
        <div className="flex gap-2 mb-4">
          {product.impact && (
            <Badge variant="outline" className="text-xs border-accent/50 text-accent">
              Impact
            </Badge>
          )}
          {product.passion && (
            <Badge variant="outline" className="text-xs border-destructive/50 text-destructive">
              Passion
            </Badge>
          )}
        </div>

        {/* Key Metrics */}
        <div className="bg-background/50 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Rendement estimé</span>
            <span className="font-bold text-accent text-lg">{product.return}</span>
          </div>
          
          {product.invested && product.performance !== undefined && (
            <div className="flex justify-between items-center pt-2 border-t border-border/50">
              <span className="text-sm text-muted-foreground">Performance</span>
              <div className="flex items-center gap-1">
                {product.performance >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`font-semibold ${product.performance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.performance >= 0 ? '+' : ''}{product.performance}%
                </span>
              </div>
            </div>
          )}
          
          {product.invested && product.currentValue && (
            <div className="flex justify-between items-center pt-2 border-t border-border/50">
              <span className="text-sm text-muted-foreground">Valeur actuelle</span>
              <span className="font-bold text-foreground">{product.currentValue}€</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 group-hover:shadow-lg"
          onClick={() => onInvest(product.id)}
        >
          {product.invested ? "Voir les détails" : "Investir"}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;