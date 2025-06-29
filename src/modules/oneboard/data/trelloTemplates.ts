
import { Board, BoardColumn, BoardCard } from '../config';

export const TRELLO_BOARD_TEMPLATES: Board[] = [
  {
    id: 'template-personal-kanban',
    name: 'Kanban Pessoal',
    description: 'Organize suas tarefas pessoais com um quadro Kanban simples',
    columnsCount: 3,
    isActive: true,
    isShared: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'template-project-management',
    name: 'Gestão de Projeto',
    description: 'Template completo para gerenciamento de projetos de software',
    columnsCount: 5,
    isActive: true,
    isShared: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'template-marketing',
    name: 'Campanhas de Marketing',
    description: 'Organize campanhas e ações de marketing',
    columnsCount: 4,
    isActive: true,
    isShared: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system'
  }
];

export const TRELLO_COLUMN_TEMPLATES: Record<string, BoardColumn[]> = {
  'template-personal-kanban': [
    {
      id: 'col-1',
      title: 'A Fazer',
      boardId: 'template-personal-kanban',
      position: 0,
      cards: []
    },
    {
      id: 'col-2',
      title: 'Em Progresso',
      boardId: 'template-personal-kanban',
      position: 1,
      cards: []
    },
    {
      id: 'col-3',
      title: 'Concluído',
      boardId: 'template-personal-kanban',
      position: 2,
      cards: []
    }
  ],
  'template-project-management': [
    {
      id: 'proj-col-1',
      title: 'Backlog',
      boardId: 'template-project-management',
      position: 0,
      cards: []
    },
    {
      id: 'proj-col-2',
      title: 'Sprint Atual',
      boardId: 'template-project-management',
      position: 1,
      cards: []
    },
    {
      id: 'proj-col-3',
      title: 'Em Desenvolvimento',
      boardId: 'template-project-management',
      position: 2,
      cards: []
    },
    {
      id: 'proj-col-4',
      title: 'Em Revisão',
      boardId: 'template-project-management',
      position: 3,
      cards: []
    },
    {
      id: 'proj-col-5',
      title: 'Finalizado',
      boardId: 'template-project-management',
      position: 4,
      cards: []
    }
  ],
  'template-marketing': [
    {
      id: 'mark-col-1',
      title: 'Ideias',
      boardId: 'template-marketing',
      position: 0,
      cards: []
    },
    {
      id: 'mark-col-2',
      title: 'Planejamento',
      boardId: 'template-marketing',
      position: 1,
      cards: []
    },
    {
      id: 'mark-col-3',
      title: 'Em Execução',
      boardId: 'template-marketing',
      position: 2,
      cards: []
    },
    {
      id: 'mark-col-4',
      title: 'Concluído',
      boardId: 'template-marketing',
      position: 3,
      cards: []
    }
  ]
};

export const TRELLO_CARD_EXAMPLES: Record<string, BoardCard[]> = {
  'template-personal-kanban': [
    {
      id: 'card-1',
      title: 'Estudar React',
      description: 'Completar o curso de React avançado',
      columnId: 'col-1',
      position: 0,
      priority: 'high',
      tags: ['educação', 'programação'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'card-2',
      title: 'Exercitar-se',
      description: 'Ir à academia 3x por semana',
      columnId: 'col-2',
      position: 0,
      priority: 'medium',
      tags: ['saúde', 'rotina'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'card-3',
      title: 'Ler livro técnico',
      description: 'Terminar "Clean Code" do Robert Martin',
      columnId: 'col-3',
      position: 0,
      priority: 'low',
      tags: ['leitura', 'programação'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  'template-project-management': [
    {
      id: 'proj-card-1',
      title: 'Configurar CI/CD',
      description: 'Implementar pipeline de deploy automático',
      columnId: 'proj-col-1',
      position: 0,
      priority: 'high',
      tags: ['devops', 'infraestrutura'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'proj-card-2',
      title: 'API de Autenticação',
      description: 'Desenvolver endpoints de login e registro',
      columnId: 'proj-col-2',
      position: 0,
      priority: 'high',
      tags: ['backend', 'segurança'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'proj-card-3',
      title: 'Interface do Dashboard',
      description: 'Criar componentes da tela principal',
      columnId: 'proj-col-3',
      position: 0,
      priority: 'medium',
      tags: ['frontend', 'ui'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  'template-marketing': [
    {
      id: 'mark-card-1',
      title: 'Campanha Black Friday',
      description: 'Planejamento completo da campanha de fim de ano',
      columnId: 'mark-col-1',
      position: 0,
      priority: 'high',
      tags: ['campanha', 'vendas'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'mark-card-2',
      title: 'Conteúdo para Redes Sociais',
      description: 'Criar posts para Instagram e LinkedIn',
      columnId: 'mark-col-2',
      position: 0,
      priority: 'medium',
      tags: ['social media', 'conteúdo'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

// Export the templates in the format expected by BoardTemplateModal
export const trelloTemplates = TRELLO_BOARD_TEMPLATES.map(template => ({
  ...template,
  columns: TRELLO_COLUMN_TEMPLATES[template.id] || [],
  cards: TRELLO_CARD_EXAMPLES[template.id] || []
}));

export function createBoardFromTemplate(templateId: string, customName?: string): {
  board: Board;
  columns: BoardColumn[];
  cards: BoardCard[];
} {
  const template = TRELLO_BOARD_TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    throw new Error('Template não encontrado');
  }

  const newBoardId = crypto.randomUUID();
  
  const board: Board = {
    ...template,
    id: newBoardId,
    name: customName || template.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const templateColumns = TRELLO_COLUMN_TEMPLATES[templateId] || [];
  const templateCards = TRELLO_CARD_EXAMPLES[templateId] || [];

  const columns = templateColumns.map(col => ({
    ...col,
    id: crypto.randomUUID(),
    boardId: newBoardId,
    cards: []
  }));

  const cards = templateCards.map(card => {
    const targetColumn = columns.find(col => col.position === templateColumns.find(tc => tc.id === card.columnId)?.position);
    return {
      ...card,
      id: crypto.randomUUID(),
      columnId: targetColumn?.id || columns[0]?.id || ''
    };
  });

  // Adicionar cards às colunas
  cards.forEach(card => {
    const column = columns.find(col => col.id === card.columnId);
    if (column) {
      column.cards.push(card);
    }
  });

  return { board, columns, cards };
}

export function getDefaultKanbanColumns(): BoardColumn[] {
  return [
    {
      id: crypto.randomUUID(),
      title: 'A Fazer',
      boardId: '',
      position: 0,
      cards: []
    },
    {
      id: crypto.randomUUID(),
      title: 'Em Progresso',
      boardId: '',
      position: 1,
      cards: []
    },
    {
      id: crypto.randomUUID(),
      title: 'Concluído',
      boardId: '',
      position: 2,
      cards: []
    }
  ];
}
