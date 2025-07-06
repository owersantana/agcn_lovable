import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileBottomNav } from "./MobileBottomNav";

export const DashboardLayout = () => {
  useEffect(() => {
    console.log('DashboardLayout component mounted');
    console.log('Current pathname in DashboardLayout:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {console.log('DashboardLayout rendering')}
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {console.log('About to render Outlet in DashboardLayout')}
            <Outlet />
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
};