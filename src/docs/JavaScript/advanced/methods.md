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

- 检查 `Clipboard.writeText()` API 是否可用
- 将给定的值写入剪切板并返回一个 `Promise`
- 如果剪贴板 API 不可用，则使用 `document.execCommand()` API 复制到剪贴板
- 注意 `document.execCommand` 有弃用的风险

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

- 在每个动画帧 `requestAnimationFrame()` 上调用提供的回调函数
- 返回一个具有 `start` 和 `stop` 方法的对象
- 第二个参数控制是否需要显式调用 默认为 `true`

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

const cb = () => console.log('111');

const recorder = recordAnimationFrames(cb);

setTimeout(() => {
	recorder.stop();
}, 2000);

setTimeout(() => {
	recorder.start();
}, 2000);

const recorder2 = recordAnimationFrames(() => console.log('222'), false);
```

## 添加和删除事件监听器

- 使用事件委托将单个事件监听器添加到 父元素，避免为单个元素添加事件监听造成性能浪费
- `EventTarget.addEventListener()` 向元素添加事件监听器
- `opts.target` 指定将事件绑定在哪个子元素中，值是一个 `css` 选择器字符串
- `opts.options` 为 `addEventListener` 第三个参数配置项
- 注意添加事件的返回值，用于 `EventTarget.removeEventListener()` 解除事件监听的绑定

```JavaScript
function on(el, event, fn, opts = {}) {
	const delegatorFn = e =>
		e.target.matches(opts.target) && fn.call(e.target, e);
	el.addEventListener(
		event,
		opts.target ? delegatorFn : fn,
		opts.options || false
	);
	return opts.target ? delegatorFn : fn;
}

const fn = e => console.log(e);

on(document.body, 'click', fn);

on(document.body, 'click', fn, { target: 'p' });

on(document.body, 'click', fn, { options: true });

on(document.body, 'click', fn, { target: 'p', options: { once: true } });
```

## 单位转换器

```JavaScript
// 基于类的单位转换器数据结构
class Distance {
  static conversions = {
    inches: 2.54,
    feet: 30.48,
    yards: 91.44,
    miles: 160934.4,
    centimeters: 1,
    meters: 100,
    kilometers: 100000
  };

  constructor(cm) {
    this.cm = cm;
  }
}
// 为了避免手动添加每个转换，使用 Object.defineProperty() 为每个单位创建一个 getter 计算指定单位的值。
// 为每个单位创建一个静态方法，该方法将创建一个新的数据结构实例，并将值转换为内部存储的单位。
Object.entries(Distance.conversions).forEach(([unit, conversion]) => {
  Object.defineProperty(Distance, `from${unit.charAt(0).toUpperCase() + unit.slice(1)}`, {
    get: function () {
      return value => new Distance(value * conversion);
    }
  });

  Object.defineProperty(Distance.prototype, unit, {
    get: function () {
      return this.cm / conversion;
    }
  });
});

const distance = Distance.fromMeters(10);

distance.feet; // 32.808398950131235
distance.centimeters; // 1000


// 虽然这对于特定类型的测量非常有效，但我们不必为不同类型的测量重复整个过程。
// 使用原型继承，创建一个单一的工厂函数，可用于创建任何类型测量的单位转换器。
const createUnitConverter = unitConversions => {
  // 创建将充当数据结构的函数
  const UnitConverter = function (unit) {
    this.unit = unit;
  };

  // Add static methods
  Object.entries(unitConversions).forEach(([unit, conversion]) => {
    Object.defineProperty(UnitConverter, `from${unit.charAt(0).toUpperCase() + unit.slice(1)}`, {
      get: function () {
        return value => new UnitConverter(value * conversion);
      }
    });

    // 添加静态方法
    Object.defineProperty(UnitConverter.prototype, unit, {
      get: function () {
        return this.unit / conversion;
      }
    });
  });

  return UnitConverter;
};

const Data = createUnitConverter({
  bits: 1,
  bytes: 8,
  kilobits: 1000,
  kilobytes: 8000,
  megabits: 1000000,
  megabytes: 8000000
});

const data = Data.fromBytes(2000);

data.kilobytes; // 2
data.bits; // 16000

// 对于复杂的转换公式，可以调整为函数以适应。
```

## 缓存代理

- 缓存代理一些比较消耗性能的计算进行优化
- 通过将 `cache` 设置为返回函数的属性来允许访问它

```JavaScript
const memoize = fn => {
  const cache = new Map();
  const cached = function () {
    const args = Array.prototype.join.call(arguments, '');
    return cache.has(args)
      ? cache.get(args)
      : cache.set(args, fn.apply(this, arguments)) && cache.get(args);
  };
  cached.cache = cache;
  return cached;
};

const fn = (...arg) => {
  console.log('开始计算乘积');
  let a = 1;
  for (let i = 0, n = arg.length; i < n; i++) {
    a *= arg[i];
  }
  return a;
};

const proxyMuTe = memoize(fn);
proxyMuTe(1, 2, 3, 4, 5);
proxyMuTe(1, 2, 3, 4, 5);
proxyMuTe;
```
