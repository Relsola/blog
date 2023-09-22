---
sidebar: auto
---

# vue2 基础

## 创建vue项目
创建vue2项目这里推荐使用vue官方脚手架工具 `vue cli`<br>
[Vue CLI 中文官网](https://cli.vuejs.org/zh/)

####  安装 vue cli
```bash
 npm i @vue/cli -g 
 # OR
 yarn global add @vue/cli
```
####  创建项目
```bash
 vue create my-project
 # OR
 vue ui
```

## Vue 基础语法

### vue 实例

#### 模板语法
::: tip
`Vue.js` 使用了基于 `HTML` 的模板语法，允许开发者声明式地将 DOM 绑定至底层 Vue 实例的数据。所有 Vue.js 的模板都是合法的 HTML，所以能被遵循规范的浏览器和 HTML 解析器解析。

在底层的实现上，Vue 将模板编译成虚拟 DOM 渲染函数。结合响应系统，Vue 能够智能地计算出最少需要重新渲染多少组件，并把 DOM 操作次数减到最少。
:::

#### 文本插值
::: tip
vue中数据绑定最常见的形式就是使用“Mustache”语法 (双大括号) 的文本插值。  
`{{}}`语法本质就是`v-text`指令的语法糖   
通过使用`v-once`指令，执行一次性地插值，当数据改变时，插值处的内容不会更新。
:::
```vue
<!-- v-text不会识别html标签 -->
<div v-text="'<h1>Hello Vue</h1>'"></div>
<!-- v-html会识别html标签 -->
<div v-html="'<h1>Hello Vue</h1>'"></div>
```


#### 响应式数据
::: tip
当一个`Vue`实例被创建时，它将`data`对象中的所有的`property`加入到`Vue`的响应式系统中。当这些`property`的值发生改变时，视图将会产生“响应”，即匹配更新为新的值。
:::

#### data为什么是一个函数
::: tip
因为组件会复用，只有每个组件实例维护一份独立拷贝，才不会相互影响。  
如果组件不服用（比如根组件），`data`使用对象形式也可以，但不推荐。
:::

```vue
<template>
  <div>
    <h1>{{ msg }}</h1>

    <h2>{{ 1 + 1 }}</h2>
  </div>
</template>

<script>
export default {
  data: () => ({ 
    msg: "Hello Vue",
  }),
};
</script>
```

### 事件绑定

* 通过`v-on`指令加事件名来绑定事件，一般用简写的方式，用`@`代替`v-on`。
* 一个元素可以同时绑定多个事件，但是一般情况下只是绑定一个。
* 绑定的事件可以是一个JavaScript表达式或者自定义事件（自定义事件只能写在`methods`对象里）。
* 绑定的自定义事件如果不传参默认第一个参数是事件对象。
* 如果既想传参又想获取事件对象，可以使用`$event`。

```vue
<template>
  <div>
    <h1>{{ num }}</h1>

    <button v-on:click="num+=1">num++</button>

    <button v-on:click="numAdd">num++</button>
    <button @click="numReduce(3, 1)">num--</button>

    <button @click="getElement">7</button>
    <!-- 既传参 又传事件对象 -->
    <button @click="getAll(0x4e00, 0x9fff, $event)">对</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    num: 10,
  }),

  methods: {
    numAdd() {
      this.num += 1;
    },

    numReduce(num1, num2) {
      this.num -= num1 >> num2;
    },

    getElement: (e) => {
      // 不传参默认第一个参数是事件对象
      let num = e.target.innerText;
      num = Number(num);
      num++;
      e.target.innerText = num;
    },

    getAll: (val1, val2, e) => {
      e.target.innerText = val1+val2;
    },
  },
};
</script>
```

### 修饰符
::: tip
修饰符 (modifier) 是以半角句号 . 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。  
:::

```vue
<!-- 阻止单击事件继续传播 -->
<a @click.stop="doThis"></a>

<!-- 取消默认事件 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰符链式调用，先左后右-->
<a @click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form @submit.prevent></form>

<!-- 
  只当在 event.target 是当前元素自身时触发处理函数
  即事件不是从内部元素触发的
 -->
<div v-on:click.self="doThat">...</div>
```

::: tip
`.capture`、`.once`和`.passive`修饰符与原生`addEventListener`事件相对应。  
添加事件监听器时，使用 `capture` 捕获模式。  
例如：指向内部元素的事件，在被内部元素处理前，先被外部处理  
:::

```vue
<!-- 
  添加事件监听器时使用事件捕获模式
  即内部元素触发的事件先在此处理，然后才交由内部元素进行处理
 -->
<div v-on:click.capture="doThis">...</div>

<!-- 点击事件最多被触发一次 -->
<a @click.once="doThis"></a>

<!-- 
  滚动事件的默认行为 (scrolling) 将立即发生而非等待 `onScroll` 完成
  以防其中包含 event.preventDefault()
 -->
<div @scroll.passive="onScroll">...</div>
```

::: tip
在监听键盘事件时，我们经常需要检查详细的按键，`Vue`允许为`v-on`在监听键盘事件时添加按键修饰符，你可以直接将`KeyboardEvent.key`暴露的任意有效按键名转换为`kebab-case`来作为修饰符，`Vue`本身也提供了绝大多数常用的按键码的别名。
:::
```vue
<!-- $event.key 等于 PageDown 调用 onPageDown -->
<input v-on:keyup.page-down="onPageDown" />

<!-- 仅在 $event.key 为 Enter 时调用 submit -->
<input @keyup.enter="submit" />

<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + 点击 -->
<div @click.ctrl="doSomething">Do something</div>
```

::: tip
`.exact`修饰符允许控制触发一个事件所需的确定组合的系统按键修饰符
:::
```vue
<!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 仅当没有按下任何系统按键时触发 -->
<button @click.exact="onClick">A</button>
```

### v-bind指令
::: tip
`v-bind`指令可以用于响应式地更新标签属性
:::
```vue
<a v-bind:href="url">...</a>
```
在这里`href`是参数，告知`v-bind`指令将该元素的`href`属性与表达式`url`的值绑定。  

#### `v-bind`缩写
由于`v-bind`使用的比较频繁，`Vue`为`v-bind`也提供了特定简写。
```vue
<!-- 完整语法 -->
<a v-bind:href="url">...</a>

<!-- 缩写 -->
<a :href="url">...</a>

<!-- 动态参数的缩写 (2.6.0+) -->
<a :[key]="url"> ... </a>
```

### 条件渲染

#### `template`标签
`template`标签用于包裹，不会渲染到页面上，可以划分代码块。

#### v-if 和 v-show
::: tip
* `v-if`和`v-show`都是接收一个布尔值决定是否渲染DOM。
* `v-if`可以和`v-else-if`连用，效果和`if..else if`一致。
* `v-if`是正真的条件渲染，`v-show`是渲染然后控制`display`属性显示隐藏。
* `v-if`有着较好的初始性能开销，但如果标签渲染需要频繁切换，`v-show`会有更好的性能开销
:::

```vue
<!-- v-if 和 v-else-if -->
<template>
  <button @click="toggle">切换num</button>
  <p v-if="num === 1">num === 1</p>
  <p v-else-if="num === 0">num === 0</p>
  
  <p v-show="num === 1">num === 1</p>

  <!-- 用于控制是否渲染一堆标签 -->
  <template v-if="show">
    <h1>Title</h1>
    <p>Paragraph 1</p>
    <p>Paragraph 2</p>
  </template>
</template>

<script>
export default {
  data: () => ({
    num: 1,
    show: false,
  }),

  methods: {
    toggle() {
      this.num ^= 1;
    },
  },
};
</script>
```

### 列表渲染
::: tip
`vue`中提供了`v-for`指令基于一个数组等来渲染一个列表。
:::

#### 渲染数组
`v-for`指令需要使用`item in items`形式的特殊语法，其中`items`是源数据数组，而`item`则是被迭代的数组元素的别名。
```vue
<p v-for="item in Data" >{{ item.name }}</p>
```

`v-for`还支持一个可选的第二个参数，即当前项的索引。
```vue
<ul>
  <li v-for="(item, index) in items">
    {{ index }} - {{ item }}
  </li>
</ul>
```

也可以用`of`替代`in`作为分隔符。
```vue
<div v-for="item of items"></div>
```

#### 渲染对象
::: tip
`v-for`遍历一个对象有三个参数，第一个参数是对象的值，后两个参数可选（键名和索引），在遍历对象时，会按` Object.keys()`的结果遍历。
:::
```vue
<div v-for="(value, name, index) in object">
  {{ index }}. {{ name }}: {{ value }}
</div>
```

#### 用`key`管理可复用的元素
::: tip
Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染，这么做会使 Vue 变得高效。  
为了给 Vue 一个提示，以便它能跟踪每个节点的身份，从而重用和重新排序现有元素，你需要为每项提供一个唯一`key`属性。  
建议尽可能在使用`v-for`时提供`key`属性，除非遍历输出的 DOM 内容非常简单，或者是刻意依赖默认行为以获取性能上的提升。  
:::

```vue
<div v-for="item in items" v-bind:key="item.id">...</div>
```

#### 数组更新检测
::: tip
Vue 不能检测数组和对象的变化。
:::


#### `v-for`与`v-if`一同使用
::: warning 注意
极不推荐在同一元素上使用`v-if`和`v-for`，非要用记住`v-for`的优先级高于`v-if`。  

解决方案：
* 在`v-for`的外层或内层包裹一个元素来使用`v-if`
* 用[computed](#计算属性)计算属性处理
:::

### 双向绑定

#### v-model

### 计算属性

### 监听器

### 动态类名

### 动态行类样式

## Vue常用API