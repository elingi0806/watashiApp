import { ThemeDefinition } from 'vuetify';

// テーマ名
export const MAIN_THEME = 'mainTheme';
// Light mode theme
export const mainTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#2f6ed4',
    secondary: '#53dade',
    accent: '#fe9ee2',
    error: '#FE1592',
    warning: '#ea7200',
    tips: '#85E695',
    mainBase: '#000000',
    mainFont: '#ffffff',
    fontColor: '#666666',
    borderColor: '#808080',
    disabledFontColor: '	#B1B3B6',
    disabledBorderColor: '#C0C0C0',
  },
};

// Dark モードのテーマ名
export const MAIN_DARK_THEME = 'mainDarkTheme';
// Dark mode theme
export const mainDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#61A8E8',
    secondary: '#476088',
    accent: '#4FDDC3',
    error: '#FE1592',
    warning: '#ea7200',
    tips: '#85E695',
    mainBase: '#000000',
    mainFont: '#ffffff',
    fontColor: '#666666',
    borderColor: '#808080',
    disabledFontColor: '	#B1B3B6',
    disabledBorderColor: '#C0C0C0',
  },
};
