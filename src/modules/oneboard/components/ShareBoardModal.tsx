
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Mail, Link, Lock } from 'lucide-react';
import { Board } from '../config';

interface ShareBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: Board | null;
}

export function ShareBoardModal({ isOpen, onClose, board }: ShareBoardModalProps) {
  const [shareLink, setShareLink] = useState('');
  const [password, setPassword] = useState('');
  const [emails, setEmails] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [passwordGenerated, setPasswordGenerated] = useState(false);

  React.useEffect(() => {
    if (board && isOpen) {
      // Generate share link
      const link = `${window.location.origin}/shared/board/${board.id}`;
      setShareLink(link);
      setPassword('');
      setPasswordGenerated(false);
      setLinkCopied(false);
    }
  }, [board, isOpen]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    setPasswordGenerated(true);
  };

  const sendByEmail = () => {
    const emailList = emails.split(',').map(email => email.trim()).filter(email => email);
    if (emailList.length > 0) {
      console.log('Enviando convites para:', emailList);
      // TODO: Implement email sending
      onClose();
    }
  };

  if (!board) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Compartilhar Board: {board.name}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Link
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label>Link de Compartilhamento</Label>
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(shareLink)}
                  className="flex items-center gap-2"
                >
                  {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {linkCopied ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Senha de Acesso (Opcional)</Label>
              <div className="flex gap-2">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite uma senha ou gere uma"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generatePassword}
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Gerar
                </Button>
              </div>
              {passwordGenerated && (
                <p className="text-sm text-muted-foreground">
                  Senha gerada! Compartilhe com as pessoas autorizadas.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emails">Emails para Convite</Label>
              <Textarea
                id="emails"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="Digite os emails separados por vírgula&#10;exemplo: user1@email.com, user2@email.com"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Separe múltiplos emails com vírgula
              </p>
            </div>
            
            <Button 
              onClick={sendByEmail}
              className="w-full flex items-center gap-2"
              disabled={!emails.trim()}
            >
              <Mail className="h-4 w-4" />
              Enviar Convites
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
