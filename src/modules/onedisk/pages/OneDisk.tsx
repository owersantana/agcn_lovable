import { useState } from "react";
import { OneDiskToolbar } from "../components/OneDiskToolbar";
import { OneDiskSidebar } from "../components/OneDiskSidebar";
import { OneDiskFileArea } from "../components/OneDiskFileArea";
import { OneDiskFooter } from "../components/OneDiskFooter";
import { OneDiskShareModal } from "../components/OneDiskShareModal";
import { FileItem, BucketInfo } from "../config";
import { useIsMobile } from "@/hooks/use-mobile";

export default function OneDisk() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'files' | 'trash' | 'shared' | 'favorites'>('files');
  const [currentPath, setCurrentPath] = useState('/');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; fileName: string; shareLink: string }>({
    isOpen: false,
    fileName: '',
    shareLink: ''
  });
  
  const [bucketInfo] = useState<BucketInfo>({
    id: "bucket-1",
    name: "Meu Bucket",
    uuid: "b8f3c4e2-9a7d-4e1f-8c6b-2d5a9e7f1b3c",
    currentPath: currentPath,
    usedSpace: 45 * 1024 * 1024 * 1024,
    totalSpace: 100 * 1024 * 1024 * 1024,
    objectsCount: 1247
  });

  // Mock data organizado por diretórios
  const [allFiles, setAllFiles] = useState<{ [path: string]: FileItem[] }>({
    '/': [
      {
        id: "1",
        name: "Imagens",
        type: "folder",
        size: 0,
        createdAt: new Date("2024-01-15"),
        modifiedAt: new Date("2024-01-20"),
        shared: false,
        favorite: true,
        path: "/imagens",
      },
      {
        id: "2",
        name: "Documentos",
        type: "folder",
        size: 0,
        createdAt: new Date("2024-01-16"),
        modifiedAt: new Date("2024-01-21"),
        shared: false,
        favorite: false,
        path: "/documentos",
      },
      {
        id: "3",
        name: "Downloads",
        type: "folder",
        size: 0,
        createdAt: new Date("2024-01-17"),
        modifiedAt: new Date("2024-01-22"),
        shared: false,
        favorite: false,
        path: "/downloads",
      },
      {
        id: "4",
        name: "Manual.pdf",
        type: "file",
        size: 1200000,
        createdAt: new Date("2024-01-18"),
        modifiedAt: new Date("2024-01-18"),
        shared: false,
        favorite: false,
        path: "/manual.pdf",
        mimeType: "application/pdf"
      }
    ],
    '/imagens': [
      {
        id: "img1",
        name: "foto1.jpg",
        type: "file",
        size: 850000,
        createdAt: new Date("2024-01-19"),
        modifiedAt: new Date("2024-01-19"),
        shared: true,
        favorite: false,
        path: "/imagens/foto1.jpg",
        mimeType: "image/jpeg"
      },
      {
        id: "img2",
        name: "screenshot.png",
        type: "file",
        size: 450000,
        createdAt: new Date("2024-01-20"),
        modifiedAt: new Date("2024-01-20"),
        shared: false,
        favorite: true,
        path: "/imagens/screenshot.png",
        mimeType: "image/png"
      }
    ],
    '/documentos': [
      {
        id: "doc1",
        name: "Projetos",
        type: "folder",
        size: 0,
        createdAt: new Date("2024-01-16"),
        modifiedAt: new Date("2024-01-21"),
        shared: false,
        favorite: false,
        path: "/documentos/projetos",
      },
      {
        id: "doc2",
        name: "Contrato.pdf",
        type: "file",
        size: 2560000,
        createdAt: new Date("2024-01-17"),
        modifiedAt: new Date("2024-01-17"),
        shared: false,
        favorite: false,
        path: "/documentos/contrato.pdf",
        mimeType: "application/pdf"
      }
    ],
    '/documentos/projetos': [
      {
        id: "proj1",
        name: "Projeto A",
        type: "folder",
        size: 0,
        createdAt: new Date("2024-01-16"),
        modifiedAt: new Date("2024-01-21"),
        shared: true,
        favorite: false,
        path: "/documentos/projetos/projeto-a",
      },
      {
        id: "proj2",
        name: "Relatório.docx",
        type: "file",
        size: 1800000,
        createdAt: new Date("2024-01-18"),
        modifiedAt: new Date("2024-01-18"),
        shared: false,
        favorite: true,
        path: "/documentos/projetos/relatorio.docx",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      }
    ],
    '/downloads': [
      {
        id: "down1",
        name: "video_demo.mp4",
        type: "file",
        size: 105600000,
        createdAt: new Date("2024-01-17"),
        modifiedAt: new Date("2024-01-17"),
        shared: false,
        favorite: false,
        path: "/downloads/video_demo.mp4",
        mimeType: "video/mp4"
      }
    ]
  });

  const [trashedFiles, setTrashedFiles] = useState<FileItem[]>([]);

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath(file.path);
      setSelectedItems([]);
      console.log("Navigate to folder:", file.name);
    } else {
      console.log("Open file:", file.name);
    }
  };

  const handleNavigateToFolder = (folder: FileItem) => {
    if (folder.type === 'folder') {
      setCurrentPath(folder.path);
      setSelectedItems([]);
      console.log("Navigate into folder:", folder.name);
    }
  };

  const handleFavoriteToggle = (fileId: string) => {
    setAllFiles(prevFiles => {
      const newFiles = { ...prevFiles };
      
      // Encontrar e atualizar o arquivo em qualquer diretório
      Object.keys(newFiles).forEach(path => {
        newFiles[path] = newFiles[path].map(file => 
          file.id === fileId ? { ...file, favorite: !file.favorite } : file
        );
      });
      
      return newFiles;
    });
  };

  const handleShareClick = (fileId: string) => {
    const currentFiles = getCurrentFiles();
    const file = currentFiles.find(f => f.id === fileId);
    
    if (file) {
      const shareLink = `https://onedisk.example.com/share/${file.id}`;
      
      setShareModal({
        isOpen: true,
        fileName: file.name,
        shareLink: shareLink
      });
      
      // Marcar como compartilhado
      setAllFiles(prevFiles => {
        const newFiles = { ...prevFiles };
        Object.keys(newFiles).forEach(path => {
          newFiles[path] = newFiles[path].map(f => 
            f.id === fileId ? { ...f, shared: true } : f
          );
        });
        return newFiles;
      });
    }
  };

  const handleCreateFolder = () => {
    if (currentView !== 'files') return;
    
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name: "",
      type: "folder",
      size: 0,
      createdAt: new Date(),
      modifiedAt: new Date(),
      shared: false,
      favorite: false,
      path: `${currentPath === '/' ? '' : currentPath}/nova-pasta`,
    };
    
    setAllFiles(prevFiles => {
      const newFiles = { ...prevFiles };
      const currentFiles = newFiles[currentPath] || [];
      newFiles[currentPath] = [newFolder, ...currentFiles];
      return newFiles;
    });
    
    setEditingFolderId(newFolder.id);
    console.log("Nova pasta criada");
  };

  const handleFolderRename = (itemId: string, newName: string) => {
    setAllFiles(prevFiles => {
      const newFiles = { ...prevFiles };
      const currentFiles = newFiles[currentPath] || [];
      
      if (newName.trim()) {
        newFiles[currentPath] = currentFiles.map(file => 
          file.id === itemId ? { ...file, name: newName.trim() } : file
        );
      } else {
        newFiles[currentPath] = currentFiles.filter(file => file.id !== itemId);
      }
      
      return newFiles;
    });
    
    setEditingFolderId(null);
  };

  const handleUploadFiles = (files: FileList) => {
    if (currentView !== 'files') return;
    
    const newFiles: FileItem[] = Array.from(files).map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: "file" as const,
      size: file.size,
      createdAt: new Date(),
      modifiedAt: new Date(),
      shared: false,
      favorite: false,
      path: `${currentPath === '/' ? '' : currentPath}/${file.name}`,
      mimeType: file.type || 'application/octet-stream'
    }));
    
    setAllFiles(prevFiles => {
      const updatedFiles = { ...prevFiles };
      const currentFiles = updatedFiles[currentPath] || [];
      updatedFiles[currentPath] = [...currentFiles, ...newFiles];
      return updatedFiles;
    });
    
    console.log("Arquivos carregados:", newFiles.map(f => f.name));
  };

  const handleReload = () => {
    console.log("Recarregando diretório atual:", currentPath);
    setSelectedItems([]);
  };

  const handleItemSelect = (item: FileItem) => {
    setSelectedItems(prev => {
      if (prev.includes(item.id)) {
        return prev.filter(id => id !== item.id);
      } else {
        return [...prev, item.id];
      }
    });
  };

  const handleSelectAll = (selected: boolean) => {
    const currentFiles = getCurrentFiles();
    setSelectedItems(selected ? currentFiles.map(file => file.id) : []);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    const currentFiles = getCurrentFiles();
    const selectedFiles = currentFiles.filter(file => selectedItems.includes(file.id));
    
    if (currentView === 'trash') {
      setTrashedFiles(prev => prev.filter(file => !selectedItems.includes(file.id)));
      console.log("Itens excluídos permanentemente:", selectedItems);
    } else {
      setTrashedFiles(prev => [...prev, ...selectedFiles]);
      
      if (currentView === 'files') {
        setAllFiles(prevFiles => {
          const newFiles = { ...prevFiles };
          const remainingFiles = (newFiles[currentPath] || []).filter(file => !selectedItems.includes(file.id));
          newFiles[currentPath] = remainingFiles;
          return newFiles;
        });
      }
      
      console.log("Itens movidos para lixeira:", selectedItems);
    }
    
    setSelectedItems([]);
  };

  const handleRestoreSelected = () => {
    if (currentView !== 'trash' || selectedItems.length === 0) return;
    
    const selectedFiles = trashedFiles.filter(file => selectedItems.includes(file.id));
    
    setAllFiles(prevFiles => {
      const newFiles = { ...prevFiles };
      const rootFiles = newFiles['/'] || [];
      newFiles['/'] = [...rootFiles, ...selectedFiles];
      return newFiles;
    });
    
    setTrashedFiles(prev => prev.filter(file => !selectedItems.includes(file.id)));
    setSelectedItems([]);
    console.log("Itens restaurados:", selectedItems);
  };

  const handleEmptyTrash = () => {
    setTrashedFiles([]);
    setSelectedItems([]);
    console.log("Lixeira esvaziada");
  };

  const handleZipSelected = () => {
    console.log("Criando ZIP dos itens:", selectedItems);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handlePathClick = (path: string) => {
    setCurrentPath(path);
    setSelectedItems([]);
    console.log("Navigate to path:", path);
  };

  const handleTrashClick = () => {
    setCurrentView('trash');
    setSelectedItems([]);
    console.log("Mostrando lixeira");
  };

  const handleSharedClick = () => {
    setCurrentView('shared');
    setSelectedItems([]);
    console.log("Mostrando compartilhados");
  };

  const handleFavoritesClick = () => {
    setCurrentView('favorites');
    setSelectedItems([]);
    console.log("Mostrando favoritos");
  };

  const handleBackToFiles = () => {
    setCurrentView('files');
    setSelectedItems([]);
    console.log("Voltando aos arquivos");
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setCurrentView('files');
    setSelectedItems([]);
    console.log("Navigate to:", path);
  };

  const handleRemoveSharing = () => {
    if (currentView !== 'shared' || selectedItems.length === 0) return;
    
    setAllFiles(prevFiles => {
      const newFiles = { ...prevFiles };
      Object.keys(newFiles).forEach(path => {
        newFiles[path] = newFiles[path].map(file => 
          selectedItems.includes(file.id) ? { ...file, shared: false } : file
        );
      });
      return newFiles;
    });
    
    setSelectedItems([]);
    console.log("Compartilhamento removido:", selectedItems);
  };

  const handleRemoveFavorites = () => {
    if (currentView !== 'favorites' || selectedItems.length === 0) return;
    
    setAllFiles(prevFiles => {
      const newFiles = { ...prevFiles };
      Object.keys(newFiles).forEach(path => {
        newFiles[path] = newFiles[path].map(file => 
          selectedItems.includes(file.id) ? { ...file, favorite: false } : file
        );
      });
      return newFiles;
    });
    
    setSelectedItems([]);
    console.log("Removido dos favoritos:", selectedItems);
  };

  const getCurrentFiles = () => {
    switch (currentView) {
      case 'trash':
        return trashedFiles;
      case 'shared':
        return Object.values(allFiles).flat().filter(file => file.shared);
      case 'favorites':
        return Object.values(allFiles).flat().filter(file => file.favorite);
      default:
        return allFiles[currentPath] || [];
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'trash':
        return "Lixeira";
      case 'shared':
        return "Arquivos Compartilhados";
      case 'favorites':
        return "Arquivos Favoritos";
      default:
        return bucketInfo.name;
    }
  };

  const getCurrentPath = () => {
    switch (currentView) {
      case 'trash':
        return "/lixeira";
      case 'shared':
        return "/compartilhados";
      case 'favorites':
        return "/favoritos";
      default:
        return currentPath;
    }
  };

  const currentFiles = getCurrentFiles();
  const isEmpty = currentFiles.length === 0;

  const renderEmptyState = () => {
    switch (currentView) {
      case 'trash':
        return (
          <div className="text-center space-y-4">
            <div className="text-6xl opacity-20">🗑️</div>
            <h3 className="text-lg font-medium">Lixeira vazia</h3>
            <p className="text-muted-foreground">
              Não há itens na lixeira no momento.
            </p>
          </div>
        );
      case 'shared':
        return (
          <div className="text-center space-y-4">
            <div className="text-6xl opacity-20">📤</div>
            <h3 className="text-lg font-medium">Nenhum arquivo compartilhado</h3>
            <p className="text-muted-foreground">
              Você ainda não compartilhou nenhum arquivo.
            </p>
          </div>
        );
      case 'favorites':
        return (
          <div className="text-center space-y-4">
            <div className="text-6xl opacity-20">❤️</div>
            <h3 className="text-lg font-medium">Nenhum arquivo favorito</h3>
            <p className="text-muted-foreground">
              Adicione arquivos aos favoritos para vê-los aqui.
            </p>
          </div>
        );
      default:
        return (
          <div className="text-center space-y-4">
            <div className="text-6xl opacity-20">📁</div>
            <h3 className="text-lg font-medium">Diretório vazio</h3>
            <p className="text-muted-foreground">
              Este diretório não contém nenhum arquivo ou pasta.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <OneDiskToolbar
        bucketName={getViewTitle()}
        viewMode={viewMode}
        isInTrash={currentView === 'trash'}
        isInShared={currentView === 'shared'}
        isInFavorites={currentView === 'favorites'}
        onNavigateHome={handleBackToFiles}
        onNavigateBack={() => {
          const pathParts = currentPath.split('/').filter(Boolean);
          if (pathParts.length > 0) {
            pathParts.pop();
            const newPath = '/' + pathParts.join('/');
            setCurrentPath(newPath === '/' ? '/' : newPath);
          }
        }}
        onNavigateForward={() => console.log("Navigate forward")}
        onReload={handleReload}
        onCreateFolder={handleCreateFolder}
        onDelete={() => console.log("Delete")}
        onShare={() => console.log("Share")}
        onInfo={() => console.log("Info")}
        onViewModeChange={setViewMode}
        onMenuClick={() => setSidebarOpen(true)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <OneDiskSidebar
          usedSpace={bucketInfo.usedSpace}
          totalSpace={bucketInfo.totalSpace}
          objectsCount={bucketInfo.objectsCount}
          currentPath={getCurrentPath()}
          isOpen={isMobile ? sidebarOpen : true}
          onClose={() => setSidebarOpen(false)}
          onTrashClick={handleTrashClick}
          onSharedClick={handleSharedClick}
          onFavoritesClick={handleFavoritesClick}
          onNavigate={handleNavigate}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          {isEmpty ? (
            <div className="flex-1 flex items-center justify-center">
              {renderEmptyState()}
            </div>
          ) : (
            <OneDiskFileArea
              files={currentFiles}
              viewMode={viewMode}
              selectedItems={selectedItems}
              editingFolderId={editingFolderId}
              isInTrash={currentView === 'trash'}
              isInShared={currentView === 'shared'}
              isInFavorites={currentView === 'favorites'}
              onFileClick={handleFileClick}
              onFavoriteToggle={handleFavoriteToggle}
              onShareClick={handleShareClick}
              onItemSelect={handleItemSelect}
              onSelectAll={handleSelectAll}
              onFolderRename={handleFolderRename}
              onNavigateToFolder={handleNavigateToFolder}
              onUploadFiles={handleUploadFiles}
            />
          )}
          
          <OneDiskFooter
            currentPath={getCurrentPath()}
            bucketUuid={bucketInfo.uuid}
            bucketName={bucketInfo.name}
            selectedItems={selectedItems}
            isInTrash={currentView === 'trash'}
            isInShared={currentView === 'shared'}
            isInFavorites={currentView === 'favorites'}
            onPathClick={handlePathClick}
            onDeleteSelected={handleDeleteSelected}
            onRestoreSelected={handleRestoreSelected}
            onEmptyTrash={trashedFiles.length > 0 ? handleEmptyTrash : undefined}
            onZipSelected={handleZipSelected}
            onClearSelection={handleClearSelection}
            onRemoveSharing={handleRemoveSharing}
            onRemoveFavorites={handleRemoveFavorites}
          />
        </div>
      </div>

      <OneDiskShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal(prev => ({ ...prev, isOpen: false }))}
        fileName={shareModal.fileName}
        shareLink={shareModal.shareLink}
      />
    </div>
  );
}
