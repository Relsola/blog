# 手写系列

## 手写LRU缓存
::: tip
在有限的缓存资源中，淘汰掉最近最久未使用的资源。
:::
```js
class LRUCache {
	constructor(capacity) {
		this.capacity = capacity;
		this.cache = new Map();
	}

	get(key) {
		if (!this.cache.has(key)) {
			return -1;
		}
		const value = this.cache.get(key);
		this.cache.delete(key);
		this.cache.set(key, value);
		return value;
	}

	put(key, value) {
		if (this.cache.has(key)) {
			this.cache.delete(key);
		} else if (this.cache.size >= this.capacity) {
			const firstKey = this.cache.keys().next().value;
			this.cache.delete(firstKey);
		}
		this.cache.set(key, value);
	}
}
```

## 实现 EventEmitter 发布订阅模式
::: tip EventEmitter包含三个核心方法：
1. on(event, listener)：用于添加事件和订阅者。接收两个参数，event表示事件名称，listener表示订阅者的回调函数。

2. emit(event, ...args)：用于触发事件。接收一个事件名称和任意数量的参数。当事件被触发时，所有订阅该事件的回调函数将被调用，并将参数传递给它们。

3. off(event, listener)：用于移除事件和订阅者。接收两个参数，event表示事件名称，listener表示要移除的订阅者的回调函数。
:::
```js
class EventEmitter {
  constructor() {
    this.events = {}; // 用一个对象来保存事件和订阅者
  }

  // 添加事件
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // 触发事件
  emit(event, ...args) {
    const listeners = this.events[event] || [];
    listeners.forEach((listener) => listener(...args));
  }

  // 移除事件
  off(event, listener) {
    const listeners = this.events[event] || [];
    const index = listeners.indexOf(listener);
    if (index >= 0) {
      listeners.splice(index, 1);
    }
  }
}
```

## 手写 call apply bind

### call
```js
Function.prototype.myCall = function (context, ...arg) {
    context = context ?? globalThis;
    // 避免冲突 使用Symbol
    const key = Symbol('key');
    context[key] = this;
    const result = context[key](...arg);
    delete context[key];
    return result;
}
```

### apply
```js
Function.prototype.myApply = function (context, rest) {
    context = context ?? globalThis;
    // 参数不符合要求返回 undefined
    rest = Array.isArray(rest) ? rest : [undefined]
    const key = Symbol('key');
    context[key] = this;
    const result = context[key](...rest);
    delete context[key];
    return result;
}
```

### bind
```js
Function.prototype.myBind = function (context, ...arg) {
    const self = this;
    const Bound = function () {
        const thisArg = arg.concat(...arguments);
        // 用于构造函数忽略 this 指向
        return this instanceof Bound ?
            new Bound(...thisArg)
            : self.apply(context, thisArg);
    }
    // 保护目标原型
    const emptyFn = function () { };
    emptyFn.prototype = this.prototype;
    Bound.prototype = new emptyFn();
    return Bound;
}
```

## 手写 new 操作符
::: tip new 操作符调用构造函数的过程
1. 创建一个空对象
2. 将空对象的`__proto__`指向构造函数的`prototype`
3. 将这个空对象赋值给构造函数内部的`this`，并执行构造函数
4. 根据构造函数的逻辑，返回第一步创建的对象或者构造函数显示的返回值
:::
```js
function myNew(constructor, ...arg) {
    // 改变obj原型指向
    const obj = Object.create(constructor.prototype);
    // 将obj作为上下文this指向
    const result = constructor.apply(obj, arg);
    // 正确输出结果
    return result !== null && typeof result === "object" ? result : obj;
}
```

## 手写 AJAX
::: tip 原生ajax步骤
1. 创建`XMLHttpRequest`对象
2. 设置`readyState`监听事件
2. 使用`open`方法设置和服务器的交互信息
3. 使用`send`发送数据
:::
```JS
// 使用Promise封装AJAX
function ajax(methods, url, data) {
	const xhr = new XMLHttpRequest();
	return new Promise((resolve, reject) => {
		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) return;
			if (xhr.status === 200) resolve(xhr.responseText);
			else reject(xhr.statusText);
		};
    if(methods === 'post') 
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.open(methods, url);
		xhr.send(data);
	});
}
```

