# JS 功能函数

## 深浅拷贝

### 测试用例

```JavaScript
const obj = {};

const data = {
  name: 'Jack',
  obj: { a: 1, b: 2 },

  date: [new Date(1536627600000), new Date(1540047600000)],
  re: new RegExp('\\w+'),
  err: new Error('"x" is not defined'),

  func: function () {
    console.log(1);
  },
  val: undefined,
  sym: Symbol('foo'),

  [Symbol('bar')]: [1, 2, 3],

  nan: NaN,
  infinityMax: Infinity,

  key: obj
};

obj.key = data;
```

### 浅拷贝

1. 扩展运算符
2. `Object.assign`

```JavaScript
const copy = { ...data };

const copy = Object.assign({}, data);
```

### 深拷贝

通过递归实现深拷贝 `WeakMap` 弱引用优化循环引用

```JavaScript
function deepClone(source, map = new WeakMap()) {
  // 如果不是复杂数据类型 或者为null，直接返回
  if (source === null || !(typeof source === 'function' || typeof source === 'object')) {
    return source;
  }
  // 深拷贝函数
  if (typeof source === 'function') {
    return new Function(`return ${source.toString()}`)();
  }
  // 拷贝特殊对象
  if (source instanceof RegExp) {
    const reg = new RegExp(source);
    reg.__proto__ = source.__proto__;
    reg.lastIndex = source.lastIndex;
    return reg;
  }
  if (source instanceof Date) {
    return new Date(source);
  }
  if (source instanceof Error) {
    return new Error(source);
  }
  // 解决循环引用
  if (map.has(source)) {
    return map.get(source);
  }
  const clone = Array.isArray(source) ? [] : {};
  // 继承原型
  clone.__proto__ = source.__proto__;
  map.set(source, clone);
  // 递归拷贝
  Object.keys(source).forEach(key => {
    clone[key] = deepClone(source[key], map);
  });
  // 拷贝Symbols属性
  Object.getOwnPropertySymbols(source).forEach(key => {
    clone[key] = deepClone(source[key], map);
  });
  return clone;
}
```

## 数组扁平化

### `flat` -- 简洁

```JavaScript
arr.flat(Infinity);
```

### `reduce`

```JavaScript
const flatten = arr =>
  arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? flatten(cur) : cur), []);
```

### `递归`

```JavaScript
const flatten = arr => {
  let result = [];
  arr.forEach(item => {
    result = result.concat(Array.isArray(item) ? flatten(item) : item);
  });
  return result;
};
```

### `扩展运算符`

```JavaScript
const flatten = arr => {
  while (arr.some(Array.isArray)) {
    arr = [].concat(...arr);
  }
  return arr;
};
```

## 将文本复制到粘贴板

```JavaScript
function copyToClipboard(str) {
	if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
		return navigator.clipboard.writeText(str);
	} else {
		const el = document.createElement('input');
		el.value = str;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		const selected =
			document.getSelection().rangeCount > 0
				? document.getSelection().getRangeAt(0)
				: false;
		el.select();
		const flag = document.execCommand('copy');
		document.body.removeChild(el);
		if (selected) {
			document.getSelection().removeAllRanges();
			document.getSelection().addRange(selected);
		}
		return flag ? Promise.resolve('success') : Promise.reject('failure');
	}
}
```

## 录制动画帧

```JavaScript
function recordAnimationFrames(callback, autoStart = true) {
	let running = false, raf;
	const stop = () => {
		if (!running) {
			return;
		}
		running = false;
		cancelAnimationFrame(raf);
	};
	const start = () => {
		if (running) {
			return;
		}
		running = true;
		run();
	};
	const run = () => {
		raf = requestAnimationFrame(() => {
			callback();
			if (running) {
				run();
			}
		});
	};
	if (autoStart) {
		start();
	}
	return { start, stop };
};
```
