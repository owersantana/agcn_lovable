
import React from 'react';
import { Button } from '@/components/ui/button';
import { Folder, File, Heart, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoriteFile {
  id: string;
  name: string;
  type: 'folder' | 'file';
  path: string;
  favoritedAt: Date;
}

export function OneDiskFavoriteFiles() {
  // Mock data - em produção viria da API
  const [favoriteFiles, setFavoriteFiles] = React.useState<FavoriteFile[]>([
    {
      id: 'fav1',
      name: 'Pasta de Imagens',
      type: 'folder',
      path: '/documentos/projetos/imagens',
      favoritedAt: new Date('2024-01-20')
    },
    {
      id: 'fav2',
      name: 'Apresentação.pptx',
      type: 'file',
      path: '/documentos/projetos/apresentacao.pptx',
      favoritedAt: new Date('2024-01-19')
    }
  ]);

  const handleFileClick = (file: FavoriteFile) => {
    console.log('Navigate to favorite file:', file.path);
  };

  const handleRemoveFavorite = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteFiles(prev => prev.filter(file => file.id !== fileId));
    console.log('Remove from favorites:', fileId);
  };

  return (
    <div className="p-2">
      <h3 className="text-sm font-medium text-sidebar-foreground mb-2">Arquivos Favoritos</h3>
      
      {favoriteFiles.length === 0 ? (
        <div className="text-center py-8">
          <Heart className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Nenhum arquivo favorito
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {favoriteFiles.map((file) => (
            <div
              key={file.id}
              className={cn(
                "flex items-center gap-2 py-2 px-2 text-sm hover:bg-sidebar-accent rounded cursor-pointer group"
              )}
              onClick={() => handleFileClick(file)}
            >
              {file.type === 'folder' ? (
                <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  Favoritado em {file.favoritedAt.toLocaleDateString('pt-BR')}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleRemoveFavorite(file.id, e)}
                title="Remover dos favoritos"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
