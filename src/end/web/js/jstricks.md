# JavaScript 使用技巧

## 浏览器

### 添加和删除事件监听器

- 使用 [EventTarget.addEventListener( )](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener) 向元素添加事件监听器
- 使用`事件委托`将单个事件监听器添加到 `父元素`，避免为单个元素添加事件监听造成性能浪费
- `opts.target` 指定将事件绑定在哪个子元素中，值是一个 `css` 选择器字符串
- `opts.options` 为 `addEventListener` 第三个参数配置项
- 注意添加事件的返回值，用于 [EventTarget.removeEventListener( )](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/removeEventListener) 解除事件监听的绑定

::: code-group

```JavaScript [add]
const on = (el, event, fn, opts = {}) => {
  const delegatorFn = e => e.target.matches(opts.target) && fn.call(e.target, e);
  el.addEventListener(event, opts.target ? delegatorFn : fn, opts.options || false);
  if (opts.target) return delegatorFn;
};

const fn = e => console.log(e);

on(document.body, 'click', fn);

on(document.body, 'click', fn, { target: 'p' });

on(document.body, 'click', fn, { options: true });

on(document.body, 'click', fn, { target: 'p', options: { once: true} });
```

```JavaScript [remove]
const off = (el, event, fn, opts = false) => el.removeEventListener(event, fn, opts);

const fn = e => console.log(e);

document.body.addEventListener('click', fn);
off(document.body, 'click', fn);

const delegatorFn = on(document.body, 'click', fn, { target: 'p' });
off(document.body, 'click', delegatorFn);

const delegatorFnCapturing = on(document.body, 'click', fn, { options: true });
off(document.body, 'click', delegatorFnCapturing, { options: true });
```

:::

### 将文本复制到粘贴板

- 检查 [Clipboard.writeText( )](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard/writeText) API 是否可用
- 将给定的值写入剪切板并返回一个 `Promise`
- 如果剪贴板 API 不可用，则使用 [document.execCommand( )](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand) API 复制到剪贴板
- 注意 `document.execCommand` 有弃用的风险

```JavaScript
const copyToClipboard = str => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(str);
  } else {
    const el = document.createElement('input');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    el.select();
    const flag = document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
    return flag ? Promise.resolve('success') : Promise.reject('failure');
  }
};
```

### 录制动画帧

- 在每个动画帧 [requestAnimationFrame( )](https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame) 上调用提供的回调函数
- 返回一个具有 `start` 和 `stop` 方法的对象
- 第二个参数控制是否需要显式调用 默认为 `true`

```JavaScript
const recordAnimationFrames = (callback, autoStart = true) => {
  let running = false, raf;
  const stop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
  };
  const start = () => {
    if (running) return;
    running = true;
    run();
  };
  const run = () => {
    raf = requestAnimationFrame(() => {
      callback();
      if (running) run();
    });
  };
  if (autoStart) start();
  return { start, stop };
};
const cb = () => console.log('111');
const recorder = recordAnimationFrames(cb);
setTimeout(() => { recorder.stop() }, 2000);
setTimeout(() => { recorder.start() }, 2000);
const recorder2 = recordAnimationFrames(() => console.log('222'), false);
```

### 

## 
