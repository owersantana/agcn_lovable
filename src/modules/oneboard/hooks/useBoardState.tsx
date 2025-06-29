
import { useState, useEffect } from 'react';
import { Board, BoardColumn, BoardCard } from '../config';
import { useToast } from '@/hooks/use-toast';

interface UseBoardStateProps {
  board: Board | null;
  onBoardUpdate: (board: Board) => void;
  initialColumns?: BoardColumn[];
}

export function useBoardState({ board, onBoardUpdate, initialColumns }: UseBoardStateProps) {
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const { toast } = useToast();

  // Função para salvar colunas no localStorage
  const saveColumnsToStorage = (boardId: string, columnsToSave: BoardColumn[]) => {
    console.log('Saving columns to storage:', columnsToSave);
    localStorage.setItem(`board-columns-${boardId}`, JSON.stringify(columnsToSave));
  };

  useEffect(() => {
    if (board) {
      console.log('Loading board:', board.id);
      const savedColumns = localStorage.getItem(`board-columns-${board.id}`);
      
      if (savedColumns) {
        try {
          const parsedColumns = JSON.parse(savedColumns);
          console.log('Loaded columns from storage:', parsedColumns);
          setColumns(parsedColumns);
        } catch (error) {
          console.error('Error parsing saved columns:', error);
          if (initialColumns && initialColumns.length > 0) {
            const boardColumns = initialColumns.map(col => ({
              ...col,
              boardId: board.id
            }));
            setColumns(boardColumns);
            saveColumnsToStorage(board.id, boardColumns);
          } else {
            setColumns([]);
          }
        }
      } else {
        if (initialColumns && initialColumns.length > 0) {
          const boardColumns = initialColumns.map(col => ({
            ...col,
            boardId: board.id
          }));
          setColumns(boardColumns);
          saveColumnsToStorage(board.id, boardColumns);
        } else {
          setColumns([]);
        }
      }
    }
  }, [board, initialColumns]);

  const addColumn = (title: string) => {
    if (!title.trim() || !board) {
      toast({
        title: "Erro",
        description: "O título da coluna não pode estar vazio",
        variant: "destructive"
      });
      return;
    }

    const newColumn: BoardColumn = {
      id: crypto.randomUUID(),
      title: title.trim(),
      boardId: board.id,
      position: columns.length,
      cards: []
    };
    
    const newColumns = [...columns, newColumn];
    console.log('Adding new column:', newColumn);
    console.log('New columns array:', newColumns);
    
    setColumns(newColumns);
    saveColumnsToStorage(board.id, newColumns);
    onBoardUpdate({ ...board, columnsCount: newColumns.length, updatedAt: new Date().toISOString() });
    
    toast({
      title: "Sucesso",
      description: `Coluna "${title}" criada com sucesso`
    });
  };

  const updateColumn = (columnId: string, updates: Partial<BoardColumn>) => {
    if (!board) return;
    const newColumns = columns.map(col => 
      col.id === columnId ? { ...col, ...updates } : col
    );
    setColumns(newColumns);
    saveColumnsToStorage(board.id, newColumns);
  };

  const deleteColumn = (columnId: string) => {
    if (!board) return;
    const newColumns = columns.filter(col => col.id !== columnId);
    setColumns(newColumns);
    saveColumnsToStorage(board.id, newColumns);
    onBoardUpdate({ ...board, columnsCount: newColumns.length, updatedAt: new Date().toISOString() });
    
    toast({
      title: "Sucesso",
      description: "Coluna removida com sucesso"
    });
  };

  return {
    columns,
    setColumns,
    saveColumnsToStorage,
    addColumn,
    updateColumn,
    deleteColumn,
  };
}
