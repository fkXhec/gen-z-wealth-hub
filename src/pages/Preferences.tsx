import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Heart, TrendingUp, Leaf } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

const Preferences = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [motivation, setMotivation] = useState<string | null>(null);
  const [themes, setThemes] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [liquidity, setLiquidity] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const motivations = [
    { id: "impact", label: "Impact", icon: Leaf, desc: "Améliorer le monde avec mes investissements" },
    { id: "passion", label: "Domaine de cœur", icon: Heart, desc: "Investir dans ce qui me passionne" },
    { id: "rendement", label: "Rendement", icon: TrendingUp, desc: "Optimiser mes performances financières" }
  ];

  const impactThemes = ["Climat", "Santé", "Agriculture durable", "Inclusion", "Infrastructures vertes"];
  const passionThemes = ["Culture & Musique", "Art", "Luxe & Mode", "Sport", "Gaming", "IA & Tech", "Immobilier"];
  const products = ["ETF", "Actions", "Obligations", "Immobilier", "Crypto BTC/ETH", "Private Equity", "Venture Capital"];

  const toggleTheme = (theme: string) => {
    setThemes(prev => prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]);
  };

  const toggleProduct = (product: string) => {
    setProductTypes(prev => prev.includes(product) ? prev.filter(p => p !== product) : [...prev, product]);
  };

  const handleSubmit = () => {
    const fullProfile = {
      ...location.state?.riskProfile,
      motivation,
      themes,
      productTypes,
      liquidity
    };
    navigate("/products", { state: { profile: fullProfile } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/risk-profile")} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
            Vos Préférences d'Investissement
          </h1>
          <p className="text-muted-foreground">Définissez ce qui compte vraiment pour vous</p>
        </div>

        <div className="space-y-12">
          {/* Motivation */}
          <Card className="p-8 border-border bg-card">
            <h2 className="text-2xl font-semibold mb-6">Votre motivation profonde</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {motivations.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setMotivation(m.id)}
                  className={`p-6 rounded-lg cursor-pointer transition-all border-2 ${
                    motivation === m.id
                      ? "border-accent bg-accent/10 shadow-glow"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <m.icon className={`h-8 w-8 mb-3 ${motivation === m.id ? "text-accent" : "text-muted-foreground"}`} />
                  <h3 className="font-semibold mb-2">{m.label}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Themes */}
          {motivation && motivation !== "rendement" && (
            <Card className="p-8 border-border bg-card animate-in fade-in duration-500">
              <h2 className="text-2xl font-semibold mb-6">
                {motivation === "impact" ? "Domaines d'impact" : "Vos passions"}
              </h2>
              <div className="flex flex-wrap gap-3">
                {(motivation === "impact" ? impactThemes : passionThemes).map((theme) => (
                  <Badge
                    key={theme}
                    variant={themes.includes(theme) ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2 text-sm ${
                      themes.includes(theme) ? "bg-accent text-accent-foreground" : ""
                    }`}
                    onClick={() => toggleTheme(theme)}
                  >
                    {theme}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Product Types */}
          <Card className="p-8 border-border bg-card">
            <h2 className="text-2xl font-semibold mb-6">Types de produits</h2>
            <div className="flex flex-wrap gap-3">
              {products.map((product) => (
                <Badge
                  key={product}
                  variant={productTypes.includes(product) ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm ${
                    productTypes.includes(product) ? "bg-accent text-accent-foreground" : ""
                  }`}
                  onClick={() => toggleProduct(product)}
                >
                  {product}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Liquidity */}
          <Card className="p-8 border-border bg-card">
            <h2 className="text-2xl font-semibold mb-6">Préférence de liquidité</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div
                onClick={() => setLiquidity("liquid")}
                className={`p-6 rounded-lg cursor-pointer transition-all border-2 ${
                  liquidity === "liquid"
                    ? "border-accent bg-accent/10 shadow-glow"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <h3 className="font-semibold mb-2">💧 Liquide</h3>
                <p className="text-sm text-muted-foreground">Flexible, accessible à court terme</p>
              </div>
              <div
                onClick={() => setLiquidity("engaged")}
                className={`p-6 rounded-lg cursor-pointer transition-all border-2 ${
                  liquidity === "engaged"
                    ? "border-accent bg-accent/10 shadow-glow"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <h3 className="font-semibold mb-2">🔒 Engagé</h3>
                <p className="text-sm text-muted-foreground">3-7 ans, rendement élevé</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!motivation || !liquidity || productTypes.length === 0}
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow"
          >
            Voir mes recommandations
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
