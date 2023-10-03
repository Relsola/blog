---
sidebar: auto
---

#  Vue2 源码解读

源码阅读中...  
这里只是简单实现核心功能，详细还请阅读源码。

## 响应式原理

### 1.数据初始化

`Vue` 其实就是一个构造函数，用 `new` 操作符进行 `Vue` 实例化，这里传入的参数就是一个对象 `options` （选项）。
```js
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
});
```

`initMixin` 把 `_init` 方法挂载在 `Vue` 原型 供 `Vue` 实例调用  
通过引入文件的方式进行原型挂载，这样做有利于代码分割。
```js
// index.js
import { initMixin } from "./init.js";

// Vue就是一个构造函数 通过new关键字进行实例化
function Vue(options) {
	// Vue 初始化
	this._init(options);
}

// _init方法进行原型挂载需要传入Vue
initMixin(Vue);
export default Vue;
```

```js
// init.js
import { initState } from "./state.js";
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 这里的this指Vue实例对象
    const vm = this;
    //  this.$options就是用户new Vue的时候传入的属性
    vm.$options = options;
    // 初始化状态
    initState(vm);
  };
}
```

这里进行数据初始化，响应式数据核心是 `observe`
```js
// state.js
import { observe } from "./observer/index.js";

// 这里初始化的顺序依次是 prop > methods > data > computed > watch
export function initState(vm) {
	// 获取传入的数据对象
	const opts = vm.$options;
	// 初始化props
	if (opts.props) initProps(vm);
	// 初始化methods
	if (opts.methods) initMethod(vm);
	// 初始化data
	if (opts.data) initData(vm);
	// 初始化computed
	if (opts.computed) initComputed(vm);
	// 初始化watch
	if (opts.watch) initWatch(vm);
}

// 初始化data数据
function initData(vm) {
	// 实例的 _data 属性就是传入的 data
	let data = vm.$options.data;
	// vue组件data推荐使用函数 防止数据在组件之间共享
	data = vm._data =
		typeof data === "function" ? data.call(vm) : data || {};
	// 将 data 数据代理到 Vue 实例上
	for (const key in data) proxy(vm, `_data`, key);
	// 数据劫持 --响应式数据核心
	observe(data);
}

// 数据代理
function proxy(object, sourceKey, key) {
	Object.defineProperty(object, key, {
		get() {
			return object[sourceKey][key];
		},
		set(newValue) {
			object[sourceKey][key] = newValue;
		}
	});
}
```

### 2.对象的数据劫持

::: tip
* 数据劫持核心是 `defineReactive` 函数，主要使用 `Object.defineProperty` 来对数据 `get` 和 `set` 进行劫持
* 对于数组，如果对每一个元素下标都添加 `get` 和 `set` 方法，当数组里的元素太多，对于性能来说是承担不起的， 所以此方法只用来劫持对象
* 对象新增或者删除的属性无法被 `set` 监听到，只有对象本身存在的属性修改才会被劫持
:::

```js
// observer/index.js
class Observer {
  // 观测值
  constructor(value) {
    this.walk(value);
  }
	walk(data) {
		// 对象上的所有属性依次进行观测
		Object.keys(data).forEach(key => {
			defineReactive(data, key, data[key]);
		});
	}
}

// Object.defineProperty 数据劫持核心
function defineReactive(data, key, value) {
  // 递归，直到value不是对象才停止
  observe(value);
  
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      value = newValue;
    },
  });
}

export function observe(value) {
	// 如果传过来的是对象或者数组 进行属性劫持
	const type = Object.prototype.toString.call(value);
	if (type === "[object Object]" || type === "[object Array]")
		return new Observer(value);
}
```

### 3.数组的观测

```js
// observer/index.js
import { arrayMethods } from "./array.js";

class Observer {
  constructor(value) {
    if (Array.isArray(value)) {
      // 判断是数组通过通过重写数组原型方法来对数组的七种方法进行拦截
      value.__proto__ = arrayMethods;
      // 如果数组里面还包含数组 需要递归判断
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
	observeArray(items) {
		items.forEach(item => observe(item));
	}
}
```

给每个响应式数据增加了一个不可枚举的__ob__属性，并且指向了 Observer 实例。  
这样做可以根据这个属性来防止已经被响应式观察的数据反复被观测，其次，响应式数据可以使用 `__ob__` 来获取 `Observer` 实例的相关方法，这对数组很关键。
```js
// observer/index.js
class Observer {
  // 观测值
  constructor(value) {
    Object.defineProperty(value, "__ob__", {
      //  值指代的就是Observer的实例
      value: this,
      //  不可枚举
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }
}
```

重写数组七个方法：
```js
// observer/array.js

// 先保留数组原型
const arrayProto = Array.prototype;
// 然后将arrayMethods继承自数组原型
// 这里是面向切片编程思想（AOP）--不破坏封装的前提下，动态的扩展功能
export const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "reverse",
  "sort",
];
methodsToPatch.forEach(method => {
	arrayMethods[method] = function (...args) {
		// 这里保留原型方法的执行结果
		const result = arrayProto[method].apply(this, args);
		// this代表的就是数据本身
		// 这个属性就是上段代码增加的 代表的是该数据已经被响应式观察过了指向Observer实例
		const ob = this.__ob__;

		// 判断数组是否有新增操作
		let inserted;
		switch (method) {
			case "push":
			case "unshift":
				inserted = args;
				break;
			case "splice":
				inserted = args.slice(2);
			default:
				break;
		}
		// 如果有新增的元素 inserted 是一个数组 调用Observer实例的observeArray对数组每一项进行观测
		if (inserted) ob.observeArray(inserted);
    // 后续源码再写数组更新触发视图更新的操作
    return result;
  };
});
```

## 模板编译

在 `Vue.$mount` 过程中，`Vue` 把模版编译成 `render` 函数，这个过程就是模板编译，其核心实现方法可以分为三步：
1. `parse`： 解析模版 `template` 生成 `AST` 语法树
  
2. `optimize`： 优化 `AST` 语法树，标记静态节点
   
3. `codegen`： 把优化后的 `AST` 语法树转换生成 `render` 方法代码字符串，利用模板引擎生成可执行的 `render` 函数（`render` 执行后返回的结果就是虚拟DOM，即以 `VNode` 节点作为基础的树）

### 1.模板编译入口
```js
// init.js
import { initState } from "./state.js";
import { compileToFunctions } from "./compiler/index.js";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;
    initState(vm);

		// 如果有el属性 进行模板渲染
		if (vm.$options.el) vm.$mount(vm.$options.el);
  };

  // 模板编译
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);

		// 如果不存在render属性
		if (!options.render) {
			// 如果存在template属性
			let template = options.template;

			// 如果不存在render和template 但是存在el属性
      // 直接将模板赋值到el所在的外层html结构（就是el本身 并不是父元素）
			if (!template && el) template = el.outerHTML;

			// 最终需要把template模板转化成render函数
			if (template) {
        // 模板编译核心方法
				const render = compileToFunctions(template);
				options.render = render;
			}
		}
  };
}
```

### 2.模板转化核心 

`compileToFunctions` 把html字符串变成render函数。  
```js
// compiler/index.js
import { parse } from "./parse.js";
import { codegen } from "./codegen.js";

// 把模版编译成render函数
export function compileToFunctions(template) {
	// 1.把html代码转成ast语法树
	const ast = parse(template);

	// 2.优化静态节点
	// optimize(ast, options);

	// 3.通过ast 重新生成代码
	const code = codegen(ast);
	// 使用with语法改变作用域为this 方便render函数code里面的变量取值
	return new Function(`with(this){return ${code}}`);
}
```

### 3.解析 html 并生成 ast

