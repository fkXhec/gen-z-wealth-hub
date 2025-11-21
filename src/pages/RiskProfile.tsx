import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import calmBoat from "@/assets/calm-boat.jpg";
import dynamicBoat from "@/assets/dynamic-boat.jpg";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

interface RiskProfileData {
  risk_motion_preference?: "calm" | "dynamic";
  risk_intention?: "consolidate" | "grow";
  risk_capacity?: "vital" | "long_term";
}

const RiskProfile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<RiskProfileData>({});

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSelect = (field: keyof RiskProfileData, value: string) => {
    setProfile({ ...profile, [field]: value });
    if (step < 3) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => navigate("/preferences", { state: { riskProfile: profile } }), 300);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => step === 1 ? navigate("/") : setStep(step - 1)}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
            Profil de Risque
          </h1>
          <p className="text-muted-foreground">Question {step} sur 3</p>
          <div className="mt-6 flex gap-2 justify-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 w-20 rounded-full transition-all ${
                  i <= step ? "bg-accent" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-3">Votre rapport au mouvement</h2>
              <p className="text-muted-foreground">
                Comment vous sentez-vous face aux variations de marché ?
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="p-8 cursor-pointer hover:shadow-glow transition-all hover:scale-105 border-border bg-card"
                onClick={() => handleSelect("risk_motion_preference", "calm")}
              >
                <img src={calmBoat} alt="Bateau stable" className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-semibold mb-2">Bateau Stable</h3>
                <p className="text-muted-foreground">
                  Je préfère la stabilité et éviter les grandes variations
                </p>
              </Card>
              <Card
                className="p-8 cursor-pointer hover:shadow-glow transition-all hover:scale-105 border-border bg-card"
                onClick={() => handleSelect("risk_motion_preference", "dynamic")}
              >
                <img src={dynamicBoat} alt="Voilier rapide" className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-semibold mb-2">Voilier Rapide</h3>
                <p className="text-muted-foreground">
                  J'accepte les vagues pour une croissance plus forte
                </p>
              </Card>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-3">Votre intention profonde</h2>
              <p className="text-muted-foreground">
                Que souhaitez-vous accomplir avec vos investissements ?
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="p-8 cursor-pointer hover:shadow-glow transition-all hover:scale-105 border-border bg-card"
                onClick={() => handleSelect("risk_intention", "consolidate")}
              >
                <div className="text-5xl mb-4">🏛️</div>
                <h3 className="text-xl font-semibold mb-2">Consolider</h3>
                <p className="text-muted-foreground">
                  Renforcer ce que j'ai, sécuriser et diversifier progressivement
                </p>
              </Card>
              <Card
                className="p-8 cursor-pointer hover:shadow-glow transition-all hover:scale-105 border-border bg-card"
                onClick={() => handleSelect("risk_intention", "grow")}
              >
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">Croître</h3>
                <p className="text-muted-foreground">
                  Explorer de nouvelles opportunités et maximiser ma croissance
                </p>
              </Card>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-3">Votre situation réelle</h2>
              <p className="text-muted-foreground">
                Quelle est la nature de cet argent pour vous ?
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="p-8 cursor-pointer hover:shadow-glow transition-all hover:scale-105 border-border bg-card"
                onClick={() => handleSelect("risk_capacity", "vital")}
              >
                <div className="text-5xl mb-4">🔐</div>
                <h3 className="text-xl font-semibold mb-2">Argent Vital</h3>
                <p className="text-muted-foreground">
                  J'en ai besoin à court terme, doit rester accessible
                </p>
              </Card>
              <Card
                className="p-8 cursor-pointer hover:shadow-glow transition-all hover:scale-105 border-border bg-card"
                onClick={() => handleSelect("risk_capacity", "long_term")}
              >
                <div className="text-5xl mb-4">⏳</div>
                <h3 className="text-xl font-semibold mb-2">Long Terme</h3>
                <p className="text-muted-foreground">
                  Je peux investir sur plusieurs années sans y toucher
                </p>
              </Card>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default RiskProfile;
