import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import {
  MAIN_THEME,
  mainTheme,
  MAIN_DARK_THEME,
  mainDarkTheme,
} from '@/helpers/themes';
import { defaults } from '@/helpers/defaults';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    defaults,
    display: {
      mobileBreakpoint: 'sm',
    },
    // add icons
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    // add theme
    theme: {
      defaultTheme: MAIN_THEME,
      themes: {
        mainTheme,
        mainDarkTheme,
      },
      // primary-darken-9 primary-lighten-9 までできるようにする
      variations: {
        colors: [
          'primary',
          'secondary',
          'accent',
          'error',
          'warning',
          'tips',
          'mainBase',
          'fontColor',
          'borderColor',
          'disabledFontColor',
          'disabledBorderColor',
        ],
        lighten: 9,
        darken: 9,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
