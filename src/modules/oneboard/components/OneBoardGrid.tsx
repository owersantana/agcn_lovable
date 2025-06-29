
import React from 'react';
import { OneBoardCard } from './OneBoardCard';
import { Board } from '../config';

interface OneBoardGridProps {
  boards: Board[];
  onBoardAction: (boardId: string, action: string) => void;
}

export function OneBoardGrid({ boards, onBoardAction }: OneBoardGridProps) {
  if (boards.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-muted-foreground/20 rounded-lg"></div>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
            Nenhum board encontrado
          </h3>
          <p className="text-sm text-muted-foreground mb-4 px-4">
            Crie seu primeiro board para começar a organizar suas tarefas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-3 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {boards.map((board) => (
          <OneBoardCard
            key={board.id}
            board={board}
            onAction={onBoardAction}
          />
        ))}
      </div>
    </div>
  );
}
