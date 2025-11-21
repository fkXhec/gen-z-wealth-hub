import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Sparkles } from "lucide-react";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Invalid email").max(255, "Email too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password too long"),
  firstName: z.string().trim().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name too long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email").max(255, "Email too long"),
  password: z.string().min(1, "Password is required").max(100, "Password too long"),
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "login"
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    try {
      if (mode === "signup") {
        signupSchema.parse(formData);
      } else {
        loginSchema.parse({
          email: formData.email,
          password: formData.password,
        });
      }
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

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      },
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast({
          title: "Existing account",
          description: "This email is already in use. Please log in.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signup error",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Signup successful!",
        description: "Welcome to WealthVision",
      });
      navigate("/");
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast({
          title: "Login error",
          description: "Incorrect email or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login error",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Login successful",
        description: "Happy to see you back!",
      });
      navigate("/");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="p-8 border-border bg-card shadow-elegant">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-accent/10">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {mode === "signup" ? "Create an account" : "Login"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "signup"
                ? "Join WealthVision today"
                : "Access your personal space"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
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
                    <Label htmlFor="lastName">Last Name</Label>
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
              </>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-destructive" : ""}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-destructive" : ""}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={loading}
            >
              {loading ? "Loading..." : mode === "signup" ? "Sign up" : "Log in"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setErrors({});
              }}
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              {mode === "login"
                ? "No account yet? Sign up"
                : "Already have an account? Log in"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
