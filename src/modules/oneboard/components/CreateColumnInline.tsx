
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface CreateColumnInlineProps {
  onCreateColumn: (title: string) => void;
}

export function CreateColumnInline({ onCreateColumn }: CreateColumnInlineProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      onCreateColumn(title.trim());
      setTitle('');
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setIsCreating(false);
  };

  if (isCreating) {
    return (
      <Card className="min-w-64 max-w-64 sm:min-w-80 sm:max-w-80 p-3">
        <div className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o nome da coluna"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
              if (e.key === 'Escape') handleCancel();
            }}
            autoFocus
            className="text-sm font-medium"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} className="text-xs">
              Criar coluna
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="text-xs">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="min-w-64 max-w-64 sm:min-w-80 sm:max-w-80 p-3 border-dashed border-2 hover:border-primary/50 cursor-pointer transition-colors">
      <Button
        variant="ghost"
        onClick={() => setIsCreating(true)}
        className="w-full h-full justify-center text-muted-foreground hover:text-foreground"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar coluna
      </Button>
    </Card>
  );
}