#### 源码的正则匹配
```js
// compiler/parse.js
// 匹配标签名 
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
// 匹配特殊标签 
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 匹配 <xxx  开始标签
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// 匹配开始标签结束  >
const startTagClose = /^\s*(\/?)>/;
// 匹配 </xxxx>  结束标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
// 匹配属性  如 id="app"
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
```

#### 节点对象
```js
// 代表根节点 和 当前父节点
let root, currentParent;
// 栈结构 先进后出 来表示开始和结束标签
const stack = [];
// 标识元素和文本type
const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;
// 生成ast方法
function createASTElement(tagName, attrs) {
  return {
    // 标签名
    tag: tagName,
    // 类型
    type: ELEMENT_TYPE,
    children: [],
    // 属性
    attrs,
    parent: null,
  };
}
```

#### 标签处理
```js
// 对开始标签进行处理
function start({ tagName, attrs }) {
	const element = createASTElement(tagName, attrs);
	root = root ?? element;
	// 建立parent和children关系
	if (currentParent) {
		// 只赋予了parent属性
		element.parent = currentParent;
		// 还需要让父亲记住自己
		currentParent.children.push(element);
	}
	currentParent = element;
	stack.push(element);
}

// 对结束标签进行处理
function end() {
	// 栈结构 当遇到第一个结束标签时 会匹配到栈顶元素对应的ast 并取出来
	stack.pop();
	// 当前父元素就是栈顶的上一个元素
	currentParent = stack.at(-1);
}

// 对文本进行处理
function chars(text) {
	// 去掉空格
	text = text.replace(/\s/g, "");
	if (text !== "")
		currentParent.children.push({
			type: TEXT_TYPE,
			text
		});
}
```

#### 解析标签生成ast核心

使用 `while` 循环 `html` 字符串，利用正则去匹配开始标签、文本内容和闭合标签，然后执行 `advance` 方法将匹配到的内容在原 `html` 字符串中剔除，直到 `html` 字符串为空，结束循环：
```js
// 解析标签生成ast核心
export function parse(html) {
	root = null;
	currentParent = undefined;
	while (html) {
		// 查找 <
		const textEnd = html.indexOf("<");
		// 如果textEnd = 0 说明是一个开始标签或者结束标签
		// 如果textEnd > 0 说明就是文本的结束位置

		// 匹配开始标签 <xxx
		if (textEnd === 0) {
			// 如果开始标签解析有结果
			const startTagMatch = parseStartTag();
			if (startTagMatch) {
				// 把解析好的标签名和属性解析生成ast
				start(startTagMatch);
				continue;
			}

			// 匹配结束标签 </
			const endTagMatch = html.match(endTag);
			if (endTagMatch !== null) {
				advance(endTagMatch[0].length);
				end(endTagMatch[1]);
				continue;
			}
		}

		if (textEnd > 0) {
			// 获取文本
			const text = html.substring(0, textEnd);
			if (text !== "") {
				advance(text.length);
				chars(text);
			}
		}
  }

  // 匹配开始标签
  function parseStartTag() {
    const start = html.match(startTagOpen);

    if (start) {
      const match = {
        // 标签名
        tagName: start[1],
        attrs: [],
      };

      // 匹配到了开始标签 就截取掉
      advance(start[0].length);

      // 匹配属性 如果不是开始标签的结束 就一直匹配下去
			let end, attr;
			while (
				!(end = html.match(startTagClose)) &&
				(attr = html.match(attribute))
			) {
				advance(attr[0].length);
				match.attrs.push({
					name: attr[1],
					//这里是因为正则捕获支持双引号 单引号 和无引号的属性值
					value: attr[3] || attr[4] || attr[5] || true
				});
			}

			// 如果不是开始标签的结束
			if (end) advance(end[0].length);

			return match;
		}
		return false;
	}

	// 截取html字符串 每次匹配到了就往前继续匹配
	function advance(n) {
		html = html.substring(n);
	}

	// 返回生成的ast
	return root;
}
```
::: warning 注意
`currentParent` 指向的是栈中的最后一个 `ast` 节点  
`stack` 栈中的当前 `ast` 节点永远是下一个 `ast` 节点的父节点
:::

### 4.optimize优化树

深度遍历这个 AST 树，去检测它的每一颗子树是不是静态节点，如果是静态节点则标记 static: true

::: tip
为什么要有优化过程，因为我们知道 Vue 是数据驱动，是响应式的，但是我们的模板并不是所有数据都是响应式的，也有很多数据是首次渲染后就永远不会变化的，那么这部分数据生成的 DOM 也不会变化，我们可以在 patch 的过程跳过对他们的比对，这对运行时对模板的更新起到极大的优化作用。
:::


### 5.根据 ast 重新生成代码

::: tip
拿到生成好的 `ast` 之后 需要把 `ast` 转化成类似_c('div',{id:"app"},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))这样的字符串
* **_c**: 执行 createElement创建虚拟节点
* **_v**: 执行 createTextVNode创建文本虚拟节点
* **_s**: 处理变量 我们会在Vue原型上扩展这些方法
:::

实现一个简单的codegen方法，深度遍历AST树去生成render代码字符串：
```js
// compiler/codegen.js

// 匹配花括号 {{  }} 捕获花括号里面的内容
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function gen(node) {
	// 判断节点类型
	// 源码这块包含了复杂的处理  比如 v-once v-for v-if 自定义指令 slot 等等
	// 这里只考虑普通文本和变量表达式 {{ }} 的处理

	// 如果是元素类型 递归创建
	if (node.type == 1) return codegen(node);
	else {
		// 如果是文本节点
		let text = node.text;

		// 不存在花括号变量表达式
		if (!defaultTagRE.test(text))
			return `_v(${JSON.stringify(text)})`;

		// 正则是全局模式 每次需要重置正则的lastIndex属性  不然会引发匹配bug
		let lastIndex = (defaultTagRE.lastIndex = 0);
		const tokens = [];
		let match, index;

		while ((match = defaultTagRE.exec(text))) {
			// index代表匹配到的位置
			index = match.index;
			if (index > lastIndex) {
				// 匹配到的花括号位置  在tokens里面放入普通文本
				tokens.push(
					JSON.stringify(text.slice(lastIndex, index))
				);
			}
			// 放入捕获到的变量内容
			tokens.push(`_s(${match[1].trim()})`);
			// 匹配指针后移
			lastIndex = index + match[0].length;
		}
		// 如果匹配完了花括号  text 里面还有剩余的普通文本 那么继续push
		if (lastIndex < text.length) {
			tokens.push(JSON.stringify(text.slice(lastIndex)));
		}
		// _v表示创建文本
		return `_v(${tokens.join("+")})`;
	}
}

// 处理attrs属性
function genProps(attrs, str = "") {
	attrs.forEach(attr => {
		// 对attrs属性里面的style做特殊处理
		if (attr.name === "style") {
			let obj = {};
			attr.value.split(";").forEach(item => {
				let [key, value] = item.split(":");
				obj[key] = value;
			});
			attr.value = obj;
		}
		str += `${attr.name}:${JSON.stringify(attr.value)},`;
	});
	return `{${str.slice(0, -1)}}`;
}

// 生成子节点 调用gen函数进行递归创建
function getChildren(el) {
	const children = el.children;
	if (children) return `${children.map(c => gen(c)).join(",")}`;
}

// 递归创建生成code
export function codegen(el) {
	let children = getChildren(el);

	let code = `_c('${el.tag}',${
		el.attrs.length ? `${genProps(el.attrs)}` : "undefined"
	}${children ? `,${children}` : ""})`;
	return code;
}
```
::: warning 注意
这里只是实现了一个简单的 `codegen` 用来匹配常见的属性和 `{{ }}`里的内容 ，有兴趣看如何处理指令等可以看Vue源码。
:::

## 初始渲染

