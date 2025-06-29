
import { Button } from "@/components/ui/button";
import { Trash2, Archive, X, RotateCcw, Trash, Share, Heart } from "lucide-react";

interface OneDiskActionBarProps {
  selectedCount: number;
  isInTrash?: boolean;
  isInShared?: boolean;
  isInFavorites?: boolean;
  onDelete: () => void;
  onRestore?: () => void;
  onEmptyTrash?: () => void;
  onZip: () => void;
  onClearSelection: () => void;
  onRemoveSharing?: () => void;
  onRemoveFavorites?: () => void;
}

export function OneDiskActionBar({
  selectedCount,
  isInTrash = false,
  isInShared = false,
  isInFavorites = false,
  onDelete,
  onRestore,
  onEmptyTrash,
  onZip,
  onClearSelection,
  onRemoveSharing,
  onRemoveFavorites
}: OneDiskActionBarProps) {
  if (selectedCount === 0 && !isInTrash) return null;

  return (
    <div className="bg-primary text-primary-foreground px-2 sm:px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
        {selectedCount > 0 && (
          <span className="text-sm font-medium truncate">
            {selectedCount} {selectedCount === 1 ? 'item selecionado' : 'itens selecionados'}
          </span>
        )}
        
        <div className="flex space-x-1 sm:space-x-2">
          {isInTrash ? (
            <>
              {selectedCount > 0 && onRestore && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onRestore}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm px-2 sm:px-3"
                >
                  <RotateCcw size={14} className="mr-1" />
                  <span className="hidden sm:inline">Restaurar</span>
                </Button>
              )}
              
              {selectedCount > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onDelete}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Trash size={14} className="mr-1" />
                  <span className="hidden sm:inline">Excluir definitivamente</span>
                </Button>
              )}
              
              {onEmptyTrash && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onEmptyTrash}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Trash2 size={14} className="mr-1" />
                  <span className="hidden sm:inline">Esvaziar lixeira</span>
                </Button>
              )}
            </>
          ) : isInShared ? (
            selectedCount > 0 && onRemoveSharing && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onRemoveSharing}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm px-2 sm:px-3"
              >
                <Share size={14} className="mr-1" />
                <span className="hidden sm:inline">Remover compartilhamento</span>
              </Button>
            )
          ) : isInFavorites ? (
            selectedCount > 0 && onRemoveFavorites && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onRemoveFavorites}
                className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm px-2 sm:px-3"
              >
                <Heart size={14} className="mr-1" />
                <span className="hidden sm:inline">Remover dos favoritos</span>
              </Button>
            )
          ) : (
            selectedCount > 0 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onDelete}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Trash2 size={14} className="mr-1" />
                  <span className="hidden sm:inline">Excluir</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onZip}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Archive size={14} className="mr-1" />
                  <span className="hidden sm:inline">Zip</span>
                </Button>
              </>
            )
          )}
        </div>
      </div>
      
      {selectedCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-primary-foreground hover:bg-primary-foreground/20 ml-2 p-2"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
}
