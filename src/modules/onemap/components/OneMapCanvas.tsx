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

const nodeTypes: NodeTypes = {
  mindMapNode: MindMapFlowNode,
};

export function OneMapCanvas({ map, onMapUpdate, onMapAction }: OneMapCanvasProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Ensure all nodes have proper position properties and default values
  const initialNodes = useMemo(() => {
    if (!map?.nodes) return [];
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
      
      setEdges((eds) => addEdge(newEdge, eds));
      
      toast({
        title: "Conexão criada",
        description: `Nós conectados com sucesso!`,
      });
    },
    [nodes, setEdges, toast]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (isConnecting) {
      if (!selectedNodeId) {
        setSelectedNodeId(node.id);
        toast({
          title: "Nó selecionado",
          description: "Clique em outro nó para criar a conexão",
        });
      } else if (selectedNodeId !== node.id) {
        const params: Connection = {
          source: selectedNodeId,
          target: node.id,
          sourceHandle: null,
          targetHandle: null,
        };
        onConnect(params);
        setSelectedNodeId(null);
        setIsConnecting(false);
      }
    } else {
      setSelectedNodeId(selectedNodeId === node.id ? null : node.id);
    }
  }, [isConnecting, selectedNodeId, onConnect, toast]);

  const handleToggleConnect = useCallback(() => {
    setIsConnecting(!isConnecting);
    setSelectedNodeId(null);
    
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
    console.log('Updating node:', nodeId, 'with updates:', updates);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                ...updates, 
                updatedAt: new Date().toISOString() 
              } 
            }
          : node
      )
    );
  }, [setNodes]);

  const handleToggleExpanded = useCallback((nodeId: string) => {
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
    console.log('Adding new node with parent:', parentId);
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

    setNodes((nds) => 
      nds.filter(n => n.id !== nodeId).map(node => ({
        ...node,
        data: {
          ...node.data,
          children: node.data.children.filter(childId => childId !== nodeId),
        }
      }))
    );
    
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
    
    toast({
      title: "Nó removido",
      description: "Nó excluído com sucesso!",
    });
  }, [nodes, setNodes, setEdges, selectedNodeId, toast]);

  const handleSave = useCallback(() => {
    if (!map) return;
    
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

  // Enhanced node types with our custom props
  const enhancedNodeTypes = useMemo(() => ({
    mindMapNode: (props: any) => (
      <MindMapFlowNode
        {...props}
        onAddChild={handleAddNode}
        onDeleteNode={handleDeleteNode}
        onUpdateNode={handleNodeUpdate}
        onToggleExpanded={handleToggleExpanded}
      />
    ),
  }), [handleAddNode, handleDeleteNode, handleNodeUpdate, handleToggleExpanded]);

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
            }
          }))}
          edges={visibleEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={enhancedNodeTypes}
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
