import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import calmBoat from "@/assets/calm-boat.jpg";
import dynamicBoat from "@/assets/dynamic-boat.jpg";
import intentionCompass from "@/assets/intention-compass.jpg";
import situationAnchor from "@/assets/situation-anchor.jpg";
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
          Back
        </Button>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
            Risk Profile
          </h1>
          <p className="text-muted-foreground">Question {step} of 3</p>
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
              <h2 className="text-2xl font-semibold mb-3">Your relationship with movement</h2>
              <p className="text-muted-foreground">
                How do you feel about market fluctuations?
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="group p-8 cursor-pointer hover:shadow-glow transition-all duration-500 hover:scale-105 hover:border-accent border-2 border-border bg-card hover:bg-card/80 overflow-hidden relative"
                onClick={() => handleSelect("risk_motion_preference", "calm")}
              >
                <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <img src={calmBoat} alt="Stable boat" className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-500 group-hover:scale-110" />
                <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-accent">Stable Boat</h3>
                <p className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  I prefer stability and avoiding large fluctuations
                </p>
              </Card>
              <Card
                className="group p-8 cursor-pointer hover:shadow-glow transition-all duration-500 hover:scale-105 hover:border-accent border-2 border-border bg-card hover:bg-card/80 overflow-hidden relative"
                onClick={() => handleSelect("risk_motion_preference", "dynamic")}
              >
                <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <img src={dynamicBoat} alt="Fast sailboat" className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-500 group-hover:scale-110" />
                <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-accent">Fast Sailboat</h3>
                <p className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  I accept waves for stronger growth
                </p>
              </Card>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-3">Your deep intention</h2>
              <p className="text-muted-foreground">
                What do you want to achieve with your investments?
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="group p-8 cursor-pointer hover:shadow-glow transition-all duration-500 hover:scale-105 hover:border-accent border-2 border-border bg-card hover:bg-card/80 overflow-hidden relative"
                onClick={() => handleSelect("risk_intention", "consolidate")}
              >
                <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <img src={intentionCompass} alt="Consolidate" className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
                <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-accent">Consolidate</h3>
                <p className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  Strengthen what I have, secure and diversify gradually
                </p>
              </Card>
              <Card
                className="group p-8 cursor-pointer hover:shadow-glow transition-all duration-500 hover:scale-105 hover:border-accent border-2 border-border bg-card hover:bg-card/80 overflow-hidden relative"
                onClick={() => handleSelect("risk_intention", "grow")}
              >
                <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <img src={intentionCompass} alt="Grow" className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12" />
                <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-accent">Grow</h3>
                <p className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  Explore new opportunities and maximize my growth
                </p>
              </Card>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-3">Your real situation</h2>
              <p className="text-muted-foreground">
                What is the nature of this money for you?
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="group p-8 cursor-pointer hover:shadow-glow transition-all duration-500 hover:scale-105 hover:border-accent border-2 border-border bg-card hover:bg-card/80 overflow-hidden relative"
                onClick={() => handleSelect("risk_capacity", "vital")}
              >
                <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <img src={situationAnchor} alt="Vital Money" className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-500 group-hover:scale-110" />
                <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-accent">Vital Money</h3>
                <p className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  I need it in the short term, must remain accessible
                </p>
              </Card>
              <Card
                className="group p-8 cursor-pointer hover:shadow-glow transition-all duration-500 hover:scale-105 hover:border-accent border-2 border-border bg-card hover:bg-card/80 overflow-hidden relative"
                onClick={() => handleSelect("risk_capacity", "long_term")}
              >
                <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <img src={situationAnchor} alt="Long Term" className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-500 group-hover:scale-110" />
                <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-accent">Long Term</h3>
                <p className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  I can invest for several years without touching it
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
