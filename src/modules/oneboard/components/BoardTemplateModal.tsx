import React, { useState } from 'react';
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
import { Board, BoardColumn } from '../config';
import { trelloTemplates } from '../data/trelloTemplates';

interface BoardTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard: (board: Board, columns: BoardColumn[]) => void;
}

export function BoardTemplateModal({ isOpen, onClose, onCreateBoard }: BoardTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  const templates = trelloTemplates;

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setName(template.name);
      setDescription(template.description);
    }
    setShowForm(true);
  };

  const handleCreateEmpty = () => {
    setSelectedTemplate('empty');
    setName('');
    setDescription('');
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBoard: Board = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      columnsCount: selectedTemplate === 'empty' ? 0 : templates.find(t => t.id === selectedTemplate)?.columns.length || 0,
      isActive: true,
      isShared: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user'
    };

    let columns: BoardColumn[] = [];
    if (selectedTemplate && selectedTemplate !== 'empty') {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        columns = template.columns.map(col => ({
          ...col,
          id: crypto.randomUUID(),
          boardId: newBoard.id,
          cards: col.cards.map(card => ({
            ...card,
            id: crypto.randomUUID(),
            columnId: col.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }))
        }));
      }
    }

    onCreateBoard(newBoard, columns);
    handleClose();
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    setName('');
    setDescription('');
    setShowForm(false);
    onClose();
  };

  if (showForm) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate === 'empty' ? 'Criar Board Vazio' : 'Configurar Board'}
            </DialogTitle>
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

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Voltar
              </Button>
              <Button type="submit" disabled={!name.trim()}>
                Criar Board
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Board</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            onClick={handleCreateEmpty}
            variant="outline"
            className="w-full p-6 h-auto flex flex-col items-start"
          >
            <h3 className="font-semibold">Board Vazio</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Comece do zero e adicione suas próprias colunas
            </p>
          </Button>

          <div className="space-y-3">
            <h3 className="font-semibold">Templates</h3>
            <div className="grid gap-3">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  variant="outline"
                  className="w-full p-4 h-auto flex flex-col items-start"
                >
                  <h4 className="font-semibold">{template.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {template.columns.slice(0, 3).map((col, index) => (
                      <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                        {col.title}
                      </span>
                    ))}
                    {template.columns.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{template.columns.length - 3} mais
                      </span>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
