import { h, App } from 'vue';
import DefaultTheme from 'vitepress/theme';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  }
};
