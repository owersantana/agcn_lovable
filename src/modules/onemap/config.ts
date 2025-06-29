
import { Node, Edge } from '@xyflow/react';

export interface MindMapNodeData extends Record<string, unknown> {
  text: string;
  color: string;
  backgroundColor: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  isRoot: boolean;
  parentId?: string;
  children: string[];
  isExpanded: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MindMapNode = Node<MindMapNodeData>;

export interface MindMapConnection extends Edge {
  thickness: number;
}

export interface MindMap {
  id: string;
  name: string;
  description?: string;
  nodes: MindMapNode[];
  connections: MindMapConnection[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const DEFAULT_NODE_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export const DEFAULT_NODE_STYLE = {
  width: 120,
  height: 40,
  fontSize: 14,
  fontWeight: 'normal' as const,
  color: '#FFFFFF',
  backgroundColor: '#3B82F6',
};

export const CANVAS_CONFIG = {
  defaultWidth: 1200,
  defaultHeight: 800,
};
