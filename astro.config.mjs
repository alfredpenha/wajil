import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL ?? 'https://www.wajil.mx',
  base: '/',
  trailingSlash: 'always',
  integrations: [tailwind()]
});
