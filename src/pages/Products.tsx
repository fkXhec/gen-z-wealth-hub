import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Leaf, Heart, Building2, Zap, Plus } from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import FloatingAIMenu from "@/components/FloatingAIMenu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile || {};
  const [showAllProducts, setShowAllProducts] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const allProducts = [
    {
      id: 1,
      name: "ETF Énergie Propre",
      category: "ETF",
      risk: 3,
      return: "8-12%",
      icon: Leaf,
      impact: true,
      description: "Portefeuille diversifié d'énergies renouvelables",
      invested: true,
      currentValue: 12350,
      performance: 8.5
    },
    {
      id: 2,
      name: "Tech Innovation Fund",
      category: "Venture Capital",
      risk: 5,
      return: "15-25%",
      icon: Zap,
      description: "Startups IA et technologies émergentes"
    },
    {
      id: 3,
      name: "Royalties Musicales",
      category: "Alternative",
      risk: 2,
      return: "6-10%",
      icon: Heart,
      passion: true,
      description: "Droits sur catalogues musicaux établis"
    },
    {
      id: 4,
      name: "Infrastructure Verte",
      category: "Private Equity",
      risk: 3,
      return: "10-14%",
      icon: Building2,
      impact: true,
      description: "Parcs solaires et projets durables",
      invested: true,
      currentValue: 8700,
      performance: -2.3
    },
    {
      id: 5,
      name: "Crypto BTC/ETH",
      category: "Crypto",
      risk: 6,
      return: "Variable",
      icon: TrendingUp,
      description: "Infrastructure blockchain principale"
    },
    {
      id: 6,
      name: "Immobilier Résidentiel",
      category: "Immobilier",
      risk: 2,
      return: "5-8%",
      icon: Building2,
      description: "SCPI de logements diversifiés"
    },
    {
      id: 7,
      name: "Actions Dividendes",
      category: "Actions",
      risk: 3,
      return: "7-11%",
      icon: TrendingUp,
      description: "Grandes entreprises versant des dividendes réguliers"
    }
  ];

  // Recommandation intelligente basée sur le profil
  const getRecommendedProducts = () => {
    let recommended = [...allProducts];
    
    // Filtrer par profil de risque
    const riskProfile = profile.risk_motion_preference;
    if (riskProfile === "calm") {
      recommended = recommended.filter(p => p.risk <= 3);
    } else if (riskProfile === "dynamic") {
      recommended = recommended.filter(p => p.risk >= 3);
    }
    
    // Filtrer par motivation
    if (profile.motivation === "impact") {
      recommended.sort((a, b) => (b.impact ? 1 : 0) - (a.impact ? 1 : 0));
    } else if (profile.motivation === "passion") {
      recommended.sort((a, b) => (b.passion ? 1 : 0) - (a.passion ? 1 : 0));
    }
    
    // Filtrer par types de produits
    if (profile.productTypes?.length > 0) {
      recommended = recommended.filter(p => 
        profile.productTypes.some((type: string) => 
          p.category.toLowerCase().includes(type.toLowerCase()) ||
          type.toLowerCase().includes(p.category.toLowerCase())
        )
      );
    }
    
    return recommended.slice(0, 5);
  };

  const recommendedProducts = showAllProducts ? allProducts : getRecommendedProducts();

  const handleInvest = (productId: number) => {
    toast({
      title: "Fonctionnalité en développement",
      description: "L'investissement sera bientôt disponible !",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/preferences")} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
            Produits Recommandés
          </h1>
          <p className="text-muted-foreground">Sélection personnalisée basée sur votre profil</p>
        </div>

        {/* Profile Summary */}
        <Card className="p-6 mb-8 border-border bg-card">
          <h2 className="text-xl font-semibold mb-4">Votre profil</h2>
          <div className="flex flex-wrap gap-3">
            {profile.motivation && (
              <Badge variant="outline">Motivation: {profile.motivation}</Badge>
            )}
            {profile.liquidity && (
              <Badge variant="outline">Liquidité: {profile.liquidity}</Badge>
            )}
            {profile.productTypes?.length > 0 && (
              <Badge variant="outline">{profile.productTypes.length} types de produits</Badge>
            )}
          </div>
        </Card>

        {/* Products Horizontal Scroll */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {showAllProducts ? "Tous les produits" : "Recommandés pour vous"}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllProducts(!showAllProducts)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {showAllProducts ? "Voir les recommandations" : "Voir tous les produits"}
            </Button>
          </div>
          
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {recommendedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onInvest={handleInvest}
                />
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
      
      {/* Floating AI Menu */}
      <FloatingAIMenu />
    </div>
  );
};

export default Products;
