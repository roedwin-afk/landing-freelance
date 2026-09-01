// src/env.d.ts
/// <reference types="astro/client" />
/// <reference path="../worker-configuration.d.ts" />

interface ImportMetaEnv {
  readonly META_PIXEL_ID: string;
  readonly META_ACCESS_TOKEN: string;
  readonly HOTMART_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Env {
    N8N_LEAD_WEBHOOK_URL: string;
    META_PIXEL_ID: string;
    META_ACCESS_TOKEN: string;
    META_TEST_EVENT_CODE?: string;
  }
}

export {};