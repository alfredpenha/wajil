import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL ?? 'https://alfredpenha.github.io',
  base: '/wajil/',
  trailingSlash: 'always',
  integrations: [tailwind()]
});
