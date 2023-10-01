# 手写系列

## 获取地址栏参数值
::: tip
webAPI `window.location.search` 获取搜索字符串。
:::
```js
function getQueryString(name){
    const str =  window.location.search.substring(1);
    const reg = new RegExp(`(?:^|&)${name}=([^&]+)(?:$|&)`)
    const result = str.match(reg);
    return result === null ? null : result[1];
}
```

## 实现 EventEmitter 发布订阅模式
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

## 手写 setInterval
::: tip
用`requestAnimationFrame`实现自己的`setInterval`方法
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
let count = 0
const timer = obj.setInterval(() => {
  console.log('interval...')
  count++
  if (count >= 3) {
    obj.clearInterval()
  } 
}, 500)
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

## 深拷贝
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

### 手写对象属性值迭代器
::: tip
自定义对象属性值迭代器，使之能使用`for of`循环遍历对象属性的值
:::
```js
var obj = {
  name: 'AAA',
  age: 23,
  address: '广州'
}
Object.defineProperty(obj, Symbol.iterator, {
  writable: false,
  enumerable: false,
  configurable: true,
  value: function() {
    var self = this;
    var index = 0;
    var keys = Object.keys(self);
    return {
      next: function() {
        return {
          done: index >= keys.length,
          value: self[keys[index++]]
        }
      }
    }
  }
})
for (const val of obj) {
  console.log(`属性值为：${val}`);
}
```

### 手写图片懒加载
::: tip
图片懒加载是一种常用的技术，如果直接给某个img标签设置src属性，由于图片过大或者网络不佳，图片的位置会出现一片空白，图片懒加载就是使用一个`loading`图片来进行站位，等真正的图片加载完毕后再显示出来。
:::

#### 不使用代理模式实现图片懒加载
```js
const loadingSrc = 'https://www.imooc.com/static/img/index/logo2020.png'
const imgSrc = 'https://img1.sycdn.imooc.com/5c09123400014ba418720632.jpg'
const myImage = (function () {
  const imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  const img = new Image()
  img.onload = function () {
    imgNode.src = img.src
  }
  return {
    setSrc: function (src) {
      imgNode.src = loadingSrc
      img.src = src
    }
  }
})()
myImage.setSrc(imgSrc)
```

#### 使用代理模式实现图片懒加载
```js
const loadingSrc = 'https://www.imooc.com/static/img/index/logo2020.png'
const imgSrc = 'https://img1.sycdn.imooc.com/5c09123400014ba418720632.jpg'
const myImage = (function(){
  const imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  return {
    setSrc: function (src) {
      imgNode.src = src
    }
  }
})()
const proxyImage = (function(){
  const img = new Image()
  img.onload = function () {
    myImage.setSrc(img.src)
  }
  return {
    setSrc: function (src) {
      myImage.setSrc(loadingSrc)
      img.src = src
    }
  }
})()
proxyImage.setSrc(imgSrc)
```

### 手写事件委托
::: tip 题目
循环创建10个li标签，当点击li标签时，打印其对应的索引
:::
```html
<ul id="list"></ul>
```
```js
function loadNode(len) {
  var html = '';
  for (let index = 0; index < 10; index++) {
    html += '<li>'+index+'</li>';
  }
  var list = document.getElementById('list');
  list.onclick = function(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    if(target.nodeName.toLowerCase() === 'li') {
      console.log(target.innerText);
    }
  }
  list.innerHTML = html;
}
loadNode();
```

### 手写原生Ajax请求
::: tip 原生ajax步骤
1. 创建`XMLHttpRequest`对象
2. 使用`open`方法设置和服务器的交互信息
3. 使用`send`发送数据
4. 注册事件
:::

