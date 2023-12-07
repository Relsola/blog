import { defineConfigWithTheme } from 'vitepress';
import path from 'path';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

const resolve = (src: string): string => path.resolve(__dirname, `../${src}`);

export default defineConfigWithTheme({
  title: 'Relsola',
  srcDir: 'src/docs',
  description: "Relsola's blog.",

  markdown: { lineNumbers: true },

  themeConfig: {
    nav: [
      {
        text: 'JavaScript',
        items: [
          { text: 'API', link: '/JavaScript/api' },
          {
            text: '技巧',
            items: [
              { text: 'JavaScript', link: '/JavaScript/custom/JavaScript' },
              { text: 'Vue', link: '/JavaScript/custom/Vue' }
            ]
          },
          {
            text: '进阶',
            items: [
              { text: '正则表达式', link: '/JavaScript/advanced/RegExp/index' },
              { text: '位运算', link: '/JavaScript/advanced/Bitwise/index' }
            ]
          }
        ]
      }
    ]
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
