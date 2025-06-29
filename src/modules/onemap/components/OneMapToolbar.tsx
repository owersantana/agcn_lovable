
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Grid3X3, Map, Share, Download, Upload } from 'lucide-react';
import { MindMap } from '../config';

interface OneMapToolbarProps {
  onCreateMap: () => void;
  onViewModeChange: (mode: 'grid' | 'canvas') => void;
  viewMode: 'grid' | 'canvas';
  activeMap?: MindMap | null;
  onBackToGrid: () => void;
}

export function OneMapToolbar({
  onCreateMap,
  onViewModeChange,
  viewMode,
  activeMap,
  onBackToGrid,
}: OneMapToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background">
      <div className="flex items-center space-x-4">
        {viewMode === 'canvas' && activeMap ? (
          <>
            <Button variant="ghost" size="sm" onClick={onBackToGrid}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center space-x-2">
              <Map className="h-5 w-5 text-primary" />
              <span className="font-medium">{activeMap.name}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Map className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">OneMap</h1>
            <span className="text-sm text-muted-foreground">- Mapas Mentais</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {viewMode === 'grid' ? (
          <>
            <Button onClick={onCreateMap} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Mapa
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewModeChange('canvas')}
            >
              <Map className="h-4 w-4 mr-2" />
              Canvas
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grade
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
