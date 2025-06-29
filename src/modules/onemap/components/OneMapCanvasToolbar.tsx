import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Save, Trash2, Undo, Redo, Link, ZoomIn, ZoomOut, Maximize, Download, Upload } from 'lucide-react';

interface OneMapCanvasToolbarProps {
  onAddNode: () => void;
  onSave: () => void;
  selectedNodeId?: string | null;
  onDeleteNode?: () => void;
  zoom?: number;
  onZoom?: (delta: number) => void;
  isConnecting?: boolean;
  onToggleConnect?: () => void;
}

export function OneMapCanvasToolbar({
  onAddNode,
  onSave,
  selectedNodeId,
  onDeleteNode,
  isConnecting = false,
  onToggleConnect,
}: OneMapCanvasToolbarProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-border bg-background shadow-sm">
      <div className="flex items-center space-x-2">
        {/* Adicionar nó */}
        <Button variant="outline" size="sm" onClick={onAddNode}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Nó
        </Button>
        
        {/* Modo de conexão */}
        {onToggleConnect && (
          <Button 
            variant={isConnecting ? "default" : "outline"} 
            size="sm" 
            onClick={onToggleConnect}
          >
            <Link className="h-4 w-4 mr-1" />
            {isConnecting ? 'Cancelar Conexão' : 'Conectar Nós'}
          </Button>
        )}
        
        {/* Excluir nó selecionado */}
        {selectedNodeId && onDeleteNode && (
          <Button variant="outline" size="sm" onClick={onDeleteNode} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir Selecionado
          </Button>
        )}
      </div>

      {/* Controles de visualização */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" disabled>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" disabled>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      {/* Ações de histórico e arquivo */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" disabled>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Redo className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <Button variant="outline" size="sm" disabled>
          <Upload className="h-4 w-4 mr-1" />
          Importar
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Download className="h-4 w-4 mr-1" />
          Exportar
        </Button>
        
        <Button variant="default" size="sm" onClick={onSave}>
          <Save className="h-4 w-4 mr-1" />
          Salvar
        </Button>
      </div>
    </div>
  );
}