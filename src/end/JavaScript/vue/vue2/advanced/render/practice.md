# render 函数实践

## 自定义 Element-ui 的 $message 内容

```JavaScript
successCallBack() {
  // 使用vue 的 this.$createElement 创建虚拟节点
  const h = this.$createElement;

  const textVNode = h(
    'span',
    { style: { color: '#13CE66', fontSize: '14px' } },
    '这是一条 message'
  );

  const btnVNode = h(
    'el-button',
    {
      props: { type: 'primary', size: 'mini' },
      on: { click: _ => this.$router.push('/path') }
    },
    '确定'
  );

  this.$message({ type: 'success', message: h('div', [textVNode, btnVNode]) });
}
```
