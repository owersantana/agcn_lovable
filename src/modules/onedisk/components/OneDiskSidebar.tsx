
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2, Share, Heart, FolderTree, X } from "lucide-react";
import { OneDiskFileTreeSidebar } from "./OneDiskFileTreeSidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface OneDiskSidebarProps {
  usedSpace: number;
  totalSpace: number;
  objectsCount: number;
  currentPath: string;
  isOpen?: boolean;
  onClose?: () => void;
  onTrashClick: () => void;
  onSharedClick: () => void;
  onFavoritesClick: () => void;
  onNavigate: (path: string) => void;
}

export function OneDiskSidebar({
  usedSpace,
  totalSpace,
  objectsCount,
  currentPath,
  isOpen = true,
  onClose,
  onTrashClick,
  onSharedClick,
  onFavoritesClick,
  onNavigate
}: OneDiskSidebarProps) {
  const [activeView, setActiveView] = useState<'tree' | 'shared' | 'favorites'>('tree');
  const isMobile = useIsMobile();
  const usedPercentage = (usedSpace / totalSpace) * 100;
  const usedGB = (usedSpace / (1024 * 1024 * 1024)).toFixed(2);
  const totalGB = (totalSpace / (1024 * 1024 * 1024)).toFixed(0);

  const handleSharedClick = () => {
    setActiveView('tree');
    onSharedClick();
    if (isMobile && onClose) onClose();
  };

  const handleFavoritesClick = () => {
    setActiveView('tree');
    onFavoritesClick();
    if (isMobile && onClose) onClose();
  };

  const handleTreeClick = () => {
    setActiveView('tree');
    if (isMobile && onClose) onClose();
  };

  const handleTrashClick = () => {
    onTrashClick();
    if (isMobile && onClose) onClose();
  };

  const handleNavigate = (path: string) => {
    onNavigate(path);
    if (isMobile && onClose) onClose();
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        
        {/* Mobile sidebar */}
        <div className={cn(
          "fixed left-0 top-0 h-full w-80 bg-sidebar border-r border-sidebar-border z-50 transform transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <h2 className="text-lg font-semibold text-sidebar-foreground">OneDisk</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="p-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={handleTreeClick}
              >
                <FolderTree size={16} className="mr-3" />
                Árvore de Arquivos
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={handleTrashClick}
              >
                <Trash2 size={16} className="mr-3" />
                Lixeira
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={handleSharedClick}
              >
                <Share size={16} className="mr-3" />
                Compartilhados
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={handleFavoritesClick}
              >
                <Heart size={16} className="mr-3" />
                Favoritos
              </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto border-t border-sidebar-border">
              <OneDiskFileTreeSidebar 
                onNavigate={handleNavigate}
                currentPath={currentPath}
              />
            </div>

            {/* Storage info */}
            <div className="p-4 border-t border-sidebar-border">
              <div className="bg-sidebar-accent p-4 rounded-lg">
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-sidebar-foreground mb-2">
                    <span>Espaço usado</span>
                    <span>{usedGB} GB de {totalGB} GB</span>
                  </div>
                  <Progress value={usedPercentage} className="h-2" />
                </div>
                
                <div className="text-xs text-sidebar-foreground/60 space-y-1">
                  <div>Objetos: {objectsCount.toLocaleString()}</div>
                  <div>{usedPercentage.toFixed(1)}% utilizado</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-full flex flex-col">
      {/* Navigation */}
      <div className="p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleTreeClick}
        >
          <FolderTree size={16} className="mr-3" />
          Árvore de Arquivos
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={onTrashClick}
        >
          <Trash2 size={16} className="mr-3" />
          Lixeira
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleSharedClick}
        >
          <Share size={16} className="mr-3" />
          Compartilhados
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleFavoritesClick}
        >
          <Heart size={16} className="mr-3" />
          Favoritos
        </Button>
      </div>

      {/* Content Area - Only File Tree */}
      <div className="flex-1 overflow-y-auto border-t border-sidebar-border">
        <OneDiskFileTreeSidebar 
          onNavigate={onNavigate}
          currentPath={currentPath}
        />
      </div>

      {/* Storage info - Fixed at bottom */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent p-4 rounded-lg">
          <div className="mb-3">
            <div className="flex justify-between text-sm text-sidebar-foreground mb-2">
              <span>Espaço usado</span>
              <span className="text-xs sm:text-sm">{usedGB} GB de {totalGB} GB</span>
            </div>
            <Progress value={usedPercentage} className="h-2" />
          </div>
          
          <div className="text-xs text-sidebar-foreground/60 space-y-1">
            <div>Objetos: {objectsCount.toLocaleString()}</div>
            <div>{usedPercentage.toFixed(1)}% utilizado</div>
          </div>
        </div>
      </div>
    </div>
  );
}
