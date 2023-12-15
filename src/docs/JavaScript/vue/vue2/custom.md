## Vue2 中的函数式组件

### 函数式组件

函数式组件（functional component）是一个不持有状态 data、实例 this 和生命周期的组件。

> 函数式组件没有 data、生命周期和 this，函数式组件又叫无状态组件（stateless component）。

模板定义：

```vue
<template functional>
  <div>
    <h1>{{ props.title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'FunOne',
  props: {
    title: [String]
  }
};
</script>

<style></style>
```

render 函数定义

```JavaScript
export default {
  name: 'FunTwo',
  functional: true,
  props: {
    title: [String],
  },
  render(h, { props }) {
    return h('div', {}, [h('h1', {}, props.title)])
  },
}
```

> 不能这样定义：

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'FunOne',
  functional: true,
  props: {
    title: [String]
  }
};
</script>

<style></style>
```

> 使用 render 函数定义输入框

```JavaScript
export default {
  name: 'MyInput',
  functional: true,
  props: {
    value: {
      type: [String, Number],
      default: ''
    }
  },
  // NOTE 函数式组件没有 this
  render(h, context) {
    const { props, listeners, data } = context;
    return h('input', {
      // DOM 属性
      domProps: {
        value: props.value
      },
      on: {
        input: ({ target }) => {
          data.on['my-change'](Math.random().toString(36));
          // listeners 是 data.on 的别名
          listeners['my-input'](target.value);
          listeners.input(target.value);
        }
      }
    });
  }
};
```

在 render 函数中使用 MyInput

```JavaScript
import MyInput from './MyInput'
export default {
  name: 'MyInputExample',
  data() {
    return { value: '' }
  },
  render(h) {
    // MyInput 是一个组件对象选项
    return h(MyInput, {
      model: {
        value: this.value,
        callback: value => {
          console.log('model', value)
          this.value = value
        },
      },
      on: {
        // NOTE 在父组件的 MyInputExample 上监听 event-name 事件，
        // 在函数式组件的 listeners 对象
        // 上就会有一个 event-name 方法
        // 用于发送数据到外部
        'my-input': value => {
          console.log('my-input', value)
        },
        'my-change': value => {
          console.log('my-change', value)
        },
      },
    })
  },
}
```

> 在父组件的 MyInputExample 上监听 event-name 事件，在函数式组件的 listeners 对象上才会有一个 event-name 方法。

### 用 render 定义函数式组件

vue 在 render 函数的第二个参数中提供了 context，用于访问 props、slots 等属性：

```bash
props: 组件 props 对象。
data: 组件的数据对象，即 h 的第二个参数。
listeners: 组件上监听的事件对象，在组件上监听 `event-name`，listeners 对象就有 `event-name` 属性，值为函数，数据可通过该函数的参数抛到父组件。listeners 是 `data.on` 的别名。
slots: 函数，返回了包含所有插槽的对象。
scopedSlots: 对象，每个属性为返回插槽的 VNode 的函数，可传递参数。
children：子节点数组，可直接传入 `h` 函数的第三个参数。
parent: 父组件，可通过它修改父组件的 data 或者调用父组件的方法。
injection：注入对象。
```

props 和普通组件的 props 一样，不要求强制，但是声明后可对其类型进行约束，组件接口也更加清晰。

> slots() 和 children 的区别？

slots() 返回所有插槽的对象，children 是一个 VNode 数组，不包含 template 上的 v-slot

```vue
<FunTwo>
  <p slot="left">left</p>
  <span style="color:red;">按钮</span>
  <template v-slot:right>
    <div>right</div>
  </template>
  <template slot="middle">
    <span>left</span>
  </template>
</FunTwo>
```
