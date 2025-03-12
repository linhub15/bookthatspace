declare const VITE_APP_VERSION: string;

/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_URL: string;
  readonly VITE_GOOGLE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
