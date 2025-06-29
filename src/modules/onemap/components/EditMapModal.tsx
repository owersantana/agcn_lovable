
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MindMap } from '../config';

interface EditMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  map: MindMap | null;
  onSubmit: (map: MindMap) => void;
}

export function EditMapModal({ isOpen, onClose, map, onSubmit }: EditMapModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (map) {
      setName(map.name);
      setDescription(map.description || '');
      setIsPublic(map.isPublic);
    }
  }, [map]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!map || !name.trim()) return;

    const updatedMap = {
      ...map,
      name: name.trim(),
      description: description.trim(),
      isPublic,
    };

    onSubmit(updatedMap);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Mapa Mental</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Mapa *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Planejamento Estratégico"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o propósito deste mapa mental..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public">Tornar público</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
