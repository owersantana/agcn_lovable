
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Check } from 'lucide-react';
import { Label as LabelType } from '../config';

interface LabelManagerProps {
  labels: LabelType[];
  onAddLabel: (label: LabelType) => void;
  onRemoveLabel: (labelId: string) => void;
}

const labelColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#64748b', '#374151'
];

export function LabelManager({ labels, onAddLabel, onRemoveLabel }: LabelManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState(labelColors[0]);

  const handleAddLabel = () => {
    if (newLabelName.trim()) {
      const newLabel: LabelType = {
        id: crypto.randomUUID(),
        name: newLabelName.trim(),
        color: selectedColor
      };
      onAddLabel(newLabel);
      setNewLabelName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <Badge 
            key={label.id} 
            style={{ backgroundColor: label.color, color: 'white' }}
            className="flex items-center gap-1"
          >
            {label.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-white/20"
              onClick={() => onRemoveLabel(label.id)}
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        ))}
      </div>

      {isAdding ? (
        <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
          <div className="space-y-2">
            <Label htmlFor="label-name">Nome da etiqueta</Label>
            <Input
              id="label-name"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              placeholder="Nome da etiqueta"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {labelColors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full border-2 border-transparent hover:border-gray-300 flex items-center justify-center"
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleAddLabel} size="sm">
              Adicionar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAdding(false);
                setNewLabelName('');
              }}
              size="sm"
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          onClick={() => setIsAdding(true)}
          className="w-full justify-start text-muted-foreground border-dashed border"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar etiqueta
        </Button>
      )}
    </div>
  );
}
