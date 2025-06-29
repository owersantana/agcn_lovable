
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Mail, Link, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardTitle: string;
}

export function ShareCardModal({ isOpen, onClose, cardTitle }: ShareCardModalProps) {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const shareLink = `${window.location.origin}/card/${crypto.randomUUID()}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copiado!",
      description: "O link do card foi copiado para a área de transferência."
    });
  };

  const handleSendEmail = () => {
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira um endereço de email válido.",
        variant: "destructive"
      });
      return;
    }

    // Simular envio de email
    toast({
      title: "Convite enviado!",
      description: `Convite para o card "${cardTitle}" foi enviado para ${email}.`
    });
    setEmail('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Compartilhar Card
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">"{cardTitle}"</h4>
            <p className="text-sm text-muted-foreground">
              Compartilhe este card com outras pessoas para colaborar.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="share-link">Link de compartilhamento</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="share-link"
                  value={shareLink}
                  readOnly
                  className="text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="email-invite">Convidar por email</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="email-invite"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendEmail}
                  className="flex-shrink-0"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
