
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileBottomNav } from "./MobileBottomNav";
import { BRAND_CONFIG } from "@/config/brand";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Changed to true by default

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-accent rounded-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
          
          <h1 className="text-lg font-semibold text-primary-700">
            {BRAND_CONFIG.name}
          </h1>
          
          <button className="p-2 hover:bg-accent rounded-lg relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        {sidebarOpen && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-64 animate-slide-in">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Desktop Header */}
          <div className="hidden lg:block">
            <Header onMenuClick={toggleSidebar} />
          </div>

          {/* Page Content */}
          <main className={cn(
            "flex-1 p-4 lg:p-6",
            "pb-20 lg:pb-6" // Extra padding bottom for mobile nav
          )}>
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
