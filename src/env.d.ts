// src/env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly META_PIXEL_ID: string;
  readonly META_ACCESS_TOKEN: string;
  readonly HOTMART_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}