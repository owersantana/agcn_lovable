
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  FolderPlus, 
  Trash2, 
  Share, 
  Info,
  Grid3X3,
  List,
  Menu
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface OneDiskToolbarProps {
  bucketName: string;
  viewMode: 'list' | 'grid';
  isInTrash?: boolean;
  isInShared?: boolean;
  isInFavorites?: boolean;
  onNavigateHome: () => void;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  onReload: () => void;
  onCreateFolder: () => void;
  onDelete: () => void;
  onShare: () => void;
  onInfo: () => void;
  onViewModeChange: (mode: 'list' | 'grid') => void;
  onMenuClick?: () => void;
}

export function OneDiskToolbar({
  bucketName,
  viewMode,
  isInTrash = false,
  isInShared = false,
  isInFavorites = false,
  onNavigateHome,
  onNavigateBack,
  onNavigateForward,
  onReload,
  onCreateFolder,
  onDelete,
  onShare,
  onInfo,
  onViewModeChange,
  onMenuClick
}: OneDiskToolbarProps) {
  const isMobile = useIsMobile();
  const isSpecialView = isInTrash || isInShared || isInFavorites;

  return (
    <div className="border-b border-border bg-background px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onMenuClick}>
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onNavigateHome}>
              <Home className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onNavigateBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onNavigateForward}>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onReload}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Actions - Hidden in special views */}
          {!isSpecialView && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={onCreateFolder}>
                <FolderPlus className="h-4 w-4" />
                {!isMobile && <span className="ml-2">Nova Pasta</span>}
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground hidden sm:block">
            {bucketName}
          </h1>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* View Mode */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="h-7 w-7 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="h-7 w-7 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* More Actions */}
          <div className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onShare}>
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onInfo}>
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
