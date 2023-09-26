---
sidebar: auto
---

# Vue2 基础

## 创建 Vue 项目
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

### Vue 实例

#### 模板语法
::: tip
`Vue.js` 使用了基于 `HTML` 的模板语法，允许开发者声明式地将 DOM 绑定至底层 Vue 实例的数据。所有 Vue.js 的模板都是合法的 HTML，所以能被遵循规范的浏览器和 HTML 解析器解析。

在底层的实现上，Vue 将模板编译成虚拟 DOM 渲染函数。结合响应系统，Vue 能够智能地计算出最少需要重新渲染多少组件，并把 DOM 操作次数减到最少。
:::

#### 文本插值
::: tip
`Vue` 中数据绑定最常见的形式就是使用“Mustache”语法 (双大括号) 的文本插值。  
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
* `v-if`是是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。，`v-show`是渲染然后控制`display`属性显示隐藏。
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

#### 渲染函数
甚至可以渲染一个函数的返回值：

```html
<div v-for="set in sets">
  <span v-for="n in even(set)">{{ n }}</span>
</div>
```

```js
data: () => ({
    sets: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]],
  }),

  methods: {
    even: numbers => numbers.filter(number => number % 2 === 0)
  }
```

#### 渲染数字和字符串
::: tip
渲染数字和字符串会将模板重复属性`length`次。  
数字的索引从`1`开始
:::
```html
<span v-for="item in 'Date'">
  {{ item }}
</span>

<span v-for="(item, index) in 3" > 
  {{ item }}
</span>
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
`v-if` 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。  
Vue 不能检测数组和对象的变化。但Vue重写了以下数组方法，使用它们也能触发视图更新：
* `push()`
* `pop()`
* `shift()`
* `unshift()`
* `splice()`
* `sort()`
* `reverse()`
:::

#### 替换数组
使用如 `filter()`、`concat()` 和 `slice()`等方法返回一个新数组，也可以重新渲染整个列表，Vue 为了使得 DOM 元素得到最大范围的重用而实现了一些智能的启发式方法，所以用一个含有相同元素的数组去替换原来的数组是非常高效的操作。
```js
example1.items = example1.items.filter(item => item.id > 100)
```

#### 在 `<template>` 上使用 `v-for`
可以利用带有 `v-for` 的 `<template>` 来循环渲染一段包含多个元素的内容。比如：
```vue
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

#### `v-for`与`v-if`一同使用
::: warning 注意
极不推荐在同一元素上使用`v-if`和`v-for`，非要用记住`v-for`的优先级高于`v-if`。  

