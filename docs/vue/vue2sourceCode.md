---
sidebar: auto
---

#  Vue2 源码解读

源码阅读中...

## 响应式原理

### 1.数据初始化

```js
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
});
```

用 `new` 操作符进行 `Vue` 实例化,可以看出 Vue 其实就是一个构造函数，这里传入的参数就是一个对象 `options` （选项）

```js
// Vue就是一个构造函数 通过new关键字进行实例化
function Vue(options) {
  // Vue初始化工作
  this._init(options);
}

// _init方法是挂载在Vue原型的方法

// 实际文件划分文件引入，有利于代码分割
initMixin(Vue);
```

`initMixin` 把 `_init` 方法挂载在 `Vue` 原型 供 `Vue` 实例调用
```js
function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    // 这里的this代表调用_init方法的对象(实例对象)
    //  this.$options就是用户new Vue的时候传入的属性
    vm.$options = options;
    // 初始化状态
    initState(vm);
  };
}
```

这里进行数据初始化，响应式数据核心是 `observe`
```js
// 这里初始化的顺序依次是 prop>methods>data>computed>watch
function initState(vm) {
  // 获取传入的数据对象
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethod(vm);
  }
  if (opts.data) {
    // 初始化data
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}

// 初始化data数据
function initData(vm) {
	let data = vm.$options.data;
	// 实例的_data属性就是传入的data
	// vue组件data推荐使用函数 防止数据在组件之间共享
	data = vm._data =
		typeof data === "function" ? data.call(vm) : data || {};

	// 把data数据代理到vm 也就是Vue实例上面 我们可以使用this.a来访问this._data.a
	for (let key in data) {
		proxy(vm, `_data`, key);
	}
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
    },
  });
}
```

### 2.对象的数据劫持

::: tip
* 数据劫持核心是 `defineReactive` 函数，主要使用 `Object.definePropert`y 来对数据 `get` 和 `set` 进行劫持
  
* 对于数组，如果对每一个元素下标都添加 `get` 和 `set` 方法，当数组里的元素太多，对于性能来说是承担不起的， 所以此方法只用来劫持对象
  
* 对象新增或者删除的属性无法被 `set` 监听到，只有对象本身存在的属性修改才会被劫持
:::

```js
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

// Object.defineProperty数据劫持核心 兼容性在ie9以及以上
function defineReactive(data, key, value) {
	observe(value); // 递归关键
	// 递归，直到value不是对象才停止
	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: true,
		get() {
			return value;
		},
		set(newValue) {
			if (newValue === value) return;
			value = newValue;
		}
	});
}

function observe(value) {
	// 如果传过来的是对象或者数组 进行属性劫持
	const type = Object.prototype.toString.call(value);
	if (type === "[object Object]" || type === "[object Array]")
		return new Observer(value);
}
```

### 3.数组的观测

```js
class Observer {
	constructor(value) {
		if (Array.isArray(value)) {
			// 这里对数组做了额外判断
			// 通过重写数组原型方法来对数组的七种方法进行拦截
			value.__proto__ = arrayMethods;
			// 如果数组里面还包含数组 需要递归判断
			this.observeArray(value);
		} else this.walk(value);
	}
	observeArray(items) {
		items.forEach(item => observe(item));
	}
}
```

给每个响应式数据增加了一个不可枚举的__ob__属性，并且指向了 Observer 实例。
  
这样做可以根据这个属性来防止已经被响应式观察的数据反复被观测，其次，响应式数据可以使用 `__ob__` 来获取 `Observer` 实例的相关方法，这对数组很关键。
```js
class Observer {
  // 观测值
  constructor(value) {
    Object.defineProperty(value, "__ob__", {
      // 值指代的就是Observer的实例
      value: this,
      // 不可枚举
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }
}
```

```js
// 先保留数组原型
const arrayProto = Array.prototype;
// 然后将arrayMethods继承自数组原型
// 这里是面向切片编程思想（AOP）--不破坏封装的前提下，动态的扩展功能
const arrayMethods = Object.create(arrayProto);
let methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "reverse",
  "sort",
];
methodsToPatch.forEach((method) => {
  arrayMethods[method] = function (...args) {
    // 这里保留原型方法的执行结果
    const result = arrayProto[method].apply(this, args);
    // this代表的就是数据本身 
    // 这个属性就是上段代码增加的 代表的是该数据已经被响应式观察过了指向Observer实例
    const ob = this.__ob__;

    // 这里的标志就是代表数组有新增操作
    let inserted = null;
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
    // 如果有新增的元素 inserted是一个数组 调用Observer实例的observeArray对数组每一项进行观测
    if (inserted !== null) ob.observeArray(inserted);
    // 数组的检测更新后面再说
    return result;
  };
});
```


## 模板编译

在 `Vue.$mount` 过程中，`Vue` 把模版编译成 `render` 函数，这个过程就是模板编译，其核心实现方法可以分为三步：
1. `parse`： 解析模版 `template` 生成 `AST` 语法树
  
2. `optimize`： 优化 `AST` 语法树，标记静态节点
   
3. `codegenChildren`： 把优化后的 `AST` 语法树转换生成 `render` 方法代码字符串，利用模板引擎生成可执行的 `render` 函数（`render` 执行后返回的结果就是虚拟DOM，即以 `VNode` 节点作为基础的树）
   
### 1.入口
```js
function initMixin(Vue) {
  // ...
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);

    // 如果不存在render属性
    if (!options.render) {
      // 如果存在template属性
      let template = options.template;

      if (!template && el) {
        // 如果不存在render和template 但是存在el属性 直接将模板赋值到el所在的外层html结构（就是el本身 并不是父元素）
        template = el.outerHTML;
      }

      // 最终需要把template模板转化成render函数
      if (template) {
        // 这里对模板进行编译
        const render = compileToFunctions(template);
        options.render = render;
      }
    }
  };
}
```

