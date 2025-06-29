
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, Grid, Kanban } from 'lucide-react';
import { Board } from '../config';

interface OneBoardToolbarProps {
  onCreateBoard: () => void;
  onViewModeChange: (mode: 'grid' | 'canvas') => void;
  viewMode: 'grid' | 'canvas';
  activeBoard: Board | null;
  onBackToGrid: () => void;
}

export function OneBoardToolbar({
  onCreateBoard,
  onViewModeChange,
  viewMode,
  activeBoard,
  onBackToGrid
}: OneBoardToolbarProps) {
  return (
    <div className="border-b border-border bg-background p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {activeBoard && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToGrid}
              className="flex items-center gap-2 px-2 sm:px-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">
              {activeBoard ? activeBoard.name : 'OneBoard'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {!activeBoard && (
            <>
              <div className="flex items-center border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('grid')}
                  className="h-7 sm:h-8 px-2 sm:px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'canvas' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('canvas')}
                  className="h-7 sm:h-8 px-2 sm:px-3"
                >
                  <Kanban className="h-4 w-4" />
                </Button>
              </div>

              <Button onClick={onCreateBoard} className="flex items-center gap-2 px-3 sm:px-4">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Novo Board</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
