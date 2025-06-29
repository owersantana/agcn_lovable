
export interface OneBoardConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
  routes: string[];
}

export const ONEBOARD_MODULE: OneBoardConfig = {
  id: "oneboard",
  name: "OneBoard",
  description: "Sistema de quadros colaborativos e Kanban",
  enabled: true,
  icon: "trello",
  routes: ["/dashboard/oneboard"]
};

export interface Board {
  id: string;
  name: string;
  description: string;
  columnsCount: number;
  isActive: boolean;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  columns?: BoardColumn[];
}

export interface BoardColumn {
  id: string;
  title: string;
  boardId: string;
  position: number;
  cards: BoardCard[];
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface BoardCard {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  position: number;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
  labels?: Label[];
  checklists?: Checklist[];
  coverImage?: string;
  members?: Member[];
  attachments?: Attachment[];
  comments?: Array<{id: string, text: string, author: string, createdAt: string}>;
  createdAt: string;
  updatedAt: string;
}

export interface OneBoardState {
  boards: Board[];
  activeBoard: Board | null;
  boardColumns: BoardColumn[];
  isLoading: boolean;
  error: string | null;
}
