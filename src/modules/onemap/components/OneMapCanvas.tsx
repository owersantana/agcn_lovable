import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  NodeTypes,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MindMap, MindMapNodeData, DEFAULT_NODE_COLORS } from '../config';
import { OneMapCanvasToolbar } from './OneMapCanvasToolbar';
import { MindMapFlowNode } from './MindMapFlowNode';
import { useToast } from '@/hooks/use-toast';

interface OneMapCanvasProps {
  map: MindMap | null;
  onMapUpdate: (map: MindMap) => void;
  onMapAction: (mapId: string, action: string) => void;
}

// ✅ MOVIDO PARA FORA DO COMPONENTE - Corrige o warning do React Flow
const nodeTypes: NodeTypes = {
  mindMapNode: MindMapFlowNode,
};

export function OneMapCanvas({ map, onMapUpdate, onMapAction }: OneMapCanvasProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFromNode, setConnectingFromNode] = useState<string | null>(null);

  console.log('🎨 OneMapCanvas render:', { map: map?.name, nodesCount: map?.nodes?.length });

  // Ensure all nodes have proper position properties and default values
  const initialNodes = useMemo(() => {
    if (!map?.nodes) return [];
    console.log('🔄 Processing initial nodes:', map.nodes);
    return map.nodes.map(node => ({
      ...node,
      position: node.position || { x: 400, y: 300 },
      data: {
        ...node.data,
        text: node.data.text || 'Novo Nó',
        backgroundColor: node.data.backgroundColor || '#3B82F6',
        color: node.data.color || '#FFFFFF',
        fontSize: node.data.fontSize || 14,
        fontWeight: node.data.fontWeight || 'normal',
        children: node.data.children || [],
        isExpanded: node.data.isExpanded !== undefined ? node.data.isExpanded : true,
      }
    }));
  }, [map?.nodes]);

  const initialEdges = useMemo(() => {
    if (!map?.connections) return [];
    console.log('🔗 Processing initial edges:', map.connections);
    return map.connections.map(conn => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      type: conn.type || 'smoothstep',
      animated: false,
      style: { 
        stroke: '#E5E7EB', 
        strokeWidth: 0.8,
        strokeOpacity: 0.4
      },
    }));
  }, [map?.connections]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<MindMapNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  // Update local state when map changes
  React.useEffect(() => {
    if (map) {
      console.log('🗺️ Map changed, updating nodes and edges');
      const safeNodes = map.nodes.map(node => ({
        ...node,
        position: node.position || { x: 400, y: 300 },
        data: {
          ...node.data,
          text: node.data.text || 'Novo Nó',
          backgroundColor: node.data.backgroundColor || '#3B82F6',
          color: node.data.color || '#FFFFFF',
          fontSize: node.data.fontSize || 14,
          fontWeight: node.data.fontWeight || 'normal',
          children: node.data.children || [],
          isExpanded: node.data.isExpanded !== undefined ? node.data.isExpanded : true,
        }
      }));
      setNodes(safeNodes);
      
      const safeEdges = map.connections?.map(conn => ({
        id: conn.id,
        source: conn.source,
        target: conn.target,
        type: conn.type || 'smoothstep',
        animated: false,
        style: { 
          stroke: '#E5E7EB', 
          strokeWidth: 0.8,
          strokeOpacity: 0.4
        },
      })) || [];
      setEdges(safeEdges);
    }
  }, [map, setNodes, setEdges]);

  // Filter nodes and edges based on expanded state
  const visibleNodes = useMemo(() => {
    if (!nodes.length) return [];
    
    const getVisibleNodeIds = (nodeId: string, visited = new Set()): string[] => {
      if (visited.has(nodeId)) return [];
      visited.add(nodeId);
      
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return [];
      
      const result = [nodeId];
      
      if (node.data.isExpanded && node.data.children) {
        for (const childId of node.data.children) {
          result.push(...getVisibleNodeIds(childId, visited));
        }
      }
      
      return result;
    };
    
    const rootNode = nodes.find(n => n.data.isRoot);
    if (!rootNode) return nodes;
    
    const visibleIds = new Set(getVisibleNodeIds(rootNode.id));
    return nodes.filter(node => visibleIds.has(node.id));
  }, [nodes]);

  const visibleEdges = useMemo(() => {
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
    return edges.filter(edge => 
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );
  }, [edges, visibleNodes]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (!sourceNode || !targetNode) return;

      const newEdge: Edge = {
        ...params,
        id: crypto.randomUUID(),
        type: 'smoothstep',
        animated: false,
        style: { 
          stroke: '#E5E7EB', 
          strokeWidth: 0.8,
          strokeOpacity: 0.4
        },
      };
      
      console.log('🔗 Creating new connection:', newEdge);
      setEdges((eds) => addEdge(newEdge, eds));
      
      toast({
        title: "Conexão criada",
        description: `Nós conectados com sucesso!`,
      });
    },
    [nodes, setEdges, toast]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('👆 Node clicked:', node.id, 'isConnecting:', isConnecting);
    
    if (isConnecting) {
      if (!connectingFromNode) {
        setConnectingFromNode(node.id);
        toast({
          title: "Nó selecionado",
          description: "Clique em outro nó para criar a conexão",
        });
      } else if (connectingFromNode !== node.id) {
        const params: Connection = {
          source: connectingFromNode,
          target: node.id,
          sourceHandle: null,
          targetHandle: null,
        };
        onConnect(params);
        setConnectingFromNode(null);
        setIsConnecting(false);
      }
    } else {
      setSelectedNodeId(selectedNodeId === node.id ? null : node.id);
    }
  }, [isConnecting, connectingFromNode, onConnect, selectedNodeId, toast]);

  const handleToggleConnect = useCallback(() => {
    console.log('🔗 Toggling connect mode:', !isConnecting);
    setIsConnecting(!isConnecting);
    setConnectingFromNode(null);
    
    if (!isConnecting) {
      toast({
        title: "Modo de conexão ativado",
        description: "Clique em dois nós para conectá-los",
      });
    } else {
      toast({
        title: "Modo de conexão desativado",
        description: "",
      });
    }
  }, [isConnecting, toast]);

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<MindMapNodeData>) => {
    console.log('💾 handleNodeUpdate called:', { nodeId, updates });
    console.log('📊 Current nodes before update:', nodes.map(n => ({ id: n.id, text: n.data.text })));
    
    setNodes((nds) => {
      console.log('🔄 Inside setNodes callback');
      console.log('📊 Previous nodes state:', nds.map(n => ({ id: n.id, text: n.data.text })));
      
      const updatedNodes = nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = { 
            ...node, 
            data: { 
              ...node.data, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } 
          };
          console.log('🔄 Updating node:', { 
            nodeId, 
            oldData: node.data, 
            newData: updatedNode.data,
            updates 
          });
          return updatedNode;
        }
        return node;
      });
      
      console.log('📊 Updated nodes state:', updatedNodes.map(n => ({ id: n.id, text: n.data.text })));
      return updatedNodes;
    });
  }, [setNodes]);

  const handleToggleExpanded = useCallback((nodeId: string) => {
    console.log('🔄 Toggling expanded for node:', nodeId);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, isExpanded: !node.data.isExpanded } }
          : node
      )
    );
    
    toast({
      title: "Nó atualizado",
      description: "Estado de expansão alterado",
    });
  }, [setNodes, toast]);

  const handleAddNode = useCallback((parentId?: string) => {
    console.log('➕ Adding new node with parent:', parentId);
    const parentNode = parentId ? nodes.find(n => n.id === parentId) : null;
    const rootNode = nodes.find(n => n.data.isRoot);
    
    let x = 400;
    let y = 300;
    
    if (parentNode && parentNode.position) {
      x = parentNode.position.x + 200;
      y = parentNode.position.y + ((parentNode.data.children?.length || 0) * 80);
    } else if (rootNode && rootNode.position) {
      x = rootNode.position.x + 200;
      y = rootNode.position.y + ((rootNode.data.children?.length || 0) * 80);
    }

    const colorIndex = nodes.length % DEFAULT_NODE_COLORS.length;
    const backgroundColor = DEFAULT_NODE_COLORS[colorIndex];

    const newNode: Node<MindMapNodeData> = {
      id: crypto.randomUUID(),
      type: 'mindMapNode',
      position: { x, y },
      data: {
        text: 'Novo Nó',
        color: '#FFFFFF',
        backgroundColor,
        fontSize: 14,
        fontWeight: 'normal',
        isRoot: false,
        parentId: parentId || rootNode?.id,
        children: [],
        isExpanded: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    setNodes((nds) => {
      const updatedNodes = [...nds, newNode];
      
      if (parentId || rootNode) {
        const targetParentId = parentId || rootNode!.id;
        return updatedNodes.map((node) =>
          node.id === targetParentId
            ? { 
                ...node, 
                data: { 
                  ...node.data, 
                  children: [...(node.data.children || []), newNode.id] 
                } 
              }
            : node
        );
      }
      
      return updatedNodes;
    });

    if (parentId || rootNode) {
      const targetParentId = parentId || rootNode!.id;
      const newEdge: Edge = {
        id: crypto.randomUUID(),
        source: targetParentId,
        target: newNode.id,
        type: 'smoothstep',
        animated: false,
        style: { 
          stroke: '#E5E7EB', 
          strokeWidth: 0.8,
          strokeOpacity: 0.4
        },
      };
      setEdges((eds) => [...eds, newEdge]);
    }
    
    setSelectedNodeId(newNode.id);
    
    toast({
      title: "Nó adicionado",
      description: "Novo nó criado com sucesso! Duplo clique para editar ou use Tab durante a edição para criar nós filhos.",
    });
  }, [nodes, setNodes, setEdges, toast]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    const nodeToDelete = nodes.find(n => n.id === nodeId);
    if (!nodeToDelete || nodeToDelete.data.isRoot) {
      if (nodeToDelete?.data.isRoot) {
        toast({
          title: "Erro",
          description: "Não é possível excluir o nó raiz",
          variant: "destructive",
        });
      }
      return;
    }

    console.log('🗑️ Deleting node and children:', nodeId);

    // Remove o nó e todos os seus filhos recursivamente
    const nodesToDelete = new Set<string>();
    
    const collectNodesToDelete = (nodeId: string) => {
      nodesToDelete.add(nodeId);
      const node = nodes.find(n => n.id === nodeId);
      if (node && node.data.children) {
        node.data.children.forEach(childId => collectNodesToDelete(childId));
      }
    };
    
    collectNodesToDelete(nodeId);

    setNodes((nds) => 
      nds.filter(n => !nodesToDelete.has(n.id)).map(node => ({
        ...node,
        data: {
          ...node.data,
          children: node.data.children.filter(childId => !nodesToDelete.has(childId)),
        }
      }))
    );
    
    setEdges((eds) => eds.filter(e => !nodesToDelete.has(e.source) && !nodesToDelete.has(e.target)));
    
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
    
    toast({
      title: "Nó removido",
      description: `Nó "${nodeToDelete.data.text}" e seus filhos foram excluídos com sucesso!`,
    });
  }, [nodes, setNodes, setEdges, selectedNodeId, toast]);

  const handleDuplicateNode = useCallback((nodeId: string) => {
    const nodeToDuplicate = nodes.find(n => n.id === nodeId);
    if (!nodeToDuplicate) return;

    console.log('📋 Duplicating node:', nodeId);

    const newNode: Node<MindMapNodeData> = {
      ...nodeToDuplicate,
      id: crypto.randomUUID(),
      position: {
        x: nodeToDuplicate.position.x + 150,
        y: nodeToDuplicate.position.y + 50,
      },
      data: {
        ...nodeToDuplicate.data,
        text: `${nodeToDuplicate.data.text} (Cópia)`,
        children: [], // Não duplicar filhos por simplicidade
        isRoot: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(newNode.id);
    
    toast({
      title: "Nó duplicado",
      description: `Nó "${nodeToDuplicate.data.text}" foi duplicado com sucesso!`,
    });
  }, [nodes, setNodes, toast]);

  const handleConnectNode = useCallback((nodeId: string) => {
    console.log('🔗 Starting connection from node:', nodeId);
    setIsConnecting(true);
    setConnectingFromNode(nodeId);
    toast({
      title: "Modo de conexão ativado",
      description: "Clique em outro nó para criar a conexão",
    });
  }, [toast]);

  const handleRenameNode = useCallback((nodeId: string) => {
    console.log('✏️ handleRenameNode triggered for:', nodeId);
    const nodeToRename = nodes.find(n => n.id === nodeId);
    if (nodeToRename) {
      console.log('📝 Found node to rename:', nodeToRename.data.text);
      toast({
        title: "Modo de renomeação",
        description: `Renomeando nó "${nodeToRename.data.text}". Digite o novo nome e pressione Enter.`,
      });
    } else {
      console.log('❌ Node not found for rename:', nodeId);
    }
  }, [nodes, toast]);

  const handleSave = useCallback(() => {
    if (!map) return;
    
    console.log('💾 Saving map with nodes:', nodes.length, 'edges:', edges.length);
    
    const updatedMap: MindMap = {
      ...map,
      nodes: nodes as Node<MindMapNodeData>[],
      connections: edges.map(edge => ({ 
        ...edge, 
        thickness: 1,
        type: edge.type || 'smoothstep',
        style: { 
          stroke: '#E5E7EB', 
          strokeWidth: 0.8,
          strokeOpacity: 0.4
        }
      })),
      updatedAt: new Date().toISOString(),
    };
    
    onMapUpdate(updatedMap);
    
    toast({
      title: "Mapa salvo",
      description: "Suas alterações foram salvas com sucesso!",
    });
  }, [map, nodes, edges, onMapUpdate, toast]);

  // ✅ MEMOIZED PROPS - Evita recriação desnecessária
  const nodeProps = useMemo(() => ({
    onAddChild: handleAddNode,
    onDeleteNode: handleDeleteNode,
    onUpdateNode: handleNodeUpdate,
    onToggleExpanded: handleToggleExpanded,
    onDuplicateNode: handleDuplicateNode,
    onConnectNode: handleConnectNode,
    onRenameNode: handleRenameNode,
  }), [handleAddNode, handleDeleteNode, handleNodeUpdate, handleToggleExpanded, handleDuplicateNode, handleConnectNode, handleRenameNode]);

  if (!map) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-center space-y-4">
          <div className="text-lg font-medium">Selecione um mapa mental</div>
          <p className="text-sm text-muted-foreground">
            Escolha um mapa da lista ou crie um novo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <OneMapCanvasToolbar
        zoom={1}
        onZoom={() => {}}
        onAddNode={() => handleAddNode()}
        onSave={handleSave}
        selectedNodeId={selectedNodeId}
        onDeleteNode={selectedNodeId ? () => handleDeleteNode(selectedNodeId) : undefined}
        isConnecting={isConnecting}
        onToggleConnect={handleToggleConnect}
      />

      <div className="flex-1">
        <ReactFlow
          nodes={visibleNodes.map(node => ({
            ...node,
            style: {
              ...node.style,
              border: selectedNodeId === node.id ? '2px solid #3B82F6' : node.style?.border,
            },
            // ✅ PASSANDO PROPS MEMOIZADAS DIRETAMENTE
            data: {
              ...node.data,
              ...nodeProps,
            }
          }))}
          edges={visibleEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="top-right"
          className="bg-gray-50"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Cross} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}