#### get请求
```js
var xhr = new XMLHttpRequest();
xhr.open('get','https://www.baidu.com/getUserInfo?name=AAA&age=18');
xhr.send();
xhr.onreadystatechange = function() {
  if(xhr.readyState ==4 && xhr.status==200) {
    console.log('请求成功');
  }
}
```
#### post请求
```js
var xhr = new XMLHttpRequest();
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.open('post','https://www.baidu.com/getUserInfo');
xhr.send('name=AAA&age=18');
xhr.onreadystatechange = function() {
  if(xhr.readyState ==4 && xhr.status==200) {
    console.log('请求成功');
  }
}
```

### 手写函数AOP
::: tip
AOP(面向切面编程)的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，这些跟业务逻辑无关的功能通常包括日志统计，安全控制，异常处理等。把这些功能抽离出来后，再通过动态织入的方式掺入业务逻辑模块中
:::
```js
Function.prototype.before = function (beforeFn) {
  const self = this
  return function beforeFunc () {
    const args = arguments
    beforeFn.apply(this, args)
    return self.apply(this, args)
  }
}
Function.prototype.after = function (afterFn) {
  const self = this
  return function afterFunc () {
    const args = arguments
    const result = self.apply(this, args)
    afterFn.apply(this, args)
    return result
  }
}
function func () {
  console.log('2')
}
const newFunc = func.before(() => {
  console.log('1')
}).after(() => {
  console.log('3')
})
newFunc() // 1 2 3
```

### 手写柯里化
**柯里化**：又称部分求值，一个柯里化参数首先会接受一些参数，接受这些参数之后，该函数并不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来，待到合适的时机一起求值。<br>
```js
// 通用的柯里化
var currying = function(fn) {
  var args = [];
  return function() {
    if(arguments.length==0) {
      return fn.apply(this,args);
    } else {
      Array.prototype.push.apply(args,arguments);
      return arguments.callee;
    }
  }
}

var cost = (function(){
  var money = 0;
  return function() {
    for(var i = 0,len = arguments.length;i<len;i++) {
      money +=arguments[i];
    }
    return money;
  }
})()
var cost = currying(cost);
cost(100);
cost(200);
cost(20);
cost(10);
console.log(cost()); // 输出330
```

### 手写分时函数
::: tip
分时函数案例：把1秒创建1000个DOM节点，改成每隔200毫秒创建10个节点，这样不用短时间在页面中创建大量的DOM。
:::
```js
var timeChunk = function(arr,fn,count,interval) {
  var timer = null;
  var data = null;
  var start = function() {
    for(var i = 0 ; i < Math.min(count || 1 , arr.length) ; i++) {
      fn(arr.shift());
    }
  }
  return function() {
    timer = setInterval(function(){
      if(arr.length == 0) {
        clearInterval(timer);
        timer = null;
        return;
      }
      start();
    }, interval || 200)
  }
}

var arr = [];
for(var i = 0 ; i < 1000 ; i++) {
  arr.push(i);
}

var renderDOMList = timeChunk(arr, function(data) {
  var div = document.createElement('div');
  div.innerHTML = data;
  document.body.appendChild(div);
},10,200);
renderDOMList();
```


### 手写JSONP
::: tip 原理
JSONP实现跨域的原理是利用`script`标签没有跨域限制，通过`src`指向一个`ajax`的URL，最后跟一个回调函数`callback`
:::
```js
function JSONP (url, data, callback) {
  const cbName = 'callback_' + new Date().getTime()
  const queryString = normalizeParams(data)
  const hasIndex = url.indexOf('?') !== -1
  url = `${hasIndex ? url : url + '?'}${queryString}&jsoncallback=${cbName}`
  const script = document.createElement('script')
  script.src = url
  window[cbName] = function (data) {
    callback(data)
    document.body.removeChild(script)
  }
  document.body.appendChild(script)
}
function normalizeParams (data) {
  if (!data || Object.keys(data).length === 0) {
    return ''
  }
  return Object.keys(data).map((key, index) => {
    return `${index ? '&' : ''}${key}=${data[key]}`
  })
}
const params = {
  name: 'AAA',
  age: 23,
  address: '广东'
}
JSONP('https://www.runoob.com/try/ajax/jsonp.php', params, function (data) {
  console.log(data)
})
```

