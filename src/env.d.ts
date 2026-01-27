/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_ANALYTICS_PROVIDER?: 'plausible' | 'ga4' | 'none';
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
  readonly PUBLIC_GA4_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
