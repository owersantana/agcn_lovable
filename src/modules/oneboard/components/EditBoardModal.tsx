
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Board } from '../config';

interface EditBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedBoard: Board) => void;
  board: Board | null;
}

export function EditBoardModal({ isOpen, onClose, onSubmit, board }: EditBoardModalProps) {
  const [name, setName] = useState(board?.name || '');
  const [description, setDescription] = useState(board?.description || '');

  React.useEffect(() => {
    if (board) {
      setName(board.name);
      setDescription(board.description);
    }
  }, [board]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && board) {
      onSubmit({
        ...board,
        name: name.trim(),
        description: description.trim()
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Board</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome do Board</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do board"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite uma descrição (opcional)"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
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
