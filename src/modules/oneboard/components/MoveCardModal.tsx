
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BoardColumn } from '../config';

interface MoveCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (targetColumnId: string, position: number) => void;
  currentColumnId: string;
  columns: BoardColumn[];
  cardTitle: string;
}

export function MoveCardModal({ 
  isOpen, 
  onClose, 
  onMove, 
  currentColumnId, 
  columns, 
  cardTitle 
}: MoveCardModalProps) {
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');

  const availableColumns = columns.filter(col => col.id !== currentColumnId);
  const selectedColumn = columns.find(col => col.id === selectedColumnId);

  const handleMove = () => {
    if (selectedColumnId && selectedPosition !== '') {
      onMove(selectedColumnId, parseInt(selectedPosition));
      onClose();
      setSelectedColumnId('');
      setSelectedPosition('');
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedColumnId('');
    setSelectedPosition('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mover Card</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Movendo o card "{cardTitle}"
          </p>

          <div className="space-y-2">
            <Label>Coluna de destino</Label>
            <Select value={selectedColumnId} onValueChange={setSelectedColumnId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma coluna" />
              </SelectTrigger>
              <SelectContent>
                {availableColumns.map((column) => (
                  <SelectItem key={column.id} value={column.id}>
                    {column.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedColumn && (
            <div className="space-y-2">
              <Label>Posição</Label>
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a posição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Primeiro (topo)</SelectItem>
                  {selectedColumn.cards.map((_, index) => (
                    <SelectItem key={index + 1} value={String(index + 1)}>
                      Posição {index + 2}
                    </SelectItem>
                  ))}
                  <SelectItem value={String(selectedColumn.cards.length)}>
                    Último (final)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleMove}
              disabled={!selectedColumnId || selectedPosition === ''}
            >
              Mover
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
