
import React from 'react';
import { Button } from '@/components/ui/button';
import { Folder, File, Share } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SharedFile {
  id: string;
  name: string;
  type: 'folder' | 'file';
  path: string;
  sharedWith: string[];
  sharedAt: Date;
}

export function OneDiskSharedFiles() {
  // Mock data - em produção viria da API
  const sharedFiles: SharedFile[] = [
    {
      id: 'shared1',
      name: 'Relatório Mensal.pdf',
      type: 'file',
      path: '/documentos/projetos/relatorio.pdf',
      sharedWith: ['user1@email.com', 'user2@email.com'],
      sharedAt: new Date('2024-01-18')
    },
    {
      id: 'shared2',
      name: 'Pasta de Projetos',
      type: 'folder',
      path: '/documentos/projetos',
      sharedWith: ['team@empresa.com'],
      sharedAt: new Date('2024-01-15')
    }
  ];

  const handleFileClick = (file: SharedFile) => {
    console.log('Navigate to shared file:', file.path);
  };

  const handleStopSharing = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Stop sharing file:', fileId);
  };

  return (
    <div className="p-2">
      <h3 className="text-sm font-medium text-sidebar-foreground mb-2">Arquivos Compartilhados</h3>
      
      {sharedFiles.length === 0 ? (
        <div className="text-center py-8">
          <Share className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Nenhum arquivo compartilhado
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {sharedFiles.map((file) => (
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
                  {file.sharedWith.length} {file.sharedWith.length === 1 ? 'pessoa' : 'pessoas'}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleStopSharing(file.id, e)}
                title="Parar de compartilhar"
              >
                <Share className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
