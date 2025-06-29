
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Paperclip, Download, Trash2, File, Image, FileText, FileArchive, FileAudio, FileVideo, X, Plus } from 'lucide-react';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface AttachmentManagerProps {
  attachments: Attachment[];
  onAddAttachment: (attachment: Attachment) => void;
  onRemoveAttachment: (attachmentId: string) => void;
}

export function AttachmentManager({ attachments, onAddAttachment, onRemoveAttachment }: AttachmentManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return FileVideo;
    if (type.startsWith('audio/')) return FileAudio;
    if (type === 'application/pdf' || type.includes('document')) return FileText;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return FileArchive;
    return File;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      // Simular upload - em um cenário real, você faria upload para um servidor
      const attachment: Attachment = {
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Usuário Atual'
      };

      onAddAttachment(attachment);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Paperclip className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          Arraste arquivos aqui ou clique para selecionar
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar arquivo
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Anexos ({attachments.length})</Label>
          <div className="space-y-2">
            {attachments.map((attachment) => {
              const FileIcon = getFileIcon(attachment.type);
              return (
                <div
                  key={attachment.id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <FileIcon className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(attachment.size)}</span>
                      <span>•</span>
                      <span>
                        {new Date(attachment.uploadedAt).toLocaleDateString('pt-BR')} às {new Date(attachment.uploadedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Por {attachment.uploadedBy}</p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {attachment.type.startsWith('image/') && (
                      <Badge variant="secondary" className="text-xs">
                        Imagem
                      </Badge>
                    )}
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        // Abrir/download do arquivo
                        const link = document.createElement('a');
                        link.href = attachment.url;
                        link.download = attachment.name;
                        link.click();
                      }}
                      title="Baixar arquivo"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => onRemoveAttachment(attachment.id)}
                      title="Remover anexo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
