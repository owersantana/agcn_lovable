
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Star, 
  MoreHorizontal, 
  Eye, 
  Filter,
  Settings,
  Share,
  Archive,
  Edit,
  Power
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Board } from '../config';
import { useToast } from '@/hooks/use-toast';

interface OneBoardCanvasToolbarProps {
  board: Board;
  onBoardUpdate: (board: Board) => void;
  onBoardAction?: (boardId: string, action: string) => void;
}

export function OneBoardCanvasToolbar({ 
  board, 
  onBoardUpdate,
  onBoardAction
}: OneBoardCanvasToolbarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(board.name);
  const { toast } = useToast();

  const handleTitleSubmit = () => {
    if (title.trim() && title !== board.name) {
      onBoardUpdate({
        ...board,
        name: title.trim(),
        updatedAt: new Date().toISOString()
      });
      toast({
        title: "Sucesso",
        description: "Nome do board atualizado"
      });
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(board.name);
      setIsEditingTitle(false);
    }
  };

  const toggleFavorite = () => {
    const favoritesKey = 'oneboard-favorites';
    const savedFavorites = localStorage.getItem(favoritesKey);
    let favorites: string[] = [];
    
    if (savedFavorites) {
      try {
        favorites = JSON.parse(savedFavorites);
      } catch (error) {
        console.error('Error parsing favorites:', error);
        favorites = [];
      }
    }

    const isFavorite = favorites.includes(board.id);
    let newFavorites: string[];

    if (isFavorite) {
      newFavorites = favorites.filter(id => id !== board.id);
      toast({
        title: "Removido dos favoritos",
        description: `${board.name} foi removido dos favoritos`
      });
    } else {
      newFavorites = [...favorites, board.id];
      toast({
        title: "Adicionado aos favoritos",
        description: `${board.name} foi adicionado aos favoritos`
      });
    }

    localStorage.setItem(favoritesKey, JSON.stringify(newFavorites));
    window.dispatchEvent(new Event('storage'));
  };

  const toggleVisibility = () => {
    onBoardUpdate({
      ...board,
      isShared: !board.isShared,
      updatedAt: new Date().toISOString()
    });
    
    toast({
      title: "Visibilidade alterada",
      description: `Board agora é ${!board.isShared ? 'público' : 'privado'}`
    });
  };

  const handleBoardAction = (action: string) => {
    if (onBoardAction) {
      onBoardAction(board.id, action);
    }
  };

  const getFavoriteStatus = () => {
    const favoritesKey = 'oneboard-favorites';
    const savedFavorites = localStorage.getItem(favoritesKey);
    
    if (savedFavorites) {
      try {
        const favorites: string[] = JSON.parse(savedFavorites);
        return favorites.includes(board.id);
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  const isFavorite = getFavoriteStatus();

  return (
    <div className="border-b border-border bg-background p-3 sm:p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {isEditingTitle ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyDown}
              className="text-lg font-semibold bg-transparent border-0 p-0 h-auto focus-visible:ring-0"
              autoFocus
            />
          ) : (
            <h1 
              className="text-lg sm:text-xl font-semibold cursor-pointer hover:bg-muted/50 px-2 py-1 rounded truncate"
              onClick={() => setIsEditingTitle(true)}
            >
              {board.name}
            </h1>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleFavorite}
            className="p-1 h-auto"
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </Button>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleVisibility}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm">
                {board.isShared ? 'Público' : 'Privado'}
              </span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtro</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleBoardAction('share')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleBoardAction('edit')}>
                <Edit className="h-4 w-4 mr-2" />
                Editar Board
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBoardAction('share')}>
                <Share className="h-4 w-4 mr-2" />
                Compartilhar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBoardAction('toggle-active')}>
                <Power className="h-4 w-4 mr-2" />
                {board.isActive ? 'Desativar' : 'Ativar'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleBoardAction('delete')}
                className="text-destructive focus:text-destructive"
              >
                <Archive className="h-4 w-4 mr-2" />
                Excluir Board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {board.description && (
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          {board.description}
        </p>
      )}
    </div>
  );
}