解决方案：
* 在`v-for`的外层或内层包裹一个元素来使用`v-if`
* 用[computed](#计算属性)计算属性处理
:::

### 双向绑定

::: tip
`v-model` 指令在表单 `<input>`、`<textarea>` 及 `<select>` 元素上可以创建双向数据绑定，它会根据控件类型自动选取正确的方法来更新元素。 `v-model` 本质上不过是语法糖，它负责监听用户的输入事件以更新数据，并对一些极端场景进行一些特殊处理。
:::

`v-model` 在不同的元素使下的语法糖：
* `text` 和 `textarea` 元素使用 `value` property 和 `input` 事件
* `checkbox` 和 `radio` 使用 `checked` property 和 `change` 事件
* `select` 字段将 `value` 作为 prop 并将 `change` 作为事件

::: warning 注意
`v-model` 会忽略所有表单元素的 `value`、`checked`、`selected`
:::

#### 文本
```vue
<input v-model="message"/>
```

#### 多行文本
```vue
<textarea v-model="message"></textarea>
```

#### 复选框
单个复选框，绑定到布尔值：
```vue
<input type="checkbox" v-model="checked"/>
```
多个复选框，绑定到同一个数组：
```vue
<input type="checkbox" value="Jack" v-model="checkedNames"/>
<input type="checkbox" value="John" v-model="checkedNames"/>
<input type="checkbox" value="Mike" v-model="checkedNames"/>
```

#### 单选按钮
```vue
<input type="radio" value="One" v-model="picked"/>
<input type="radio" value="Two" v-model="picked"/>
```

#### 选择框
单选时，绑定一个值：
```vue
<select v-model="selected">
  <option disabled value="">请选择</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```
多选时，绑定到一个数组：
```vue
<select v-model="selected" multiple style="width: 50px;">
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

#### 值绑定
对于单选按钮，复选框及选择框的选项，`v-model` 绑定的值通常是静态字符串 (对于复选框也可以是布尔值)：
```vue
<!-- 当选中时，`picked` 为字符串 "a" -->
<input type="radio" v-model="picked" value="a"/>

<!-- `toggle` 为 true 或 false -->
<input type="checkbox" v-model="toggle"/>

<!-- 当选中第一个选项时，`selected` 为字符串 "abc" -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

#### 复选框
```html
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no"
>
```
```js
// 当选中时
this.toggle === 'yes'
// 当没有选中时
this.toggle === 'no'
```

#### 单选按钮
```html
<input type="radio" v-model="pick" v-bind:value="a">
```
```js
// 当选中时
this.pick === vm.a
```

#### 选择框的选项
```html
<select v-model="selected">
    <!-- 内联对象字面量 -->
  <option v-bind:value="{ number: 123 }">123</option>
</select>
```
```js
// 当选中时
typeof this.selected // => 'object'
this.selected.number // => 123
```

#### 修饰符
`.lazy`  
将`input`事件转为 `change` 事件语法糖：
```html
<!-- 在“change”时而非“input”时更新 -->
<input v-model.lazy="msg">
```

`.number`
自动将`value`首尾空白符：
```html
<input v-model.number="age" type="number">
```

`.trim`
过滤`value`值转为`number`类型：
```html
<input v-model.trim="msg">
```

[组件中的v-model绑定](#自定义组件的-v-model)

### 计算属性

#### 计算属性的 `getter`
```vue
<template>
  <div>
    <p>{{ num }}</p>
    <p>{{ getNum }}</p>
    <button @click="handle">SET</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    num: 9,
  }),

  methods: {
    handle() {
      this.num++;
    },
  },

  // 计算属性
  computed: {
    getNum() {
      console.log(this.num);
      return ~this.num + 1;
    },
  },
};
</script>
```
这里我们声明了一个计算属性 `getNum`。我们提供的函数将用作 `this.getNum` 的 `getter` 函数。 `this.getNum` 的值始终取决于 `this.num` 的值。

::: tip
* 你可以像绑定普通 `property` 一样在模板中绑定计算属性
* 计算属性是基于它们的响应式依赖进行缓存的，只在相关响应式依赖发生改变时它们才会重新求值
* 计算属性的 `getter` 函数是没有副作用 (side effect) 的
* 对于任何复杂逻辑，都建议使用计算属性
:::

#### 计算属性的 setter

计算属性默认只有 getter，不过在需要时你也可以提供一个 setter：
```vue
<template>
  <div>
    <p>{{ num }}</p>
    <p>{{ getDoubleNum }}</p>
    <button @click="handle">SET</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    num: 9,
  }),

  methods: {
    // 触发计算属性set，直接赋值
    handle() {
      this.getDoubleNum = 10;
    },
  },

  computed: {
    // set函数是当你去设置计算属性的值的时候调用的
    getDoubleNum: {
      get() {
        console.log("get...");
        return this.num * 2;
      },
      set(val) {
        console.log("set...");
        console.log(val);
        this.num += val;
      },
    },
  },
};
</script>
```

### 监听器

虽然计算属性在大多数情况下更合适，但有时也需要一个自定义的侦听器来响应数据的变化，当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的。

```vue
<template>
  <div>
    <h2>{{ msg }}</h2>

    <p>{{ data[0].name }}</p>

    <button @click="handle">点我一下</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    msg: "Hello Vue2",
    data: [
      { id: 1, name: "Vue2" },
      { id: 2, name: "react" },
    ],
    xx: { id: 1, name: "Vue2" },
  }),

  methods: {
    handle() {
      this.data[0].num = this.data[0].num ?? 1;
      const num = (this.data[0].num ^= 1);
      this.data[0].name = num === 1 ? "Vue2" : "Vue3";
      this.xx.name = this.data[0].name;
      this.msg = "Hello " + this.data[0].name;
    },
  },

  watch: {
    // 监听的值发生改变就会触发
    // 简写函数形式
    msg() {
      console.log(this.msg);
    },

    // 对象模式，可以进行配置 
    data: {
      // 表示深度侦听
      deep: true, 
      // 立即侦听 刚打开页面的时候就会侦听到一次
      immediate: true,
      // 自己用于解决引用数据类型监听旧值 
      value: null, 

      // handler名字是固定的
      handler(newVal, oldVal) {
        if (oldVal === undefined) this.value = [...newVal];
        console.log(newVal, this.value);
        this.value = [...newVal];
      },
    },

    // 适用于对象，监听引用数据旧值
    "xx.name"(newVal, oldVal) {
      console.log(newVal, oldVal);
    },
  },
};
</script>
```

### 动态类名

#### 对象语法
我们可以传给 v-bind:class 一个对象，以动态地切换 class：
```html
<div v-bind:class="{ active: isActive }"></div>
```
上面的语法表示 `active` 这个 `class` 存在与否将取决于数据 `isActive` 的 布尔值。  

对象中可以传入多个 `class`，此外 `v-bind:class` 指令也可以与普通的 `class` 属性共存。例如：

```vue
<div
  class="static"
  v-bind:class="{ active: isActive, 'text-danger': hasError }"
></div>
```
data：
```js
data: {
  isActive: true,
  hasError: false
}
```
结果渲染为：
```html
<div class="static active"></div>
```

可以简写如下形式：
```html
<div :class="classObject"></div>
```
```js
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```

计算属性写法：
```html
<div v-bind:class="classObject"></div>
```
```js
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

#### 数组语法
我们可以把一个数组传给 v-bind:class，以应用一个 class 列表：
```html
<div v-bind:class="[activeClass, errorClass]"></div>
```
```js
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```
渲染为：
```html
<div class="active text-danger"></div>
```

数组语法中也可以使用对象语法：
```html
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

#### 三元表达式
如果你也想根据条件切换列表中的 class，可以用三元表达式：
```html
<div v-bind:class="isActive ? activeClass : ''"></div>
```

### 动态行类样式

::: tip
动态行类样式语法和动态类名语法基本一致  
动态类名的对象属性要转换成小驼峰写法
:::

####  对象语法
```html
<p :style="{ backgroundColor: 'skyblue', borderRadius: '50px' }"></p>
```

#### 数组语法
```html
<p :style="[{ backgroundColor: flag }, { borderRadius: '50px' }]"></p>
```

#### 三元表达式
```html
<p :style="{ display: isHide ? 'none' : 'block' }"></p>
```

## Vue2 组件

### 组件注册

#### 局部注册
定义组件：
```vue
<template>
  <div>
    <h2>{{ counter }}</h2>
    <button @click="onClick">点我一下</button>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      counter: 1,
    }
  },

  methods:{
    onClick(){
      this.counter+=1;
    }
  }
};
</script>
```

注册组件
```js
// 引入该组件
import Demo from "@/components/Demo.vue";

// 在 `export default` 中的 `components` 中注册
export default {
  data:{...},
  // components: { Demo ：Demo },
  components: { Demo },
}
```
使用：
``` html
<template>
  <h1>Hello Vue</h1>
  <Demo/>
  <Demo></Demo>
</template>
```

#### 全局注册
```js
// main.js
import Demo from "@/components/Demo.vue";
Vue.component('Demo', { /* ... */ })
```

#### webpack 批量导入注册
```js
/* 
  webpack的一个API 创建一个上下文 context 动态地导入模块
  参数：指定搜索的目录路径 是否搜索子目录 正则匹配文件名
  返回一个函数，该函数可以接受一个参数，用于指定要导入的模块路径
  可以借此导入所有模块
*/
const componentFiles = require.context('@/components', true, /\.vue$/);

// componentFiles.keys() 获取所有匹配的组件路径
// 循环遍历  componentFiles(path) 获得导出的组件
componentFiles.keys().forEach((fileName) => {
  const componentName = path.replace(/^\.\/(\w+)\.vue$/i, "$1");
  const componentConfig = componentFiles(path);
  Vue.component(
    componentName,
    /*
    如果这个组件选项是通过‘export defalut’导出得，
    那么就会优先使用defalut
    否则使用模块得根
    */
    componentConfig.defalut || componentConfig
  );
});
```

:::tip
* 定义组件名的方式有两种：
  1. 使用 kebab-case
  2. 使用 PascalCase
* 全局注册的组件无论你是否使用，最终都会被webpack打包，会增加JavaScript代码量，一般都推荐按需引入
* 频繁使用的如`Button`组件可以全局自动注册
* 全局注册的行为必须在根 Vue 实例 (通过 new Vue) 创建之前发生
:::

### Prop

父组件可以通过自定义属性向子组件传递信息  
子组件则是通过`props`接收父组件的信息  
  
父组件：
```vue
<template>
  <Demo post-title="Hello Vue" :onClick="onClick" />
</template>

<script>
import Demo from "@/components/Demo.vue";

export default {
  data: () => ({
    msg: "Message",
  }),
  components: { Demo },
  methods: {
    onClick() {
      console.log("调用父组件事件");
    }
  }
}
</script>
```
子组件：
```vue
<template>
  <div>
    <h1>{{ postTitle }}</h1>
    <button @click="onClick">点我一下</button>
  </div>
</template>

<script>

export default {
  props: ["postTitle", "onClick"],
};
</script>
```

#### 传递动态 Prop
prop 可以通过 v-bind 动态赋值：
```html
<!-- 动态赋予一个变量的值 -->
<Demo v-bind:title="post.title" />

<!-- 动态赋予一个复杂表达式的值 -->
<Demo v-bind:title="post.title + ' by ' + post.author.name" />
```

#### 传入一个数字或布尔值
自定义属性里的值默认都是一个字符串  
使用 `v-bind` 将一个静态的数据转换成我们真实想传递的数据
```html
<!-- 传递一个字符串'42' -->
<blog-post likes="42"></blog-post>
<!-- 传递数字-->
<blog-post v-bind:likes="42"></blog-post>
<!-- 传递一个字符串'true' -->
<blog-post likes="true"></blog-post>
<!-- 传递一个布尔值 -->
<blog-post v-bind:likes="true"></blog-post>
```

#### 传入一个对象的所有 property
```js
post: {
  id: 1,
  title: 'Vue'
}
```
html模板：
```html
<Demo v-bind="post" />
```
等价于：
```html
<Demo
  v-bind:id="post.id"
  v-bind:title="post.title"
/>
```

#### Prop 验证
```js
class Person {
  static title = "post-title"
  constructor(id) {
    this.id = id;
    this.title = Person.title
  }
}

props: {
  // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
  title: String,
  
  onClick: Function,

  postTitle: {
    // 多个可能的类型
    type: [String, Number],
    // 必填
    required: true,
    // 默认值
    default: "Hello Vue"
  },

  /* 
  注意那些 prop 会在一个组件实例创建之前进行验证
  所以实例的 property 如 data、computed 等
  在 default 或 validator 函数中是不可用的。
  */
  post: {
    // 还可以规定构造器类型
    type: Person,
    // 对象或数组默认值必须从一个工厂函数获取
    default: () => ({ id: 1 }),
    // 自定义验证函数
    validator: value => value.id > 0
  }
},
```
当 prop 验证失败的时候，(开发环境构建版本的) Vue 将会产生一个控制台的警告。

::: warning 注意
* 当你使用 DOM 中的模板时，camelCase (驼峰命名法) 的 prop 名需要使用其等价的 kebab-case (短横线分隔命名) 命名，如果你使用字符串模板，那么这个限制就不存在了。
* 单向数据流，所有的 prop 都使得其父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。注意在子组件中改变变更这个对象或数组本身将会影响到父组件的状态，但这是不合法的。
:::

#### 非 Prop 的 Attribute
一个非 prop 的 attribute 是指传向一个组件，但是该组件并没有相应 prop 定义的 attribute。  
因为显式定义的 prop 适用于向一个子组件传入信息，然而组件库的作者并不总能预见组件会被用于怎样的场景。这也是为什么组件可以接受任意的 attribute，而这些 attribute 会被添加到这个组件的根元素上。  
如果你不希望组件的根元素继承 attribute，你可以在组件的选项中设置 `inheritAttrs: false`。例如：
```js
Vue.component('my-component', {
  inheritAttrs: false,
  // ...
})
```
::: warning 注意
`inheritAttrs: false` 选项不会影响 `style` 和 `class` 的绑定。
:::

### 自定义事件

父组件可以传递 自定义事件 给子组件  
子组件可以通过`$emit`触发父组件传递的事件

父组件：
```html
<template>
  <Demo @my-event="msg += 'HE'"  @add="add" />
</template>

<script>
import Demo from "./components/Demo.vue";

export default {
  data: () => ({
    msg: "Hello Vue",
  }),

  methods: {
    // 子集触发自定义事件传递参数的时候 会传递到父级的事件监听器上
    add(val) {
      console.log(val);
    }
  },

  components: { Demo },
};
</script>

```
子组件：
```html
<template>
  <div>
    <h2>{{ msg }}</h2>

    <button @click="$emit('my-event')">my-event</button>
    <button @click="$emit('add', 1, 2, 3)">触发add</button>
  </div>
</template>
```
::: warning 注意
不同于组件和 prop，事件名不存在任何自动化的大小写转换，而是触发的事件名需要完全匹配监听这个事件所用的名称。如上例子监听`this.$emit('myEvent')`是不会有任何效果的。
:::

#### 自定义组件的 `v-model`

::: tip
一个组件上的 `v-model` 默认会利用名为 `value` 的 prop 和名为 `input` 的事件，但是像单选框、复选框等类型的输入控件可能会将 value attribute **用于不同的目的**。 `model` 选项可以用来避免这样的冲突：
:::

```html
<Demo v-model="msg" />
```

```vue
<template>
  <div>
    <h2>{{ msg }}</h2>

    <!-- v-model 语法糖 -->
    <h1>{{ checked }}</h1>
    <input type="checkbox" :checked="checked" @change="$emit('change', $event.target.checked)">
  </div>
</template>

<script>
export default {
  // 因为 v-model 有多个语法糖 推荐这种写法 
  // 注意依然要在props中接收这个变量名

  model: {
    // 接受的变量名
    prop: "checked",
    // 触发的事件名
    event: "change"
  },
  props: ["msg", "checked"],

  // 第二种写法 直接接收value变量名(固定)+input事件名(固定)
  // props:["value"] this.$emit("input")
};
</script>
```

#### 将原生事件绑定到组件
你可能有很多次想要在一个组件的根元素上直接监听一个原生事件。  
这时，可以使用 `v-on` 的 `.native` 修饰符：

```html
<!-- 子组件聚焦触发 `onFocus` 事件 -->
<Demo v-on:focus.native="onFocus" />
```

在有的时候这是很有用的，不过在你尝试监听一个类似 `<input>` 的非常特定的元素时，其根元素实际上是一个 `<label>` 元素：
```html
<label>
  {{ label }}
  <input
    v-bind="$attrs"
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
  >
</label>
```

这时，父级的 `.native` 监听器将静默失败，它不会产生任何报错，但 `onFocus` 函数不会被调用。

::: tip
* Vue 提供了一个 `$listeners` 属性，它是一个对象，里面包含了作用在这个组件上的所有监听器。  
* Vue 还提供了 `$attrs` 属性，也是一个对象，可以拿到父组件传递下来的数据（props没有接收的）。
:::

有了 `$listeners` ，就可以配合 `v-on="$listeners"` 将所有的事件监听器指向这个组件的某个特定的子元素。对于类似 `<input>` 的你希望它也可以配合 `v-model` 工作的组件来说，为这些监听器创建一个类似下述 `inputListeners` 的计算属性通常是非常有用的：

```vue
<template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
</template>

<script>
export default {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners() {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input(event) {
            this.$emit('input', event.target.value)
          }
        }
      )
    }
  }
};
</script>
```

现在 `<base-input>` 组件是一个完全透明的包裹器了，也就是说它可以完全像一个普通的 `<input>` 元素一样使用了：所有跟它相同的 attribute 和监听器都可以工作，不必再使用 `.native` 监听器。

#### `.sync` 修饰符

Vue 不允许子组件更改父组件数据，但可以使用 `update:myPropName` 的模式触发事件取而代之。  
```html
<Demo
  v-bind:title="title"
  v-on:update:title="title = $event"
/>
```
```js
this.$emit('update:title', newTitle)
```

为了方便起见，Vue为这种模式提供一个缩写，即 `.sync` 修饰符：
```html
<Demo :title.sync="title" />
```

::: warning 注意
注意带有 `.sync` 修饰符的 `v-bind` 不能和表达式一起使用 (例如 `v-bind:title.sync=”doc.title + ‘!’”` 是无效的)。取而代之的是，你只能提供你想要绑定的 property 名，类似 `v-model`。
:::

当我们用一个对象同时设置多个 prop 的时候，也可以将这个 `.sync` 修饰符和 `v-bind` 配合使用：
```html
<Demo v-bind.sync="doc" />
```

::: warning 注意
将 `v-bind.sync` 用在一个字面量的对象上，例如 `v-bind.sync=”{ title: doc.title }”` ，是无法正常工作的。
:::


### 插槽

#### 插槽内容
Vue 提供了 `<slot>` 标签可以接收父组件写在子组件标签闭合中的内容。  
子组件 `navigation-link`：
```html
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot></slot>
</a>
```
父组件：
```html
<navigation-link url="/profile">
  Your Profile
</navigation-link>
```
渲染结果：
```html
<a
  v-bind:href="url"
  class="nav-link"
>
  Your Profile
</a>
```

::: tip
当组件渲染的时候，`<slot></slot>` 将会被替换为父组件中该**标签闭合的内容**。插槽内可以包含任何模板代码，包括 HTML，甚至其它的组件，如果 子组件 中没有包含一个 `<slot>` 元素，则该组件起始标签和结束标签之间的任何内容都会被抛弃。
:::

#### 默认内容

为一个插槽设置具体的默认内容，它只会在没有提供内容的时候被渲染。
```html
<slot>
  <h2>默认内容</h2>
  --捕获所有未被匹配的内容--
</slot> 
```

#### 具名插槽
当我们需要多个插槽，`<slot>` 元素有一个特殊的 属性 `name`，这个 属性 可以用来定义额外的插槽
  
一个不带 `name` 的 `<slot>` 出口会带有隐含的名字`“default”`。
  
在向具名插槽提供内容的时候，需要在一个 `<template>` 元素上使用 `v-slot` 指令，并以 `v-slot` 的参数的形式提供其名称。
```html
<slot>匿名插槽</slot>

<slot name="one">
  <h2>具名插槽 one</h2>`
</slot>

<slot name="two">
  <h2>具名插槽 two</h2>
</slot>
```

```html
<Demo>
  <template v-slot:default>
    <h2>使用了 匿名插槽 插槽</h2>
  </template>

  <template v-slot:one>
    <h2>使用了 one 插槽</h2>
  </template>

  <template #two>
    <h2>使用了 two 插槽</h2>
  </template>
</Demo>
```

#### 作用域插槽
::: tip
父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。
:::
如果想访问子作用域中的数据，可以如下：
```html
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
```
```html
<current-user>
  <template v-slot:default="scope">
    {{ scope.user.firstName }}
  </template>
</current-user>
```
为了让 `user` 在父级的插槽内容中可用，我们可以将 `user` 作为 `<slot>` 元素的一个 attribute 绑定上去。
  
绑定在 `<slot>` 元素上的 attribute 被称为**插槽 prop**。现在在父级作用域中，我们可以使用带值的 `v-slot` 来定义我们提供的插槽 prop 的名字（名字不固定），然后我们就可以访问子级作用域的数据了

#### 独占默认插槽的缩写语法
当被提供的内容只有默认插槽时，我们就可以把 `v-slot` 直接用在组件上。

```html
<current-user v-slot:default="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

这种写法还可以更简单。就像假定未指明的内容对应默认插槽一样，不带参数的 v-slot 被假定对应默认插槽：
```html
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

::: warning 注意
默认插槽的缩写语法不能和具名插槽混用，因为它会导致作用域不明确。
  
只要出现多个插槽，请始终为所有的插槽使用完整的基于 `<template>` 的语法。
:::

#### 解构插槽 Prop
作用域插槽的内部工作原理是将你的插槽内容包裹在一个拥有单个参数的函数里：
```js
function (slotProps) {
  // 插槽内容
}
```
这意味着 `v-slot` 的值可以进行解构赋值等操作，这样可以使模板更简洁。
```html
<!-- 解构赋值 + 重命名 -->
<current-user v-slot="{ user:person }">
  {{ user.firstName }}
</current-user>
```
自定义默认内容，用于插槽 prop 是 undefined 的情形：
```html
<current-user v-slot="{ user = { firstName: 'Guest' } }">
  {{ user.firstName }}
</current-user>
```

#### 其他
动态插槽名：
```html
<Demo>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</Demo>
```

::: tip
`v-slot` 也有缩写，即把参数之前的所有内容 (`v-slot:`) 替换为字符 `#`。
  
该缩写只在其有参数的时候才可用。
  
如果你希望使用缩写的话，你必须始终以明确插槽名取而代之。
:::

具名插槽的缩写:
```html
<Demo>
  <template #header>
    ...
  </template>

  <template #footer>
    ...
  </template>
</Demo>
```

只有默认插槽缩写：
```html
<current-user #default="{ user }">
  {{ user.firstName }}
</current-user>
```

### 动态组件和异步组件

#### 在动态组件上使用 `keep-alive`

```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

::: warning 注意
注意 `<keep-alive>` 要求被切换到的组件都有自己的名字，不论是通过组件的 `name` 选项还是局部/全局注册
:::

#### 异步组件

全局注册：
```js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
// 或者
Vue.component(
  'async-webpack-example',
  // 这个动态导入会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
```

局部注册：
```js
components: {
    Demo:() => import('@/components/Demo')
  },
```

#### 处理加载状态
```js
const Demo = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import("@/components/Demo"),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000,
});
```

### 边界情况

#### 访问元素 & 组件

1. 访问根实例 `$root`
```js
this.$root
```
  
2. 访问父级组件实例 `$parent`
```js
this.$parent
```

3. 访问子组件实例或子元素 `ref`

```html
<input ref="input">
```
```js
methods: {
  focus: function () {
    this.$refs.input.focus()
  }
}
```

::: warning 注意
* `$refs` 只会在组件渲染完成之后生效，并且它们不是响应式的。
* 应该避免在模板或计算属性中访问 `$refs`。
* 当 `ref` 和 `v-for` 一起使用的时候，你得到的 `ref` 将会是一个包含了对应数据源的这些子组件的数组。
:::

#### 依赖注入

`provide` 提供，祖先组件不需要知道哪些后代组件使用它提供的 property
```vue
<template>
  <div>
    <h1>{{ msg }}</h1>

    <button @click="handle">点我一样</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    msg: "Hello Word",
  }),

  provide() {
    return {
      a: 10,
      msg: this.msg,
      handle: this.handle
    };
  },

  methods: {
    handle() {
      this.msg = this.msg === "Hello Word" ? "Hello Vue" : "Hello Word";
    },
  },
};
</script>

