
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular envio de email
    setTimeout(() => {
      if (email) {
        toast({
          title: "E-mail enviado!",
          description: "Verifique sua caixa de entrada para recuperar sua senha.",
        });
        navigate("/auth/security-code");
      } else {
        toast({
          title: "Erro",
          description: "Por favor, informe seu e-mail.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout
      icon={<Bell size={48} />}
      title="Recuperar senha"
      description="Informe seu e-mail para receber as instruções de recuperação"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar código"}
        </Button>

        <div className="text-center">
          <Link
            to="/auth/login"
            className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            Voltar ao login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
