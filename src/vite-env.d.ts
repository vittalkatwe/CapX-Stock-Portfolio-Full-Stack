/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_FINNHUB_API_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  