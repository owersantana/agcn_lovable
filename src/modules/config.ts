
// Configuração de módulos disponíveis
export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
  routes: string[];
}

export const AVAILABLE_MODULES: ModuleConfig[] = [
  {
    id: "crm",
    name: "CRM",
    description: "Gestão de relacionamento com clientes",
    enabled: true,
    icon: "user",
    routes: ["/dashboard/clientes", "/dashboard/leads"]
  },
  {
    id: "sales",
    name: "Vendas",
    description: "Controle de vendas e comissões",
    enabled: true,
    icon: "trending-up",
    routes: ["/dashboard/vendas", "/dashboard/produtos"]
  },
  {
    id: "finance",
    name: "Financeiro",
    description: "Controle financeiro e fluxo de caixa",
    enabled: true,
    icon: "dollar-sign",
    routes: ["/dashboard/financeiro", "/dashboard/relatorios"]
  },
  {
    id: "scheduling",
    name: "Agendamentos",
    description: "Sistema de agendamentos online",
    enabled: true,
    icon: "calendar",
    routes: ["/dashboard/agenda", "/dashboard/servicos"]
  },
  {
    id: "onedisk",
    name: "OneDisk",
    description: "Sistema de armazenamento em nuvem",
    enabled: true,
    icon: "hard-drive",
    routes: ["/dashboard/onedisk"]
  },
  {
    id: "oneboard",
    name: "OneBoard",
    description: "Sistema de quadros colaborativos e Kanban",
    enabled: true,
    icon: "kanban-square",
    routes: ["/dashboard/oneboard"]
  },
  {
    id: "onemap",
    name: "OneMap",
    description: "Sistema de mapas mentais e brainstorming",
    enabled: true,
    icon: "map",
    routes: ["/dashboard/onemap"]
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Campanhas e automação de marketing",
    enabled: false,
    icon: "megaphone",
    routes: ["/dashboard/campanhas", "/dashboard/automacao"]
  }
];

// Função para verificar se um módulo está habilitado
export const isModuleEnabled = (moduleId: string): boolean => {
  const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
  return module?.enabled ?? false;
};

// Função para obter rotas de módulos habilitados
export const getEnabledRoutes = (): string[] => {
  return AVAILABLE_MODULES
    .filter(module => module.enabled)
    .flatMap(module => module.routes);
};
