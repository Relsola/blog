# render 函数

## `render函数` 与 `template模板`

- `render函数` 与 `template模板` 都能创建 html 模板, 但我们平时在 `vue` 文件中写的 `html` 模板，其实会在 `beforeMount` 生命周期的钩子函数中，经过编译生成 `render` 函数。

- `template` 模板理解起来相对容易，自定义 `render` 函数灵活性高，但是写起来会更为麻烦。

- `render` 函数省去了编译步骤，因此性能更高，优先级也会更高。

- `template` 模板不可与 `render` 函数一起使用，两者同时使用时，会以 `render` 函数为准。

- `render` 函数也可以用在[函数式组](./function.md)件中，此时 `render` 函数会多出一个上下文参数。

## createElement 参数

```JavaScript
// h函数
return createElement(, {}, []);
```

### 参数 1

> {`String` | `Object` | `Function`}  
> 一个 `HTML` 标签名、组件选项对象，或者  
> `resolve` 了上述任何一种的一个 `async` 函数  
> 必填项

### 参数 2

> {`Object`}  
> 一个与模板中 `attribute` 对应的数据对象  
> 可选

### 参数 3

> {`String` | `Array`}  
> 子级虚拟节点 `VNodes`，由 `createElement()` 构建而成， 也可以使用字符串来生成文本虚拟节点
> 可选

### 创建 `vnode`

```JavaScript
export default {
  data: () => ({
    msg: 'Wonder Of You'
  }),

  render(h) {
    // 创建普通标签带插值的 vnode
    const p = h('h2', this.msg);

    return h('div', [p, h(asyncNode)]);
  }
};

// 异步 vnode
const asyncNode = _ =>
  Promise.resolve({
    data: () => ({
      msg: 'async'
    }),
    render(h) {
      console.log(111);
      return h('h2', this.msg);
    }
  });
```

### 设置 `vnode` 的 `attribute` 属性

属性的写法非常多样性，这是因为 `createElement` 内部对各种写法进行兼容处理

::: warning 注意

- `attrs` 必须是 `object` 的形式
- 单独设置了 `class` 属性后， `attrs` 的 `class` 属性会失效
- 在 `style` 中设置的样式会对 `attrs` 中的 `style` 进行覆盖，但 `attrs` 中独有的样式会保留

:::

```JavaScript
`参考官网：https://v2.cn.vuejs.org/v2/guide/render-function.html`

