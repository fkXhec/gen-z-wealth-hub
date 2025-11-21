import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, action, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Handle image generation request
    if (action === "generate_visual") {
      console.log("Generating investment visual for profile:", profile);
      
      // Build a detailed prompt for the visual summary
      const visualPrompt = `Create an elegant, luxury investment strategy summary card for BNP Paribas Private Banking.

Style requirements:
- Ultra-premium, minimalist design with plenty of white space
- Subtle BNP Paribas logo (small, top corner)
- Modern, sophisticated color palette: emerald green (#008766), gold accents, white background
- Clean typography, sans-serif fonts
- Professional financial aesthetic

Content to display:
- Profile type: ${profile.risk_motion_preference === "calm" ? "Profil Prudent" : "Profil Dynamique"}
- Investment motivation: ${profile.motivation === "impact" ? "Impact Social" : profile.motivation === "passion" ? "Passion" : "Performance"}
- Liquidity preference: ${profile.liquidity || "Non spécifié"}
- Preferred products: ${profile.productTypes?.join(", ") || "Diversifié"}

Layout:
- White card with soft shadow
- Small BNP Paribas logo in top right
- Large elegant title "Votre Stratégie d'Investissement"
- Visual icon or illustration representing the investment style
- Key metrics in clean boxes
- Subtle emerald green accent lines

Make it look like a premium banking document, not a generic infographic.`;

      const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: visualPrompt
            }
          ],
          modalities: ["image", "text"]
        }),
      });

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error("Image generation error:", imageResponse.status, errorText);
        return new Response(JSON.stringify({ error: "Erreur lors de la génération de l'image" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const imageData = await imageResponse.json();
      const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      
      if (!generatedImage) {
        console.error("No image in response:", imageData);
        return new Response(JSON.stringify({ error: "Aucune image générée" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Image generated successfully");
      return new Response(JSON.stringify({ image: generatedImage }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle regular chat
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "Tu es un conseiller en investissement expert et bienveillant de BNP Paribas Private Banking. Tu aides les utilisateurs à comprendre leurs options d'investissement, à prendre des décisions éclairées et à construire un portefeuille adapté à leur profil de risque. Tu es concis, pédagogue et tu utilises des exemples concrets. Tu parles français. Si l'utilisateur demande une synthèse visuelle de sa stratégie, tu peux lui proposer de générer une plaque récapitulative élégante." 
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requêtes atteinte, veuillez réessayer plus tard." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Paiement requis, veuillez ajouter des crédits à votre espace Lovable AI." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});