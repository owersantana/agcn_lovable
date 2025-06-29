
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { X, Plus, Trash2 } from 'lucide-react';
import { Checklist, ChecklistItem } from '../config';

interface ChecklistManagerProps {
  checklists: Checklist[];
  onUpdateChecklists: (checklists: Checklist[]) => void;
}

export function ChecklistManager({ checklists, onUpdateChecklists }: ChecklistManagerProps) {
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newItemTexts, setNewItemTexts] = useState<{[key: string]: string}>({});

  const handleAddChecklist = () => {
    if (newChecklistTitle.trim()) {
      const newChecklist: Checklist = {
        id: crypto.randomUUID(),
        title: newChecklistTitle.trim(),
        items: []
      };
      onUpdateChecklists([...checklists, newChecklist]);
      setNewChecklistTitle('');
      setIsAddingChecklist(false);
    }
  };

  const handleDeleteChecklist = (checklistId: string) => {
    onUpdateChecklists(checklists.filter(cl => cl.id !== checklistId));
  };

  const handleAddItem = (checklistId: string) => {
    const text = newItemTexts[checklistId]?.trim();
    if (text) {
      const newItem: ChecklistItem = {
        id: crypto.randomUUID(),
        text,
        completed: false
      };
      
      const updatedChecklists = checklists.map(cl => 
        cl.id === checklistId 
          ? { ...cl, items: [...cl.items, newItem] }
          : cl
      );
      
      onUpdateChecklists(updatedChecklists);
      setNewItemTexts(prev => ({ ...prev, [checklistId]: '' }));
    }
  };

  const handleToggleItem = (checklistId: string, itemId: string) => {
    const updatedChecklists = checklists.map(cl =>
      cl.id === checklistId
        ? {
            ...cl,
            items: cl.items.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          }
        : cl
    );
    onUpdateChecklists(updatedChecklists);
  };

  const handleDeleteItem = (checklistId: string, itemId: string) => {
    const updatedChecklists = checklists.map(cl =>
      cl.id === checklistId
        ? { ...cl, items: cl.items.filter(item => item.id !== itemId) }
        : cl
    );
    onUpdateChecklists(updatedChecklists);
  };

  const getChecklistProgress = (checklist: Checklist) => {
    if (checklist.items.length === 0) return 0;
    const completed = checklist.items.filter(item => item.completed).length;
    return Math.round((completed / checklist.items.length) * 100);
  };

  return (
    <div className="space-y-4">
      {checklists.map((checklist) => (
        <div key={checklist.id} className="border rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{checklist.title}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteChecklist(checklist.id)}
              className="h-6 w-6 p-0 text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          {checklist.items.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{checklist.items.filter(i => i.completed).length}/{checklist.items.length}</span>
                <span>{getChecklistProgress(checklist)}%</span>
              </div>
              <Progress value={getChecklistProgress(checklist)} className="h-2" />
            </div>
          )}

          <div className="space-y-2">
            {checklist.items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 group">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => handleToggleItem(checklist.id, item.id)}
                />
                <span className={`flex-1 text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {item.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteItem(checklist.id, item.id)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newItemTexts[checklist.id] || ''}
              onChange={(e) => setNewItemTexts(prev => ({ ...prev, [checklist.id]: e.target.value }))}
              placeholder="Adicionar item"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddItem(checklist.id);
                }
              }}
              className="text-sm"
            />
            <Button 
              onClick={() => handleAddItem(checklist.id)} 
              size="sm"
              disabled={!newItemTexts[checklist.id]?.trim()}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}

      {isAddingChecklist ? (
        <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
          <Label htmlFor="checklist-title">Título do checklist</Label>
          <Input
            id="checklist-title"
            value={newChecklistTitle}
            onChange={(e) => setNewChecklistTitle(e.target.value)}
            placeholder="Título do checklist"
            autoFocus
          />
          <div className="flex gap-2">
            <Button onClick={handleAddChecklist} size="sm">
              Adicionar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddingChecklist(false);
                setNewChecklistTitle('');
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
          onClick={() => setIsAddingChecklist(true)}
          className="w-full justify-start text-muted-foreground border-dashed border"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar checklist
        </Button>
      )}
    </div>
  );
}
