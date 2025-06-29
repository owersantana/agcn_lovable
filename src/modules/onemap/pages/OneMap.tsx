import React, { useState, useEffect } from 'react';
import { OneMapToolbar } from '../components/OneMapToolbar';
import { OneMapGrid } from '../components/OneMapGrid';
import { OneMapCanvas } from '../components/OneMapCanvas';
import { CreateMapModal } from '../components/CreateMapModal';
import { EditMapModal } from '../components/EditMapModal';
import { ShareMapModal } from '../components/ShareMapModal';
import { MindMap, MindMapNodeData } from '../config';
import { Node } from '@xyflow/react';

const STORAGE_KEY = 'onemap-data';

function OneMap() {
  const [maps, setMaps] = useState<MindMap[]>([
    {
      id: '1',
      name: 'Projeto Empresa',
      description: 'Mapa mental para planejamento estratégico da empresa',
      nodes: [
        {
          id: 'root',
          type: 'mindMapNode',
          position: { x: 400, y: 300 },
          data: {
            text: 'Estratégia 2024',
            color: '#FFFFFF',
            backgroundColor: '#3B82F6',
            fontSize: 16,
            fontWeight: 'bold',
            isRoot: true,
            children: ['node-1', 'node-2'],
            isExpanded: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
          },
        },
        {
          id: 'node-1',
          type: 'mindMapNode',
          position: { x: 200, y: 200 },
          data: {
            text: 'Marketing',
            color: '#FFFFFF',
            backgroundColor: '#10B981',
            fontSize: 14,
            fontWeight: 'normal',
            isRoot: false,
            parentId: 'root',
            children: [],
            isExpanded: true,
            createdAt: '2024-01-15T10:05:00Z',
            updatedAt: '2024-01-15T10:05:00Z',
          },
        },
        {
          id: 'node-2',
          type: 'mindMapNode',
          position: { x: 600, y: 200 },
          data: {
            text: 'Vendas',
            color: '#FFFFFF',
            backgroundColor: '#EF4444',
            fontSize: 14,
            fontWeight: 'normal',
            isRoot: false,
            parentId: 'root',
            children: [],
            isExpanded: true,
            createdAt: '2024-01-15T10:06:00Z',
            updatedAt: '2024-01-15T10:06:00Z',
          },
        },
      ],
      connections: [
        {
          id: 'conn-1',
          source: 'root',
          target: 'node-1',
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#10B981', strokeWidth: 2 },
          thickness: 2,
        },
        {
          id: 'conn-2',
          source: 'root',
          target: 'node-2',
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#EF4444', strokeWidth: 2 },
          thickness: 2,
        },
      ],
      viewport: {
        x: 0,
        y: 0,
        zoom: 1,
      },
      isPublic: false,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      createdBy: 'user1',
    },
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'canvas'>('grid');
  const [activeMap, setActiveMap] = useState<MindMap | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingMap, setEditingMap] = useState<MindMap | null>(null);
  const [sharingMap, setSharingMap] = useState<MindMap | null>(null);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.maps && Array.isArray(parsedData.maps)) {
          setMaps(parsedData.maps);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage
  const saveToStorage = (mapsData: MindMap[]) => {
    try {
      const dataToSave = {
        maps: mapsData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  };

  const handleMapAction = (mapId: string, action: string) => {
    const map = maps.find(m => m.id === mapId);
    if (!map) return;

    switch (action) {
      case 'view':
        setActiveMap(map);
        setViewMode('canvas');
        break;
      case 'edit':
        setEditingMap(map);
        setIsEditModalOpen(true);
        break;
      case 'share':
        setSharingMap(map);
        setIsShareModalOpen(true);
        break;
      case 'duplicate':
        const duplicatedMap: MindMap = {
          ...map,
          id: crypto.randomUUID(),
          name: `${map.name} (Cópia)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedMapsWithDuplicate = [...maps, duplicatedMap];
        setMaps(updatedMapsWithDuplicate);
        saveToStorage(updatedMapsWithDuplicate);
        break;
      case 'delete':
        if (confirm('Tem certeza que deseja excluir este mapa mental?')) {
          const filteredMaps = maps.filter(m => m.id !== mapId);
          setMaps(filteredMaps);
          saveToStorage(filteredMaps);
          if (activeMap?.id === mapId) {
            setActiveMap(null);
            setViewMode('grid');
          }
        }
        break;
    }
  };

  const handleCreateMap = (mapData: Omit<MindMap, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    const newMap: MindMap = {
      ...mapData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user'
    };
    
    const updatedMaps = [...maps, newMap];
    setMaps(updatedMaps);
    saveToStorage(updatedMaps);
    setIsCreateModalOpen(false);
  };

  const handleUpdateMap = (updatedMap: MindMap) => {
    const updatedMaps = maps.map(m => 
      m.id === updatedMap.id ? { ...updatedMap, updatedAt: new Date().toISOString() } : m
    );
    setMaps(updatedMaps);
    saveToStorage(updatedMaps);
    if (activeMap?.id === updatedMap.id) {
      setActiveMap(updatedMap);
    }
    setIsEditModalOpen(false);
    setEditingMap(null);
  };

  const handleBackToGrid = () => {
    setActiveMap(null);
    setViewMode('grid');
  };

  return (
    <div className="h-full flex flex-col">
      <OneMapToolbar
        onCreateMap={() => setIsCreateModalOpen(true)}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        activeMap={activeMap}
        onBackToGrid={handleBackToGrid}
      />

      {viewMode === 'grid' ? (
        <OneMapGrid maps={maps} onMapAction={handleMapAction} />
      ) : (
        <OneMapCanvas 
          map={activeMap} 
          onMapUpdate={handleUpdateMap}
          onMapAction={handleMapAction}
        />
      )}

      <CreateMapModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMap}
      />

      <EditMapModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMap(null);
        }}
        map={editingMap}
        onSubmit={handleUpdateMap}
      />

      <ShareMapModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setSharingMap(null);
        }}
        map={sharingMap}
      />
    </div>
  );
}

export default OneMap;
