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
    const c4 = <p class={isRed && 'red'}>message</p>;
    const c3 = <p class={isBold ? 'bold' : 'red'}>message</p>;

    const s1 = <p style="color: red; font-weight: bold">message</p>;
    const s2 = <p style={isRed && 'color: red'}>message</p>;
    const s3 = <p style={{ color: 'red' }}>message</p>;
  }
};
```

## v-for & v-if