```
`inject` 消费,**没有响应式 (单向数据流)**，后代组件不需要知道被注入的 property 来自哪里
```vue
<template>
  <div>
    <h1>{{ msg }}</h1>
    <h1>{{ a }}</h1>
  </div>
</template>

<script>
export default {
  inject: ["a", "msg"],
};
</script>
```

#### 循环引用
组件是可以在它们自己的模板中调用自身的。不过它们只能通过 `name` 选项来做这件事：
```html
```

### 混入

### 自定义指令

### 过滤器

### 插件

## Vue2 生命周期函数

::: tip
Vue 实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模版、挂载 Dom -> 渲染、更新 -> 渲染、卸载等一系列过程，我们称这是 Vue 的生命周期。
  
各个生命周期的作用:
* `beforeCreate`	在实例初始化之后,进行数据侦听和事件/侦听器的配置之前同步调用
    
* `created`	实例已完成对选项的处理，这些已被配置完毕：数据侦听、计算属性、方法、事件/侦听器的回调函数。然而，挂载阶段还没开始，**真实 dom 还没有生成**，`$el` 还不可用
    
* `beforeMount`	在挂载开始之前被调用：相关的 `render` 函数首次被调用
    
* `mounted`	实例被挂载后调用，在当前阶段，真实的 dom 挂载完毕，数据完成双向绑定，**可以访问到 dom 节点**
    
* `beforeUpdate`	在数据发生改变后，DOM 被更新之前被调用
    
* `update`	在数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用
    
* `activated`	keep-alive 专属，被 keep-alive 缓存的组件激活时调用
    
* `deactivated`	keep-alive 专属，被 keep-alive 缓存的组件失活时调用
    
* `beforeDestroy`	实例销毁之前调用，在这一步，实例仍然完全可用
    
* `destroyed`	实例销毁后调用，该钩子被调用后，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁
:::

#### 生命周期函数具体适合哪些场景

1. `created`：数据 `data` 、方法 `methods` 、监听器 `watch` 和 计算属性 `computed` 都已经被初始化好了，如果要调用 methods 中的方法，或者操作 data 中的数据，最早可以在这个阶段中操作，常用于异步数据获取 。

2. `mounted`：实例被挂载后调用，在当前阶段，真实的 dom 挂载完毕，可以访问到 dom 。 如果想要操作 dom ，最早可以在这个阶段进行。

3. `updated`：在数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用。

::: warning 注意
`mounted` 和 `updated` 不会保证所有的子组件也都被挂载完成，如果你希望等到整个视图都渲染完毕再执行某些操作，可以在 `mounted` 或 `updated` 内部使用 `this.$nextTick`
:::
```js
mounted: function () {
  this.$nextTick(function () {
    // 仅在整个视图都被渲染之后才会运行的代码
  })
}