### 1.组件挂载入口

```js
// init.js

Vue.prototype.$mount = function (el) {
	const vm = this;
	const options = vm.$options;
	el = document.querySelector(el);

	if (!options.render) {
		let template = options.template;
		if (!template && el) template = el.outerHTML;
		if (template) {
			const render = compileToFunctions(template);
			options.render = render;
		}
	}

	// 将当前组件实例挂载到真实的el节点上面
	return mountComponent(vm, el);
};
```

### 2.组件挂载核心

::: tip 组件挂载核心
* 第一步模板编译解析生成了render函数
* 下一步调用 `vm._render` 方法调用生成的render函数生成虚拟dom
* 最后调用 `vm._update` 方法把虚拟dom渲染到页面
:::
```js
// lifecycle.js

export function mountComponent(vm, el) {
  // 真实的el选项赋值给实例的$el属性 为之后虚拟dom产生的新的dom替换老的dom做铺垫
  vm.$el = el;

  // _update 和 _render 方法都是挂载在Vue原型的方法
  vm._update(vm._render());
}
```

### 3.render 函数转化成虚拟 dom
```js
// render.js
import { createElement, createTextNode } from "./vdom/index.js";

export function renderMixin(Vue) {
  Vue.prototype._render = function () {
    const vm = this;
    // 获取模板编译生成的render方法
    const { render } = vm.$options;
    // 生成vnode --虚拟dom
    const vnode = render.call(vm);
    return vnode;
  };

	// render函数里面有_c _v _s方法需要定义

	// 创建虚拟dom元素
	Vue.prototype._c = function (...args) {
		const vm = this;
		return createElement(vm, ...args);
	};

	// 创建虚拟dom文本
	Vue.prototype._v = function (text) {
		return createTextNode(text);
	};

	// 如果模板里面的是一个对象  需要JSON.stringify
	Vue.prototype._s = function (val) {
		return val == null
			? ""
			: typeof val === "object"
			? JSON.stringify(val)
			: val;
	};
}
```

```js
// vdom/index.js

// 定义Vnode类
export default class Vnode {
  constructor(tag, data, key, children, text) {
    this.tag = tag;
    this.data = data;
    this.key = key;
    this.children = children;
    this.text = text;
  }
}

// 创建元素vnode 等价于render函数里面的 h=>h(App)
export function createElement(tag, data = {}, ...children) {
  const key = data.key;
  return new Vnode(tag, data, key, children);
}

// 创建文本vnode
export function createTextNode(text) {
  return new Vnode(undefined, undefined, undefined, undefined, text);
}
```

### 4.虚拟 dom 转化成真实 dom 
```js
// lifecycle.js

import { patch } from "./vdom/patch.js";
export function lifecycleMixin(Vue) {
  // 把_update挂载在Vue的原型
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // patch是渲染vnode为真实dom核心
    patch(vm.$el, vnode);
  };
}
```

`_update` 核心方法就是 `patch` ，初始渲染和后续更新都是共用这一个方法，只是传入的第一个参数不同，初始渲染总体思路就是根据虚拟 dom(vnode) 调用原生 js 方法创建真实 dom 节点并替换掉 el 选项的位置。
```js
// vdom/patch.js

// patch用来渲染和更新视图 这里只介绍初次渲染的逻辑
export function patch(oldVnode, vnode) {

  // 判断传入的oldVnode是否是一个真实元素
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // 真实DOM，初次渲染
    const oldElm = oldVnode;
    const parentElm = oldElm.parentNode;

    // 将虚拟dom转化成真实dom节点
		const el = createElm(vnode);

    // 插入到 老的el节点下一个节点的前面 就相当于插入到老的el节点的后面
    // 这里不直接使用父元素appendChild是为了不破坏替换的位置
    parentElm.insertBefore(el, oldElm.nextSibling);

    // 删除老的el节点
    parentElm.removeChild(oldVnode);
    return el;
  }
}

// 虚拟dom转成真实dom 就是调用原生方法生成dom树
function createElm(vnode) {
  let { tag, data, key, children, text } = vnode;
  // 判断虚拟dom 是元素节点还是文本节点
  if (typeof tag === "string") {
    // 虚拟dom的el属性指向真实dom
    vnode.el = document.createElement(tag);

    // 解析虚拟dom属性
    updateProperties(vnode);

		// 如果有子节点就递归插入到父节点里面
		children.forEach(child => {
			return vnode.el.appendChild(createElm(child));
		});
  } else {
    // 文本节点
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

// 解析vnode的data属性 映射到真实dom上
function updateProperties(vnode) {
	// 新的vnode的属性
	const newProps = vnode.data || {};
	// 真实节点
	const el = vnode.el;

	// 遍历属性添加到dom树上
	for (const key in newProps) {
		if (key === "style") {
			for (const styleName in newProps.style) {
				el.style[styleName] = newProps.style[styleName];
			}
		} else if (key === "class") {
			el.className = newProps.class;
		} else {
			// 给这个元素添加属性 值就是对应的值
			el.setAttribute(key, newProps[key]);
		}
	}
}
```

### 5._render 和_update 原型方法的混入
```js
// index.js

import { initMixin } from "./init.js";
import { lifecycleMixin } from "./lifecycle.js";
import { renderMixin } from "./render.js";

// Vue就是一个构造函数 通过new关键字进行实例化
function Vue(options) {
  // 这里开始进行Vue初始化工作
  this._init(options);
}

// 混入 _init
initMixin(Vue);

// 混入 _render
renderMixin(Vue);

// 混入 _update
lifecycleMixin(Vue);

export default Vue;
```

## 渲染更新

### 1.定义 Watcher