### 手写 new
`new`操作符调用构造函数的过程如下：
1. 创建一个空对象
2. 将空对象的`__proto__`指向构造函数的`prototype`
3. 将这个空对象赋值给构造函数内部的`this`，并执行构造函数
4. 根据构造函数的逻辑，返回第一步创建的对象或者构造函数显示的返回值
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

### 手写 extends
```js
function inherit (child, parent) {
  // 1.继承父类原型上的属性
  child.prototype = Object.create(parent.prototype)
  // 2.修复子类的构造函数
  child.prototype.constructor = child
  // 3.存储父类
  child.super = parent
  // 4.继承静态属性
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(child, parent)
  } else if (child.__proto__) {
    child.__proto__ = parent
  } else {
    for (const key in parent) {
      if (parent.hasOwnProperty(k) && !(k in child)) {
        child[key] = parent[key]
      }
    }
  }
}
// 父类
function Parent (name) {
  this.name = name
  this.parentColors = ['red']
}
Parent.prototype.sayName = function () {
  console.log(this.name)
}
Parent.create = function (name) {
  return new Parent(name)
}
// 子类
function Child (name) {
  this.name = name
  this.childColors = ['green']
}
// 继承
inherit(Child, Parent)

// test
const child1 = new Child('child1')
console.log(child1 instanceof Child)  // true
console.log(child1 instanceof Parent) // true
console.log(child1.name)              // child1
console.log(child1.childColors)       // ['green']
console.log(child1.parentColors)      // undefined

const child2 = Child.create('child2')
console.log(child2 instanceof Child)  // false
console.log(child2 instanceof Parent) // true
console.log(child2.name)              // child2
console.log(child2.childColors)       // undefined
console.log(child2.parentColors)      // ['red']
```

### 手写Object.create方法
```js
function create (obj, properties) {
  const strType = typeof obj
  const isObject = strType === 'object' || strType === 'function'
  const isUndefined = strType === 'undefined'
  if (isUndefined || !isObject) {
    throw new TypeError('Object prototype may only be an Object or null')
  }
  // 设置原型
  function F () {}
  F.prototype = obj
  const ret = new F()
  // 兼容第二个参数
  if (properties !== null && properties !== undefined) {
    Object.defineProperties(ret, properties)
  }
  // 兼容null
  if (obj === null) {
    ret.__proto__ = null
  }
  return ret
}
const obj = {
  age: 23,
  name: 'AAA'
}
const myObj1 = create(obj, {
  address: {
    value: '广东'
  }
})
const originObj1 = Object.create(obj, {
  address: {
    value: '广东'
  }
})
console.log(myObj1.name)        // 23
console.log(myObj1.address)     // 广东
console.log(originObj1.name)    // 23
console.log(originObj1.address) // 广东

const myObj2 = create(null)
const originObj2 = Object.create(null)
console.log('toString' in myObj2)     // false
console.log('toString' in originObj2) // false
```

### 手写数组降维flat方法
原生`Array.prototype.flat`方法接受一个`depth`参数，默认值为`1`，`depth`表示要降维的维数：
```js
const arr = [1, [2, 3], [4, [5, 6]]]
console.log(arr.flat(1))         // [1, 2, 3, 4, [5, 6]]
console.log(arr.flat(Infinity))  // [1, 2, 3, 4, 5, 6]
```

#### reduce + 递归实现方案
```js
// MDN: 可查看更多flat实现方法
function flat (arr = [], depth = 1) {
  if (arr.length === 0) {
    return []
  }
  let result = []
  if (depth > 0) {
    result = arr.reduce((acc, val) => {
      return acc.concat(Array.isArray(val) ? flat(val, depth - 1) : val)
    }, [])
  } else {
    result = arr.slice()
  }
  return result
}
const arr = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]]
const myResult1 = flat(arr, 1)
const originResult1 = arr.flat(1)
const myResult2 = flat(arr, Infinity)
const originResult2 = arr.flat(Infinity)
console.log(myResult1)      // [1, 2, 3, 1, 2, 3, 4, [2, 3, 4]]
console.log(originResult1)  // [1, 2, 3, 1, 2, 3, 4, [2, 3, 4]]
console.log(myResult2 )     // [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]
console.log(originResult2 ) // [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]
```

