import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, User, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour ! Je suis votre conseiller IA personnel. Comment puis-je vous aider avec votre stratégie d'investissement aujourd'hui ?"
    }
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const response: Message = {
        role: "assistant",
        content: "Je comprends votre question. Basé sur votre profil, je vous recommande de diversifier entre des ETF à impact (40%), des actions tech (30%) et des produits alternatifs (30%). Souhaitez-vous que je détaille chaque catégorie ?"
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto h-screen flex flex-col pt-16">
        <div className="p-4 border-b border-border bg-card/50 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-accent/10">
                <Bot className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h1 className="font-semibold">Conseiller IA</h1>
                <p className="text-xs text-muted-foreground">En ligne</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`p-2 rounded-full h-fit ${
                message.role === "assistant" ? "bg-accent/10" : "bg-primary"
              }`}>
                {message.role === "assistant" ? (
                  <Bot className="h-5 w-5 text-accent" />
                ) : (
                  <User className="h-5 w-5 text-primary-foreground" />
                )}
              </div>
              <Card className={`p-4 max-w-[80%] ${
                message.role === "user" 
                  ? "bg-accent text-accent-foreground" 
                  : "bg-card border-border"
              }`}>
                <p className="text-sm">{message.content}</p>
              </Card>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border bg-card/50 backdrop-blur">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Posez votre question..."
              className="bg-background border-border"
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Ask-My-Portfolio • Wealth Copilot • Banking Assistant
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
