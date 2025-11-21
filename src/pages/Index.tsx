import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, TrendingUp, Target, Brain, Leaf } from "lucide-react";
import heroImage from "@/assets/hero-investment.jpg";
import logoBnp from "@/assets/logo-bnp.png";
import Header from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Personalized Profile",
      description: "An intelligent journey that understands your risk profile and preferences"
    },
    {
      icon: Brain,
      title: "Innovative Products",
      description: "ETFs, crypto, real estate, music royalties and much more"
    },
    {
      icon: Brain,
      title: "AI Advisor",
      description: "An intelligent chatbot that answers all your investment questions"
    },
    {
      icon: Leaf,
      title: "Impact & Passion",
      description: "Invest according to your values and interests"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <div className="absolute inset-0 bg-gradient-primary" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-6 py-2 mb-8">
            <img src={logoBnp} alt="BNP Paribas" className="h-4 w-4" />
            <span className="text-sm text-accent font-medium">Premium Platform for Young Investors</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Invest According to
            <span className="block bg-gradient-accent bg-clip-text text-transparent">
              Your Values
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            A modern investment experience that combines performance, impact and passion. 
            Guided by artificial intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/risk-profile")}
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow text-lg px-8"
            >
              Start my journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/chat")}
              className="border-accent/30 hover:bg-accent/10 text-lg px-8"
            >
              Talk to AI advisor
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Investment products</div>
            </div>
            <div className="text-center border-x border-border">
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">AI advisor available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Personalized</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">An experience that truly reflects you</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to invest smartly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="p-6 border-border bg-card hover:shadow-glow transition-all hover:-translate-y-1"
              >
                <div className="p-3 rounded-lg bg-accent/10 w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <Card className="max-w-4xl mx-auto p-12 text-center border-border bg-gradient-card shadow-elegant">
          <Shield className="h-16 w-16 mx-auto mb-6 text-accent" />
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
            Create your profile in 3 minutes and discover investment opportunities 
            perfectly suited to your goals.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/risk-profile")}
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow text-lg px-8"
          >
            Start now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Card>
      </section>
    </div>
  );
};

export default Index;
