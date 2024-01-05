# Vue2 中的 JSX

## 自定义组件

```JavaScript
// 子组件
export default {
  props: { count: Number },

  methods: {
    clickHandler() {
      this.$emit('clickHandler', this.count);
    }
  },

  render(h) {
    return (
      <div>
        <button onclick={this.clickHandler}> +1 </button>
        <p style="color: red; margin-top: 10px">当前数量为：{this.count}</p>
      </div>
    );
  }
};
```

```JavaScript
// 父组件
import CountButton from './countButton';

export default {
  components: { CountButton },

  data: () => ({ count: 0 }),

  methods: {
    clickHandler() {
      this.count = this.count + 1;
    }
  },

  render(h) {
    return <CountButton count={this.count} onclickHandler={this.clickHandler} />;
  }
};
```

## class & style

```JavaScript
export default {
  data: () => ({ isRed: true, isBold: true }),

  render(h) {
    const { isRed, isBold } = this;
    const c1 = <p class="red bold">message</p>;
    const c2 = <p class={['red', 'bold']}>message</p>;
    const c3 = <p class={isRed && 'red'}>message</p>;
    const c4 = <p class={isBold ? 'bold' : 'red'}>message</p>;

    const s1 = <p style="color: red; font-weight: bold">message</p>;
    const s2 = <p style={isRed && 'color: red'}>message</p>;
    const s3 = <p style={{ color: 'red' }}>message</p>;
  }
};
```

## v-for & v-if

```JavaScript
export default {
	data: () => ({ list: [1, 2, 3] }),

	render(h) {
		// 循环渲染，只渲染奇数
		return <div>{this.list.map(n => (n & 1) === 1 && <h2>{n}</h2>)}</div>;
	}
};
```

## v-model

```JavaScript
export default {
	data: () => ({ value: '1' }),

	render(h) {
		return (
			<div>
				<h1>value: {this.value}</h1>
				<input value={this.value} onInput={e => (this.value = e.target.value)} />
			</div>
		);
	}
};
```

## 事件修饰符

| 修饰符          | 前缀 |
| --------------- | :--: |
| `.passive`      | `&`  |
| `.capture`      | `!`  |
| `.once`         | `~`  |
| `.capture.once` | `~!` |

| 修饰符     |                处理函数中的等价操作                |
| ---------- | :------------------------------------------------: |
| `.stop`    |             `event.stopPropagation()`              |
| `.prevent` |              `event.preventDefault()`              |
| `.self`    | `if (event.target !== event.currentTarget) return` |
| `.enter`   |         `if (event.keyCode !== 13) return`         |
| `.ctrl`    |            `if (!event.ctrlKey) return`            |

```JavaScript
return (
	<button
    {...{ on: { '!click': handleClick, '~mouseover': handleMouseover } }}>
  </button>
);
```

## props & slot

```JavaScript
const CountButton = {
	props: ['num1', 'value'],

	data: () => ({
		info: {
			msg: 'message',
			num2: 10
		}
	}),

	render(h) {
		return (
			<div>
				<h1>value: {this.value}</h1>
				<h1>num1: {this.num1}</h1>
				{this.$slots.header}
				{this.$scopedSlots.default && this.$scopedSlots.default(this.info)}
				<button onClick={_ => this.info.num2++}> +1 </button>
			</div>
		);
	}
};

export default {
	components: { CountButton },

	data: () => ({
		info: {
			num1: 7,
			value: 'default'
		}
	}),

	render(h) {
		return (
			<CountButton
				// 传递多个 props
				{...{ props: { ...this.info } }}
				// 作用域插槽
				scopedSlots={{
                    // 插槽名称： 定义箭头函数，返回需要渲染的html
					default: ({ msg, num2 }) => (
						<div>
							<h1>msg: {msg}</h1>
							<h1>num2: {num2}</h1>
						</div>
					)
				}}>
				{/* 普通插槽 */}
				<h1 slot="header">Header</h1>
			</CountButton>
		);
	}
};
```
