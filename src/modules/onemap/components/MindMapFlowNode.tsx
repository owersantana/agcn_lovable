import React, { useState, memo, useEffect, useRef, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Palette,
  Type,
  MoreHorizontal,
  Copy,
  Link,
  FileEdit
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MindMapNodeData, DEFAULT_NODE_COLORS } from '../config';

interface MindMapFlowNodeProps extends NodeProps {
  data: MindMapNodeData;
  onAddChild: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateNode: (nodeId: string, updates: Partial<MindMapNodeData>) => void;
  onToggleExpanded: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onConnectNode: (nodeId: string) => void;
  onRenameNode: (nodeId: string) => void;
}

export const MindMapFlowNode = memo(({
  id,
  data,
  selected,
  onAddChild,
  onDeleteNode,
  onUpdateNode,
  onToggleExpanded,
  onDuplicateNode,
  onConnectNode,
  onRenameNode,
}: MindMapFlowNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.text || '');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontOptions, setShowFontOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  console.log('🔄 MindMapFlowNode render:', { 
    id, 
    text: data.text, 
    isEditing, 
    selected, 
    editText,
    onUpdateNode: typeof onUpdateNode 
  });

  useEffect(() => {
    console.log('📝 useEffect - data.text changed:', { oldEditText: editText, newText: data.text });
    setEditText(data.text || '');
  }, [data.text]);

  const startEditing = useCallback(() => {
    console.log('🚀 Starting edit mode for node:', id, 'current text:', data.text);
    setIsEditing(true);
    setEditText(data.text || '');
    
    setTimeout(() => {
      if (inputRef.current) {
        console.log('🎯 Focusing input element');
        inputRef.current.focus();
        inputRef.current.select();
      } else {
        console.log('❌ Input ref not available');
      }
    }, 50);
  }, [id, data.text]);

  const finishEditing = useCallback(() => {
    console.log('✅ Finishing edit with text:', editText, 'original text:', data.text);
    console.log('🔍 Text changed?', editText.trim() !== data.text);
    console.log('🔍 Text not empty?', editText.trim().length > 0);
    
    if (editText.trim() && editText.trim() !== data.text) {
      console.log('💾 Calling onUpdateNode with:', { id, updates: { text: editText.trim() } });
      onUpdateNode(id, { text: editText.trim() });
    } else {
      console.log('⚠️ Not updating - text unchanged or empty');
    }
    setIsEditing(false);
  }, [editText, data.text, onUpdateNode, id]);

  const cancelEditing = useCallback(() => {
    console.log('❌ Canceling edit - reverting to original text:', data.text);
    setEditText(data.text || '');
    setIsEditing(false);
  }, [data.text]);

  const handleNodeDoubleClick = useCallback((e: React.MouseEvent) => {
    console.log('👆 Double click on node - starting edit');
    e.preventDefault();
    e.stopPropagation();
    startEditing();
  }, [startEditing]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('⌨️ Key pressed:', e.key, 'current editText:', editText);
    
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('⏎ Enter pressed - finishing edit');
      finishEditing();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      console.log('⎋ Escape pressed - canceling edit');
      cancelEditing();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      console.log('⭾ Tab pressed - finishing edit and creating child');
      finishEditing();
      setTimeout(() => {
        onAddChild(id);
      }, 100);
    }
  }, [finishEditing, cancelEditing, onAddChild, id, editText]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('📝 Input changed:', { oldValue: editText, newValue });
    setEditText(newValue);
  }, [editText]);

  const handleInputBlur = useCallback(() => {
    console.log('👁️ Input blur - finishing edit after delay');
    setTimeout(() => {
      finishEditing();
    }, 100);
  }, [finishEditing]);

  const handleColorChange = useCallback((color: string) => {
    console.log('🎨 Changing color to:', color);
    onUpdateNode(id, { backgroundColor: color });
    setShowColorPicker(false);
  }, [onUpdateNode, id]);

  const handleFontSizeChange = useCallback((fontSize: number) => {
    console.log('📏 Changing font size to:', fontSize);
    onUpdateNode(id, { fontSize });
    setShowFontOptions(false);
  }, [onUpdateNode, id]);

  const handleFontWeightToggle = useCallback(() => {
    const newWeight = data.fontWeight === 'bold' ? 'normal' : 'bold';
    console.log('🔤 Toggling font weight to:', newWeight);
    onUpdateNode(id, { fontWeight: newWeight });
  }, [onUpdateNode, id, data.fontWeight]);

  const handleRenameClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('✏️ Rename button clicked for node:', id);
    console.log('📞 Calling onRenameNode');
    onRenameNode(id);
    console.log('🚀 Starting edit mode after rename click');
    startEditing();
  }, [onRenameNode, id, startEditing]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (data.isRoot) {
      alert('Não é possível excluir o nó raiz');
      return;
    }
    
    if (confirm(`Tem certeza que deseja excluir o nó "${data.text}"?`)) {
      console.log('🗑️ Deleting node:', id);
      onDeleteNode(id);
    }
  }, [onDeleteNode, id, data.isRoot, data.text]);

  const handleDuplicateClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('📋 Duplicating node:', id);
    onDuplicateNode(id);
  }, [onDuplicateNode, id]);

  const handleConnectClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔗 Connect node clicked:', id);
    onConnectNode(id);
  }, [onConnectNode, id]);

  const hasChildren = data.children && data.children.length > 0;

  return (
    <div className="relative group" ref={nodeRef}>
      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} className="!bg-gray-400 !border-gray-600" />
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !border-gray-600" />
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !border-gray-600" />
      <Handle type="source" position={Position.Right} className="!bg-gray-400 !border-gray-600" />

      {/* Node Content */}
      <div
        className={`
          rounded-lg shadow-md border-2 flex items-center justify-center p-3 min-w-[120px] min-h-[40px]
          ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'}
          ${data.isRoot ? 'shadow-lg border-yellow-400' : 'shadow-md'}
          hover:shadow-lg transition-all duration-200
          ${!isEditing ? 'cursor-pointer' : ''}
        `}
        style={{
          backgroundColor: data.backgroundColor || '#3B82F6',
          color: data.color || '#FFFFFF',
          fontSize: `${data.fontSize || 14}px`,
          fontWeight: data.fontWeight || 'normal',
        }}
        onDoubleClick={handleNodeDoubleClick}
      >
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editText}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="text-center border-none bg-transparent placeholder-white/70 focus:ring-0 focus:ring-offset-0 focus:outline-none"
            style={{ 
              color: data.color || '#FFFFFF',
              fontSize: `${data.fontSize || 14}px`,
              fontWeight: data.fontWeight || 'normal'
            }}
            placeholder="Digite Tab para criar nó filho"
          />
        ) : (
          <div className="flex items-center space-x-2">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleExpanded(id);
                }}
                className="text-current opacity-70 hover:opacity-100 transition-opacity"
                title={data.isExpanded ? 'Recolher filhos' : 'Expandir filhos'}
              >
                {data.isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronUp className="h-3 w-3" />
                )}
              </button>
            )}
            <span className="text-center break-words px-2">{data.text || 'Nó'}</span>
          </div>
        )}
      </div>

      {/* Action Buttons - Sempre visíveis quando selecionado */}
      {selected && !isEditing && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 bg-white rounded-lg shadow-lg border p-1 z-10">
          {/* Botão de adicionar filho */}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-green-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('➕ Add child button clicked');
              onAddChild(id);
            }}
            title="Adicionar nó filho"
          >
            <Plus className="h-3 w-3 text-green-600" />
          </Button>

          {/* Botão de renomear */}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-blue-100"
            onClick={handleRenameClick}
            title="Renomear nó"
          >
            <FileEdit className="h-3 w-3 text-blue-600" />
          </Button>

          {/* Botão de editar (duplo clique alternativo) */}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-indigo-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('✏️ Edit button clicked');
              startEditing();
            }}
            title="Editar texto (ou duplo clique)"
          >
            <Edit3 className="h-3 w-3 text-indigo-600" />
          </Button>

          {/* Color Picker */}
          <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-purple-100"
                title="Alterar cor"
              >
                <Palette className="h-3 w-3 text-purple-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700">Escolha uma cor</div>
                <div className="grid grid-cols-4 gap-2">
                  {DEFAULT_NODE_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 hover:border-gray-400 transition-colors ${
                        data.backgroundColor === color ? 'border-gray-600' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                      title={`Cor ${color}`}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Font Options */}
          <Popover open={showFontOptions} onOpenChange={setShowFontOptions}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-orange-100"
                title="Opções de fonte"
              >
                <Type className="h-3 w-3 text-orange-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2">
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700">Tamanho da fonte</div>
                <div className="flex flex-wrap gap-1">
                  {[10, 12, 14, 16, 18, 20].map((size) => (
                    <button
                      key={size}
                      className={`px-2 py-1 text-xs rounded border ${
                        data.fontSize === size 
                          ? 'bg-blue-500 text-white border-blue-500' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleFontSizeChange(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button
                  className={`w-full px-2 py-1 text-xs rounded border ${
                    data.fontWeight === 'bold'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={handleFontWeightToggle}
                >
                  Negrito
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Menu de mais opções */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                title="Mais opções"
              >
                <MoreHorizontal className="h-3 w-3 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              <DropdownMenuItem onClick={handleDuplicateClick}>
                <Copy className="h-3 w-3 mr-2" />
                Duplicar nó
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleConnectClick}>
                <Link className="h-3 w-3 mr-2" />
                Conectar a outro nó
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!data.isRoot && (
                <DropdownMenuItem 
                  onClick={handleDeleteClick}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Excluir nó
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Indicador de nó raiz */}
      {data.isRoot && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Nó Raiz
          </div>
        </div>
      )}

      {/* Indicador de modo de edição */}
      {isEditing && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Editando... (Enter=Salvar, Esc=Cancelar, Tab=Criar filho)
          </div>
        </div>
      )}
    </div>
  );
});

MindMapFlowNode.displayName = 'MindMapFlowNode';