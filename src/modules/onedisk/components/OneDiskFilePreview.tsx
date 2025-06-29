
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileItem } from '../config';
import { X, Download, Share, Eye } from 'lucide-react';

interface OneDiskFilePreviewProps {
  file: FileItem;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
}

export function OneDiskFilePreview({ file, onClose, onDownload, onShare }: OneDiskFilePreviewProps) {
  const getPreviewContent = () => {
    const mimeType = file.mimeType || '';
    
    if (mimeType.includes('image')) {
      return (
        <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
          <img 
            src="/placeholder.svg" 
            alt={file.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      );
    }
    
    if (mimeType.includes('pdf')) {
      return (
        <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
          <div className="text-center">
            <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Preview de PDF não disponível</p>
          </div>
        </div>
      );
    }
    
    if (mimeType.includes('video')) {
      return (
        <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
          <video controls className="max-h-full max-w-full">
            <source src="/placeholder-video.mp4" type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Preview não disponível</p>
        </div>
      </div>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-96">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg truncate">{file.name}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {getPreviewContent()}
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tamanho:</span>
            <span>{formatFileSize(file.size)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Criado:</span>
            <span>{file.createdAt.toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Modificado:</span>
            <span>{file.modifiedAt.toLocaleDateString('pt-BR')}</span>
          </div>
          {file.mimeType && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo:</span>
              <span>{file.mimeType}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onDownload} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={onShare} variant="outline" className="flex-1">
            <Share className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