## 手写 Promise

::: tip
[参考文章](https://juejin.cn/post/7043758954496655397?searchId=20230930171436A8157BB9298B8B37FCB9)  

要实现一个符合 Promise/A+ 规范的 Promise，需要注意以下几个要点：

1. 状态转移：Promise 可以处于三种状态之一，分别是“pending”（等待状态）、“fulfilled”（已完成状态）和“rejected”（已拒绝状态）。当 Promise 转移到已完成或已拒绝状态时，需要保证状态不可逆转。

2. 异步处理：Promise 可以处理异步操作，例如使用定时器或者在事件回调中执行异步代码。需要确保在异步操作完成之后，Promise 状态可以正确地转移。

3. 链式调用：Promise 支持链式调用，也就是说每次调用 then() 方法后，都会返回一个新的 Promise。在 Promise 链中，每个 Promise 的状态都会受到前一个 Promise 的影响，因此需要保证每个 Promise 都能正确处理自己的状态。

4. 错误处理：当 Promise 被拒绝时，可以通过 catch() 方法或在 then() 方法中传入第二个参数来处理错误。需要保证错误能够正确地冒泡，并且能够捕获到所有可能出现的错误。

5. 静态方法：Promise 还有一些静态方法，例如 Promise.all()、Promise.race()、Promise.resolve() 和 Promise.reject() 等。这些方法与实例方法有所不同，需要额外注意实现。

6. 链式调用的值传递：在链式调用中，每个 then() 方法可以返回一个值或一个新的 Promise。如果返回一个值，后续的 then() 方法应该接收到这个值。如果返回一个新的 Promise，后续的 then() 方法应该等待这个 Promise 完成，并接收到它的结果。
:::

```js
class myPromise {
    // 三种状态
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';

    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        this.PromiseResult = null;
        // 保存then回调函数的队列
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        // bind使this指向正确
        try { func(this.resolve.bind(this), this.reject.bind(this)) }
        catch (error) { this.reject(error) };
    }

    resolve(value) { this.changeState(myPromise.FULFILLED, value) };
    reject(value) { this.changeState(myPromise.REJECTED, value) };

    // 改变状态
    changeState(state, result) {
        if (this.PromiseState !== myPromise.PENDING) return
        this.PromiseState = state;
        this.PromiseResult = result;
        state === myPromise.FULFILLED ?
            this.onFulfilledCallbacks.forEach(callback => { callback() })
            : this.onRejectedCallbacks.forEach(callback => { callback() });
    }


    runOnce(promise2, callback, resolve, reject, state) {
        try {
            if (typeof callback !== 'function') {
                state ? resolve(this.PromiseResult) : reject(this.PromiseResult)
            } else {
                const x = callback(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
            }
        } catch (e) { reject(e) }
    }

    // then 方法
    then(onFulfilled, onRejected) {
        const promise2 = new myPromise((resolve, reject) => {
            switch (this.PromiseState) {
                case myPromise.FULFILLED:
                    setTimeout(() => {
                        this.runOnce(promise2, onFulfilled, resolve, reject, true)
                    });
                    break;

                case myPromise.REJECTED:
                    setTimeout(() => {
                        this.runOnce(promise2, onRejected, resolve, reject, false)
                    });
                    break;

                default:
                    this.onFulfilledCallbacks.push(() => {
                        setTimeout(() => {
                            this.runOnce(promise2, onFulfilled, resolve, reject, true)
                        });
                    });
                    this.onRejectedCallbacks.push(() => {
                        setTimeout(() => {
                            this.runOnce(promise2, onRejected, resolve, reject, false)
                        })
                    });
                    break;
            }
        })
        return promise2
    }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
    if (x === promise2) throw new TypeError('Chaining cycle detected for promise');

    if (x instanceof myPromise)
        x.then(y => { resolvePromise(promise2, y, resolve, reject) }, reject);
    else if (x !== null && ((typeof x === 'object' || (typeof x === 'function')))) {
        try {
            var then = x.then;
        } catch (e) { return reject(e) }

        if (typeof then === 'function') {
            let called = false;
            try {
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, r => {
                    if (called) return;
                    called = true;
                    reject(r);
                })
            } catch (e) {
                if (called) return;
                called = true;
                reject(e);
            }
        } else resolve(x);

    } else return resolve(x);
}
```

## 节流防抖

### 函数节流
::: tip
函数节流：续触发事件但是在 n 秒中只执行一次函数，节流会稀释函数的执行频率。
:::
```js
// 定时器版
function throttle(func, wait) {
    let timer = null;
    return function (...args) {
        let context = this;
        if (timer === null) {
            timer = setTimeout(() => {
                timer = null;
                func.apply(context, args);
            }, wait)
        }
    }
}

// 时间戳版
function throttle(func, wait) {
    // 时间戳版
    let previous = 0;
    return function (...args) {
        let now = Date.now();
        if (now - previous >= wait) {
            previous = now;
            func.apply(this, args);
        }
    }
}
```

### 函数防抖
::: tip
函数防抖：触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
:::
```js
// 非立即执行版
function debounce(func, delay) {
	let timer = null;
	return function (...args) {
		const context = this;
		if (timer !== null) clearTimeout(timer);
		timer = setTimeout(() => {
      timer = null;
			func.apply(context, args);
		}, delay);
	};
}

// 立即执行版
function debounce(func, delay) {
    let timer = null;
    return function (...arg) {
        const context = this;
        if (timer !== null) clearTimeout(timer);
        const callNow = !timer;
        timer = setTimeout(() => {
            timer = null;
        }, delay)
        if (callNow) func.apply(context, arg);
    }
}

// 双剑合璧版
/**
 * @desc 函数防抖
 * @param {Function} func 函数
 * @param {Number} wait 延迟执行毫秒数
 * @param {Boolean} immediate true 表立即执行，false 表非立即执行
 */
function debounce(func, wait, immediate) {
	let timer = null;
	return immediate
		? function (...arg) {
        const context = this;
        if (timer !== null) clearTimeout(timer);
        const callNow = !timer;
        timer = setTimeout(() => {
            timer = null;
        }, wait)
        if (callNow) func.apply(context, arg);
      }
		: function (...arg) {
				const context = this;
				if (timer !== null) clearTimeout(timer);
				timer = setTimeout(() => {
          timer = null;
					func.apply(context, arg);
				}, wait);
		  };
}
```

## 手写 instanceof
::: tip
`instanceof` 原理是在对象原型链中是否能找到执行类型的 `prototype`
:::
```js
function myInstanceOf (left, right) {
  if (typeof left !== 'object') return false;
  while(true) {
    if (left === null) return false;
    if (left.__proto__ === right.prototype) return true;
    left = left.__proto__;
  }
}
```

## 实现 setInterval
::: tip
用`requestAnimationFrame`实现`setInterval`方法
:::
```js
const obj = {
  timer: null,
  setInterval: function (callback, interval) {
    const now = Date.now
    let startTime = now()
    let endTime = startTime
    const self = this
    const loop = function () {
      self.timer = requestAnimationFrame(loop)
      endTime = now()
      if (endTime - startTime >= interval) {
        startTime = endTime = now()
        callback && callback()
      }
    }
    this.timer = requestAnimationFrame(loop)
    return this.timer
  },
  clearInterval: function () {
    cancelAnimationFrame(this.timer)
  }
}
```

## 实现深拷贝
::: tip
通过递归实现深拷贝。  
`WeakMap` 弱引用优化循环引用。  
工作中还是推荐直接使用`lodash`的深拷贝方法。
:::
```js
function deepClone(source, map = new WeakMap()) {
    // 如果不是复杂数据类型 或者为 null，直接返回
    if (typeof source !== "object" || source === null) return source;
    if (source instanceof RegExp) return new RegExp(source);
    if (source instanceof Date) return new Date(source);
    if (source instanceof Error) return new Error(source);

    // 解决循环引用 obj[key] = obj
    if (map.has(source)) return map.get(source);
    const cloneObj = Array.isArray(source) ? [] : {};
    map.set(source, cloneObj);

    for (const key in source) {
        // 筛掉对象原型链上继承的属性
        if (source.hasOwnProperty(key))
            cloneObj[key] = deepClone(source[key], map);
    }
    return cloneObj;
}


const data = {
    name: 'Jack',
    date: [new Date(1536627600000), new Date(1540047600000)],

    reg: new RegExp("\\w+"),
    err: new Error('"x" is not defined'),

    func: function () { console.log(1) },
    val: undefined,
    sym: Symbol('foo'),

    nan: NaN,
    infinityMax: Infinity,
}

console.log(deepClone(data));
```

## 手写数组方法

### flat
```js
function flat(arr = [], depth = 1) {
	if (arr.length === 0 || depth < 1) return arr;
	return arr.reduce(
		(pre, cur) =>
			pre.concat(Array.isArray(cur) ? flat(cur, --depth) : cur),
		[]
	);
}
```

### map
```js
Array.prototype.myMap = function (callback, context) {
	return this.reduce((pre, cur, index, arr) => {
		pre[index] = callback.call(context, cur, index, arr);
		return pre;
	}, []);
};
```

### reduce
```js
Array.prototype.myReduce = function (callback, initialValue) {
	if (typeof callback !== "function") {
		throw new TypeError(`${callback} is not a function`);
	}

	const n = this.length;
	let index = 0;
	let result;

	// 处理初始值
	if (initialValue) {
		result = initialValue;
	} else {
		if (n === 0) {
			throw new TypeError(
				"Reduce of empty this with no initial value"
			);
		}
		result = this[index++];
	}

	while (index < n) {
		if (index in this) {
			result = callback(result, this[index], index, this);
		}
		index++;
	}
	return result;
};
```

## 数组去重
```js
const arr = [1, 2, 2, 'abc', 'abc', true, true, false, false, undefined, undefined, NaN, NaN]

// Set
const result = Array.from(new Set(arr));

// Reduce
const result = arr.reduce((pre, cur) =>
 !pre.includes(cur) ? (pre.push(cur), pre) : pre, []
);

// filter
const result = arr.filter((item, index) => arr.indexOf(item) === index)
```

## 实现Object.create
```js
function create(proto, propertiesObject) {
	if (!(proto === null || typeof proto === "object" || typeof proto === "function")) {
		throw new TypeError(
			"Object prototype may only be an Object or null"
		);
	}

	// 设置原型
	function F() {}
	F.prototype = proto;
	const result = new F();

	// 兼容第二个参数
	if (propertiesObject !== null && propertiesObject !== undefined) {
		Object.defineProperties(result, propertiesObject);
	}

	// 兼容null
	if (proto === null) result.__proto__ = null;
    
	return result;
}
```

## 函数柯里化
::: tip
**柯里化：**又称部分求值，一个柯里化参数首先会接受一些参数，接受这些参数之后，该函数并不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来，待到合适的时机一起求值。
:::
```js
function curry(fn) {
    return function curried(...args) {
		if (args.length >= fn.length) {
			return fn.apply(this, args);
		} else {
			return function (...moreArgs) {
				return curried.apply(this, args.concat(moreArgs));
			};
		}
	};
}
```

## 实现继承
```js
function inherit(subType, superType) {
	// 继承父类原型上的属性
	const prototype = Object.create(superType.prototype);
	// 将constructor指向子类构造器
	prototype.constructor = subType;
	// 存储父类
	subType.super = superType;
	// 继承静态属性
	Object.setPrototypeOf(subType, superType);
}
```

## 实现JSONP
```js
// 动态的加载js文件
function JSONP(url, callback) {
	url = `${url}?callback=${callback}`;
	const script = document.createElement("script");
	script.src = url;
	document.body.appendChild(script);
}
```