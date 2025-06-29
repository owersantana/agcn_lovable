import React, { useState, useEffect } from 'react';
import { OneBoardToolbar } from '../components/OneBoardToolbar';
import { OneBoardGrid } from '../components/OneBoardGrid';
import { OneBoardCanvas } from '../components/OneBoardCanvas';
import { CreateBoardModal } from '../components/CreateBoardModal';
import { EditBoardModal } from '../components/EditBoardModal';
import { ShareBoardModal } from '../components/ShareBoardModal';
import { BoardTemplateModal } from '../components/BoardTemplateModal';
import { Board, BoardColumn } from '../config';

const STORAGE_KEY = 'oneboard-data';

function OneBoard() {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: '1',
      name: 'Projeto Principal',
      description: 'Quadro para organizar tarefas do projeto principal da empresa',
      columnsCount: 4,
      isActive: true,
      isShared: false,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      createdBy: 'user1'
    },
    {
      id: '2',
      name: 'Marketing Digital',
      description: 'Campanhas e estratégias de marketing digital',
      columnsCount: 3,
      isActive: true,
      isShared: true,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      createdBy: 'user2'
    },
    {
      id: '3',
      name: 'Desenvolvimento',
      description: 'Tasks de desenvolvimento de software',
      columnsCount: 5,
      isActive: false,
      isShared: false,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-12',
      createdBy: 'user1'
    }
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'canvas'>('grid');
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [activeBoardColumns, setActiveBoardColumns] = useState<BoardColumn[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [sharingBoard, setSharingBoard] = useState<Board | null>(null);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.boards && Array.isArray(parsedData.boards)) {
          setBoards(parsedData.boards);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage
  const saveToStorage = (boardsData: Board[]) => {
    try {
      const dataToSave = {
        boards: boardsData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  };

  const handleBoardAction = (boardId: string, action: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;

    switch (action) {
      case 'view':
        setActiveBoard(board);
        setActiveBoardColumns([]);
        setViewMode('canvas');
        break;
      case 'edit':
        setEditingBoard(board);
        setIsEditModalOpen(true);
        break;
      case 'share':
        setSharingBoard(board);
        setIsShareModalOpen(true);
        break;
      case 'toggle-active':
        const updatedBoards = boards.map(b => 
          b.id === boardId ? { ...b, isActive: !b.isActive, updatedAt: new Date().toISOString() } : b
        );
        setBoards(updatedBoards);
        saveToStorage(updatedBoards);
        if (activeBoard?.id === boardId) {
          setActiveBoard(updatedBoards.find(b => b.id === boardId) || null);
        }
        break;
      case 'delete':
        if (confirm('Tem certeza que deseja excluir este board?')) {
          const filteredBoards = boards.filter(b => b.id !== boardId);
          setBoards(filteredBoards);
          saveToStorage(filteredBoards);
          if (activeBoard?.id === boardId) {
            setActiveBoard(null);
            setViewMode('grid');
          }
        }
        break;
    }
  };

  const handleCreateBoard = (boardData: Omit<Board, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    const newBoard: Board = {
      ...boardData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user'
    };
    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    saveToStorage(updatedBoards);
    setIsCreateModalOpen(false);
  };

  const handleCreateBoardFromTemplate = (board: Board, columns: BoardColumn[]) => {
    const updatedBoards = [...boards, board];
    setBoards(updatedBoards);
    saveToStorage(updatedBoards);
    setActiveBoard(board);
    setActiveBoardColumns(columns);
    setViewMode('canvas');
    setIsTemplateModalOpen(false);
  };

  const handleUpdateBoard = (updatedBoard: Board) => {
    const updatedBoards = boards.map(b => 
      b.id === updatedBoard.id ? { ...updatedBoard, updatedAt: new Date().toISOString() } : b
    );
    setBoards(updatedBoards);
    saveToStorage(updatedBoards);
    if (activeBoard?.id === updatedBoard.id) {
      setActiveBoard(updatedBoard);
    }
    setIsEditModalOpen(false);
    setEditingBoard(null);
  };

  const handleBackToGrid = () => {
    setActiveBoard(null);
    setActiveBoardColumns([]);
    setViewMode('grid');
  };

  const showCreateBoardOptions = () => {
    setIsTemplateModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      <OneBoardToolbar
        onCreateBoard={showCreateBoardOptions}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        activeBoard={activeBoard}
        onBackToGrid={handleBackToGrid}
      />

      {viewMode === 'grid' ? (
        <OneBoardGrid boards={boards} onBoardAction={handleBoardAction} />
      ) : (
        <OneBoardCanvas 
          board={activeBoard} 
          onBoardUpdate={handleUpdateBoard}
          onBoardAction={handleBoardAction}
          initialColumns={activeBoardColumns}
        />
      )}

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBoard}
      />

      <EditBoardModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBoard(null);
        }}
        board={editingBoard}
        onSubmit={handleUpdateBoard}
      />

      <ShareBoardModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setSharingBoard(null);
        }}
        board={sharingBoard}
      />

      <BoardTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onCreateBoard={handleCreateBoardFromTemplate}
      />
    </div>
  );
}

export default OneBoard;
