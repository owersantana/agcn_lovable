
import { ChevronRight } from "lucide-react";
import { OneDiskActionBar } from "./OneDiskActionBar";

interface OneDiskFooterProps {
  currentPath: string;
  bucketUuid: string;
  bucketName: string;
  selectedItems: string[];
  isInTrash?: boolean;
  isInShared?: boolean;
  isInFavorites?: boolean;
  onPathClick: (path: string) => void;
  onDeleteSelected: () => void;
  onRestoreSelected?: () => void;
  onEmptyTrash?: () => void;
  onZipSelected: () => void;
  onClearSelection: () => void;
  onRemoveSharing?: () => void;
  onRemoveFavorites?: () => void;
}

export function OneDiskFooter({
  currentPath,
  bucketUuid,
  bucketName,
  selectedItems,
  isInTrash = false,
  isInShared = false,
  isInFavorites = false,
  onPathClick,
  onDeleteSelected,
  onRestoreSelected,
  onEmptyTrash,
  onZipSelected,
  onClearSelection,
  onRemoveSharing,
  onRemoveFavorites
}: OneDiskFooterProps) {
  const pathSegments = currentPath.split('/').filter(segment => segment !== '');
  
  return (
    <div className="border-t border-border">
      <OneDiskActionBar
        selectedCount={selectedItems.length}
        isInTrash={isInTrash}
        isInShared={isInShared}
        isInFavorites={isInFavorites}
        onDelete={onDeleteSelected}
        onRestore={onRestoreSelected}
        onEmptyTrash={onEmptyTrash}
        onZip={onZipSelected}
        onClearSelection={onClearSelection}
        onRemoveSharing={onRemoveSharing}
        onRemoveFavorites={onRemoveFavorites}
      />
      
      <div className="flex items-center justify-between p-2 sm:p-4 bg-background">
        {/* Left side - Breadcrumb path */}
        <div className="flex items-center space-x-1 text-sm text-muted-foreground min-w-0 flex-1">
          <button
            onClick={() => onPathClick('/')}
            className="hover:text-foreground transition-colors truncate"
          >
            {bucketName}
          </button>
          
          {isInTrash ? (
            <>
              <ChevronRight size={14} className="flex-shrink-0" />
              <span className="text-foreground">Lixeira</span>
            </>
          ) : isInShared ? (
            <>
              <ChevronRight size={14} className="flex-shrink-0" />
              <span className="text-foreground">Compartilhados</span>
            </>
          ) : isInFavorites ? (
            <>
              <ChevronRight size={14} className="flex-shrink-0" />
              <span className="text-foreground">Favoritos</span>
            </>
          ) : (
            pathSegments.map((segment, index) => {
              const fullPath = '/' + pathSegments.slice(0, index + 1).join('/');
              return (
                <div key={index} className="flex items-center space-x-1 min-w-0">
                  <ChevronRight size={14} className="flex-shrink-0" />
                  <button
                    onClick={() => onPathClick(fullPath)}
                    className="hover:text-foreground transition-colors truncate"
                  >
                    {segment}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Right side - Bucket UUID */}
        <div className="text-xs text-muted-foreground font-mono ml-4 hidden sm:block">
          {bucketUuid}
        </div>
      </div>
    </div>
  );
}
