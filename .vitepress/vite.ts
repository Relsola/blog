import path from 'path';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

const resolve = (src: string): string => path.resolve(__dirname, `../${src}`);

export default {
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
      $: resolve('examples'),
      '@utils': resolve('src/utils'),
      '@hooks': resolve('src/hooks')
    }
  },

  ssr: { noExternal: ['element-plus'] }
};
