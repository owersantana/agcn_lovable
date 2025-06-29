
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validações
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "Por favor, verifique se as senhas são iguais.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simular alteração de senha
    setTimeout(() => {
      toast({
        title: "Senha alterada com sucesso!",
        description: "Agora você pode fazer login com sua nova senha.",
      });
      navigate("/auth/login");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout
      icon={<Settings size={48} />}
      title="Nova senha"
      description="Crie uma nova senha segura para sua conta"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Nova senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Sua nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirme sua nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="text-xs text-muted-foreground">
          A senha deve ter pelo menos 6 caracteres.
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Alterando..." : "Alterar senha"}
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
