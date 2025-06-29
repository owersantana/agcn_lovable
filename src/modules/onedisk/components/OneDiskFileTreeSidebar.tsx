
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Folder, FolderOpen, File, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  path: string;
  files?: any[]; // Arquivos dentro da pasta
}

interface OneDiskFileTreeSidebarProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export function OneDiskFileTreeSidebar({ onNavigate, currentPath }: OneDiskFileTreeSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['/']);

  // Mock data expandido - em produção viria da API
  const treeData: TreeNode[] = [
    {
      id: 'root',
      name: 'Meu Bucket',
      type: 'folder',
      path: '/',
      files: [
        {
          id: "1",
          name: "Pasta de Imagens",
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
      children: [
        {
          id: 'imagens',
          name: 'Imagens',
          type: 'folder',
          path: '/imagens',
          files: [
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
          ]
        },
        {
          id: 'documentos',
          name: 'Documentos',
          type: 'folder',
          path: '/documentos',
          files: [
            {
              id: "doc1",
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
          children: [
            {
              id: 'projetos',
              name: 'Projetos',
              type: 'folder',
              path: '/documentos/projetos',
              files: [
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
              ]
            }
          ]
        },
        {
          id: 'downloads',
          name: 'Downloads',
          type: 'folder',
          path: '/downloads',
          files: [
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
        }
      ]
    }
  ];

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleFolderClick = (node: TreeNode) => {
    if (node.type === 'folder') {
      onNavigate(node.path);
    }
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedFolders.includes(node.id);
    const isActive = currentPath === node.path;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center gap-1 py-1 px-2 text-sm hover:bg-sidebar-accent rounded cursor-pointer",
            isActive && "bg-sidebar-primary text-sidebar-primary-foreground"
          )}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => handleFolderClick(node)}
        >
          {node.type === 'folder' && hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(node.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          
          {node.type === 'folder' ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <Folder className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            )
          ) : (
            <File className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          )}
          
          <span className="truncate flex-1">{node.name}</span>
        </div>

        {node.type === 'folder' && hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2">
      <h3 className="text-sm font-medium text-sidebar-foreground mb-2">Árvore de Arquivos</h3>
      <div className="space-y-1">
        {treeData.map(node => renderTreeNode(node))}
      </div>
    </div>
  );
}
