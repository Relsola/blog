import baseSidebar from './base';
import advancedSidebar from './advanced';
import vueSidebar from './vue';
import reactSidebar from './react';
import practiceSidebar from './practice';

export const JS_NAV = {
  text: 'JavaScript',
  activeMatch: `^/JavaScript/(base|custom|advanced|practice)/`,
  items: [
    { text: 'JS 基础', link: 'JavaScript/base/function' },
    { text: 'JS 进阶', link: 'JavaScript/advanced/methods' },
    { text: 'Vue', link: 'JavaScript/vue/index' },
    { text: 'React', link: 'JavaScript/vue/index' },
    { text: '最佳实践', link: 'JavaScript/practice/index' }
  ]
};

export const JS_sidebar = Object.assign(
  baseSidebar,
  advancedSidebar,
  vueSidebar,
  reactSidebar,
  practiceSidebar
);
