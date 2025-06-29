
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BoardColumn } from '../config';

interface CopyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: (targetColumnId: string, position: number, newTitle: string, copyOptions: CopyOptions) => void;
  currentColumnId: string;
  columns: BoardColumn[];
  cardTitle: string;
}

interface CopyOptions {
  copyDescription: boolean;
  copyLabels: boolean;
  copyMembers: boolean;
  copyChecklists: boolean;
  copyAttachments: boolean;
  copyDueDate: boolean;
}

export function CopyCardModal({ 
  isOpen, 
  onClose, 
  onCopy, 
  currentColumnId, 
  columns, 
  cardTitle 
}: CopyCardModalProps) {
  const [selectedColumnId, setSelectedColumnId] = useState<string>(currentColumnId);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [newTitle, setNewTitle] = useState(`${cardTitle} (cópia)`);
  const [copyOptions, setCopyOptions] = useState<CopyOptions>({
    copyDescription: true,
    copyLabels: true,
    copyMembers: true,
    copyChecklists: false,
    copyAttachments: false,
    copyDueDate: true,
  });

  const selectedColumn = columns.find(col => col.id === selectedColumnId);

  const handleCopy = () => {
    if (selectedColumnId && selectedPosition !== '' && newTitle.trim()) {
      onCopy(selectedColumnId, parseInt(selectedPosition), newTitle.trim(), copyOptions);
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedColumnId(currentColumnId);
    setSelectedPosition('');
    setNewTitle(`${cardTitle} (cópia)`);
    setCopyOptions({
      copyDescription: true,
      copyLabels: true,
      copyMembers: true,
      copyChecklists: false,
      copyAttachments: false,
      copyDueDate: true,
    });
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const updateCopyOption = (key: keyof CopyOptions, value: boolean) => {
    setCopyOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Copiar Card</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título da cópia</Label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Título do novo card"
            />
          </div>

          <div className="space-y-2">
            <Label>Coluna de destino</Label>
            <Select value={selectedColumnId} onValueChange={setSelectedColumnId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma coluna" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
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

          <div className="space-y-3">
            <Label>Copiar também:</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyDescription"
                  checked={copyOptions.copyDescription}
                  onCheckedChange={(checked) => updateCopyOption('copyDescription', checked as boolean)}
                />
                <Label htmlFor="copyDescription" className="text-sm">Descrição</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyLabels"
                  checked={copyOptions.copyLabels}
                  onCheckedChange={(checked) => updateCopyOption('copyLabels', checked as boolean)}
                />
                <Label htmlFor="copyLabels" className="text-sm">Etiquetas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyMembers"
                  checked={copyOptions.copyMembers}
                  onCheckedChange={(checked) => updateCopyOption('copyMembers', checked as boolean)}
                />
                <Label htmlFor="copyMembers" className="text-sm">Membros</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyChecklists"
                  checked={copyOptions.copyChecklists}
                  onCheckedChange={(checked) => updateCopyOption('copyChecklists', checked as boolean)}
                />
                <Label htmlFor="copyChecklists" className="text-sm">Checklists</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyAttachments"
                  checked={copyOptions.copyAttachments}
                  onCheckedChange={(checked) => updateCopyOption('copyAttachments', checked as boolean)}
                />
                <Label htmlFor="copyAttachments" className="text-sm">Anexos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyDueDate"
                  checked={copyOptions.copyDueDate}
                  onCheckedChange={(checked) => updateCopyOption('copyDueDate', checked as boolean)}
                />
                <Label htmlFor="copyDueDate" className="text-sm">Data de vencimento</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCopy}
              disabled={!selectedColumnId || selectedPosition === '' || !newTitle.trim()}
            >
              Copiar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
