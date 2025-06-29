
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, Underline, List, Link, Code, Image, Eye, Edit } from 'lucide-react';

interface DescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DescriptionEditor({ value, onChange, placeholder }: DescriptionEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  const insertFormat = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = value.substring(0, start) + text + value.substring(end);
    
    onChange(newText);
    
    // Position cursor after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const renderMarkdown = (text: string) => {
    let html = text;
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Underline
    html = html.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
    
    // Code
    html = html.replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');
    
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank" rel="noopener">$1</a>');
    
    // Images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded" />');
    
    // Lists
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>');
    
    // Line breaks
    html = html.replace(/\n/g, '<br />');
    
    return html;
  };

  const formatButtons = [
    {
      icon: Bold,
      tooltip: 'Negrito',
      action: () => insertFormat('**', '**')
    },
    {
      icon: Italic,
      tooltip: 'Itálico',
      action: () => insertFormat('*', '*')
    },
    {
      icon: Underline,
      tooltip: 'Sublinhado',
      action: () => insertFormat('<u>', '</u>')
    },
    {
      icon: List,
      tooltip: 'Lista',
      action: () => insertText('\n- ')
    },
    {
      icon: Link,
      tooltip: 'Link',
      action: () => insertFormat('[', '](url)')
    },
    {
      icon: Code,
      tooltip: 'Código',
      action: () => insertFormat('`', '`')
    },
    {
      icon: Image,
      tooltip: 'Imagem',
      action: () => insertFormat('![alt](', ')')
    }
  ];

  return (
    <div className="space-y-2">
      {/* Mini Toolbar */}
      <div className="flex items-center gap-1 p-2 border rounded-md bg-muted/30">
        <div className="flex items-center gap-1">
          {formatButtons.map((button, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={button.action}
              title={button.tooltip}
            >
              <button.icon className="h-3 w-3" />
            </Button>
          ))}
        </div>
        
        <div className="w-px h-4 bg-border mx-1" />
        
        {/* Emoji Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-sm"
          onClick={() => insertText('😊')}
          title="Emoji"
        >
          😊
        </Button>
        
        {/* Mention Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs font-medium"
          onClick={() => insertText('@')}
          title="Menção"
        >
          @
        </Button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* View Mode Toggle */}
        <Button
          type="button"
          variant={viewMode === 'edit' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => setViewMode('edit')}
          title="Modo Edição"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant={viewMode === 'preview' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => setViewMode('preview')}
          title="Visualizar"
        >
          <Eye className="h-3 w-3" />
        </Button>
      </div>

      {/* Content Area */}
      {viewMode === 'edit' ? (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className="resize-none"
        />
      ) : (
        <div 
          className="min-h-[144px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || '<span class="text-muted-foreground">Nenhum conteúdo para visualizar</span>' }}
        />
      )}
      
      {/* Format Help */}
      <p className="text-xs text-muted-foreground">
        Dica: Use **negrito**, *itálico*, `código`, [link](url) ou - para listas. Clique em visualizar para ver o resultado.
      </p>
    </div>
  );
}
