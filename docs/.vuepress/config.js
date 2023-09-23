const { resolve } = require('path')
module.exports = {
  title: 'Relsola',
  description: 'Relsola的个人博客',
  base: '/blog/',
  head: [['link', { rel: 'icon', href: '/icon.png' }]],
  port: 3000,
  markdown: {
    lineNumbers: false
  },
  themeConfig: {
    sidebar: 'auto',
    repo: 'https://github.com/Relsola/blog',
    repoLabel: 'Github',
    nav: [
      {
        text: 'JavaScript',
        items:
          [
            { text: 'JavaScript基础', link: '/JavaScript/base' },
            { text: 'ES6', link: '/JavaScript/es6' },
            { text: 'JavaScript手写系列', link: '/JavaScript/handwrite' },
            { text: '补充', link: '/JavaScript/complement' },
            {
              text: 'JavaScript进阶',
              items:
                [
                  { text: '函数', link: '/JavaScript/function' },
                  { text: '异步编程', link: '/JavaScript/asyncpro' },
                  { text: '设计模式', link: '/JavaScript/designPattern' },
                  { text: '数据结构与算法', link: '/JavaScript/algorithm' },
                ]
            }
          ]
      },

      {
        text: 'Vue',
        items: [
          {
            text: 'Vue2.0',
            items:
              [
                { text: 'Vue2基础', link: '/vue/vue2/base' },
                { text: 'Vue2组件', link: '/vue/vue2/components' },
                { text: 'Vue2源码', link: '/vue/vue2/sourceCode' }
              ]
          },
          {
            text: 'Vue3.0',
            items:
              [
                { text: 'Vue3基础', link: '/vue/vue3/base' },
                { text: 'Vue3组件', link: '/vue/vue3/components' },
                { text: 'Vue3源码', link: '/vue/vue3/sourceCode' }
              ]
          },
          {
            text: '补充',
            items:
              [
                { text: 'Vue应用测试', link: '/vue/vueTest' },
                { text: 'Nuxt.js', link: '/vue/nuxt' },
              ]
          }
        ]
      },

      {
        text: 'React',
        items:
          [
            { text: 'React基础', link: '/react/base' },
            { text: 'React进阶', link: '/react/advanced' },
            { text: 'React生态', link: '/react/ecology' },
            { text: 'React原理', link: '/react/principle' },
            { text: 'React状态管理', link: '/react/stateMana' },
            { text: 'React-Hooks', link: '/react/hooks' },
            { text: 'React源码', link: '/react/sourceCode' }
          ]
      },

      {
        text: '读书感悟',
        link: '/books/one'
      },

      {
        text: 'Node.js',
        items: [
          { text: 'Node.js基础', link: '/node/base' },
          { text: 'Express', link: '/node/express' },
          { text: 'Koa', link: '/node/koa' },
          { text: 'Nest.js', link: '/node/nest' },
        ]
      },

      {
        text: '前端工程化',
        items:
          [
            { text: 'Webpack', link: '/project/webpack' },
            { text: 'Vite', link: '/project/vite' },
            { text: 'Rollup', link: '/project/rollup' },
            { text: 'Git操作', link: '/project/git' }
          ]
      },

      {
        text: 'TypeScript',
        items: [
          { text: 'TypeScript基础', link: '/typescript/base' },
          { text: 'TypeScript类型挑战', link: '/typescript/challenge' }
        ]
      },

      {
        text: 'CSS预编译器',
        items:
          [
            { text: 'tailwindcss', link: '/cssPrecompile/tailwindcss' },
            { text: 'Less', link: '/cssPrecompile/less' },
            { text: 'Sass', link: '/cssPrecompile/sass' },
          ]
      }
    ],
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@images': '../images',
        '@vuepress': '../images/vuepress',
        '@components': '../.vuepress/components',
        '@': resolve(__dirname, 'public', 'assets')
      }
    }
  }
}
