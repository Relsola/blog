const { resolve } = require("path");
module.exports = {
  title: "Relsola",
  description: "Relsola的个人博客",
  base: "/blog/",
  head: [["link", { rel: "icon", href: "/icon.png" }]],
  port: 3000,
  markdown: {
    lineNumbers: false,
  },
  themeConfig: {
    sidebar: "auto",
    repo: "https://github.com/Relsola/blog",
    repoLabel: "Github",
    nav: [
      {
        text: "JavaScript",
        items: [
          { text: "深入理解解JavaScript", link: "/JavaScript/base" },
          { text: "深入理解ES6", link: "/JavaScript/es6" },
          { text: "JavaScript手写系列", link: "/JavaScript/handwrite" },
          { text: "JavaScript设计模式", link: "/JavaScript/designPattern" },
          { text: "数据结构与算法", link: "/JavaScript/algorithm" },
        ],
      },

      {
        text: "Vue",
        items: [
          { text: "Vue2基础", link: "/vue/vue2base" },
          { text: "Vue3基础", link: "/vue/vue3base" },
          { text: "Vue核心插件", link: "/vue/libraries" },
          { text: "Vue测试", link: "/vue/vueTest" },
          { text: "Vue2源码解读", link: "/vue/vue2sourceCode" },
          { text: "Vue3源码解读", link: "/vue/vue3sourceCode" },
        ],
      },

      {
        text: "React",
        items: [
          { text: "React基础", link: "/react/base" },
          { text: "React进阶", link: "/react/advanced" },
          { text: "React生态", link: "/react/ecology" },
          { text: "React原理", link: "/react/principle" },
          { text: "React状态管理", link: "/react/stateMana" },
          { text: "ReactHooks", link: "/react/hooks" },
          { text: "React源码", link: "/react/sourceCode" },
        ],
      },

      {
        text: "前端工程化",
        items: [
          { text: "Webpack", link: "/project/webpack" },
          { text: "Vite", link: "/project/vite" },
          { text: "Docker", link: "/project/docker" },
          { text: "Rollup", link: "/project/rollup" },
          { text: "Git操作", link: "/project/git" },
          { text: "计算机网络", link: "/project/git" },
          { text: "浏览器原理", link: "/project/git" },
        ],
      },

      {
        text: "TypeScript",
        items: [
          { text: "TypeScript基础", link: "/typescript/base" },
          { text: "TypeScript类型挑战", link: "/typescript/challenge" },
        ],
      },

      {
        text: "CSS预编译器",
        items: [
          { text: "tailwindcss", link: "/cssPrecompile/tailwindcss" },
          { text: "Less", link: "/cssPrecompile/less" },
          { text: "Sass", link: "/cssPrecompile/sass" },
        ],
      },
    ],
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@images": "../images",
        "@vuepress": "../images/vuepress",
        "@components": "../.vuepress/components",
        "@": resolve(__dirname, "public", "assets"),
      },
    },
  },
};
