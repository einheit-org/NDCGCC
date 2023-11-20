/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYSTACK_LIVE: string;
  readonly VITE_API_URL: string;
  readonly VITE_AD_ID: string;
  readonly VITE_AD_PW: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
