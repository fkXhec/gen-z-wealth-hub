import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, X, Send, Loader2, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

const FloatingAIMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const location = useLocation();
  const profile = location.state?.profile || {};

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: Message) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-advisor`;
    
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast({
            variant: "destructive",
            title: "Limite atteinte",
            description: "Trop de requêtes, veuillez réessayer plus tard.",
          });
        } else if (resp.status === 402) {
          toast({
            variant: "destructive",
            title: "Crédits insuffisants",
            description: "Veuillez ajouter des crédits à votre compte.",
          });
        }
        throw new Error("Failed to start stream");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la communication avec le conseiller.",
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    await streamChat(userMessage);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const generateVisual = async () => {
    if (isGeneratingImage) return;
    
    setIsGeneratingImage(true);
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-advisor`;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          action: "generate_visual",
          profile: profile
        }),
      });

      if (!resp.ok) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de générer la plaque visuelle.",
        });
        return;
      }

      const data = await resp.json();
      
      if (data.image) {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: "Voici votre plaque récapitulative personnalisée :",
            image: data.image
          }
        ]);
        
        toast({
          title: "Plaque générée",
          description: "Votre synthèse visuelle est prête !",
        });
      }
    } catch (error) {
      console.error("Visual generation error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération.",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow z-50 p-0"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>

      {/* Chat Dialog */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[600px] border-2 border-accent shadow-elegant z-50 flex flex-col bg-card">
          {/* Header */}
          <div className="p-4 border-b border-border bg-gradient-accent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-foreground/10">
                <MessageSquare className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-accent-foreground">Conseiller IA</h3>
                <p className="text-xs text-accent-foreground/80">Toujours là pour vous aider</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Posez-moi vos questions sur vos investissements !</p>
                {profile.risk_motion_preference && (
                  <Button
                    onClick={generateVisual}
                    disabled={isGeneratingImage}
                    className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
                    size="sm"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Image className="mr-2 h-4 w-4" />
                        Générer ma plaque récapitulative
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.image && (
                      <img 
                        src={msg.image} 
                        alt="Plaque récapitulative" 
                        className="mt-2 rounded-lg w-full"
                      />
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            {profile.risk_motion_preference && messages.length > 0 && (
              <Button
                onClick={generateVisual}
                disabled={isGeneratingImage}
                variant="outline"
                className="w-full mb-2"
                size="sm"
              >
                {isGeneratingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Image className="mr-2 h-4 w-4" />
                    Générer ma plaque récapitulative
                  </>
                )}
              </Button>
            )}
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question..."
                className="resize-none min-h-[60px]"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-accent text-accent-foreground hover:bg-accent/90 h-[60px] px-4"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default FloatingAIMenu;