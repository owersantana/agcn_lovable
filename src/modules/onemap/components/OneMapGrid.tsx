
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Eye, 
  Edit, 
  Share, 
  Copy, 
  Trash2, 
  MoreVertical, 
  Map,
  Calendar,
  User
} from 'lucide-react';
import { MindMap } from '../config';

interface OneMapGridProps {
  maps: MindMap[];
  onMapAction: (mapId: string, action: string) => void;
}

export function OneMapGrid({ maps, onMapAction }: OneMapGridProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (maps.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-center space-y-4">
          <Map className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-medium">Nenhum mapa mental criado</h3>
            <p className="text-sm text-muted-foreground">
              Clique em "Novo Mapa" para criar seu primeiro mapa mental
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {maps.map((map) => (
          <Card key={map.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-medium truncate">
                    {map.name}
                  </CardTitle>
                  {map.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {map.description}
                    </p>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onMapAction(map.id, 'view')}>
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onMapAction(map.id, 'edit')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onMapAction(map.id, 'share')}>
                      <Share className="h-4 w-4 mr-2" />
                      Compartilhar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onMapAction(map.id, 'duplicate')}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onMapAction(map.id, 'delete')}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Preview do mapa */}
                <div 
                  className="h-24 bg-muted/30 rounded border cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-center"
                  onClick={() => onMapAction(map.id, 'view')}
                >
                  <div className="text-center">
                    <Map className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">
                      {map.nodes.length} nós
                    </span>
                  </div>
                </div>

                {/* Metadados */}
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    Atualizado em {formatDate(map.updatedAt)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      {map.createdBy}
                    </div>
                    
                    {map.isPublic && (
                      <Badge variant="secondary" className="text-xs">
                        Público
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => onMapAction(map.id, 'view')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Abrir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onMapAction(map.id, 'edit')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
