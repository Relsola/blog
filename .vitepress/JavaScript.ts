export const JS_NAV = {
  text: 'JavaScript',
  activeMatch: `^/JavaScript/(base|api|custom|advanced|practice)/`,
  items: [
    { text: 'JS基础', link: 'JavaScript/base/function' },
    { text: '常用API', link: 'JavaScript/api/JavaScript' },
    { text: '进阶技巧', link: 'JavaScript/custom/methods' },
    { text: '进阶学习', link: 'JavaScript/advanced/RegExp/index' },
    { text: '最佳实践', link: 'JavaScript/practice/index' }
  ]
};

export const JS_SIDEBAR = {
  '/JavaScript/base': [
    { text: '对象与类', link: '/JavaScript/base/object' },
    { text: '代理与反射', link: '/JavaScript/base/proxy' },
    { text: '函数', link: '/JavaScript/base/function' }
  ],
  '/JavaScript/api': [{ text: 'JS API', link: 'JavaScript/api/JavaScript' }],
  '/JavaScript/custom': [{ text: 'JavaScript 实用方法', link: 'JavaScript/custom/methods' }],
  '/JavaScript/advanced': [
    { text: '正则表达式', link: 'JavaScript/advanced/RegExp/index' },
    { text: '位运算', link: 'JavaScript/advanced/Bitwise/index' }
  ],
  '/JavaScript/practice': [{ text: '最佳实践', link: 'JavaScript/practice/index' }]
};