### 2.模板转化核心方法 `compileToFunctions`
```js
function compileToFunctions(template) {
  // 1.解析模版template生成 AST语法树
  // ast用来描述代码本身形成树结构 不仅可以描述html 也能描述css以及js语法
  const ast = parseHTML(template);

  // 2.优化AST语法树，标记静态节点
  optimize(ast)

  // 3.把优化后的 AST语法树转换生成render方法代码字符串，利用模板引擎生成可执行的 
  const code = codegenChildren(ast);
  // 使用with语法改变作用域为this  之后调用render函数可以使用call改变this 方便code里面的变量取值
  const render = new Function(`with(this){return ${code}}`);
  return render;
}
```

### 3.解析 html 并生成 ast

#### 源码的正则匹配
```js
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
let root = null, currentParent = null; 
// 栈结构 先进后出 来表示开始和结束标签
const stack = [];
// 标识元素和文本type
const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;
// 生成ast方法
function createASTElement(tagName, attrs) {
  return {
    tag: tagName, // 标签名
    type: ELEMENT_TYPE, // 类型
    children: [],
    attrs, // 属性
    parent: null,
  };
}
```

#### 标签处理
```js
// 对开始标签进行处理
function start({ tagName, attrs }) {
  const element = createASTElement(tagName, attrs);
  root = root ?? element
  // 建立parent和children关系
  if (currentParent !== null) {
    // 只赋予了parent属性
    node.parent = currentParent;
    // 还需要让父亲记住自己
    currentParent.children.push(node);
  }
  currentParent = element;
  stack.push(element);
}

// 对结束标签进行处理
function end(tagName) {
  // 栈结构 当遇到第一个结束标签时 会匹配到栈顶元素对应的ast 并取出来
  const element = stack.pop();
  // 当前父元素就是栈顶的上一个元素
  currentParent = stack.at(-1);
}

// 对文本进行处理
function chars(text) {
  // 去掉空格
  text = text.replace(/\s/g, "");
  if (text !== "") {
    currentParent.children.push({
      type: TEXT_TYPE,
      text,
    });
  }
}
```

#### 解析标签生成ast核心

使用 `while` 循环 `html` 字符串，利用正则去匹配开始标签、文本内容和闭合标签，然后执行 `advance` 方法将匹配到的内容在原 `html` 字符串中剔除，直到 `html` 字符串为空，结束循环：
```js
function parseHTML(html) {
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
      //匹配到了开始标签 就截取掉
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
          value: attr[3] || attr[4] || attr[5] || true, 
        });
      }

      // 如果不是开始标签的结束
     if (end) {
        advance(end[0].length)
      }
      return match
    }
    return false
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
* **_c**: 执行 createElement创建虚拟节点
* **_v**: 执行 createTextVNode创建文本虚拟节点
* **_s**: 处理变量 我们会在Vue原型上扩展这些方法
:::

实现一个简单的codegen方法，深度遍历AST树去生成render代码字符串：
```js
// 匹配花括号 {{  }} 捕获花括号里面的内容
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; 

function genChildren(node) {
  // 判断节点类型
  // 源码这块包含了复杂的处理  比如 v-once v-for v-if 自定义指令 slot 等等  
  // 这里只考虑普通文本和变量表达式 {{ }} 的处理

  // 如果是元素类型
  if (node.type == 1) {
    // 递归创建
    return codegenChildren(node);
  } else {
    // 如果是文本节点
    const text = node.text;

    // 不存在花括号变量表达式
    if (!defaultTagRE.test(text)) 
      return `_v(${JSON.stringify(text)})`;
    
    // 正则是全局模式 每次需要重置正则的lastIndex属性  不然会引发匹配bug
    let lastIndex = defaultTagRE.lastIndex = 0;
    const tokens = [];
    let match, index;

    while ((match = defaultTagRE.exec(text))) {
      // index代表匹配到的位置
      index = match.index;
      if (index > lastIndex) {
        // 匹配到 '{{ }}' 在tokens里面放入普通文本
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      // 放入捕获到的变量内容
      tokens.push(`_s(${match[1].trim()})`);
      // 匹配指针后移
      lastIndex = index + match[0].length;
    }
    // 如果匹配完了花括号  text里面还有剩余的普通文本 那么继续push
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }
    // _v表示创建文本
    return `_v(${tokens.join("+")})`;
  }
}

// 处理attrs属性
function genChildrenProps(attrs) {
  let str = "";
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    // 对attrs属性里面的style做特殊处理
    if (attr.name === "style") {
      let obj = {};
      attr.value.split(";").forEach((item) => {
        let [key, value] = item.split(":");
        obj[key] = value;
      });
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}

// 生成子节点 调用genChildren函数进行递归创建
function getChildren(el) {
  const children = el.children;
  if (children.length !== 0) 
    return `${children.map(c => genChildren(c)).join(",")}`;
}

// 递归创建生成code
function codegenChildren(el) {
  const children = getChildren(el);
  const code = `_c('${el.tag}',${
    el.attrs.length ? `${genChildrenProps(el.attrs)}` : "undefined"
  }${children ? `,${children}` : ""})`;
  return code;
}
```

#### 6.code 字符串生成 render 函数
```js
const code = codegenChildren(ast);
// 使用with语法改变作用域为this  之后调用render函数可以使用call改变this 方便code里面的变量取值 比如 name值就变成了this.name
const render = new Function(`with(this){return ${code}}`);
return render;
```

## 初始渲染

## 渲染更新

## 异步更新

## diff算法



## 计算属性

## 侦听属性
