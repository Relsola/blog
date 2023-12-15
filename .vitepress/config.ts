import { defineConfigWithTheme } from 'vitepress';
import { nav, sidebar } from './nav-sidebar';
import vite from './vite';

export default defineConfigWithTheme({
  title: 'Relsola',
  srcDir: 'src/docs',
  description: "Relsola's blog.",

  markdown: { lineNumbers: true },

  themeConfig: {
    logo: 'images/icon.png',
    nav,
    sidebar,
    outlineTitle: '本页目录',
    darkModeSwitchLabel: '切换主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  },

  vite
});