`Vue` 里使用[观察者模式](https://www.cnblogs.com/zhengyufeng/p/10985321.html)在数据变动的时候自动去更新，这里我们定义 `Watcher` 当做观察者，它需要订阅数据的变动，当数据变动之后，通知它去执行某些方法，其本质是一个构造函数，初始化的时候会去执行 `get` 方法。
```js
// observer/watcher.js

export default class Watcher {
  // 唯一id  每次new Watcher都会自增
	static id = 0;

  constructor(vm, exprOrFn, cb, options) {
    // Vue实例
    this.vm = vm;
    // 表达式
    this.exprOrFn = exprOrFn;
    //回调函数
    this.cb = cb;
    // 额外配置 
    this.options = options;
    // watcher的唯一标识
    this.id = id++;

    // 如果表达式是一个函数
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn;
    }

    // 实例化就会默认调用get方法
    this.get();
  }
  get() {
    this.getter();
  }
}
```

### 2.创建渲染 Watcher

我们在组件挂载方法里面定义一个渲染 `Watcher`，主要功能就是执行核心渲染页面的方法：
```js
// lifecycle.js

export function mountComponent(vm, el) {
  vm.$el = el;

  // 注册一个渲染watcher 执行vm._update(vm._render())方法渲染视图
  function updateComponent(){
    vm._update(vm._render());
  };
  new Watcher(vm, updateComponent, null, true);
}
```

### 3.定义 Dep

`Dep` 也是一个构造函数，可以理解为观察者模式里面的被观察者，在 `subs` 里面收集 `watcher`，当数据变动的时候通知自身 `subs` 所有的 `watcher` 更新。
```js
// observer/dep.js

// dep和watcher是多对多的关系
// 每个属性都有自己的dep
export default class Dep {
  // dep实例的唯一标识
	static id = 0;
  // 默认Dep.target为null
	static target = null;

  constructor() {
    this.id = Dep.id++;
		// 存放 watcher
		this.subs = [];
  }
}
```

### 4.对象的依赖收集

在数据被访问的时，把我们定义好的渲染 `Watcher` 放到 `dep` 的 `subs` 数组里面，同时把 `dep` 实例对象也放到渲染 `Watcher` 里面，数据更新时就可以通知 `dep` 的 `subs` 存储的 `watcher` 更新。
```js
// observer/index.js

function defineReactive(data, key, value) {
  observe(value);

  // 为每个属性实例化一个Dep
	const dep = new Dep();

  Object.defineProperty(data, key, {
    get() {
      // 页面取值的时候 把watcher收集到dep里面 --依赖收集
      if (Dep.target) {
        // 如果有watcher dep就会保存watcher 同时watcher也会保存dep
				dep.depend();
      }
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      // 如果赋值的新值也是一个对象  需要观测
      observe(newValue);
      value = newValue;
      // 通知渲染watcher去更新 --派发更新
      dep.notify(); 
    },
  });
}
```

### 5.完善观察者模式

`watcher` 在调用 `getter` 方法前后分别把自身赋值给 `Dep.target`，方便进行依赖收集 `update` 方法用来更新。
```js
// observer/watcher.js
import { pushTarget, popTarget } from "./dep.js";

export default class Watcher {
  // 唯一id  每次new Watcher都会自增
	static id = 0;

  constructor(vm, exprOrFn, cb, options) {
    // Vue实例
    this.vm = vm;
    // 表达式
    this.exprOrFn = exprOrFn;
    //回调函数
    this.cb = cb;
    // 额外配置 
    this.options = options;
    // watcher的唯一标识
    this.id = id++;

    // 如果表达式是一个函数
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn;
    }

    // 实例化就会默认调用get方法
    this.get();
  }

  get() {
    // 在调用方法之前先把当前watcher实例推到全局Dep.target上
    pushTarget(this);
    //如果watcher是渲染watcher 那么就相当于执行  vm._update(vm._render()) 这个方法在render函数执行的时候会取值 从而实现依赖收集
    this.getter();
    // 在调用方法之后把当前watcher实例从全局Dep.target移除
    popTarget();
  }
  
	// 把dep放到deps里面 同时保证同一个dep只被保存到watcher一次  同样的  同一个watcher也只会保存在dep一次
	addDep(dep) {
		let id = dep.id;
		if (!this.depsId.has(id)) {
			this.depsId.add(id);
			this.deps.push(dep);
			// 直接调用dep的addSub方法  把自己--watcher实例添加到dep的subs容器里面
			dep.addSub(this);
		}
	}

  // 更新视图
  update() {
    this.get();
  }
}
```

`Dep` 定义相关的方法把收集依赖的同时把自身也放到 `watcher` 的 `deps` 容器里面去。
```js
// observer/dep.js

// 每个属性都有自己的dep
export class Dep {
	// 默认Dep.target为null
	static target = null;
	// 栈结构用来存watcher
	static targetStack = [];
	// dep实例的唯一标识
	static id = 0;

	constructor() {
		this.id = Dep.id++;
		// 存放 watcher
		this.subs = [];
	}

	depend() {
		// 如果当前存在watcher 把自身dep实例存放在watcher里面
		if (Dep.target) Dep.target.addDep(this);
	}

	notify() {
		// 依次执行subs里面的watcher更新方法
		this.subs.forEach(watcher => watcher.update());
	}

	addSub(watcher) {
		// 把watcher加入到自身的subs容器
		this.subs.push(watcher);
	}
}

export function pushTarget(watcher) {
	Dep.targetStack.push(watcher);
	// Dep.target指向当前watcher
	Dep.target = watcher;
}

export function popTarget() {
	// 当前watcher出栈 拿到上一个watcher
	Dep.targetStack.pop();
	Dep.target = Dep.targetStack.at(-1);
}
```

### 6.数组的依赖收集

如果对象属性的值是一个数组，那么执行 `childOb.dep.depend` 收集数组的依赖 如果数组里面还包含数组 需要递归遍历收集，因为只有访问数据触发了 `get` 才会去收集依赖，一开始只是递归对数据进行响应式处理无法收集依赖 。
```js
// observer/index.js

function defineReactive(data, key, value) {
  // childOb就是Observer实例
	const childOb = observe(value);

 	// 为每个属性实例化一个Dep
	const dep = new Dep();

	Object.defineProperty(data, key, {
		get() {
			// 页面取值的时候 把watcher收集到dep里面 --依赖收集
			if (Dep.target) {
				// 如果有watcher dep就会保存watcher 同时watcher也会保存dep
				dep.depend();

				// 如果 value 是一个数组
				if (childOb && Array.isArray(value)) {
					value.__ob__.dep = dep;
					// 递归遍历属性
					dependArray(value);
				}
			}
			return value;
		},

		set(newValue) {
			if (newValue === value) return;

			// 如果赋值的新值也是一个对象  需要观测
			observe(newValue);
			value = newValue;

			// 通知渲染watcher去更新 --派发更新
			dep.notify();
		}
	});
}

// 递归收集数组依赖
function dependArray(value) {
	value.forEach(e => {
		e && e.__ob__ && e.__ob__.dep.depend();
		// 如果数组里面还有数组  就递归去收集依赖
		if (Array.isArray(e)) dependArray(e);
	});
}
```

### 7.数组的派发更新

```js
// observer/array.js

methodsToPatch.forEach(method => {
	arrayMethods[method] = function (...args) {
		// 这里保留原型方法的执行结果
		const result = arrayProto[method].apply(this, args);
		// this代表的就是数据本身
		// 这个属性就是上段代码增加的 代表的是该数据已经被响应式观察过了指向Observer实例
		const ob = this.__ob__;

		// 判断数组是否有新增操作
		let inserted;
		switch (method) {
			case "push":
			case "unshift":
				inserted = args;
				break;
			case "splice":
				inserted = args.slice(2);
			default:
				break;
		}
		// 如果有新增的元素 inserted 是一个数组 调用Observer实例的observeArray对数组每一项进行观测
		if (inserted) ob.observeArray(inserted);
		// 数组派发更新
		ob.dep.notify();
		return result;
	};
});
```


## 异步更新

按照之前的逻辑，每次我们改变数据的时候都会触发相应的 watcher 进行更新，会重新渲染一次 这样非常浪费性能，我们可以采用异步更新，让数据变动完毕后统一去更新视图。
### 1.watcher 更新改写
```js
// observer/watcher.js
import { queueWatcher } from "./scheduler.js";

export default class Watcher {
  // ...
  update() {
    // 每次watcher进行更新的时候  是否可以让他们先缓存起来  之后再一起调用
    // 异步队列机制
    queueWatcher(this);
  }
  run() {
    // 真正的触发更新
    this.get();
  }
}
```

### 2.queueWatcher 实现队列机制

先同步把 `watcher` 都放到队列里面去，执行完队列的事件之后再清空队列，主要使用 `nextTick` 来执行 `watcher` 队列。
```js
// observer/scheduler.js
import { nextTick } from "../util/next-tick.js";

let queue = [];
let has = {};
function flushSchedulerQueue() {
	// 调用watcher的run方法 执行真正的更新操作
	queue.forEach(watcher => watcher.run());
	// 执行完之后清空队列
	queue = [];
	has = {};
}

// 实现异步队列机制
export function queueWatcher(watcher) {
	const id = watcher.id;
	// watcher去重
	if (has[id] === undefined) {
		// 同步代码执行 把全部的watcher都放到队列里面去
		queue.push(watcher);
		has[id] = true;
		// 进行异步调用
		nextTick(flushSchedulerQueue);
	}
}
```

### 3.nextTick 实现原理
```js
// util/next-tick.js

const callbacks = [];
let pending = false;

function flushCallbacks() {
	//把标志还原为false
	pending = false;
	// 依次执行回调
	callbacks.forEach(callback => callback());
}

//定义异步方法  采用优雅降级
let timerFunc; 
if (typeof Promise !== "undefined") {
	// 如果支持promise
	const p = Promise.resolve();
    timerFunc = () => {
		p.then(flushCallbacks);
	};
} else if (typeof MutationObserver !== "undefined") {
	// MutationObserver 主要是监听dom变化 也是一个异步方法
	let counter = 1;
	const observer = new MutationObserver(flushCallbacks);
	const textNode = document.createTextNode(String(counter));
	observer.observe(textNode, {
		characterData: true
	});
	timerFunc = () => {
		counter = (counter + 1) % 2;
		textNode.data = String(counter);
	};
} else if (typeof setImmediate !== "undefined") {
	// 如果前面都不支持 判断setImmediate
	timerFunc = () => {
		setImmediate(flushCallbacks);
	};
} else {
	// 最后降级采用setTimeout
	timerFunc = () => {
		setTimeout(flushCallbacks, 0);
	};
}

export function nextTick(cb) {
	// 除了渲染watcher  还有用户自己手动调用的nextTick 一起被收集到数组
	callbacks.push(cb);
	if (!pending) {
		// 如果多次调用nextTick  只会执行一次异步 等异步队列清空之后再把标志变为false
		pending = true;
		timerFunc();
	}
}
```

### 4.$nextTick 挂载原型
```js
// render.js

import { nextTick } from "./util/next-tick.js";

export function renderMixin(Vue) {
  // ...

  // 挂载在原型上，可供用户手动调用
  Vue.prototype.$nextTick = nextTick;
}
```

## diff算法

### 1.patch 核心渲染方法改写

::: tip 渲染更新过程
1. `diff` 只进行同级比较
2. 根据新老 `vnode` 子节点不同情况分别处理
:::
```js
// vdom/patch.js

export function patch(oldVnode, vnode) {

  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // 初次渲染逻辑...
  } else {
		// oldVnode是虚拟dom 更新过程使用diff算法

		// 如果新旧标签不一致 用新的替换旧的 oldVnode.el代表的是真实dom节点 --同级比较
		if (oldVnode.tag !== vnode.tag) {
			oldVnode.el.parentNode.replaceChild(
				createElm(vnode),
				oldVnode.el
			);
		}

		// 如果旧节点是一个文本节点
		if (!oldVnode.tag && oldVnode.text !== vnode.text)
			oldVnode.el.textContent = vnode.text;

		// 不符合上面两种 代表标签一致 并且不是文本节点
		// 为了节点复用 所以直接把旧的虚拟dom对应的真实dom赋值给新的虚拟dom的el属性
		const el = (vnode.el = oldVnode.el);
    // 更新属性
		updateProperties(vnode, oldVnode.data);
    
    // 老节点的子元素
		const oldCh = oldVnode.children || [];
    // 新节点的子元素
		const newCh = vnode.children || [];

		if (oldCh.length > 0 && newCh.length > 0) {
			// 新老节点都存在子节点
			updateChildren(el, oldCh, newCh);
		} else if (oldCh.length > 0 && newCh.length === 0) {
			// 老节点有子节点 新节点无子节点
			el.innerHTML = "";
		} else if (oldCh.length === 0 && newCh.length) {
			// 老节点无子节点 新节点有子节点
			newCh.forEach(child => el.appendChild(createElm(child)));
		}
	}
}
```

### 2.updateProperties 更新属性

对比新老 `vnode` 进行属性更新：
```js
//  vdom/patch.js

// 解析vnode的data属性 映射到真实dom上
function updateProperties(vnode, oldProps = {}) {
	// 新的vnode的属性
	const newProps = vnode.data || {};
	// 真实节点
	const el = vnode.el;

	// 如果新的节点没有 需要把老的节点属性移除
	for (const k in oldProps) if (!newProps[k]) el.removeAttribute(k);

	// 对style样式做特殊处理 如果新的没有 需要把老的style值置为空
	const newStyle = newProps.style || {};
	const oldStyle = oldProps.style || {};
	for (const key in oldStyle)
		  if (!newStyle[key]) el.style[key] = "";

	// 遍历新的属性 进行增加操作
	for (const key in newProps) {
		if (key === "style")
			for (const styleName in newProps.style)
				el.style[styleName] = newProps.style[styleName];
		else if (key === "class") el.className = newProps.class;
		else el.setAttribute(key, newProps[key]);
	}
}
```
### 3. diff 核心 更新子节点 

1. 使用双指针移动来进行新老节点的对比。
2. 用 `isSameVnode` 来判断新老子节点的头头、尾尾、头尾、尾头、是否是同一节点，如果满足就进行相应的移动指针(头头、尾尾)或者移动 dom 节点(头尾、尾头)操作。
3. 如果全都不相等 进行暴力对比 如果找到了利用 key 和 index 的映射表来移动老的子节点到前面去 如果找不到就直接插入。
4. 对老的子节点进行递归 `patch` 处理。
5. 最后老的子节点有多的就删掉 新的子节点有多的就添加到相应的位置。
```js
// vdom/patch.js

// 判断两个vnode的标签和key是否相同 如果相同 就可以认为是同一节点就地复用
function isSameVnode(oldVnode, newVnode) {
  return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
}

// diff算法核心 采用双指针的方式 对比新老vnode的儿子节点
function updateChildren(parent, oldCh, newCh) {
	// 老节点子节点的起始下标
	let oldStartIndex = 0;
	// 老节点子节点的第一个节点
	let oldStartVnode = oldCh[0];
	// 老节点子节点的结束下标
	let oldEndIndex = oldCh.length - 1;
	// 老节点子节点的起结束节点
	let oldEndVnode = oldCh[oldEndIndex];

  // 同上，表示新节点
  let newStartIndex = 0;
  let newStartVnode = newCh[0];
  let newEndIndex = newCh.length - 1;
  let newEndVnode = newCh[newEndIndex];

	// 根据key来创建老节点子节点的index映射表
	function makeIndexByKey(children) {
		let map = {};
		children.forEach((item, index) => {
			map[item.key] = index;
		});
		return map;
	}
	// 生成的映射表
	const map = makeIndexByKey(oldCh);

  // 只有当新老儿子的双指标的起始位置不大于结束位置的时候  才能循环 一方停止了就需要结束循环
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 因为暴力对比过程把移动的vnode置为 undefined 如果不存在vnode节点 直接跳过
    if (!oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIndex];
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 头和头对比 依次向后追加
      // 递归比较子节点以及他们的子节点
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIndex];
      newStartVnode = newCh[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 尾和尾对比 依次向前追加
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIndex];
      newEndVnode = newCh[--newEndIndex];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 老的头和新的尾相同 把老的头部移动到尾部
      patch(oldStartVnode, newEndVnode);
      // insertBefore 移动或者插入真实dom
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling); 
      oldStartVnode = oldCh[++oldStartIndex];
      newEndVnode = newCh[--newEndIndex];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 老的尾和新的头相同 把老的尾部移动到头部
      patch(oldEndVnode, newStartVnode);
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldCh[--oldEndIndex];
      newStartVnode = newCh[++newStartIndex];
    } else {
      // 上述四种情况都不满足 那么需要暴力对比
      // 根据老的子节点的key和index的映射表 从新的开始子节点进行查找 如果可以找到就进行移动操作 如果找不到则直接进行插入
      let moveIndex = map[newStartVnode.key];
      if (!moveIndex) {
        // 老的节点找不到  直接插入
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
      } else {
        // 找得到就拿到老的节点
        const moveVnode = oldCh[moveIndex];
        // 占位操作 避免数组塌陷  防止老节点移动走了之后破坏了初始的映射表位置
        oldCh[moveIndex] = undefined; 
        // 把找到的节点移动到最前面
        parent.insertBefore(moveVnode.el, oldStartVnode.el);
        patch(moveVnode, newStartVnode);
      }
    }
  }

  // 如果老节点循环完毕了 但是新节点还有  新节点需要被添加到头部或者尾部
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // 这是一个优化写法 insertBefore的第一个参数是null等同于appendChild作用
      const ele =
        newCh[newEndIndex + 1] == null ? null : newCh[newEndIndex + 1].el;
      parent.insertBefore(createElm(newCh[i]), ele);
    }
  }

  // 如果新节点循环完毕 老节点还有  老节点需要直接被删除
	if (oldStartIndex <= oldEndIndex) {
		while (oldStartIndex++ <= oldEndIndex)
			if (oldCh[i] != undefined) parent.removeChild(child.el);
	}
}
```

### 4.改造原型渲染更新方法_update
改造_update 方法 在 Vue 实例的_vnode 保留上次的 vnode 节点 以供 patch 进行新老虚拟 dom 的对比
```js
// lifecycle.js

export function lifecycleMixin(Vue) {
	// 把_update挂载在Vue的原型
	Vue.prototype._update = function (vnode) {
		const vm = this;

		// 保留上一次的vnode
		// 初次渲染 vm._vnode 不存在 赋值给$el属性
		const prevVnode = vm._vnode ?? vm.$el;
		vm._vnode = vnode;

		// patch是渲染vnode为真实dom核心
		// 更新时把上次的vnode和这次更新的vnode穿进去 进行diff算法
		vm.$el = patch(prevVnode, vnode);
	};
}
```

## Mixin混入

### 1.定义全局 Mixin 函数

把 `mixin` 定义为 `Vue` 的全局方法，核心方法就是利用 `mergeOptions` 把传入的选项混入到自己的 `options` 上面。
```js
// init.js
import { mergeOptions } from "./util/index.js";

export default function initMixin(Vue){
  // ...
	Vue.mixin = function (mixin) {
		// 合并对象
		this.options = mergeOptions(this.options, mixin);
	};
};
```

### 2.mergeOptions 方法

`mergeOptions` 方法遍历父亲和儿子的属性进行合并，如果合并项有自己的合并策略，那么就是用相应的合并策略。  
这里的生命周期的合并策略 `mergeHook` 是把全部的生命周期都各自混入成了数组的形式依次调用。
```js
// util/index.js

// 定义生命周期
export const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destroyed",
];

// 合并策略
const strats = {};

//生命周期合并策略
function mergeHook(parentVal, childVal) {
	// 如果有合并项
	if (childVal) {
		if (parentVal) {
			// 合并成一个数组
			return parentVal.concat(childVal);
		} else {
			// 包装成一个数组
			return [childVal];
		}
	} else {
		return parentVal;
	}
}

// 为生命周期添加合并策略
LIFECYCLE_HOOKS.forEach(hook => {
	strats[hook] = mergeHook;
});

// mixin核心方法
export function mergeOptions(parent, child) {
	const options = {};

	// 遍历父亲
	for (const key in parent) mergeFiled(key);

	// 父亲没有 儿子有
	for (const key in child)
		if (!parent.hasOwnProperty(key)) mergeFiled(key);

	//真正合并字段方法
	function mergeFiled(key) {
		if (strats[key]) {
			options[key] = strats[key](parent[key], child[key]);
		} else {
			// 默认策略
			options[key] = child[key] ? child[key] : parent[key];
		}
	}
	return options;
}
```

### 3.生命周期的调用

把 `$options` 上面的生命周期依次遍历进行调用：
```js
// lifecycle.js

export function callHook(vm, hook) {
	// 依次执行生命周期对应的方法
	const handlers = vm.$options[hook];

	if (handlers)
		//生命周期里面的this指向当前实例
		handlers.forEach(handler => handler.call(vm));
}
```

在 `init` 初始化的时候调用 `mergeOptions` 来进行选项合并，之后在需要调用生命周期的地方运用 `callHook` 来执行用户传入的相关方法。
```js
// init.js

Vue.prototype._init = function (options) {
  const vm = this;

  //  this.$options就是用户new Vue的时候传入的属性和全局的Vue.options合并之后的结果
  vm.$options = mergeOptions(vm.constructor.options, options);

  //初始化数据之前
	callHook(vm, "beforeCreate");

  // 初始化状态
  initState(vm);

  //初始化数据之后
	callHook(vm, "created");

	// 如果有el属性 进行模板渲染
	if (vm.$options.el) vm.$mount(vm.$options.el);
};
```

在 `mountComponent` 方法里面调用相关的生命周期 `callHook`：
```js
// lifecycle.js

export function mountComponent(vm, el) {
  vm.$el = el;
  
  //初始渲染之前
  callHook(vm, "beforeMount");

  function updateComponent() {
    vm._update(vm._render());
  };

	new Watcher(
		vm,
		updateComponent,
		//更新之前
		() => callHook(vm, "beforeUpdate"),
		true
	);

	//渲染完成之后
	callHook(vm, "mounted");
}
```

## 组件注册

每一个组件都是一个继承自 `Vue` 的子类，能够使用 `Vue` 的原型方法。

### 1.全局组件注册


```js
// global-api/index.js
import initExtend from "./initExtend.js";
import initAssetRegisters from "./assets.js";

export const ASSETS_TYPE = ["component", "directive", "filter"];

export function initGlobalApi(Vue) {
	// 全局的组件 指令 过滤器
	Vue.options = {};

	ASSETS_TYPE.forEach(type => (Vue.options[type + "s"] = {}));

	// _base 指向Vue
	Vue.options._base = Vue;

	// extend方法定义
	initExtend(Vue);

	// assets注册方法 包含组件 指令和过滤器
	initAssetRegisters(Vue);
}
```

```js
// global-api/asset.js
import { ASSETS_TYPE } from "./index.js";

export default function initAssetRegisters(Vue) {
	ASSETS_TYPE.forEach(type => {
		Vue[type] = function (id, definition) {
			if (type === "component") {
				// 全局组件注册 子组件继承父组件方法  
				definition = this.options._base.extend(definition);
			}
			this.options[type + "s"][id] = definition;
		};
	});
}
```

### 2.Vue.extend 定义

`Vue.extend` 核心思路就是使用原型继承的方法返回了 `Vue` 的子类，并且利用 `mergeOptions` 把传入组件的 `options` 和父类的 `options` 进行了合并。
```js
//  global-api/initExtend.js
import { mergeOptions } from "../util/index.js";

export default function initExtend(Vue) {
	//组件的唯一标识
	let cid = 0;

	// 创建子类继承Vue父类 便于属性扩展
	Vue.extend = function (extendOptions) {
		// 创建子类的构造函数 并且调用初始化方法
		const Sub = function VueComponent(options) {
			this._init(options); //调用Vue初始化方法
		};
		Sub.cid = cid++;
		// 子类原型指向父类
		Sub.prototype = Object.create(this.prototype);
		//constructor指向自己
		Sub.prototype.constructor = Sub;
		//合并自己的 options 和父类的 options
		Sub.options = mergeOptions(this.options, extendOptions);
		return Sub;
	};
}
```

### 3.组件的合并策略

```js
// init.js

Vue.prototype._init = function (options) {
  const vm = this;
  //合并options
  vm.$options = mergeOptions(vm.constructor.options, options);
};
```

这里使用原型继承的方式来进行组件合并，组件内部优先查找自己局部定义的组件，找不到会向上查找原型中定义的组件。
```js
// util/index.js
import { ASSETS_TYPE } from "../global-api/index.js";

// 组件 指令 过滤器的合并策略
function mergeAssets(parentVal, childVal) {
  // 原型继承
	const result = Object.create(parentVal); 
	if (childVal) {
		for (const key in childVal)
			result[key.toLocaleLowerCase()] = childVal[key];
	}
	return result;
}

// 定义组件的合并策略
ASSETS_TYPE.forEach(type => {
	strats[type + "s"] = mergeAssets;
});
```

### 4.创建组件 Vnode

改写 `createElement` 方法 对于非普通 `html` 标签 就需要生成组件 `Vnode` 把 `Ctor` 和 `children` 作为 `Vnode` 最后一个参数 `componentOptions` 传入。  
这里需要注意组件的 `data.hook.init` 方法 我们手动调用 `child.$mount()` 方法 此方法可以生成组件的真实 dom 并且挂载到自身的 `$el` 属性上面 。
```js
// util/index.js

//判断是否是对象
export function isObject(data) {
	return !(typeof data !== "object" || data == null);
}

// 判断是否是组件
export function isReservedTag(tagName) {
	// 定义常见标签
	const str =
		"html,body,base,head,link,meta,style,title," +
		"address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section," +
		"div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul," +
		"a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby," +
		"s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video," +
		"embed,object,param,source,canvas,script,noscript,del,ins," +
		"caption,col,colgroup,table,thead,tbody,td,th,tr," +
		"button,datalist,fieldset,form,input,label,legend,meter,optgroup,option," +
		"output,progress,select,textarea," +
		"details,dialog,menu,menuitem,summary," +
		"content,element,shadow,template,blockquote,iframe,tfoot";
	const obj = {};
	str.split(",").forEach(tag => {
		obj[tag] = true;
	});
	return obj[tagName];
}
```

```js
// vdom/index.js
import { isObject, isReservedTag } from "../util/index.js";

// 创建元素vnode 等于render函数里面的 h=>h(App)
export function createElement(vm, tag, data = {}, ...children) {
	const key = data.key;

	if (isReservedTag(tag)) {
		// 如果是普通标签
		return new Vnode(tag, data, key, children);
	} else {
		// 否则就是组件
		const Ctor = vm.$options.components[tag]; //获取组件的构造函数
		return createComponent(vm, tag, data, key, children, Ctor);
	}
}

function createComponent(vm, tag, data, key, children, Ctor) {
	// 如果没有被改造成构造函数
	if (isObject(Ctor)) Ctor = vm.$options._base.extend(Ctor);

	// 声明组件自己内部的生命周期
	data.hook = {
		// 组件创建过程的自身初始化方法
		init(vnode) {
			//实例化组件
			const child = (vnode.componentInstance = new Ctor({
				_isComponent: true
			}));

			//因为没有传入el属性  需要手动挂载 为了在组件实例上面增加$el方法可用于生成组件的真实渲染节点
			child.$mount();
		}
	};

	// 组件vnode  也叫占位符vnode  ==> $vnode
	return new Vnode(
		`vue-component${tag}`,
		data,
		key,
		undefined,
		undefined,
		{
			Ctor,
			children
		}
	);
}
```

### 5.渲染组件真实节点

判断如果属于组件 `Vnode` 那么把渲染好的组件真实 dom `vnode.componentInstance.$el` 返回：
```js
// vdom/patch.js

// patch用来渲染和更新视图
export function patch(oldVnode, vnode) {
	// 组件的创建过程是没有el属性的
	if (!oldVnode) return createElm(vnode);

  // ....
}

// 判断是否是组件Vnode
function createComponent(vnode) {
	// 初始化组件
	// 创建组件实例
	let i = vnode.data;

	// 调用组件data.hook.init方法进行组件初始化过程
  // 最终组件的vnode.componentInstance.$el就是组件渲染好的真实dom
	if ((i = i.hook) && (i = i.init)) i(vnode);

	// 如果组件实例化完毕有componentInstance属性 那证明是组件
	if (vnode.componentInstance) return true;
}

// 虚拟dom转成真实dom
function createElm(vnode) {
	const { tag, data, key, children, text } = vnode;

	if (typeof tag === "string") {
		// 如果是组件 返回真实组件渲染的真实dom
		if (createComponent(vnode))
			return vnode.componentInstance.$el;

    // 创建真实dom...
}
```
## 侦听属性

侦听属性的写法很多，可以写成、字符串、函数、数组、以及对象。对于对象的写法自己可以增加一些 `options` 用来增强功能，侦听属性的特点是监听的值发生了变化之后可以执行用户传入的自定义方法。

### 1.侦听属性的初始化

`initWatch` 初始化 `Watch`，`createWatcher` 处理 `Watch` 的兼容性写法，包含字符串、函数、数组、以及对象、最后调用 `$watch` 传入处理好的参数进行创建用户 `Watcher`。
```js
// state.js

// 统一初始化数据的方法
export function initState(vm) {
  const opts = vm.$options;
  // ....

	// 初始化watch
	if (opts.watch) initWatch(vm);
}

// 初始化watch
function initWatch(vm) {
	const watch = vm.$options.watch;
	for (const key in watch) {
		// 用户自定义 watch 的写法可能是数组 对象 函数 字符串
		const handler = watch[key];
		if (Array.isArray(handler)) {
			// 如果是数组就遍历进行创建
			handler.forEach(handle => createWatcher(vm, key, handle));
		} else {
			createWatcher(vm, key, handler);
		}
	}
}

// 创建watcher的核心
function createWatcher(vm, exprOrFn, handler, options = {}) {
	if (typeof handler === "object") {
		//保存用户传入的对象
		options = handler;
		//这个代表真正用户传入的函数
		handler = handler.handler;
	}
	// 传入的是定义好的methods方法
	if (typeof handler === "string") handler = vm[handler];
	// 调用vm.$watch创建用户watcher
	return vm.$watch(exprOrFn, handler, options);
}
```

### 2.$watch

原型方法 `$watch` 就是创建自定义 `watch` 的核心方法，把用户定义的 `options` 和 `user:true` 传给构造函数 `Watcher`：
```js
//  render.js
import Watcher from "./observer/watcher.js";

Vue.prototype.$watch = function (exprOrFn, cb, options) {
	const vm = this;
	//  user: true 这里表示是一个用户watcher
	new Watcher(vm, exprOrFn, cb, {
		...options,
		user: true
	});
	// 如果有 immediate属性 代表需要立即执行回调
	if (options.immediate) cb();
};
```

### 3.Watcher 改造

这里主要改造有两点：
1. 实例化的时候为了兼容用户 `watch` 的写法 会将传入的字符串写法转成 `Vue` 实例对应的值 并且调用 `get` 方法获取并保存一次旧值。
2. `run` 方法判断如果是用户 `watch` 那么执行用户传入的回调函数 `cb` 并且把新值和旧值作为参数传入进去。
```js
// observer/watcher.js
import { isObject } from "../util/index.js";

export default class Watcher {
  static id = 0;
  constructor(vm, exprOrFn, cb, options) {
    // ...

    //标识用户watcher
    this.user = options.user; 

		// 如果表达式是一个函数
		if (typeof exprOrFn === "function") this.getter = exprOrFn;
		else {
			this.getter = function () {
				// 用户 watcher 传过来的可能是一个字符串
				const path = exprOrFn.split(".");
				let obj = vm;
				for (const key of path) obj = obj[key];
				return obj;
			};
		}

		// 实例化就进行一次取值操作 进行依赖收集过程
		this.value = this.get();
	}
  // ....

	run() {
		const newVal = this.get(); // 新值
		const oldVal = this.value; // 老值

		// 现在的新值将成为下一次变化的老值
		this.value = newVal;
		if (this.user && (newVal !== oldVal || isObject(newVal))) {
			// 如果两次的值不相同  或者值是引用类型 执行回调函数
			this.cb.call(this.vm, newVal, oldVal);
		} else {
			// 渲染watcher
			this.cb.call(this.vm);
		}
	}
}
```

## 计算属性

### 1.计算属性的初始化

计算属性可以写成一个函数也可以写成一个对象，对象的形式 `get` 属性就代表的是计算属性依赖的值 `set` 代表修改计算属性的依赖项的值。  
我们把 `lazy:true` 传给构造函数 `Watcher` 用来创建计算属性 `Watcher`。
```js
// state.js

function initComputed(vm) {
	const computed = vm.$options.computed;

	// 用来存放计算watcher
	const watchers = (vm._computedWatchers = {});

	for (const key in computed) {
		// 获取用户定义的计算属性
		const userDef = computed[key];

		//创建计算属性watcher使用
		const getter =
			typeof userDef === "function" ? userDef : ·serDef.get;

		// 创建计算watcher  lazy设置为true
		watchers[key] = new Watcher(vm, getter, () => {}, {
			lazy: true
		});

		defineComputed(vm, key, userDef);
	}
}
```

### 2.对计算属性进行属性劫持

`defineComputed` 方法主要是重新定义计算属性，其实最主要的是劫持 `get` 方法，也就是计算属性依赖的值，根据依赖值是否发生变化来判断计算属性是否需要重新计算。  
`createComputedGetter` 方法就是判断计算属性依赖的值是否变化的核心，我们在计算属性创建的 `Watcher` 增加 `dirty` 标志位，如果标志变为 `true` 代表需要调用 `watcher.evaluate` 来进行重新计算。
```js
//  state.js

// 定义普通对象用来劫持计算属性
const sharedPropertyDefinition = {
	enumerable: true,
	configurable: true,
	get: () => {},
	set: () => {}
};

// 重新定义计算属性  对get和set劫持
function defineComputed(target, key, userDef) {
	sharedPropertyDefinition.get = createComputedGetter(key);
	if (typeof userDef !== "function")
		sharedPropertyDefinition.set = userDef.set;

	// 利用Object.defineProperty来对计算属性的get和set进行劫持
	Object.defineProperty(target, key, sharedPropertyDefinition);
}

// 重写计算属性的get方法 来判断是否需要进行重新计算
function createComputedGetter(key) {
	return function () {
		// 获取对应的计算属性watcher
		const watcher = this._computedWatchers[key];

		if (watcher && watcher.dirty)
			// 计算属性取值的时候 如果是新的  需要重新求值
			watcher.evaluate();

		return watcher.value;
	};
}
```

### 3.Watcher 改造

主要改造有四点：
1. 实例化的时候如果是计算属性，不会去调用 `get` 方法访问值进行依赖收集。
2. `update` 方法只是把计算 `watcher` 的 `dirty` 标识为 `true`，只有当下次访问到了计算属性的时候才会重新计算。
3. 新增 `evaluate` 方法专门用于计算属性重新计算。
4. 新增 `depend` 方法 让计算属性的依赖值收集外层 `watcher`。
```js
// observer/watcher.js

export default class Watcher {
  static id = 0;
  constructor(vm, exprOrFn, cb, options) {
    // ...

    // 标识计算属性watcher
    this.lazy = options.lazy;
    // dirty可变  表示计算watcher是否需要重新计算 默认值是true
    this.dirty = this.lazy; 

    // ...

		// 实例化就进行一次取值保留操作 进行依赖收集过程
		// 计算属性实例化的时候不会去调用get
		this.value = this.lazy ? undefined : this.get();
  }

  // ....

	get() {
		// 在调用方法之前先把当前watcher实例推到全局Dep.target上
		pushTarget(this);
		//如果watcher是渲染watcher 那么就相当于执行  vm._update(vm._render()) 这个方法在render函数执行的时候会取值 从而实现依赖收集
		const result = this.getter.call(this.vm);
		// 在调用方法之后把当前watcher实例从全局Dep.target移除
		popTarget();
		return result;
	}

	// 更新视图
	update() {
		// 计算属性依赖的值发生变化 只需要把dirty置为true  下次访问到了重新计算
		if (this.lazy) {
			this.dirty = true;
		} else {
			// 每次watcher进行更新的时候  是否可以让他们先缓存起来  之后再一起调用
			// 异步队列机制
			queueWatcher(this);
		}
	}

	// 计算属性重新进行计算 并且计算完成把dirty置为false
	evaluate() {
		this.value = this.get();
		this.dirty = false;
	}

	depend() {
		// 计算属性的watcher存储了依赖项的dep
		let i = this.deps.length;
		// 调用依赖项的dep去收集渲染watcher
		while (i--) this.deps[i].depend();
	}
}
```

### 4.外层 Watcher 的依赖收集

```js
// state.js

// 重写计算属性的get方法 来判断是否需要进行重新计算
function createComputedGetter(key) {
	return function () {
		// 获取对应的计算属性watcher
		const watcher = this._computedWatchers[key];

		if (watcher && watcher.dirty) {
			// 计算属性取值的时候 如果是新的  需要重新求值
			watcher.evaluate();
			// 如果Dep还存在target 这个时候一般为渲染watcher 计算属性依赖的数据也需要收集
			if (Dep.target) watcher.depend();
		}
		return watcher.value;
	};
}
```

## mini-vue

### 文件目录

```yaml
├─compiler
│      codegen.js
│      index.js
│      parse.js
│      
├─global-api
│      assets.js
│      index.js
│      initExtend.js
│      
├─observer
│      array.js
│      dep.js
│      index.js
│      scheduler.js
│      watcher.js
│      
├─util
│      index.js
│      next-tick.js
│      
├─vdom
│      index.js
│      patch.js
│      
│  index.html
│  index.js
│  init.js
│  lifecycle.js
│  main.js
│  render.js
│  state.js
│  
```

### mini-vue

把上面手写的Vue2各部分代码汇总就能实现拉👌
  
这里使用用一个简易模板：
```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Document</title>
	<style>
		button {
			width: 80px;
			height: 40px;
			background: skyblue;
		}
	</style>
</head>

<body>
	<div id="app" class="active" style="background-color:black;color:white;">
		<Demo></Demo>

		<p>计算属性：{{ getTenNum }}</p>

		<h2 class="black">{{ num }}</h2>
		<h2 title="hello">{{ arr }}</h2>

		<P>控制num:</P>
		<button id="add" onclick="add()">+1</button>
		<button id="reduce" onclick="reduce()">-1</button>

		<p>控制arr:</p>
		<button id="push" onclick="push()">+1</button>
		<button id="pop" onclick="pop()">-1</button>
	</div>

	<script src="./main.js" type="module"></script>
</body>

</html>
```

Vue实例化：
```js
// main.js
import Vue from "./index.js";

Vue.mixin({
	created() {
		console.log("我是全局混入的created");
	}
});

const vm = new Vue({
	el: "#app",

	data: () => ({
		num: 11,
		arr: [1, 2, 3]
	}),

	components: {
		Demo: {
			data: () => ({
				msg: "Hello Vue"
			}),
			template: `<h1>我是子组件 {{ msg }}</h1>`
		}
	},

	computed: {
		getTenNum() {
			return this.num * 10;
		}
	},

	watch: {
		num: {
			deep: true,
			handler(newValue, oldValue) {
				console.log("newValue", newValue);
				console.log("oldValue", oldValue);
			}
		}
	},

	beforeCreate() {
		console.log("beforeCreate");
	},

	created() {
		console.log("我是自己的created");
	},

	beforeMount() {
		console.log("beforeMount");
	},

	mounted() {
		console.log("mounted");
	}
});

window.add = function () {
	vm.num++;
};

window.reduce = function () {
	vm.num--;
};

window.push = function () {
	vm.arr.push((vm.arr.at(-1) ?? 0) + 1);
};

window.pop = function () {
	vm.arr.pop();
};

console.log(vm);
```

效果如下：  
  
![Alt text](@/vue/mini-vue.gif)