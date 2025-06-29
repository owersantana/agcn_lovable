
// Configuração global da marca - modifique aqui para whitelabel
export const BRAND_CONFIG = {
  name: "Agencione",
  tagline: "Gerencie seu negócio de forma inteligente",
  
  // URLs e links
  website: "https://agencione.com.br",
  support: "https://agencione.com.br/suporte",
  
  // Redes sociais
  social: {
    instagram: "https://instagram.com/agencione",
    facebook: "https://facebook.com/agencione", 
    tiktok: "https://tiktok.com/@agencione"
  },
  
  // Configurações de autenticação
  auth: {
    enableSignup: true,
    enableForgotPassword: true,
    enableSocialLogin: false
  }
} as const;
