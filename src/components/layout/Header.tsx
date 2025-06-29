
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Settings, LogOut, User, Folder, HardDrive, Maximize, Sun, Moon, TrendingUp, DollarSign, Calendar, LayoutDashboard, Megaphone } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const appModules = [
    { name: "CRM", icon: User, enabled: true },
    { name: "Financeiro", icon: DollarSign, enabled: true },
    { name: "Vendas", icon: TrendingUp, enabled: true },
    { name: "OneDisk", icon: HardDrive, enabled: true },
    { name: "Oneboard", icon: LayoutDashboard, enabled: true },
    { name: "Agendamentos", icon: Calendar, enabled: true },
    { name: "Projetos", icon: Folder, enabled: false },
    { name: "Marketing", icon: Megaphone, enabled: false },
    { name: "Relatórios", icon: Folder, enabled: false },
  ];

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="hidden lg:flex"
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <NotificationDropdown />

          {/* Apps menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-4">
              <div className="grid grid-cols-3 gap-3">
                {appModules.map((module) => {
                  const IconComponent = module.icon;
                  return (
                    <Tooltip key={module.name}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-16 w-16 p-0 flex flex-col items-center justify-center gap-1 ${
                            !module.enabled ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={!module.enabled}
                        >
                          <IconComponent className="h-6 w-6" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{module.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Fullscreen toggle */}
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            <Maximize size={20} />
          </Button>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