#### forEach + 递归实现方案
```js
// MDN: 可查看更多flat实现方法
function flat (arr = [], depth = 1) {
  if (arr.length === 0) {
    return []
  }
  const result = [];
  // 注意：立即执行函书前的语句必须要有分号
  (function flatFunc(arr, depth) {
    arr.forEach(item => {
      if (Array.isArray(item) && depth > 0) {
        flatFunc(item, depth - 1)
      } else {
        result.push(item)
      }
    })
  })(arr, depth)
  return result
}
const arr = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]]
const myResult1 = flat(arr, 1)
const originResult1 = arr.flat(1)
const myResult2 = flat(arr, Infinity)
const originResult2 = arr.flat(Infinity)
console.log(myResult1)      // [1, 2, 3, 1, 2, 3, 4, [2, 3, 4]]
console.log(originResult1)  // [1, 2, 3, 1, 2, 3, 4, [2, 3, 4]]
console.log(myResult2 )     // [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]
console.log(originResult2 ) // [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]
```

#### generator方案
```js
// MDN: 可查看更多flat实现方法
function * flat (arr = [], depth = 1) {
  if (arr.length === 0) {
    return []
  }
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      yield * flat(item, depth - 1)
    } else {
      yield item
    }
  }
}
const arr = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]]
const myResult1 = [...flat(arr, 1)]
const originResult1 = arr.flat(1)
const myResult2 = [...flat(arr, Infinity)]
const originResult2 = arr.flat(Infinity)
console.log(myResult1)      // [1, 2, 3, 1, 2, 3, 4, [2, 3, 4]]
console.log(originResult1)  // [1, 2, 3, 1, 2, 3, 4, [2, 3, 4]]
console.log(myResult2 )     // [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]
console.log(originResult2 ) // [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]
```

### 手写数组map方法
`map`方法接受两个参数，其中第二个参数为`callback`回调函数执行时的`this`。

