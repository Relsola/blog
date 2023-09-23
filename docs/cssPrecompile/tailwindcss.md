# TailwindCSS

## 介绍

Tailwind CSS使用原子类，提供了一组高度可定制化的CSS程序和组件；帮助前端开发人员快捷、方便地构建美观的用户界面；相比于传统的CSS框架，Tailwind CSS更注重简洁性和灵活性，可以和现有的前端框架如React、Vue、Angular等无缝集成，同时也避免了传统CSS开发中需要编写大量重复的样式代码。

官方内容：  
[TailwindCSS官网](https://www.tailwindcss.cn/)  
[TailwindCSS仓库](https://github.com/tailwindlabs/tailwindcss)  
[TailwindCSS练习场](https://play.tailwindcss.com/)  

## 安装

::: warning 注意
本文所有演示皆是基于 Vite + React 搭建的项目下进行的。
:::

首先我们在项目中安装Tailwind CSS，他以Postcss插件的形式接入到项目当中。  

安装依赖：
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

配置tailwind.config.js：
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

配置postcss.config.js：
```js
export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    }
};
```

创建全局CSS文件：
```css
@tailwind base; 
@tailwind components; 
@tailwind utilities;
```

这里 `VSCode` 可能会显示警告 `Unknown at rule @tailwind`  
可以安装VSCode插件 `Tailwind CSS IntelliSense`  
![Alt text](@/cssPrecompile/tailwindCSSIntelliSense.png)  
打开设置进入 settings.json 设置如下：
```json
// settings.json
{
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```
该警告将不再出现。  
同时 `Tailwind CSS IntelliSense` 可以增强我们Tailwind的开发体验，在写类名时，可以进行智能提示和补全，并且每个旁边都会有对应的类名的详细属性；甚至鼠标放在现有类名上也会呈现具体样式细节。

## 特性

我们可以先以官网的一个案例来了解TailwindCSS的使用
```html
<div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
	<div className="shrink-0">
		<img
			className="h-12 w-12"
			src="src/assets/React.png"
			alt="React Logo"
		/>
	</div>
	<div className="text-x1 font-medium text-black">
		React Logo
	</div>
	<p className="text-slate-500">You have a new message!</p>
</div>
```
所呈现出的效果如下：  
![Alt text](@/cssPrecompile/tailwindCSSReact.png)

在这个案例中，我们使用了下面几种样式：

* 宽高：最外层的元素使用max-w-sm限制最大宽度，图片使用w-12和h12来限制图片具体的宽度高*度。
* 边距：mx-auto来设置margin实现左右居中，p-6控制内边距padding。
* flex布局：flex开启flex布局、items-center设置items-center实现上下居中，shrink-0不收缩。
* 背景样式：bg-white背景白色，rounded-xl圆角，shadow-lg阴影。
* 文字样式：text-xl字体大小，font-medium字体加粗，text-black和text-slate-500字体颜色。

更多的样式缩写，可以查看官网的文档，由于语法比较语义化，查一两次基本就能记住了。  

::: tip
这里margin和padding比较特殊，有多种方式来设置；我们知道margin: 24px是设置上下左右四个方向的边距，在Tailwind CSS就可以简写成m-6；如果是margin: 24px 12px，Tailwind CSS就可以设置成X轴方向和Y轴方向，对应的类名就是：mx-3 my-6，因此上面的mx-auto就非常好理解了；而上下左右对应四个字母t、b、l、r，加上margin（m）和padding（p），就可以分别对应不同方向的设置了，比如pb-4。
:::

### 状态更改修饰符

我们可以给按钮元素设置悬浮、聚焦状态的改变，在CSS中是通过`:hover`，`:focus`等实现的，Tailwind CSS添加`hover:`前缀来实现：
```html
<button 
  className="bg-sky-500 hover:bg-sky-700 ">
  点我
</button>
```

这样鼠标悬浮后，背景颜色就会加深；还可以使用`active:`激活和`focus:`聚焦：
```html
<button
  className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:bg-violet-800"
>
  点我
</button>
```

对于a链接，`visited:`修饰符表示链接已经访问过：
```html
<a 
  href="https://relsola.github.io/blog" 
  className="text-red-500 visited:text-red-500">
</a>
```

还有一些`first-of-type:`、`last-of-type:`、`empty:`、`disabled:`、`checked:`修饰符,这里就不再赘述。

### 元素修饰符

对于第一个和最后一个元素，使用first:和last:来选择元素：
```tsx
<ul>
	{arr.map(item => (
		<li className="bg-blue-200 first:mt-10 last:bg-blue-500">
			{item}
		</li>
	))}
</ul>
```

对于奇偶元素，可以使用odd:和even:修饰符来选择元素：
```tsx
<ul>
	{arr.map(item => (
		<li className="bg-blue-200 odd:bg-blue-300 even:text-yellow-600">
			{item}
		</li>
	))}
</ul>
```

![Alt text](@/cssPrecompile/tailwindCSSodd.png)  

对于一些特殊的子元素，比如选择第几个元素`:nth-child`，我们通过`[&:nth-child(n)]`前缀：
```tsx
<ul>
	{arr.map(item => (
		<li className="bg-blue-200 [&:nth-child(3)]:bg-blue-500">
			{item}
		</li>
	))}
</ul>
```

### 父级修饰符
还有一些子元素的样式依赖于父级元素，我们通过给父级元素标记`group`类名，并且使用`group-*`的修饰符来标记目标元素，比如下面的例子：
```tsx
<div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4 group hover:bg-blue-100">
	<div className="shrink-0">
		<img
			className="h-12 w-12"
			src="src/assets/React.png"
			alt="React Logo"
		/>
	</div>
	<div className="text-x1 font-medium text-black group-hover:text-yellow-500">
		React Logo
	</div>
	<p className="text-slate-500 group-hover:text-violet-500">
		You have a new message!
	</p>
</div>
```

![Alt text](@/cssPrecompile/tailwindCSSgroup.gif)  

除了`group-hover`，还支持`group-active`、`group-focus`或者`group-odd`等修饰符；如果有多个组嵌套的情况，我们可以使用`group/{name}`来标记该父级元素，其中的子元素使用`group-hover/{name}`修饰符来设置样式：

```tsx
<ul>
	{arr.map(item => (
		<li className="group/item">
			{item}
            <div className="invisible group-hover/item:visible text-red-400 group/opt">
				<div className="group-hover/opt:text-red-700">
					hover me
				</div>
			</div>
		</li>
	))}
</ul>
```

　比如上面的案例中，最外层的元素使用了`group/item`，而下面的按钮使用了`group/opt`单独变成一个组，用来控制该组下面的元素样式。

### 同级修饰符

当我们需要根据同级元素的状态对目标元素进行样式设置时，使用`peer`标记同级的元素，使用`peer-*`修饰符对目标元素进行样式设计，比如下面的案例：

```tsx
<div className="flex flex-col items-start">
	<span>Email：</span>
	<input
		type="email"
		className="peer outline-none border-2 border-pink-600 p-1 rounded-md"
	/>
	<p className="mt-2 invisible peer-invalid:visible text-pink-600">
		请输入正确的邮箱地址
	</p>
</div>
```

我们给同级的输入框标记为peer，而p标签就是我们需要设计样式的目标元素，使用`peer-invalid:visible`让p标签当输入框输入内容无效时进行内容的显示，效果如下：

![Alt text](@/cssPrecompile/tailwindCSSpeer.png)

和`group`的使用一样，`peer`也可以使用`peer/{name}`来标记某个具体的元素，然后使用`peer-*/{name}`来设计目标元素的样式。

## 伪元素修饰符

对于::after和::before等伪元素，我们也可以使用`before:`和`after:`修饰符：
```tsx
<span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
	Email
</span>
```

当使用`before:`和`after:`修饰符这类修饰符时，Tailwind CSS会默认添加`content: ''`样式，除非我们需要在content中添加其他内容，否则不需要额外的声明。  
对于输入框input的placeholder，我们可以使用`placeholder:`修饰符很方便的更改占位符样式：
```tsx
<input
	className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
	placeholder="Search for anything..."
/>
```
效果如下：  
![Alt text](@/cssPrecompile/tailwindCSSplaceholder.png)

## 夜间模式

我们在浏览有些网站或者App时都会看到有夜间模式的功能，启用夜间模式可以让网站展示不同的风格样式，Tailwind CSS可以通过类名很容易的控制；要开启夜间模式，我们先在`tailwind.config.js`配置darkMode：

```js
// tailwind.config.js
export default {
  darkMode: "class",
  // ...
}
```

这样我们就可以通过全局根节点上控制类名来控制整体的页面风格是否呈现夜间模式了，比如在html节点或者App.vue上添加/移除`dark`类名；下面就来对页面进行改造，对于夜间模式下的背景颜色或者文字颜色，使用`dark:`修饰符，

```tsx
export default () => {
	const [isDark, setIsDark] = useState(false);

	return (
		<div className={isDark ? "dark" : ""}>
			<div className="p-6 max-w-sm mx-auto bg-white dark:bg-black  rounded-xl shadow-lg flex items-center space-x-4">
				<div className="shrink-0">
					<img
						className="h-12 w-12"
						src="src/assets/React.png"
						alt="React Logo"
					/>
				</div>
				<div className="text-x1 font-medium text-black dark:text-white">
					React Logo
				</div>
				<p className="text-slate-500 ">
					You have a new message!
				</p>
			</div>

			<button
				className="mt-10 px-2 py-1 border-solid border-2 border-indigo-600 hover:bg-sky-400 rounded-md"
				onClick={() => {
					setIsDark(!isDark);
				}}
			>
				{isDark ? "关闭" : "开启"}夜间模式
			</button>
		</div>
	);
};
```

在上面代码中，我们使用了`bg-white`在默认模式下的背景颜色为白色，以及`dark:bg-black`夜间模式下背景颜色为黑色，通过`isDark`变量来实现控制根节点开启/关闭夜间模式；效果如下：

![Alt text](@/cssPrecompile/tailwindCSSdark.gif);

## 自定义样式

对于一些全局的样式，比如颜色模式、自适应缩放模式、间距等等，我们可以添加到`tailwind.config.js`配置文件中：
```js
export default {
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      red: '#ff0000',
      "main-color": "#ff7849",
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  }
}
```
比如觉得全局的red红色，红的不够鲜艳，我们可以在colors中重新设置一个色值；或者设置一个全局的主要色值`main-color`，在页面中使用`bg-main-color`或者`text-main-color`就可以设置一个全局的颜色。  
  
在使用边距值时，我们发现只有`mt-6`这种模糊的数据，使用的单位也是`rem`；如果设计稿需要比较精确的还原，我们可以使用大括号来将精确的数值进行呈现：
```tsx
<div className="mt-[123px]">
</div>
```

对于色值、字体大小等，这种使用方式也是有效的：
```tsx
<div 
  className="bg-[#f0f0f0] text-[22px] before:content-['11']">
</div>
```

甚至对于CSS变量，也可以直接使用大括号，都不需要`var()`，只需要提供变量名称：
```tsx
<div className="bg-[--my-color]">
</div>
```

## 函数指令

### tailwind指令

在Tailwind CSS中，`tailwind`指令是用于快速生成基于配置的样式代码的工具。这些参数可以是任何有效的CSS属性和值。它可以根据 Tailwind CSS的配置文件中的设置来生成相应的样式代码。

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
@tailwind variants;
```

这里对应参数的作用如下：
* base：可以生成基础样式代码，包括重置样式、字体样式、间距样式等。
* components：可以生成各种 UI 组件的样式代码，例如按钮、卡片、表单等
* utilities：可以生成高度定制化的、短小精悍的样式代码，用于实现特定的设计效果。
* variants：可以用于创建自定义的样式变体，在需要时灵活地应用它们

### layer指令

`@layer`指令是Tailwind CSS中一个重要的指令，它用于将 CSS 类分层，从而更好地组织和控制样式。我们可以使用`@layer`指令来创建不同的层（layers）。层是CSS类的分组，这些组可以用于将 CSS 规则封装为独立的、可重用的模块。通过将样式规则组织到不同的层中，这样就可以更好地控制样式的作用范围和优先级。

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1 {
    @apply text-2xl;
  }
  h2 {
    @apply text-xl;
  }
}

@layer components {
  .btn-blue {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
}

@layer utilities {
  .filter-none {
    filter: none;
  }
  .filter-grayscale {
    filter: grayscale(100%);
  }
}
```

`@layer base`指令用于创建基础层base。基础层包含了通用的、基础的样式规则，例如颜色、字体、间距等。这些基础样式是整个网站中普遍适用的，通常不需要进行修改或定制。通过将基础样式规则分离到基础层中，可以确保它们在整个网站中保持一致，并且不会受到其他样式规则的影响。  
  
`@layer components`指令用于创建组件层`components`。组件层包含了与具体组件相关的样式规则。组件可以是任何自定义的HTML元素或页面组件，例如按钮、卡片、表单等。组件层中的样式规则通常与具体的UI组件有关，并且可能需要进行频繁的修改和定制。
  
`@layer utilities`指令用于创建实用层。实用层包含了高度定制化的、短小精悍的样式规则。这些规则通常是用来实现某些特定的设计效果。实用层中的样式规则通常是单一用途的，并且可以根据需要进行精确地控制和定制。

### apply指令

在Tailwind CSS中，我们可以使用`@apply`指令将现有的CSS类应用于已经定义的样式规则，以实现更灵活的样式控制：
```css
.my-custom-class {  
  @apply text-center;  
  @apply bg-blue;  
  @apply border-2;  
}
```
比如在上面的案例中，我们定义了我们自己的类名`my-custom-class`，然后使用`@apply`指令将`text-center`、`bg-blue`和`border-2`应用于我们自定义的样式，这样就可以根据具体的需求，封装一系列我们需要的样式规则。

## TailwindCSS生态

`TailwindCSS` 在近年来的快速发展中，`TailwindCSS` 不仅成为前端开发者钟爱的工具，还形成了一个多样化的生态系统。

### UI库支持
[tailwindui](https://tailwindui.com/)：快速的构建你的下一个创意。
  
[headlessui](https://github.com/tailwindlabs/headlessui)：完全无样式，完全无障碍的 UI 组件，本设计的与 Tailwind CSS 完美集成。
  
[shadcnUI](https://ui.shadcn.com/)：无障碍可定制的组件库，精美的设计并且可复制到你自己的应用程序中，帮你构建组件库。
  
[daisyui](https://daisyui.com/)：给 Tailwind CSS 添加组件类名，让你可以更快的创建漂亮的网站。
  
[seamless-ui](https://github.com/Clueless-Community/seamless-ui)：使用 简单 HTML 和 Tailwind CSS 制作下一代用户界面。  

[vue-tailwind](https://github.com/alfonsobries/vue-tailwind)：使用 Tailwind CSS 的 Vue 可配置 class UI 组件库。
  
[Equal UI](https://equal-ui.github.io/Equal/)：Equal UI 是一个基于 Tailwind CSS 提供支持的 Vue3 UI 组件库。
  
[wireui](https://livewire-wireui.com/)：一组用于 TallStack 项目的可重复使用的 UI 组件库。
  
[tailwind-react-ui](https://github.com/emortlock/tailwind-react-ui)：使用 Tailwind CSS 使用 React 使用组件和 UI 框架。
  
[skeleton](https://github.com/skeletonlabs/skeleton)：Svelte 和 Tailwind CSS 的 UI 工具箱。
  
[tailwindcss-radix](https://tailwindcss-radix.vercel.app/)：用于样式化 Radix 状态的实用程序和变体。
  
[windmillui](https://windmillui.com/)：用于快速、无障碍开发漂亮界面的 UI 组件库。
  
[pines](https://devdojo.com/pines)：一个包含动画、滑块、工具提示、手风琴、模态框等组件的 一组 UI 元素，可以复制并粘贴到任何 Alpine 和 Tailwind CSS 项目中。
  
[Preline UI](https://preline.co/index.html)：Preline UI 是一组开源的预构建 UI 组件，基于实用程序优先的 Tailwind CSS 框架。
  
[Feliz.DaisyUI](https://dzoukr.github.io/Feliz.DaisyUI/#/)：Feliz 对 DaisyUI Tailwind CSS 组件库的封装。
  
[indielayer](https://indielayer.com/)：基于 Tailwind CSS 的 Vue3 和 Nuxt UI 库。 快速构建和原型化 Web 应用程序。
  
[sailboatui](https://sailboatui.com/)：Sailboat UI 是一个现代的 Tailwind CSS UI 组件库。从 150 多个开源的 Tailwind CSS 组件开始，轻松构建您的产品。
  
[mambaui](https://mambaui.com/)：Mamba UI 是一个基于 Tailwind CSS 的免费开源 UI 组件和模板集合。


[floatui](https://floatui.com/)：使用 Tailwind CSS 构建，漂亮且具有响应式的 React 和 Vue UI 组件和模板。
  
[hyperui](https://www.hyperui.dev/)：HyperUI 是一个包含免费 Tailwind CSS 组件的集合，可用于您的下一个项目。通过各种组件，您可以构建下一个营销网站、管理仪表盘、电子商务商店等等。
  
[oruga](https://oruga.io/)：Oruga UI 就像一只毛毛虫，简约而功能齐全。它在您手中蜕变成一只蝴蝶。
  
[windmillui React](https://windmillui.com/react-ui)：WindmillReact UI 是一个基于 Tailwind CSS 的组件库, 适用于 React 框架。
  
[ripple-ui](https://www.ripple-ui.com/)：Ripple UI 是一组用于构建现代界面的组件和实用工具的集合，基于 Tailwind CSS 构建。
  
[nature-ui](https://nature-ui.com/)：Nature UI 是一个基于 React 的模块化组件库，内置对 Tailwind CSS 的支持。
  
[konsta](https://github.com/konstaui/konsta)：使用 Tailwind CSS 制作的移动端 UI 组件。
  
[rewinds](https://rewinds.mhaidarhanif.com/)：Rewinds 是一个使用 React、Radix UI、Zod、Conform、Prisma ORM、MySQL 在 PlanetScale、Verce 等平台上构建的 Remix Tailwind` 技术栈。
  
[dev.ui](https://github.com/kumard3/dev.ui)：DevUI 是一套免费开源的、可访问和可定制的 React 组件和模板，可以加速开发过程。

### 项目推荐
[tailwindcss-neumorphism](https://github.com/sambeevors/tailwindcss-neumorphism)：使用 Tailwind CSS 生成令人舒服 UI 的 CSS 代码。
  
[soft-ui-dashboard-tailwind](https://github.com/creativetimofficial/soft-ui-dashboard-tailwind)：令人舒服的 UI 仪表板 Tailwind - 免费开源的 TailwindCSS 仪表板。
  
[oku-nuxt3-template](https://github.com/productdevbook/oku-nuxt3-template)：Nuxt 3 最佳起始仓库，Tailwindcss，Sass，Headless UI，Vue，Pinia，Vite，Eslint，i18n，Naive UI。
  
[web-ui-clones](https://github.com/jigar-sable/web-ui-clones)：使用 TailwindCSS 克隆各种（知名） 网站。
  
[ChatGPT-PerfectUI](https://github.com/ConnectAI-E/ChatGPT-PerfectUI)： 用 Vue3 + Vite + Tailwindcss 复刻 ChatGPT！体验一模一样的 web-app。
  
[purple-admin-ui](https://github.com/purpleio/purple-admin-ui)：  基于 Tailwind CSS 的 Blazor 组件库。

### 插件支持

[tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)：一个用于创建漂亮动画效果的 Tailwind CSS 插件。
  
[tailwindcss-gradients](https://github.com/benface/tailwindcss-gradients)：一个用于生成渐变背景效果的 Tailwind CSS 插件。
  
[tailwindcss-forms](https://github.com/tailwindlabs/tailwindcss-forms)：	一个为表单样式提供基本样式，使表单元素易于通过实用工具进行覆盖修改的插件。
  
[tailwindcss-line-clamp](https://github.com/tailwindlabs/tailwindcss-line-clamp)：一个提供了在固定行数后视觉上截断文本的实用工具的插件。
  
[tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)：一个 Tailwind CSS 文字排版工具。
  
[tailwindcss-container-queries](https://github.com/tailwindlabs/tailwindcss-container-queries)：一个为容器查询提供实用工具 Tailwind CSS v3.2+ 的插件。
  
[tailwindcss-aspect-ratio](https://github.com/tailwindlabs/tailwindcss-aspect-ratio)：一个为元素提供可组合的 API，用于设置固定的纵横比的插件。
  
[nightwindcss](https://nightwindcss.com/)：一个自动的、可定制的、可覆盖的 Tailwind 暗模式插件。
  
### 设计资源
[Tailwind CSS UI](https://www.figma.com/community/file/768809027799962739/Tailwind-CSS-UI)：一个 Tailwind 创建飘动动画的设计资源。
  
[Tailwind CSS](https://www.figma.com/community/plugin/738806869514947558/Tailwind-CSS)：从你的 Tailwind 配置文件中直接生成样式和其他很酷的内容。
  
[Heroicons](https://www.figma.com/community/file/1143911270904274171/Heroicons)：Heroicons 图 Figma 设计资源。
  
[heroicons](https://heroicons.com/)：由 Tailwind CSS 的制作者提供，精美手工制作的 SVG 图标。

## 总结

TailwindCSS是目前社区非常流行的原子化CSS方案，他以Postcss插件的形式接入到项目当中。开发者在使用时，仅需要根据样式来书写类名，便可以实现任意的样式组合，最终在项目打包时以增量编译的形式生成最终的样式文件。  

具备优势：
* 有效减少CSS体积。
* CSS模块化，不存在任何污染的问题。
* 可配置化以及JIT， 灵活丰富。
* 设计层面的统一。
* 省去命名烦恼。