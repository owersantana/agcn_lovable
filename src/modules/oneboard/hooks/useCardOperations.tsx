
import { BoardColumn, BoardCard } from '../config';

interface UseCardOperationsProps {
  columns: BoardColumn[];
  updateColumn: (columnId: string, updates: Partial<BoardColumn>) => void;
}

export function useCardOperations({ columns, updateColumn }: UseCardOperationsProps) {
  const addCard = (columnId: string, title: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;

    const newCard: BoardCard = {
      id: crypto.randomUUID(),
      title,
      columnId,
      position: column.cards.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    updateColumn(columnId, {
      cards: [...column.cards, newCard]
    });
  };

  const updateCard = (cardId: string, updates: Partial<BoardCard>) => {
    const column = columns.find(col => col.cards.some(card => card.id === cardId));
    if (!column) return;

    updateColumn(column.id, {
      cards: column.cards.map(card => 
        card.id === cardId ? { ...card, ...updates, updatedAt: new Date().toISOString() } : card
      )
    });
  };

  const deleteCard = (cardId: string) => {
    const column = columns.find(col => col.cards.some(card => card.id === cardId));
    if (!column) return;

    updateColumn(column.id, {
      cards: column.cards.filter(card => card.id !== cardId)
    });
  };

  const moveCard = (cardId: string, targetColumnId: string, position: number) => {
    const fromColumn = columns.find(col => col.cards.some(card => card.id === cardId));
    const toColumn = columns.find(col => col.id === targetColumnId);
    
    if (!fromColumn || !toColumn) return;

    const card = fromColumn.cards.find(c => c.id === cardId);
    if (!card) return;

    // Update card's column reference
    const updatedCard = { ...card, columnId: targetColumnId };

    // If it's the same column, just reorder
    if (fromColumn.id === targetColumnId) {
      const newCards = [...fromColumn.cards];
      const cardIndex = newCards.findIndex(c => c.id === cardId);
      const [removedCard] = newCards.splice(cardIndex, 1);
      newCards.splice(position, 0, removedCard);
      
      updateColumn(fromColumn.id, {
        cards: newCards.map((c, index) => ({ ...c, position: index }))
      });
    } else {
      // Move to different column - this logic will be handled by moveCardToColumn
      return { fromColumn, toColumn, card: updatedCard };
    }
  };

  const copyCard = (originalCard: BoardCard, targetColumnId: string, position: number, newTitle: string, copyOptions: any) => {
    const targetColumn = columns.find(col => col.id === targetColumnId);
    if (!targetColumn) return;

    const newCard: BoardCard = {
      id: crypto.randomUUID(),
      title: newTitle,
      columnId: targetColumnId,
      position: position,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: copyOptions.copyDescription ? originalCard.description : undefined,
      labels: copyOptions.copyLabels ? originalCard.labels : undefined,
      members: copyOptions.copyMembers ? originalCard.members : undefined,
      checklists: copyOptions.copyChecklists ? originalCard.checklists : undefined,
      attachments: copyOptions.copyAttachments ? originalCard.attachments : undefined,
      dueDate: copyOptions.copyDueDate ? originalCard.dueDate : undefined,
      priority: originalCard.priority,
      tags: originalCard.tags,
    };

    // Insert card at specified position
    const newCards = [...targetColumn.cards];
    newCards.splice(position, 0, newCard);
    
    updateColumn(targetColumnId, {
      cards: newCards.map((c, index) => ({ ...c, position: index }))
    });
  };

  return {
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    copyCard,
  };
}
