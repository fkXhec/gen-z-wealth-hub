import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, TrendingUp, Leaf, Heart, Building2, Zap } from "lucide-react";

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile || {};

  const products = [
    {
      id: 1,
      name: "ETF Énergie Propre",
      category: "ETF",
      risk: 3,
      return: "8-12%",
      icon: Leaf,
      impact: true,
      description: "Portefeuille diversifié d'énergies renouvelables"
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
      description: "Parcs solaires et projets durables"
    },
    {
      id: 5,
      name: "Crypto BTC/ETH",
      category: "Crypto",
      risk: 6,
      return: "Variable",
      icon: TrendingUp,
      description: "Infrastructure blockchain principale"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
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

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {products.map((product) => (
            <Card key={product.id} className="p-6 border-border bg-card hover:shadow-glow transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <product.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                <Badge variant="secondary">Risque {product.risk}/6</Badge>
              </div>

              <p className="text-muted-foreground mb-4">{product.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {product.impact && (
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      Impact
                    </Badge>
                  )}
                  {product.passion && (
                    <Badge variant="outline" className="text-pink-500 border-pink-500">
                      Passion
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Rendement estimé</p>
                  <p className="font-semibold text-accent">{product.return}</p>
                </div>
              </div>

              <Button className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                En savoir plus
              </Button>
            </Card>
          ))}
        </div>

        {/* CTA to Chat */}
        <Card className="p-8 text-center border-border bg-gradient-card">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-accent" />
          <h2 className="text-2xl font-semibold mb-3">Besoin de conseils personnalisés ?</h2>
          <p className="text-muted-foreground mb-6">
            Discutez avec votre conseiller IA pour affiner votre stratégie
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/chat")}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Parler à mon conseiller IA
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Products;
