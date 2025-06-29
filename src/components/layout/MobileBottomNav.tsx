
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Folder, User, Bell, Settings, ChevronUp } from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    icon: Folder,
    href: "/dashboard",
  },
  {
    title: "Clientes",
    icon: User,
    href: "/dashboard/clientes",
  },
  {
    title: "Agenda",
    icon: Bell,
    href: "/dashboard/agenda",
  },
  {
    title: "Vendas",
    icon: ChevronUp,
    href: "/dashboard/vendas",
  },
  {
    title: "Perfil",
    icon: Settings,
    href: "/dashboard/perfil",
  },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.title}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors",
                isActive
                  ? "text-primary-600 bg-primary-50"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={20} className="mb-1" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