`第二个参数：`
{
    // 与 `v-bind:class` 的 API 相同，
    // 接受一个字符串、对象或字符串和对象组成的数组
    // class: ['1', '2'],
    // class: 'a1 ' + this.active,
    class: { foo: true, bar: false },

    // 与 `v-bind:style` 的 API 相同，
    // 接受一个字符串、对象，或对象组成的数组
    // 注意style中的样式需要用驼峰命名
    // style: 'font-size:16px',
    // style: [{ fontSize: '14px' }, { color: 'green' }]
    style: { color: 'red', fontSize: '14px' },

    // 普通的 HTML attribute
    attrs: { id: 'foo', class: 'bar', style:'color:red;' },

    // 组件 prop
    props: { msg: 'bar' },

    // DOM property
    domProps: { innerHTML: 'baz' },

    // 事件监听器在 `on` 内，
    // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
    // 需要在处理函数中手动检查 keyCode。
    on: {
        click: this.clickHandler,
        mouseenter: this.mouseenterHandler
    },

    // 仅用于组件，用于监听原生事件，而不是组件内部使用 `vm.$emit` 触发的事件。
    nativeOn: {
        click: this.nativeClickHandler
    },

    // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`赋值，
    // 因为 Vue 已经自动为你进行了同步。
     directives: [
        {
            name: 'my-custom-directive',
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
}
```

## 插槽 & 事件修饰符

### 设置组件的默认插槽与具名插槽

```JavaScript
export default {
  render(h) {
    const Once = {
      render(h) {
        // 可以通过 this.$slots访问静态插槽的内容，每个插槽都是一个 VNode 数组
        const { default: def, once } = this.$slots;
        return h('div', ['默认插槽内容:', def, 'once插槽内容:', once]);
      }
    };

    // 当你需要指定某个 vnode 是子组件的具名插槽内容时，需要设置 { slot: 'name'}
    return h('div', [h(Once, [h('div', '123'), h('div', { slot: 'once' }, '456')])]);
  }
};
```

上面的父组件 `render` 函数转换为模版语法写法如下：

```html
<div>
  <Once>
    <div>123</div>
    <div slot="once">456</div>
  </Once>
</div>
```

上面的子组件 `render` 函数转换为模版语法写法如下：

```html
<div>
  默认插槽内容:
  <slot></slot>
  once插槽内容:
  <slot name="once"></slot>
</div>
```

### 设置组件的作用域插槽

- 在子组件中使用 `this.$scopedSlots`，
- 向父组件传入插槽的 `vnode` 提供子组件的数据，
- 父组件使用 `scopedSlots{}` 通过 `render` 函数的形式消费子组件的数据

```JavaScript
export default {
  render(h) {
    const Once = {
      render(h) {
        const { default: def } = this.$scopedSlots;
        // `<div><slot :text="'once'"></slot></div>`
        return h('div', [def({ text: 'once' })]);
      }
    };

    // `<div><Once #default="{ text }"><span>{{ text }}</span></Once></div>`
    return h('div', [h(Once, { scopedSlots: { default: ({ text }) => h('span', text) } })]);
  }
};
```

### 事件修饰符

| 修饰符          | 前缀 |
| --------------- | :--: |
| `.passive`      | `&`  |
| `.capture`      | `!`  |
| `.once`         | `~`  |
| `.capture.once` | `~!` |

```JavaScript
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  '~!mouseover': this.doThisOnceInCapturingMode
};
```

对于所有其它的修饰符，私有前缀都不是必须的，因为你可以在事件处理函数中使用事件方法：

| 修饰符     |                处理函数中的等价操作                |
| ---------- | :------------------------------------------------: |
| `.stop`    |             `event.stopPropagation()`              |
| `.prevent` |              `event.preventDefault()`              |
| `.self`    | `if (event.target !== event.currentTarget) return` |
| `.enter`   |         `if (event.keyCode !== 13) return`         |
| `.ctrl`    |            `if (!event.ctrlKey) return`            |

```JavaScript
on: {
  keyup: function (event) {
    // 如果触发事件的元素不是事件绑定的元素则返回
    if (event.target !== event.currentTarget) return;
    // 如果按下去的不是 enter 键或者
    // 没有同时按下 shift 键
    // 则返回
    if (!event.shiftKey || event.keyCode !== 13) return;
    // 阻止 事件冒泡
    event.stopPropagation();
    // 阻止该元素默认的 keyup 事件
    event.preventDefault();
    // ...
  }
};
```

## 使用 JavaScript 代替模板功能

### v-if

三目运算符

```JavaScript
render(h) {
  return h('div', [this.is ? h('div', '这是1') : h('div', '这是2')]);
}
```

### if-else

与工厂函数结合

```JavaScript
render(h) {
  const createEle = _ => {
    if (this.is) {
      return h('div', '123');
    } else {
      return h('div', '456');
    }
  };
  return h('div', [createEle()]);
}
```

### v-for

通过 `js` 生成一个 `vnode` 的数组

```JavaScript
  data: () => ({
    mockList: ['111', '222', '333', '444']
  }),
  render(h) {
    return h(
      'div',
      this.mockList.map((item, index) => h('div', `${item}的index是${index}`))
    );
  }
```

### v-model

> 渲染函数中没有与 `v-model` 的直接对应——你必须自己实现相应的逻辑
> 这就是深入底层的代价，但与 `v-model` 相比，这可以让你更好地控制交互细节。

```JavaScript
props: ['value'],
render(h) {
  const self = this;
  return h('input', {
    domProps: { value: self.value },
    on: { input: e => self.$emit('input', e.target.value) }
  });
}
```

```JavaScript
// el-input 的 v-model 绑定
data: () => ({ value: '' }),

render(h) {
  // <el-input v-model="value" size="small" style="width: 240px" />
  return h('el-input', {
    props: { size: 'small', value: this.value },
    style: { width: '240px' },
    on: { input: e => (this.value = e) }
  });
}
```