#### while循环方案
```js
// MDN: Array.prototype.map
Array.prototype.myMap = function (callback, context) {
  if (this === null) {
    throw new TypeError('this is null or not defined')
  }
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`)
  }
  let arr = Object(this)
  let thisArg = arguments.length > 1 ? arguments[1] : undefined
  const len = arr.length >>> 0
  let result = new Array(len)
  let index = 0
  while (index < len) {
    let value, mapValue
    if (index in arr) {
      value = arr[index]
      mapValue = callback.call(this.thisArg, value, index, arr)
      result[index] = mapValue
    }
    index++
  }
  return result
}
const arr = [1, 2, 3, , 4]
const myResult = arr.myMap(value => value + 1)
const originResult = arr.map(value => value + 1)
console.log(myResult)     // [2, 3, 4, empty, 5]
console.log(originResult) // [2, 3, 4, empty, 5]
```

#### reduce方案
```js
// MDN: Array.prototype.reduce
Array.prototype.myMap = function (callback, context) {
  return this.reduce((acc, cur, index, array) => {
    acc[index] = callback.call(context, cur, index, array)
    return acc
  }, [])
}
const arr = [1, 2, 3, , 4]
const myResult = arr.myMap(value => value + 1)
const originResult = arr.map(value => value + 1)
console.log(myResult)     // [2, 3, 4, empty, 5]
console.log(originResult) // [2, 3, 4, empty, 5]
```

### 手写数组reduce方法
此小节先介绍`reduce`方法的实现，再介绍基于`reduce`方法的两个经典案例。
#### reduce实现
```js
// MDN: Array.prototype.reduce
Array.prototype.myReduce = function (callback, initialValue) {
  if (this === null) {
    throw new TypeError('Array.prototype.reduce called on null or undefined')
  }
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`)
  }
  const array = Object(this)
  const len = array.length >>> 0
  let index = 0
  let result
  // 处理初始值
  if (arguments.length > 1) {
    result = initialValue
  } else {
    // example: [,,,,5]
    while(index < len && !(index in array)) {
      index++
    }
    if (index >= len) {
      throw new TypeError('Reduce of empty array with no initial value')
    }
    value = array[index++]
  }
  while (index < len) {
    if (index in array) {
      result = callback(result, array[index], index, array)
    }
    index++
  }
  return result
}
const array = [1, , 2, 3, , , 5]
const myResult = array.myReduce((acc, cur) => acc + cur, 0)
const originResult = array.reduce((acc, cur) => acc + cur, 0)
console.log(myResult)     // 11
console.log(originResult) // 11
```

#### 基于reduce顺序执行promise
```js
function p1 (val) {
  return new Promise(resolve => {
    resolve(val * 1)
  })
}
function p2 (val) {
  return new Promise(resolve => {
    resolve(val * 2)
  })
}
function p3 (val) {
  return val * 3
}
function runPromiseInSequence (promiseArr, val) {
  return promiseArr.reduce((promiseChain, currentFunc) => {
    return promiseChain.then(currentFunc)
  }, Promise.resolve(val))
}

const promiseArr = [p1, p2, p3]
runPromiseInSequence(promiseArr, 1).then(console.log) // 6
```

#### 基于reduce实现管道函数pie
```js
// pie顺序执行每一个参数函数
const pieFunc1 = x => x + 1
const pieFunc2 = x => x + 2
const pieFunc3 = x => x + 3
function pie () {
  const funcArr = [...arguments]
  return function (val) {
    return funcArr.reduce((acc, fn) => {
      acc = fn(acc)
      return acc
    }, val)
  }
}
const func1 = pie(pieFunc1, pieFunc2)
const func2 = pie(pieFunc1, pieFunc3)
console.log(func1(0))   // 3
console.log(func2(10))  // 14
```

### 手写数组去重方法
数组去重有很多种方法，这里只介绍两种：`Set`结构去重和`reduce`方法去重。
```js
// 定义变量
const arr = [1, 2, 3, 1, 3, 4, 5, 4]
let uniqueArray = []

// 1.Set结构去重
uniqueArr = Array.from(new Set(arr))
console.log(uniqueArr) // [1, 2, 3, 4, 5]

// 2.reduce方法去重
function deDuplicationArray (array) {
  if (!array || array.length === 0) {
    return []
  }
  return array.reduce((acc, cur) => {
    if (acc.indexOf(cur) === -1) {
      acc.push(cur)
    }
    return acc
  }, [])
}
uniqueArr = deDuplicationArray(arr)
console.log(uniqueArr) // [1, 2, 3, 4, 5]
```

### 手写基于发布/订阅的事件系统
事件系统包括如下几个方法：
1. `on`监听事件方法。
2. `off`取消监听事件方法。
3. `emit`触发事件方法。
4. `once`绑定一次事件监听方法。
```js
function invokeCallback (callback, context, args) {
  try {
    callback && callback.apply(context, args)
  } catch {
    console.log('invoke callback error')
  }
}
const event = {
  subs: {},
  on: function (event, callback) {
    if (Array.isArray(event)) {
      for (let index = 0; index < event.length; index++) {
        this.on(event[index], callback)
      }
    } else {
      if (!this.subs[event]) {
        this.subs[event] = []
      }
      this.subs[event].push(callback)
    }
  },
  off: function (event, callback) {
    // 1、一个参数都没有，解绑全部
    // 2、只传event，解绑改event所有事件
    // 3、两个参数都传递，只移除指定某一个
    if(!arguments.length) {
      this.subs = Object.create(null)
      return
    }
    if (Array.isArray(event)) {
      for (let index = 0; index < event.length; index++) {
        this.off(event[index], callback)
      }
      return
    }
    const cbs = this.subs[event]
    if (!cbs || cbs.length === 0) {
      return
    }
    if (!callback) {
      this.subs[event] = null
      return
    }
    let cb
    let i = cbs.length
    while(i--) {
      cb = cbs[i]
      if (cb === callback || cb.fn === callback) {
        cbs.splice(i, 1)
        break
      }
    }
  },
  once: function (event, callback) {
    const self = this
    function on () {
      self.off(event, on)
      callback.apply(self, arguments)
    }
    this.on(event, on)
  },
  emit: function (event) {
    const cbs = this.subs[event]
    if (cbs && cbs.length > 0) {
      const args = [...arguments].slice(1)
      for (let index = 0, len = cbs.length; index < len; index++) {
        invokeCallback(cbs[index], this, args)
      }
    }
  }
}
const speakCallback1 = () => {
  console.log('speak callback1')
}
const speakCallback2 = () => {
  console.log('speak callback2')
}
const combineCallback = () => {
  console.log('write or listen callback')
}
const runningCallback1 = (msg) => {
  console.log('running callback1')
}
const runningCallback2 = (msg) => {
  console.log('running callback2')
}
event.on('speak', speakCallback1)
event.on('speak', speakCallback2)
event.on(['write', 'listen'], combineCallback)
event.once('running', runningCallback1)
event.once('running', runningCallback2)

event.emit('speak')   // speak callback1, speak callback2
event.emit('running') // running callback1
event.emit('running') // running callback2
event.emit('write')   // write or listen callback

event.off('speak', speakCallback1)
event.off(['write', 'listen'])
event.emit('speak')   // speak callback2
event.emit('write')   //
event.emit('listen')  // 

event.off()
event.emit('speak')   // 
event.emit('running') //
```


### 手写Vue nextTick方法
`nextTick`支持两种形式使用方式：
1. 回调函数形式。
2. 如果当前环节支持`Promise`，还支持`Promise.then`的形式。
```js
this.$nextTick(() => {
  // callback形式
})
this.$nextTick().then(() => {
  // Promise.then形式
})
```
基于`Vue`源码，`nextTick`手写代码如下：
```js
let pending = false
let timeFunc
const callbacks = []
function flushCallbacks () {
  pending = false
  const cbs = callbacks.slice()
  callbacks.length = 0
  for (let index = 0, len = cbs.length; index < len; index++) {
    cbs[index]()
  }
}

function invokeCallback (callback, context) {
  try {
    callback.call(context)
  } catch {
    console.log('invoke nextTick callback error')
  }
}

function nextTick (cb, context) {
  context = context || window
  let _resolve
  callbacks.push(() => {
    if (cb) {
      invokeCallback(cb, context)
    } else if (_resolve) {
      _resolve(context)
    }
  })
  if (!pending) {
    pending = true
    timeFunc()
  }
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
function setTimeFunc () {
  if (typeof Promise !== 'undefined') {
    const p = Promise.resolve()
    timeFunc = () => {
      p.then(flushCallbacks)
    }
  } else if (typeof MutationObserver !== 'undefined') {
    let number = 1
    const observer = new MutationObserver(flushCallbacks)
    const textNode = document.createTextNode(String(number))
    observer.observe(textNode, {
      characterData: true
    })
    timeFunc = () => {
      number = (number + 1) % 2
      textNode.data = number
    }
  } else if (typeof setImmediate !== 'undefined') {
    timeFunc = () => {
      setImmediate(flushCallbacks)
    }
  } else {
    timeFunc = () => {
      setTimeout(flushCallbacks, 0)
    }
  }
}
setTimeFunc()

nextTick(() => {
  console.log('nextTick callback')
})
nextTick().then(() => {
  console.log('nextTick promise')
})
```
