
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function SecurityCode() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular verificação do código
    setTimeout(() => {
      if (code.length === 6) {
        toast({
          title: "Código verificado!",
          description: "Agora você pode criar uma nova senha.",
        });
        navigate("/auth/new-password");
      } else {
        toast({
          title: "Código inválido",
          description: "Por favor, verifique o código enviado por e-mail.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleResendCode = () => {
    toast({
      title: "Código reenviado",
      description: "Um novo código foi enviado para seu e-mail.",
    });
  };

  return (
    <AuthLayout
      icon={<Settings size={48} />}
      title="Código de segurança"
      description="Digite o código de 6 dígitos enviado para seu e-mail"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Código de verificação</Label>
          <Input
            id="code"
            type="text"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            className="text-center text-2xl tracking-widest"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
          {isLoading ? "Verificando..." : "Verificar código"}
        </Button>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={handleResendCode}
            className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            Reenviar código
          </button>
          
          <div>
            <Link
              to="/auth/login"
              className="text-sm text-muted-foreground hover:text-primary-600 transition-colors"
            >
              Voltar ao login
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
