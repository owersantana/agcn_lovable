
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Board } from '../config';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (boardData: Omit<Board, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
}

export function CreateBoardModal({ isOpen, onClose, onSubmit }: CreateBoardModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        description: description.trim(),
        columnsCount: 0,
        isActive: true,
        isShared: false
      });
      setName('');
      setDescription('');
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Board</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="board-name">Nome do Board *</Label>
            <Input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do board"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="board-description">Descrição</Label>
            <Textarea
              id="board-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o propósito do board (opcional)"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Criar Board
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
