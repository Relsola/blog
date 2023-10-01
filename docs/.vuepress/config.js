const { resolve } = require("path");
module.exports = {
	title: "Relsola",
	description: "Relsola的个人博客",
	base: "/blog/",
	head: [["link", { rel: "icon", href: "/icon.png" }]],
	port: 3000,
	markdown: {
		lineNumbers: false
	},
	themeConfig: {
		sidebar: "auto",
		repo: "https://github.com/Relsola/blog",
		repoLabel: "Github",
		nav: [
			{
				text: "JavaScript",
				items: [
					{
						text: "深入理解解JavaScript",
						link: "/JavaScript/base"
					},
					{ text: "深入理解ES6", link: "/JavaScript/es6" },
					{
						text: "JavaScript手写系列",
						link: "/JavaScript/handwrite"
					},
					{
						text: "JavaScript设计模式",
						link: "/JavaScript/designPattern"
					}
				]
			},

			{
				text: "Vue",
				items: [
					{ text: "Vue2基础", link: "/vue/vue2base" },
					{ text: "Vue3基础", link: "/vue/vue3base" },
					{ text: "Vue核心插件", link: "/vue/libraries" },
					{ text: "Vue测试", link: "/vue/vueTest" },
					{
						text: "Vue2源码解读",
						link: "/vue/vue2sourceCode"
					},
					{
						text: "Vue3源码解读",
						link: "/vue/vue3sourceCode"
					}
				]
			},

			{
				text: "React",
				items: [
					{ text: "React基础", link: "/react/base" },
					{ text: "React生态", link: "/react/ecology" },
					{ text: "React源码", link: "/react/sourceCode" }
				]
			},

			{
				text: "前端工程化",
				items: [
					{ text: "Webpack", link: "/project/webpack" },
					{ text: "Vite", link: "/project/vite" },
					{ text: "Rollup", link: "/project/rollup" }
				]
			},

			{
				text: "TypeScript",
				items: [
					{
						text: "TypeScript基础",
						link: "/typescript/base"
					},
					{
						text: "TypeScript类型体操",
						link: "/typescript/challenge"
					}
				]
			},
			{
				text: "CSS预编译器",
				items: [
					{
						text: "tailwindcss",
						link: "/cssPrecompile/tailwindcss"
					},
					{ text: "Less", link: "/cssPrecompile/less" },
					{ text: "Sass", link: "/cssPrecompile/sass" }
				]
			},
			{
				text: "其他",
				items: [
					{ text: "Git操作", link: "/other/git" },
					{ text: "浏览器&网络", link: "/other/browser" }
				]
			}
		]
	},
	configureWebpack: {
		resolve: {
			alias: {
				"@images": "../images",
				"@vuepress": "../images/vuepress",
				"@components": "../.vuepress/components",
				"@": resolve(__dirname, "public", "assets")
			}
		}
	}
};
