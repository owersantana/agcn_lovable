
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Folder, 
  File, 
  Image, 
  FileText, 
  Archive, 
  Music, 
  Video,
  Download,
  MoreHorizontal,
  Edit2,
  Trash2,
  Share,
  Info,
  Heart,
  Share2,
  FolderOpen
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { FileItem } from '../config';

interface OneDiskFileItemProps {
  item: FileItem;
  viewMode: 'list' | 'grid';
  isSelected: boolean;
  isEditing: boolean;
  editingName: string;
  onItemClick: (item: FileItem, event: React.MouseEvent) => void;
  onItemDoubleClick: (item: FileItem) => void;
  onFavoriteToggle: (fileId: string) => void;
  onShareClick: (fileId: string) => void;
  onRename: (item: FileItem) => void;
  onEditingNameChange: (name: string) => void;
  onRenameSubmit: (itemId: string) => void;
  onRenameCancel: () => void;
  onNavigateToFolder?: (item: FileItem) => void;
}

export function OneDiskFileItem({
  item,
  viewMode,
  isSelected,
  isEditing,
  editingName,
  onItemClick,
  onItemDoubleClick,
  onFavoriteToggle,
  onShareClick,
  onRename,
  onEditingNameChange,
  onRenameSubmit,
  onRenameCancel,
  onNavigateToFolder
}: OneDiskFileItemProps) {

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') return Folder;
    
    const mimeType = item.mimeType || '';
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
    if (mimeType.includes('image')) return Image;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return Archive;
    if (mimeType.includes('audio')) return Music;
    if (mimeType.includes('video')) return Video;
    
    return File;
  };

  const getFileColor = (item: FileItem) => {
    if (item.type === 'folder') return 'text-blue-600 dark:text-blue-400';
    
    const mimeType = item.mimeType || '';
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'text-red-600 dark:text-red-400';
    if (mimeType.includes('image')) return 'text-green-600 dark:text-green-400';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return 'text-orange-600 dark:text-orange-400';
    if (mimeType.includes('audio')) return 'text-purple-600 dark:text-purple-400';
    if (mimeType.includes('video')) return 'text-pink-600 dark:text-pink-400';
    
    return 'text-gray-600 dark:text-gray-400';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const Icon = getFileIcon(item);
  const iconColor = getFileColor(item);

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          "flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer border transition-all group",
          isSelected && "bg-accent border-primary ring-1 ring-primary"
        )}
        onClick={(e) => onItemClick(item, e)}
        onDoubleClick={() => onItemDoubleClick(item)}
      >
        <Icon className={cn("h-5 w-5 flex-shrink-0", iconColor)} />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={editingName}
              onChange={(e) => onEditingNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onRenameSubmit(item.id);
                if (e.key === 'Escape') onRenameCancel();
              }}
              onBlur={() => onRenameSubmit(item.id)}
              className="h-7 text-sm"
              autoFocus
            />
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium truncate">
                {item.name}
              </span>
              <div className="flex items-center space-x-1">
                {item.favorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
                {item.shared && <Share2 className="h-4 w-4 text-blue-500" />}
              </div>
            </div>
          )}
        </div>
        
        <div className="hidden sm:flex items-center space-x-4 text-xs text-muted-foreground">
          {item.size > 0 && (
            <span className="w-16 text-right">
              {formatFileSize(item.size)}
            </span>
          )}
          <span className="w-32 text-right hidden md:block">
            {formatDate(item.modifiedAt)}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border shadow-lg">
            {item.type === 'folder' && onNavigateToFolder && (
              <DropdownMenuItem onClick={() => onNavigateToFolder(item)}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Abrir pasta
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onRename(item)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Renomear
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShareClick(item.id)}>
              <Share className="h-4 w-4 mr-2" />
              Compartilhar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFavoriteToggle(item.id)}>
              <Heart className="h-4 w-4 mr-2" />
              {item.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Info className="h-4 w-4 mr-2" />
              Informações
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Grid view
  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-all group relative w-full max-w-48",
        isSelected && "ring-2 ring-primary bg-accent"
      )}
      onClick={(e) => onItemClick(item, e)}
      onDoubleClick={() => onItemDoubleClick(item)}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <Icon className={cn("h-16 w-16", iconColor)} />
            
            {/* Status indicators - sempre visíveis */}
            <div className="absolute -bottom-1 -right-1 flex space-x-1">
              {item.favorite && <Heart className="h-4 w-4 text-red-500 fill-current bg-background rounded-full p-0.5" />}
              {item.shared && <Share2 className="h-4 w-4 text-blue-500 bg-background rounded-full p-0.5" />}
            </div>
          </div>
          
          <div className="w-full text-center">
            {isEditing ? (
              <Input
                value={editingName}
                onChange={(e) => onEditingNameChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onRenameSubmit(item.id);
                  if (e.key === 'Escape') onRenameCancel();
                }}
                onBlur={() => onRenameSubmit(item.id)}
                className="h-8 text-sm text-center p-2"
                autoFocus
              />
            ) : (
              <span className="text-sm font-medium text-center block truncate px-1" title={item.name}>
                {item.name}
              </span>
            )}
          </div>
          
          {item.size > 0 && (
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {formatFileSize(item.size)}
            </Badge>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border shadow-lg">
            {item.type === 'folder' && onNavigateToFolder && (
              <DropdownMenuItem onClick={() => onNavigateToFolder(item)}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Abrir pasta
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onRename(item)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Renomear
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShareClick(item.id)}>
              <Share className="h-4 w-4 mr-2" />
              Compartilhar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFavoriteToggle(item.id)}>
              <Heart className="h-4 w-4 mr-2" />
              {item.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Info className="h-4 w-4 mr-2" />
              Informações
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
