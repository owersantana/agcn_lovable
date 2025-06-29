
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
import { Switch } from '@/components/ui/switch';
import { MindMap, DEFAULT_NODE_STYLE, CANVAS_CONFIG, MindMapNodeData } from '../config';
import { Node } from '@xyflow/react';

interface CreateMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (map: Omit<MindMap, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
}

export function CreateMapModal({ isOpen, onClose, onSubmit }: CreateMapModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [rootNodeText, setRootNodeText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !rootNodeText.trim()) return;

    const rootNode: Node<MindMapNodeData> = {
      id: 'root',
      type: 'mindMapNode',
      position: { 
        x: CANVAS_CONFIG.defaultWidth / 2 - DEFAULT_NODE_STYLE.width / 2,
        y: CANVAS_CONFIG.defaultHeight / 2 - DEFAULT_NODE_STYLE.height / 2
      },
      data: {
        text: rootNodeText,
        color: DEFAULT_NODE_STYLE.color,
        backgroundColor: DEFAULT_NODE_STYLE.backgroundColor,
        fontSize: 16,
        fontWeight: 'bold' as const,
        isRoot: true,
        children: [],
        isExpanded: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    const newMap = {
      name: name.trim(),
      description: description.trim(),
      nodes: [rootNode],
      connections: [],
      viewport: {
        x: 0,
        y: 0,
        zoom: 1,
      },
      isPublic,
    };

    onSubmit(newMap);
    
    // Reset form
    setName('');
    setDescription('');
    setIsPublic(false);
    setRootNodeText('');
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setIsPublic(false);
    setRootNodeText('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Mapa Mental</DialogTitle>
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

          <div className="space-y-2">
            <Label htmlFor="rootText">Tópico Central *</Label>
            <Input
              id="rootText"
              value={rootNodeText}
              onChange={(e) => setRootNodeText(e.target.value)}
              placeholder="Ex: Estratégia 2024"
              required
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
              Criar Mapa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
