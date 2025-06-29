
import React from 'react';
import { BoardColumn, BoardCard } from '../config';
import { OneBoardColumn } from './OneBoardColumn';
import { CreateColumnInline } from './CreateColumnInline';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

interface ColumnsListProps {
  columns: BoardColumn[];
  onUpdateColumn: (columnId: string, updates: Partial<BoardColumn>) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddCard: (columnId: string, title: string) => void;
  onUpdateCard: (cardId: string, updates: Partial<BoardCard>) => void;
  onDeleteCard: (cardId: string) => void;
  onMoveCard: (cardId: string, targetColumnId: string, position: number) => void;
  onCopyCard: (card: BoardCard, targetColumnId: string, position: number, newTitle: string, copyOptions: any) => void;
  onCreateColumn: (title: string) => void;
}

export function ColumnsList({
  columns,
  onUpdateColumn,
  onDeleteColumn,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onMoveCard,
  onCopyCard,
  onCreateColumn,
}: ColumnsListProps) {
  return (
    <div className="h-full overflow-x-auto overflow-y-hidden">
      <div className="flex h-full gap-3 sm:gap-4 p-3 sm:p-4 min-w-max">
        <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
          {columns.map((column) => (
            <OneBoardColumn
              key={column.id}
              column={column}
              onUpdateColumn={onUpdateColumn}
              onDeleteColumn={onDeleteColumn}
              onAddCard={onAddCard}
              onUpdateCard={onUpdateCard}
              onDeleteCard={onDeleteCard}
              columns={columns}
              onMoveCard={onMoveCard}
              onCopyCard={onCopyCard}
            />
          ))}
        </SortableContext>
        
        <CreateColumnInline onCreateColumn={onCreateColumn} />
      </div>
    </div>
  );
}