updated: function () {
  this.$nextTick(function () {
    //  仅在整个视图都被重新渲染之后才会运行的代码     
  })
}
```
实例：
```vue
<!-- App.vue -->
<template>
  <div>
    <Demo v-if="once === 'One'" />

    <keep-alive>
      <component :is="once" />
    </keep-alive>

    <button @click="handle">切换组件</button>
  </div>
</template>

<script>
import Demo from "@/components/Demo.vue";
import One from "@/components/One.vue";
import Two from "@/components/Two.vue";

export default {
  data: () => ({
    once: "One",
  }),

  methods: {
    handle() {
      this.once = this.once === "One" ? "Two" : "One";
    },
  },

  components: {
    Demo,
    One,
    Two,
  },
};
</script>
```

```vue
<!-- Demo.vue -->
<template>
  <div>
    <h2 ref="once">Demo {{ info }}</h2>

    <button @click="handle">点我一下</button>
  </div>
</template>

<script>
export default {
  data: () => ({ info: 1 }),

  methods: {
    handle() {
      this.info ^= 1;
    },
  },

  // 最早执行的生命周期函数
  // vue初始化之前执行 此时你的data和methods都没有加载出来
  beforeCreate() {
    console.log("beforeCreate...", this.info);
  },

  // created 此时你的data和methods都已经加载好了
  created() {
    console.log("created...", this.info, this.$refs.once);
  },

  // beforeMount 此时我们的dom已经在内存中准备好了 但是还没有挂载到页面上
  beforeMount() {
    console.log("beforeMount...", this.$refs.once);
  },

  // mounted 表示真实dom已经有了 已经渲染到页面了
  mounted() {
    console.log("mounted...", this.$refs.once);
  },

  // beforeUpdate 此时data中的数据已经更新了
  // 但是dom中的数据还没有更新 还是旧数据
  beforeUpdate() {
    console.log("beforeUpdate...", this.info, this.$refs.once.innerHTML);
  },

  // updated 此时data和页面上的数据都更新了 保持同步
  updated() {
    console.log("updated...", this.info, this.$refs.once.innerHTML);
  },

  // beforeDestroy 销毁前 此时功能还都可以正常使用
  beforeDestroy() {
    console.log("beforeDestroy...  Demo要被销毁了");
  },

  // destroyed 销毁后 功能不在能正常使用
  destroyed() {
    console.log("destroyed...  Demo被销毁了");
  },
};
</script>
```

```vue
<!-- One.vue -->
<template>
  <h2>One</h2>
