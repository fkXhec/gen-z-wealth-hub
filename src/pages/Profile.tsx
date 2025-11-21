import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, User } from "lucide-react";
import Header from "@/components/Header";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis").max(50, "Prénom trop long"),
  lastName: z.string().trim().min(1, "Le nom est requis").max(50, "Nom trop long"),
  avatarUrl: z.string().url("URL invalide").optional().or(z.literal("")),
});

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    avatarUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
      setFormData({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        avatarUrl: data.avatar_url || "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    try {
      profileSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: formData.firstName,
        last_name: formData.lastName,
        avatar_url: formData.avatarUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id);

    setLoading(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées",
      });
      checkAuth();
    }
  };

  const getInitials = () => {
    return `${formData.firstName[0] || ""}${formData.lastName[0] || ""}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <Card className="p-8 border-border bg-card">
            <div className="flex items-center gap-6 mb-8">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.avatarUrl} alt={formData.firstName} />
                <AvatarFallback className="bg-accent/10 text-accent text-2xl">
                  {getInitials() || <User className="h-12 w-12" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
                <p className="text-muted-foreground">Gérez vos informations personnelles</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? "border-destructive" : ""}
                    disabled={loading}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? "border-destructive" : ""}
                    disabled={loading}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="avatarUrl">URL de l'avatar</Label>
                <Input
                  id="avatarUrl"
                  name="avatarUrl"
                  type="url"
                  placeholder="https://exemple.com/avatar.jpg"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  className={errors.avatarUrl ? "border-destructive" : ""}
                  disabled={loading}
                />
                {errors.avatarUrl && (
                  <p className="text-sm text-destructive mt-1">{errors.avatarUrl}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Lien vers votre photo de profil
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
