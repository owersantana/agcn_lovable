
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Novo cliente cadastrado",
      message: "João Silva foi adicionado aos seus contatos",
      time: "2 min atrás",
      read: false,
      type: "success"
    },
    {
      id: "2", 
      title: "Reunião agendada",
      message: "Reunião com cliente às 14:00",
      time: "1 hora atrás",
      read: false,
      type: "info"
    },
    {
      id: "3",
      title: "Backup concluído",
      message: "Backup automático realizado com sucesso",
      time: "3 horas atrás",
      read: true,
      type: "success"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between p-2">
          <span className="text-sm font-medium">Notificações</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check size={14} className="mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Nenhuma notificação
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem 
              key={notification.id}
              className={`p-3 cursor-pointer ${!notification.read ? 'bg-accent/50' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{notification.title}</h4>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.time}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
