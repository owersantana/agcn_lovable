
import React, { useState } from 'react';
import { Board, BoardColumn, BoardCard } from '../config';
import { OneBoardCanvasToolbar } from './OneBoardCanvasToolbar';
import { DragAndDropProvider } from './DragAndDropProvider';
import { ColumnsList } from './ColumnsList';
import { DragOverlayComponent } from './DragOverlayComponent';
import { useBoardState } from '../hooks/useBoardState';
import { useCardOperations } from '../hooks/useCardOperations';
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
} from '@dnd-kit/sortable';

interface OneBoardCanvasProps {
  board: Board | null;
  onBoardUpdate: (board: Board) => void;
  onBoardAction?: (boardId: string, action: string) => void;
  initialColumns?: BoardColumn[];
}

export function OneBoardCanvas({ board, onBoardUpdate, onBoardAction, initialColumns }: OneBoardCanvasProps) {
  const [activeColumn, setActiveColumn] = useState<BoardColumn | null>(null);
  const [activeCard, setActiveCard] = useState<BoardCard | null>(null);

  const {
    columns,
    setColumns,
    saveColumnsToStorage,
    addColumn,
    updateColumn,
    deleteColumn,
  } = useBoardState({ board, onBoardUpdate, initialColumns });

  const {
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    copyCard,
  } = useCardOperations({ columns, updateColumn });

  if (!board) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Selecione um board para visualizar</p>
      </div>
    );
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    if (active.data.current?.type === 'column') {
      setActiveColumn(active.data.current.column);
    } else if (active.data.current?.type === 'card') {
      setActiveCard(active.data.current.card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === 'card') {
      const activeCard = active.data.current?.card as BoardCard;
      
      if (overType === 'column') {
        const overColumn = over.data.current?.column as BoardColumn;
        if (activeCard.columnId !== overColumn.id) {
          moveCardToColumn(activeCard.id, overColumn.id, overColumn.cards.length);
        }
      } else if (overType === 'card') {
        const overCard = over.data.current?.card as BoardCard;
        if (activeCard.id !== overCard.id) {
          const overColumn = columns.find(col => col.id === overCard.columnId);
          if (overColumn) {
            const overIndex = overColumn.cards.findIndex(card => card.id === overCard.id);
            moveCardToColumn(activeCard.id, overColumn.id, overIndex);
          }
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.data.current?.type === 'column' && over) {
      const activeColumnId = active.id as string;
      const overColumnId = over.id as string;
      
      if (activeColumnId !== overColumnId) {
        const activeIndex = columns.findIndex(col => col.id === activeColumnId);
        const overIndex = columns.findIndex(col => col.id === overColumnId);
        
        const newColumns = arrayMove(columns, activeIndex, overIndex);
        const reorderedColumns = newColumns.map((col, index) => ({ ...col, position: index }));
        setColumns(reorderedColumns);
        saveColumnsToStorage(board.id, reorderedColumns);
      }
    }

    setActiveColumn(null);
    setActiveCard(null);
  };

  const moveCardToColumn = (cardId: string, toColumnId: string, newPosition: number) => {
    const fromColumn = columns.find(col => col.cards.some(card => card.id === cardId));
    const toColumn = columns.find(col => col.id === toColumnId);
    
    if (!fromColumn || !toColumn) return;

    const card = fromColumn.cards.find(c => c.id === cardId);
    if (!card) return;

    if (fromColumn.id === toColumnId) {
      const newCards = [...fromColumn.cards];
      const cardIndex = newCards.findIndex(c => c.id === cardId);
      const [removedCard] = newCards.splice(cardIndex, 1);
      newCards.splice(newPosition, 0, removedCard);
      
      const newColumns = columns.map(col => 
        col.id === fromColumn.id 
          ? { ...col, cards: newCards.map((c, index) => ({ ...c, position: index })) }
          : col
      );
      
      setColumns(newColumns);
      saveColumnsToStorage(board.id, newColumns);
    } else {
      const updatedCard = { ...card, columnId: toColumnId };
      
      const newColumns = columns.map(col => {
        if (col.id === fromColumn.id) {
          return {
            ...col,
            cards: col.cards.filter(c => c.id !== cardId).map((c, index) => ({ ...c, position: index }))
          };
        } else if (col.id === toColumnId) {
          const newCards = [...col.cards];
          newCards.splice(newPosition, 0, updatedCard);
          return {
            ...col,
            cards: newCards.map((c, index) => ({ ...c, position: index }))
          };
        }
        return col;
      });
      
      setColumns(newColumns);
      saveColumnsToStorage(board.id, newColumns);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-muted/20">
      {/* Fixed Toolbar */}
      <div className="flex-shrink-0 sticky top-0 z-10">
        <OneBoardCanvasToolbar 
          board={board}
          onBoardUpdate={onBoardUpdate}
          onBoardAction={onBoardAction}
        />
      </div>

      {/* Scrollable Canvas */}
      <div className="flex-1 overflow-hidden">
        <DragAndDropProvider
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <ColumnsList
            columns={columns}
            onUpdateColumn={updateColumn}
            onDeleteColumn={deleteColumn}
            onAddCard={addCard}
            onUpdateCard={updateCard}
            onDeleteCard={deleteCard}
            onMoveCard={moveCardToColumn}
            onCopyCard={copyCard}
            onCreateColumn={addColumn}
          />

          <DragOverlayComponent
            activeColumn={activeColumn}
            activeCard={activeCard}
          />
        </DragAndDropProvider>
      </div>
    </div>
  );
}
