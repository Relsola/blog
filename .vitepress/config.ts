import { defineConfigWithTheme } from 'vitepress';
import path from 'path';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

import { JS_NAV, JS_SIDEBAR } from './JavaScript';
import { theme } from './set';

const resolve = (src: string): string => path.resolve(__dirname, `../${src}`);

export default defineConfigWithTheme({
  title: 'Relsola',
  srcDir: 'src/docs',
  description: "Relsola's blog.",

  markdown: { lineNumbers: true },

  themeConfig: {
    nav: [
      {
        ...JS_NAV
      }
    ],
    sidebar: {
      ...JS_SIDEBAR
    },
    ...theme
  },

  vite: {
    plugins: [
      vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],

    resolve: {
      alias: {
        '@': resolve('src'),
        '@utils': resolve('src/utils'),
        '@hooks': resolve('src/hooks')
      }
    }
  }
});
