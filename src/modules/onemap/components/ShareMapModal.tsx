
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
import { Switch } from '@/components/ui/switch';
import { Copy, Check, Mail, Link } from 'lucide-react';
import { MindMap } from '../config';

interface ShareMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  map: MindMap | null;
}

export function ShareMapModal({ isOpen, onClose, map }: ShareMapModalProps) {
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(map?.isPublic || false);

  if (!map) return null;

  const shareUrl = `${window.location.origin}/shared/onemap/${map.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  };

  const handleEmailShare = () => {
    const subject = `Compartilhamento: ${map.name}`;
    const body = `Olá! Gostaria de compartilhar este mapa mental com você: ${shareUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Mapa Mental</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome do Mapa</Label>
            <div className="text-sm font-medium">{map.name}</div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public">Tornar público</Label>
          </div>

          {isPublic && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Link de Compartilhamento</Label>
                <div className="flex space-x-2">
                  <Input value={shareUrl} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="px-3"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleEmailShare}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  E-mail
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCopyLink}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Copiar Link
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            {isPublic !== map.isPublic && (
              <Button>
                Salvar Configurações
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
