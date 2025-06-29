
import React from 'react';
import { DragOverlay } from '@dnd-kit/core';
import { BoardColumn, BoardCard } from '../config';
import { OneBoardColumn } from './OneBoardColumn';

interface DragOverlayComponentProps {
  activeColumn: BoardColumn | null;
  activeCard: BoardCard | null;
}

export function DragOverlayComponent({ activeColumn, activeCard }: DragOverlayComponentProps) {
  return (
    <DragOverlay>
      {activeColumn && (
        <div className="min-w-64 max-w-64 sm:min-w-80 sm:max-w-80 opacity-50">
          <OneBoardColumn
            column={activeColumn}
            onUpdateColumn={() => {}}
            onDeleteColumn={() => {}}
            onAddCard={() => {}}
            onUpdateCard={() => {}}
            onDeleteCard={() => {}}
          />
        </div>
      )}
      {activeCard && (
        <div className="p-2 sm:p-3 bg-background border rounded-lg shadow-lg opacity-50 min-w-64">
          <h4 className="text-sm font-medium">{activeCard.title}</h4>
          {activeCard.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {activeCard.description}
            </p>
          )}
        </div>
      )}
    </DragOverlay>
  );
}
