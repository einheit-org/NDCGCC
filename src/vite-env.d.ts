/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYSTACK_LIVE: string;
  readonly VITE_PAYSTACK_TEST: string;
  readonly VITE_API_URL: string;
  readonly VITE_AD_ID: string;
  readonly VITE_AD_PW: string;
  readonly VITE_AD2_ID: string;
  readonly VITE_AD2_PW: string;
  readonly VITE_OTP_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
