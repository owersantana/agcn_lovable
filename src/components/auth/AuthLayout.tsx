
import { BRAND_CONFIG } from "@/config/brand";
import { Instagram } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  description: string;
  showTerms?: boolean;
}

export function AuthLayout({ children, icon, title, description, showTerms = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Formulário - 30% em desktop, 100% em mobile */}
      <div className="w-full lg:w-[30%] flex flex-col">
        {/* Header com logo */}
        <div className="p-6 border-b border-border">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary-700">{BRAND_CONFIG.name}</h1>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col justify-center p-6 lg:p-8">
          <div className="max-w-sm mx-auto w-full space-y-6">
            {/* Ícone e título */}
            <div className="text-center space-y-2">
              <div className="flex justify-center text-primary-600">
                {icon}
              </div>
              <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>

            {/* Formulário */}
            <div className="space-y-4">
              {children}
            </div>

            {/* Termos de uso */}
            {showTerms && (
              <div className="text-center">
                <button className="text-xs text-muted-foreground hover:text-primary-600 transition-colors underline">
                  Termos de Uso
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé fixo */}
        <div className="p-6 border-t border-border">
          {/* Redes sociais */}
          <div className="flex justify-center space-x-4 mb-3">
            <a href={BRAND_CONFIG.social.instagram} className="text-muted-foreground hover:text-primary-600 transition-colors">
              <Instagram size={20} />
            </a>
            <a href={BRAND_CONFIG.social.facebook} className="text-muted-foreground hover:text-primary-600 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href={BRAND_CONFIG.social.tiktok} className="text-muted-foreground hover:text-primary-600 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
          
          {/* Copyright */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <div>© {new Date().getFullYear()} {BRAND_CONFIG.name}</div>
            <div>
              powered by{" "}
              <a href="https://agencione.com.br" className="text-primary-600 hover:text-primary-700 font-medium">
                Agencione
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Background - 70% apenas em desktop */}
      <div className="hidden lg:flex lg:w-[70%] bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center p-12">
        <div className="max-w-2xl text-center text-white space-y-6">
          <h2 className="text-4xl font-bold">
            Transforme sua gestão empresarial
          </h2>
          <p className="text-xl text-primary-100">
            {BRAND_CONFIG.tagline}
          </p>
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div className="space-y-2">
              <div className="text-3xl font-bold">99%</div>
              <div className="text-primary-200">Satisfação dos clientes</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">10k+</div>
              <div className="text-primary-200">Empresas atendidas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
