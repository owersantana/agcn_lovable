
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileItem } from '../config';
import { OneDiskFileItem } from './OneDiskFileItem';
import { OneDiskFilePreview } from './OneDiskFilePreview';

interface OneDiskFileAreaProps {
  files: FileItem[];
  viewMode: 'list' | 'grid';
  selectedItems: string[];
  editingFolderId: string | null;
  isInTrash?: boolean;
  isInShared?: boolean;
  isInFavorites?: boolean;
  onFileClick: (file: FileItem) => void;
  onFavoriteToggle: (fileId: string) => void;
  onShareClick: (fileId: string) => void;
  onItemSelect: (item: FileItem) => void;
  onSelectAll: (selected: boolean) => void;
  onFolderRename: (folderId: string, newName: string) => void;
  onNavigateToFolder?: (item: FileItem) => void;
  onUploadFiles: (files: FileList) => void;
}

export function OneDiskFileArea({
  files,
  viewMode,
  selectedItems,
  editingFolderId,
  isInTrash = false,
  isInShared = false,
  isInFavorites = false,
  onFileClick,
  onFavoriteToggle,
  onShareClick,
  onItemSelect,
  onSelectAll,
  onFolderRename,
  onNavigateToFolder,
  onUploadFiles
}: OneDiskFileAreaProps) {
  const [editingName, setEditingName] = useState('');
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showUploadArea = !isInTrash && !isInShared && !isInFavorites;

  const handleItemClick = (item: FileItem, event: React.MouseEvent) => {
    console.log("Item clicked:", item.name);
    if (event.ctrlKey || event.metaKey) {
      onItemSelect(item);
    } else {
      onItemSelect(item);
    }
  };

  const handleItemDoubleClick = (item: FileItem) => {
    console.log("Item double clicked:", item.name);
    if (item.type === 'folder') {
      onFileClick(item);
    } else {
      setPreviewFile(item);
    }
  };

  const handleRename = (item: FileItem) => {
    setEditingName(item.name);
  };

  const handleRenameSubmit = (itemId: string) => {
    const trimmedName = editingName.trim();
    if (trimmedName) {
      onFolderRename(itemId, trimmedName);
    } else {
      const item = files.find(f => f.id === itemId);
      if (item && item.name === '') {
        onFolderRename(itemId, '');
      }
    }
    setEditingName('');
  };

  const handleRenameCancel = () => {
    setEditingName('');
    const editingItem = files.find(f => f.id === editingFolderId);
    if (editingItem && editingItem.name === '') {
      onFolderRename(editingFolderId!, '');
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onUploadFiles(files);
      // Reset input
      event.target.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      onUploadFiles(files);
    }
  };

  const renderUploadArea = () => (
    <div 
      className={cn(
        "border-2 border-dashed rounded-lg p-6 mb-4 transition-colors cursor-pointer",
        isDragOver 
          ? "border-primary bg-primary/5" 
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleFileUpload}
    >
      <div className="text-center">
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-2">
          Arraste arquivos aqui ou clique para selecionar
        </p>
        <Button variant="outline" onClick={handleFileUpload}>
          <Plus className="h-4 w-4 mr-2" />
          Selecionar arquivos
        </Button>
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-1">
      {showUploadArea && renderUploadArea()}
      <div className="space-y-1">
        {files.map((item) => (
          <OneDiskFileItem
            key={item.id}
            item={item}
            viewMode="list"
            isSelected={selectedItems.includes(item.id)}
            isEditing={editingFolderId === item.id}
            editingName={editingName}
            onItemClick={handleItemClick}
            onItemDoubleClick={handleItemDoubleClick}
            onFavoriteToggle={onFavoriteToggle}
            onShareClick={onShareClick}
            onRename={handleRename}
            onEditingNameChange={setEditingName}
            onRenameSubmit={handleRenameSubmit}
            onRenameCancel={handleRenameCancel}
            onNavigateToFolder={onNavigateToFolder}
          />
        ))}
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="space-y-4">
      {showUploadArea && renderUploadArea()}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {files.map((item) => (
          <OneDiskFileItem
            key={item.id}
            item={item}
            viewMode="grid"
            isSelected={selectedItems.includes(item.id)}
            isEditing={editingFolderId === item.id}
            editingName={editingName}
            onItemClick={handleItemClick}
            onItemDoubleClick={handleItemDoubleClick}
            onFavoriteToggle={onFavoriteToggle}
            onShareClick={onShareClick}
            onRename={handleRename}
            onEditingNameChange={setEditingName}
            onRenameSubmit={handleRenameSubmit}
            onRenameCancel={handleRenameCancel}
            onNavigateToFolder={onNavigateToFolder}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto p-4 relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
      />
      
      {viewMode === 'list' ? renderListView() : renderGridView()}

      {previewFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <OneDiskFilePreview
            file={previewFile}
            onClose={() => setPreviewFile(null)}
            onDownload={() => console.log('Download:', previewFile.name)}
            onShare={() => console.log('Share:', previewFile.name)}
          />
        </div>
      )}
    </div>
  );
}