</template>

<script>
export default {
  created() {
    console.log("One被创建了");
  },

  activated() {
    console.log("出现...");
  },

  deactivated() {
    console.log("隐藏....");
  },
};
</script>
```

```vue
<!-- Two.vue -->
<template>
  <h2>Two</h2>
</template>
```

#### vue 第一次页面加载会触发哪几个钩子

* 页面首次渲染会触发 `beforeCreate`， `created`， `beforeMount`， `mounted` 这四个钩子函数。

* `data` 更新后才会先后触发 `beforeUpdate` 、 `updated` 这两个钩子。

* 用户主动`vm.$destroyed()`要销毁页面后会触发 `beforeDestroy` 、`destroyed`。

####  父组件和子组件生命周期钩子函数执行顺序
Vue 的父组件和子组件生命周期钩子函数执行顺序可以归类为以下 4 部分：
1. 加载渲染过程： 父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

2. 子组件更新过程： 父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

3. 父组件更新过程： 父 beforeUpdate -> 父 updated

4. 销毁过程： 父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

#### Vue 应该在哪个生命周期内发起异步请求
* 可以在钩子函数 created、beforeMount、mounted 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。

* 但是推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：
1. 能更快获取到服务端数据，减少页面 loading 时间；
2. 服务端渲染 ssr 不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性；

## 渲染函数

```vue
<template>
  <div>
    <Demo :level="1">Hello world!</Demo>
    <aax />
  </div>
