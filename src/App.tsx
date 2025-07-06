import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth pages
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SecurityCode from "./pages/auth/SecurityCode";
import NewPassword from "./pages/auth/NewPassword";

// Dashboard pages
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Module pages
import OneDisk from "./modules/onedisk/pages/OneDisk";
import OneBoard from "./modules/oneboard/pages/OneBoard";
import OneMap from "./modules/onemap/pages/OneMap";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering');
  console.log('Current URL:', window.location.href);
  console.log('Current pathname:', window.location.pathname);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            
            {/* Auth routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/security-code" element={<SecurityCode />} />
            <Route path="/auth/new-password" element={<NewPassword />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="perfil" element={<div className="p-6">Página de Perfil em desenvolvimento</div>} />
              <Route path="configuracoes" element={<div className="p-6">Página de Configurações em desenvolvimento</div>} />
              <Route path="clientes" element={<div className="p-6">Página de Clientes em desenvolvimento</div>} />
              <Route path="clientes/novo" element={<div className="p-6">Novo Cliente em desenvolvimento</div>} />
              <Route path="agenda" element={<div className="p-6">Página de Agenda em desenvolvimento</div>} />
              <Route path="vendas" element={<div className="p-6">Página de Vendas em desenvolvimento</div>} />
              <Route 
                path="onedisk" 
                element={
                  <div>
                    {console.log('OneDisk route matched')}
                    <OneDisk />
                  </div>
                } 
              />
              <Route 
                path="oneboard" 
                element={
                  <div>
                    {console.log('OneBoard route matched')}
                    <OneBoard />
                  </div>
                } 
              />
              <Route 
                path="onemap" 
                element={
                  <div>
                    {console.log('OneMap route matched')}
                    <OneMap />
                  </div>
                } 
              />
            </Route>
            
            {/* Catch-all route */}
            <Route 
              path="*" 
              element={
                <div>
                  {console.log('NotFound route matched for path:', window.location.pathname)}
                  {console.log('Available routes:')}
                  {console.log('- /auth/login')}
                  {console.log('- /auth/forgot-password')}
                  {console.log('- /auth/security-code')}
                  {console.log('- /auth/new-password')}
                  {console.log('- /dashboard')}
                  {console.log('- /dashboard/perfil')}
                  {console.log('- /dashboard/configuracoes')}
                  {console.log('- /dashboard/clientes')}
                  {console.log('- /dashboard/clientes/novo')}
                  {console.log('- /dashboard/agenda')}
                  {console.log('- /dashboard/vendas')}
                  {console.log('- /dashboard/onedisk')}
                  {console.log('- /dashboard/oneboard')}
                  {console.log('- /dashboard/onemap')}
                  <NotFound />
                </div>
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;