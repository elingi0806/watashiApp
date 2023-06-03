import { defineNuxtConfig } from 'nuxt/config';
import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  srcDir: 'src/',
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    'nuxt-electron',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
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
  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Sen:wght@700&display=swap',
          crossorigin: '',
        },
      ],
    },
  },
});
