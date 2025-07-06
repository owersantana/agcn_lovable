import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  useEffect(() => {
    console.log('NotFound component mounted');
    console.log('Current URL when 404:', window.location.href);
    console.log('Current pathname when 404:', window.location.pathname);
    console.log('Current search params:', window.location.search);
    console.log('Current hash:', window.location.hash);
    
    // Log the error for debugging
    console.error('404 Error: User attempted to access non-existent route:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Página não encontrada
          </h2>
          <p className="text-gray-500 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          <div className="text-sm text-gray-400 mb-4">
            Rota tentada: <code className="bg-gray-100 px-2 py-1 rounded">{window.location.pathname}</code>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/dashboard">
              Voltar ao Dashboard
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link to="/auth/login">
              Ir para Login
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 text-xs text-gray-400">
          <p>Rotas disponíveis:</p>
          <ul className="mt-2 space-y-1">
            <li>/dashboard/oneboard (não /oneboard)</li>
            <li>/dashboard/onedisk (não /onedisk)</li>
            <li>/dashboard/onemap (não /onemap)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;