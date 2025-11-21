import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Investment {
  id: string;
  name: string;
  category: string;
  amount: number;
  performance: number;
}

interface FriendPortfolio {
  id: string;
  name: string;
  avatar: string;
  totalValue: number;
  totalReturn: number;
  riskProfile: string;
  investments: Investment[];
}

const Social = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFriend, setSelectedFriend] = useState<FriendPortfolio | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  // Mock data for friends' portfolios
  const friendsPortfolios: FriendPortfolio[] = [
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      totalValue: 45000,
      totalReturn: 12.5,
      riskProfile: "Moderate - Growth oriented",
      investments: [
        { id: "1", name: "Clean Energy ETF", category: "ETF", amount: 15000, performance: 15.2 },
        { id: "2", name: "Tech Innovation Fund", category: "Venture Capital", amount: 12000, performance: 22.8 },
        { id: "3", name: "Green Infrastructure", category: "Private Equity", amount: 10000, performance: 8.5 },
        { id: "4", name: "Music Royalties", category: "Alternative", amount: 8000, performance: 6.3 },
      ],
    },
    {
      id: "2",
      name: "Marcus Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      totalValue: 68000,
      totalReturn: 18.7,
      riskProfile: "Aggressive - High growth",
      investments: [
        { id: "1", name: "Crypto BTC/ETH", category: "Crypto", amount: 25000, performance: 45.2 },
        { id: "2", name: "Tech Innovation Fund", category: "Venture Capital", amount: 20000, performance: 28.5 },
        { id: "3", name: "AI Startups", category: "Venture Capital", amount: 15000, performance: 12.1 },
        { id: "4", name: "Clean Energy ETF", category: "ETF", amount: 8000, performance: 8.9 },
      ],
    },
    {
      id: "3",
      name: "Emma Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      totalValue: 32000,
      totalReturn: 7.8,
      riskProfile: "Conservative - Stability focused",
      investments: [
        { id: "1", name: "Residential Real Estate", category: "Real Estate", amount: 12000, performance: 6.5 },
        { id: "2", name: "Dividend Stocks", category: "Stocks", amount: 10000, performance: 8.2 },
        { id: "3", name: "Clean Energy ETF", category: "ETF", amount: 6000, performance: 9.1 },
        { id: "4", name: "Music Royalties", category: "Alternative", amount: 4000, performance: 7.4 },
      ],
    },
  ];

  const handleAdoptPortfolio = (friend: FriendPortfolio) => {
    setSelectedFriend(friend);
    setShowConfirmDialog(true);
  };

  const confirmAdoptPortfolio = async () => {
    if (!selectedFriend) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      // Insert each investment into user_investments table
      const investmentsToInsert = selectedFriend.investments.map((inv) => ({
        user_id: session.user.id,
        product_id: inv.id,
        amount: inv.amount,
        current_value: inv.amount * (1 + inv.performance / 100),
        return_percentage: inv.performance,
        invested_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("user_investments")
        .insert(investmentsToInsert);

      if (error) throw error;

      toast({
        title: "Portfolio adopted successfully!",
        description: `You've adopted ${selectedFriend.name}'s investment strategy.`,
      });

      setShowConfirmDialog(false);
      setSelectedFriend(null);

      // Navigate to products page to see the new investments
      setTimeout(() => navigate("/products"), 1500);
    } catch (error) {
      console.error("Error adopting portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to adopt portfolio. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => navigate("/products")} className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-8 w-8 text-accent" />
              <h1 className="text-4xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Social Investing
              </h1>
            </div>
            <p className="text-muted-foreground">
              Discover and adopt your friends' successful investment strategies
            </p>
          </div>

          <div className="grid gap-6">
            {friendsPortfolios.map((friend) => (
              <Card key={friend.id} className="p-6 border-2 border-border hover:border-accent/50 transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>{friend.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{friend.name}</h3>
                      <p className="text-sm text-muted-foreground">{friend.riskProfile}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAdoptPortfolio(friend)}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Adopt Portfolio
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                    <p className="text-2xl font-bold">
                      ${friend.totalValue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Return</p>
                    <p className={`text-2xl font-bold flex items-center gap-2 ${
                      friend.totalReturn >= 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      <TrendingUp className="h-5 w-5" />
                      +{friend.totalReturn}%
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Investment Breakdown</h4>
                  <div className="space-y-3">
                    {friend.investments.map((inv) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{inv.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {inv.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              ${inv.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className={`text-right font-semibold ${
                          inv.performance >= 0 ? "text-green-500" : "text-red-500"
                        }`}>
                          +{inv.performance}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle2 className="h-6 w-6 text-accent" />
              Confirm Portfolio Adoption
            </DialogTitle>
            <DialogDescription>
              Review the investment strategy before adopting
            </DialogDescription>
          </DialogHeader>

          {selectedFriend && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedFriend.avatar} alt={selectedFriend.name} />
                  <AvatarFallback>
                    {selectedFriend.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedFriend.name}'s Portfolio</p>
                  <p className="text-sm text-muted-foreground">{selectedFriend.riskProfile}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 border border-border rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estimated Total Investment</p>
                  <p className="text-xl font-bold text-accent">
                    ${selectedFriend.totalValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Expected Return</p>
                  <p className="text-xl font-bold text-green-500">
                    +{selectedFriend.totalReturn}%
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <h4 className="font-semibold mb-2 text-amber-600 dark:text-amber-400">
                  Risk Assessment
                </h4>
                <p className="text-sm text-muted-foreground">
                  This portfolio is classified as <strong>{selectedFriend.riskProfile}</strong>.
                  Past performance is not indicative of future results. Please ensure this aligns
                  with your risk tolerance and investment goals.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Investments to be added:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedFriend.investments.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
                    >
                      <div>
                        <p className="font-medium text-sm">{inv.name}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {inv.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${inv.amount.toLocaleString()}</p>
                        <p className="text-xs text-green-500">+{inv.performance}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAdoptPortfolio}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Confirm & Adopt Portfolio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Social;
