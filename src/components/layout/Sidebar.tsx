
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BRAND_CONFIG } from "@/config/brand";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  User,
  Settings,
  Folder,
  Bell,
  LogOut
} from "lucide-react";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  isHeader?: boolean;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: <Folder size={20} />,
    isHeader: true,
  },
  {
    title: "Visão Geral",
    icon: <Folder size={20} />,
    href: "/dashboard",
  },
  {
    title: "Meu Negócio",
    icon: <Settings size={20} />,
    children: [
      { title: "Perfil", icon: <User size={16} />, href: "/dashboard/perfil" },
      { title: "Configurações", icon: <Settings size={16} />, href: "/dashboard/configuracoes" },
    ],
  },
  {
    title: "Gestão",
    icon: <Folder size={20} />,
    isHeader: true,
  },
  {
    title: "Clientes",
    icon: <User size={20} />,
    children: [
      { title: "Lista de Clientes", icon: <User size={16} />, href: "/dashboard/clientes" },
      { title: "Novo Cliente", icon: <User size={16} />, href: "/dashboard/clientes/novo" },
    ],
  },
  {
    title: "Kanban",
    icon: <Folder size={20} />,
    children: [
      { title: "Projetos", icon: <Folder size={16} />, href: "/dashboard/kanban/projeto/1" },
      { title: "Clientes", icon: <User size={16} />, href: "/dashboard/kanban/cliente/1" },
      { title: "Geral", icon: <Settings size={16} />, href: "/dashboard/kanban/geral/1" },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  // Menus fechados por padrão
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (title: string) => {
    setOpenItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-primary">
          {BRAND_CONFIG.name}
        </h1>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.isHeader ? (
                <div className="px-3 py-2 text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
                  {item.title}
                </div>
              ) : item.children ? (
                <Collapsible open={openItems.includes(item.title)}>
                  <CollapsibleTrigger
                    onClick={() => toggleItem(item.title)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "transition-transform",
                        openItems.includes(item.title) && "rotate-180"
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          to={child.href!}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors",
                            isActive(child.href!)
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent"
                          )}
                        >
                          {child.icon}
                          <span>{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  to={item.href!}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors",
                    isActive(item.href!)
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-sidebar-accent">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              João Silva
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              admin@empresa.com
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 justify-start text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut size={16} className="mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
}