</template>

<script>
export default {
  components: {
    Demo: {
      render: function (createElement) {
        return createElement(
          // 标签名称
          'h' + this.level,
          // 子节点数组
          this.$slots.default
        )
      },
      props: {
        level: {
          type: Number,
          required: true
        }
      }
    },

    aax: {
      // @returns {VNode}
      render: function (createElement) {
        console.log(this);

        return createElement(
          // 必填项 {String | Object | Function}
          //  HTML标签名、组件选项对象，resolve 了上述任何一种的一个 async 函数
          'div',

          // {Object} 一个与模板中 attribute 对应的数据对象,可选。
          {
            // v-bind:class
            'class': { div: true },

            // v-bind:style
            style: { color: 'skyblue' },

            // 普通的 HTML attribute
            attrs: { id: 'aax' },

            // 组件 prop
            props: { msg: 'Hello Vue' },

            // DOM property
            domProps: { innerHTML: 'baz' },

            // v-on 不支持修饰器。
            on: { click: this.clickHandler },

            // 仅用于组件，用于监听原生事件，而不是组件内部使用
            // `vm.$emit` 触发的事件。
            nativeOn: {
              click: this.blogTitle += "EH"
            },

            // 自定义指令
            directives: [
              {
                name: 'cope',
                value: '2',
                expression: '1 + 1',
                arg: 'foo',
                modifiers: {
                  bar: true
                }
              }
            ],

            // 作用域插槽的格式为
            // { name: props => VNode | Array<VNode> }
            scopedSlots: {
              default: props => createElement('span', props.text)
            },

            // 如果组件是其它组件的子组件，需为插槽指定名称
            slot: 'name-of-slot',
            // 其它特殊顶层 property
            key: 'myKey',
            ref: 'myRef',
            // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
            // 那么 `$refs.myRef` 会变成一个数组。
            refInFor: true
          },

          // {String | Array}
          // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，
          // 也可以使用字符串来生成“文本虚拟节点”。可选。
          [
            this.blogTitle,
            createElement('h1', '一则头条'),
            createElement(Demo, { props: { level: 2 } }),
          ])
      },

      data: () => ({
        blogTitle: "blogTitle",
        div: "div"
      }),

      methods: {
        clickHandler() {
          this.blogTitle = this.blogTitle.split('').reverse().join('');
        }
      }
    }
  },
}
</script>
```