import { defineNuxtConfig } from 'nuxt/config';
import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  srcDir: 'src/',
  build: {
    transpile: ['vuetify'],
  },
  modules: ['nuxt-electron'],
  electron: {
    build: [
      {
        entry: 'electron/main.ts',
      },
    ],
  },
  hooks: {
    'vite:extendConfig': (config) => {
      config.plugins!.push(vuetify());
    },
  },
  vite: {
    ssr: {
      noExternal: ['vuetify'],
    },
    define: {
      'process.env.DEBUG': false,
    },
  },
  css: ['@/assets/main.scss'],
});
