import DefaultTheme from 'vitepress/theme';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  }
};
