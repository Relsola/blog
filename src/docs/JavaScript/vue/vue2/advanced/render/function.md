# 函数式组件

> 函数式组件没有 `data`、生命周期和 `this`，函数式组件又叫无状态组件（`stateless component`）。

## 模板定义

```vue
<!-- functional 声明 -->
<template functional>
  <div>
    <h1>{{ props.title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Fun',
  props: {
    title: [String],
    default: ''
  }
};
</script>

<!-- 巧用$options做过滤器 -->
<template functional>
  <div>
    <h1>{{ $options.updateTitle(props.title) }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Fun',
  props: {
    title: [String],
    default: ''
  },

  updateTitle(title) {
    return 'msg' + title;
  }
};
</script>
```

## render 函数定义

```JavaScript
export default {
	name: 'Fun',
    // functional 声明
	functional: true,
	props: {
		title: [String],
		default: ''
	},
	render(h, { props }) {
		return h('div', [h('h1', props.title)]);
	}
};
```

## render 函数中的 context

