---
sidebar: auto
---
# JavaScript基础

## 数据类型

### 原始类型
::: tip
JavaScript 中原始类型有七种，原始类型既只保存原始值，是没有函数可以调用的。
:::

#### 七种原始类型
```js
string
number
boolean
null
undefined
symbol // ES6新增，表示独一无二的值
bigint // ES6新增，以n结尾，表示超长数据
```

::: warning 注意
为什么说原始类型没有函数可以调用，但如`'string'.toString()`却又可以在浏览器中正确执行？
:::
因为`'string'.toString()`中的字符串`'string'`在这个时候会被封装成其对应的字符串对象，以上代码相当于`new String('string').toString()`，因为`new String('string')`创建的是一个`String`对象，而这个对象里是存在`toString()`方法的。

#### null undefined undeclared 的区别
1. `null`表示空，什么都没有，不存在的对象，他的数据类型是object。
2. `undefined`表示未定义，常见的为`undefined`情况： 
   - 变量声明未赋值
   - 函数执行但没有明确的返回值
   - 获取一个对象上不存在的属性或方法
3. 变量声明未赋值，是`undefined`,未声明的变量，是`undeclared`

### 引用类型
::: tip
在 JavaScript 中，除了原始类型，其他的都是引用类型，引用类型存储的是地址，而原始类型存储的是值。基本数据类型存储在栈中，引用数据类型存储在堆中。
:::
```js
const a = [];
const b = a;
a.push(1);
console.log(b); // [1]
```

## 类型转换

### 类型转换
`JavaScript`中，类型转换只有三种：
1. 转换成数字
2. 转换成布尔值
3. 转换成字符串

### 转string
* `.toString()`
* `String()`
::: warning 注意
`Sting()`函数相可以将`null`和`undefined`转化为字符串，`.toString()`转化会报错。
:::

### 转number
* `Number()`
* `parseInt()`
* `parseFloat()`
::: tip
* `Number()`函数会将合法字符串转化成数字，不合法则转化为`NAN` ，空字符串转化为`0`，`null`和`undefined`转`0`和`NAN`，`true`转`1`，`false`转`0`。
* `parseInt()`是从左向右获取一个字符串的合法整数位。
* `parseFloat()`获取字符串的所有合法小数位。
:::

### 转boolean
除了`undefined`、`null`、`false`、`0`、`-0`、`NaN`和空字符串转换成`false`以外，其他所有值都转换成`true`，包括所有对象。

### 隐式转换
常用的隐式类型转换有：
1. 任意值 + 空字符串 转字符串
2. `+a`转`number`
3. `a-0`转`number`

### 引用类型转原始类型
引用类型转原始类型，会调用内置的[ToPrimitive]函数，对于该函数而言，其逻辑如下：
1. 是否已经是原始类型，是则直接返回
2. 调用`valueOf()`，如果转换为原始类型，则返回
3. 调用`toString()`，如果转换为原始类型，则返回
4. 也可以重写`Symbol.toPrimitive()`方法，优先级别最高
5. 如果都没有返回原始类型，会报错
```js
const obj = {
  value: 0,
  valueOf() {
    return 1;
  },
  toString() {
    return '2'
  },
  [Symbol.toPrimitive]() {
    return 3
  }
}
console.log(obj + 1); // 4
```

### 经典类型面试题

```js
console.log([]==![]); // true

// 分析：
// 1. 左侧是一个对象(数组)
// 2. 右侧是一个布尔值，因为除了null所有对象都转换成布尔值都是true，所以![]结果为false
// 3. 此时相当于 对象==布尔值 ，依据类型转换规则，转换成数字类型进行比较
// 4. 对象(空数组)转换成0 ，布尔值false转换成0
// 5. 即0==0 ，返回true
```

```js
// 如何使if(a==1&&a==2&&a==3) {console.log('true')};正确打印'true'
const a = {
  value: 0,
  valueOf() {
    this.value++;
    return this.value;
  }
}
if(a==1 && a==2 && a==3) {console.log('true')} // true

// 分析：
// 1. 重写对象`a`的`valueOf()`方法，使`value`属性每次调用时自增
// 2. 当判断`a==1`时，第一次调用`valueOf()`方法，此时`value`等于1，判断`1==1`，继续向下走
// 3. 判断`a==2`时，第二次调用`valueOf()`方法，此时`value`等于2，判断`2==2`，继续向下走
// 4. 判断`a==3`时，第三次调用`valueOf()`方法，此时`value`等于3，判断`3==3`，`if`判断结束
// 5. `if`条件判断为`true && true && true`，执行`console.log('true')`，打印`true`
```

### == 和 ===

=== 严格相等
::: tip
`===`严格相等，指：左右两边不仅值要相等，类型也要相等。
:::

== 不严格相等
::: tip
`==`不像`===`那样严格，对于一般情况，只要值相等，就返回`true`，但`==`还涉及一些类型转换，它的转换规则如下：
* 两边的类型是否相同，相同的话就比较值的大小，例如`1==2`，返回`false`
* 类型不相同会进行类型转换
* 判断的是否是`null`和`undefined`，是的话就返回`true`
* 判断的类型是否是`String`和`Number`，是的话，把`String`类型转换成`Number`，再进行比较
* 判断其中一方是否是`Boolean`，是的话就把`Boolean`转换成`Number`，再进行比较
* 如果其中一方为`Object`，且另一方为原始类型，会将`Object`转换成原始类型后，再进行比较
:::

## 数据类型的判断

### typeof 
::: tip
`typeof`的返回值有八种，返回值是字符串，`typeof`能准确判断除`null`以外的原始类型的值，对于对象类型，除了函数会判断成`function`，其他对象类型一律返回`object`
:::
```js
typeof 1               // number
typeof '1'             // string
typeof true            // boolean
typeof undefined       // undefined
typeof Symbol()        // symbol
typeof 1n              // bigint

typeof null            // object
typeof []              // object
typeof {}              // object
typeof new Function(); // function
```

### instanceof
::: tip
`instanceof` 通过原型链可以判断出对象的类型，但并不是百分百准确
:::
```js
function Person(name) {
  this.name = name;
}
const p = new Person();
p instanceof Person               // true

new String() instanceof String    // true
({}) instanceof Object;           // true
new Date() instanceof Date;       // true
new RegExp() instanceof RegExp;   // true
new Error() instanceof Error;     // true

(() => { }) instanceof Function;  // true
(() => { }) instanceof Object;    // true
```

### constructor
::: tip
`constructor`访问它的构造函数。既可以检测基本类型又可以检测对象，但不能检测`null`和`undefined`
:::
::: warning 注意
函数的`constructor`是不稳定，如果把函数的原型进行重写，这样检测出来的结果会不准确
:::
```js
(10).constructor === Number;         // true
[].constructor === Array;            // true
(new RegExp()).constructor === RegExp; // true
(new RegExp()).constructor === Object; // false

function Fn() { };
Fn.prototype = new Array();
(new Fn()).constructor;      // Array
(() => { }).constructor;     // Function
```

### Object.prototype.toString.call()
::: tip
获取`Object`原型上的`toString`方法，让`toString`方法中的`this`指向第一个参数的值，让方法执行，返回值是最准确的。
* 第一个object：当前实例是引用数据类型的(object)
* 第二个Object：数据类型。
:::
```js
Object.prototype.toString.call('');              // [object String]
Object.prototype.toString.call(1);               // [object Number]
Object.prototype.toString.call(true);            // [object Boolean]
Object.prototype.toString.call(1n);              // [object BigInt]
Object.prototype.toString.call(Symbol());        // [object Symbol]
Object.prototype.toString.call(undefined);       // [object Undefined]
Object.prototype.toString.call(null);            // [object Null]
Object.prototype.toString.call(new Function());  // [object Function]
Object.prototype.toString.call(new Date());      // [object Date]
Object.prototype.toString.call([]);              // [object Array]
Object.prototype.toString.call(new RegExp());    // [object RegExp]
Object.prototype.toString.call(new Error());     // [object Error]
```

## JS高级特性

### new 操作符
无论是通过字面量还是通过`new`进行构造函数调用创建出来的对象，其实都一样。调用`new`的过程如下：
1. 创建一个新对象
2. 原型绑定
3. 绑定this到这个新对象上
4. 返回新对象 

### this
::: tip
当一个函数被调用时，会创建一个执行上下文，其中`this`就是执行上下文的一个属性，`this`是函数在调用时JS引擎向函数内部传递的一个隐含参数
:::

`JavaScript`中的`this`只有如下几种情况，并按他们的优先级从低到高划分如下：
1. 独立函数调用，例如`getUserInfo()`，此时`this`指向全局对象`window`
2. 对象调用，例如`stu.getStudentName()`，此时`this`指向调用的对象`stu`
3. `call()`、`apply()`和`bind()`改变上下文的方法，`this`指向取决于这些方法的第一个参数，当第一个参数为`null`时，`this`指向全局对象`window`
4. 箭头函数没有`this`，箭头函数里面的`this`只取决于包裹箭头函数的第一个普通函数的`this`
5. `new`构造函数调用，`this`永远指向构造函数返回的实例上，优先级最高。
```js
var name = 'global name';
const fn = function() {
  console.log(this.name);
}
const Person = function(name) {
  this.name = name;
}
Person.prototype.getName = function() {
  console.log(this.name);
}
const obj = {
  name: 'lisi',
  fn:fn
}
const obj1 = {
  name: 'zhangsan'
}

// 独立函数调用，输出 global name
fn();
// 对象调用，输出lisi
obj.fn();
// 改变this指向为obj1，输出 zhangsan
obj.fn.apply(obj1);
// new 构造函数调用，输出 person
const p = new Person('person');
p1.getName();
```

### 闭包
::: tip
一个本该被销毁的变量内存空间 ，由于外部的引用导致其无法被销毁，那么他就会形成闭包
:::

闭包的几种表现形式：
1. 返回一个函数
2. 作为函数参数传递
3. 回调函数
4. 非典型闭包IIFE(立即执行函数表达式)

**返回一个函数**：这种形式的闭包在`JavaScript`的代码编写中是非常常见的一种方式。
```js
const a = 1;
function fn(){
  const a = 2;
  // 这里就形成了闭包
  return function(){
    console.log(a);
  };
};
const gn = fn();
gn(); // 输出2，而不是1
```
**作为函数参数传递**：无论通过何种手段将内部函数传递到它所在词法作用域之外，它都会持有对原始作用域的引用，无论在何处执行这个函数，都会产生闭包。
```js
const a = 1;
function foo(){
  const a = 2;
  function baz(){
    console.log(a);
  }
  bar(baz);
}
function bar(fn){
  // 这里就形成了闭包
  fn();
}
foo(); // 输出2，而不是1
```

**回调函数**：在定时器、事件监听、Ajax请求、跨窗口通信、Web Workers或者任何异步中，只要使用了回调函数，实际上就是在使用闭包。
```js
// 定时器
const time = 'timer';
setTimeout(function timeHandler(){
  console.log(time); // 'timer'
},1000);
```
**IIFE**：IIFE(立即执行函数表达式)并不是一个典型的闭包，但它确实创建了一个闭包。
```js
const a = 2;
(function IIFE(){
  // 输出2
  console.log(a);
})();
```

#### 经典循环和闭包面试题
```js
// 以下代码运行结果是什么，如何改进？
for(var i = 1; i <= 5; i++){
  setTimeout(()=>{
    console.log(i)
  }, i*1000)
};
```
**代码分析**：<br>
1. `for`循环创建了5个定时器，并且定时器是在循环结束后才开始执行
2. `for`循环结束后，用`var i`定义的变量`i`此时等于6
3. 依次执行五个定时器，都打印变量`i`，所以结果是打印5次6

**第一种方法(常用)**：在循环中使用`let i`代替`var i`
```js
for(let i = 1;i <= 5; i++){
  setTimeout(()=>{
    console.log(i)
  }, i*1000)
};
```

**第二种方法**：利用`IIFE(立即执行函数表达式)`当每次`for`循环时，把此时的`i`变量传递到定时器中
```js
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(() => {
      console.log(j)
    }, i * 1000)
  })(i);
};
```

**第三种方法**：`setTimeout`函数的第三个参数，可以作为定时器执行时的变量进行使用
```js
for (var i = 1; i <= 5; i++) {
  setTimeout(j => {
    console.log(j)
  }, i * 1000, i)
};
```

### 垃圾回收

#### 引用计数法
::: tip
当我们创建一个变量，对应的也就创建了一个针对这个值的引用。在引用这块计数法的机制下，内存中每一个值都会对应一个引用计数，当垃圾收集器感知到某个值的引用计数为0时，就判断它“没用”了，随即这块内存就会被释放。<br>
缺点：无法甄别循环引用场景下的“垃圾”。
:::

#### 标记清除法
::: tip
在标记清除算法中，一个变量是否被需要的判断标准，是它是否可抵达 。<br>
这个算法有两个阶段：
* 标记阶段：垃圾收集器会先找到根对象(在浏览器里，根对象是 Window；在 Node 里，根对象是 Global)，从根对象出发，垃圾收集器会扫描所有可以通过根对象触及的变量，这些对象会被标记为“可抵达 ”。
* 清除阶段： 没有被标记为“可抵达” 的变量，就会被认为是不需要的变量，这波变量会被清除。
:::

### 原型和继承
::: tip
* 在JavaScript中，一切都是对象，其属性分共有和私有。
* 每一个对象身上都有一个非标准属性`__proto__`指向隐式原型。
* 每一个构造函数上都有一个属性`prototype`指向显示原型。
* 一个对象的隐式原型和其构造器的显示原型指向的是一样的。
* 每一个原型对象都有一个属性`constructor`指向构造器。
* 优点：资源共享，节省内存；改变原型指向，实现继承。
* 缺点：查找数据的时候有的时候不是在自身对象中查找。
:::

原型链:实际上是指隐式原型链,从对象的`__proto__`开始，连接所有的对象，就是对象查找属性或方法的过程。
1. 当访问一个对象属性时，先往实例化对象的自身中寻找，找到则使用。
2. 如果自身找不到该属性，则会通过`_proto_`属性去它的原型对象中找，找到则使用。
3. 如果还没有找到再去原型对象的原型（`Object`原型对象）中寻找，直到找到`Object`为止，如果依然没有找到，则返回undefined。

继承的几种方式：
1. 原型链实现继承
2. 借用构造函数实现继承
3. 组合继承
4. 寄生组合继承
5. 类继承
6. 原型链实现继承

#### 原型链实现继承
::: tip
通过重写子类的原型，并将它指向父类的手段实现。这种方式实现的继承，创建出来的实例既是子类的实例，又是父类的实例。它有如下几种缺陷：
1. 不能向父类构造函数传参
2. 父类上的引用类型属性会被所有实例共享，其中一个实例改变时，会影响其他实例
:::
```js
function Animal() {
  this.colors = ['red','blue'];
};
function Dog(name) {
  this.name = name;
};
Dog.prototype = new Animal();

const dog1 = new Dog('旺财');
const dog2 = new Dog('钢镚');
dog2.colors.push('yellow');
console.log(dog1.colors); // ["red", "blue", "yellow"]
console.log(dog2.colors); // ["red", "blue", "yellow"]

console.log(dog1 instanceof Dog);    // true
console.log(dog1 instanceof Animal); // true
```

#### 借用构造函数实现继承
:::tip
借用构造函数实现继承，通过在子类中使用`call()`方法，实现借用父类构造函数并向父类构造函数传参的目的。但这种方法，无法继承父类原型对象上的属性和方法。
:::
```js
function Animal(name) {
  this.name = name;
  this.colors = ['red','blue'];
};
Animal.prototype.eat = function() {
  console.log(this.name + ' is eating!');
};
function Dog(name) {
  Animal.call(this,name);
};

const dog1 = new Dog('旺财');
const dog2 = new Dog('钢镚');
dog2.colors.push('yellow');

console.log(dog1.colors); // ["red", "blue"]
console.log(dog2.colors); // ["red", "blue", "yellow"]

console.log(dog1 instanceof Dog);    // true
console.log(dog2 instanceof Animal); // false

console.log(dog1.eat()); // 报错
```

#### 组合继承
::: tip
组合继承是组合了原型链继承和借用构造函数继承这两种方法，它保留了两种继承方式的优点，但它并不是百分百完美的：
* 父类构造函数被调用多次。
:::
```js
function Animal(name) {
  this.name = name;
  this.colors = ['red','blue'];
}
Animal.prototype.eat = function() {
  console.log(this.name + ' is eating');
}
function Dog(name) {
  Animal.call(this,name);
}
Dog.prototype = new Animal();  // 第一次调用
const dog1 = new Dog('dog1');  // 第二次调用
const dog2 = new Dog('dog2');  // 第三次调用
dog1.colors.push('yellow');
console.log(dog1.name);   // dog1
console.log(dog2.colors); // ['red','blue']
dog2.eat(); // dog2 is eating
```

#### 寄生组合继承
::: tip
寄生组合继承是在组合继承的基础上，采用`Object.create()`方法来改造实现<br>
`Object.create()`静态方法以一个现有对象作为原型，创建一个新对象。
:::
```js
function Animal(name) {
  this.name = name;
  this.colors = ['red','blue'];
}
Animal.prototype.eat = function() {
  console.log(this.name + ' is eating');
}
function Dog(name) {
  Animal.call(this,name);
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
const dog1 = new Dog('dog1');
const dog2 = new Dog('dog2');
dog1.colors.push('yellow');
console.log(dog1.name);  // dog1
console.log(dog2.colors);// ['red','blue']
dog2.eat(); // dog2 is eating
```

#### Class实现继承
::: tip
运用ES6 class新特性来实现继承<br>
JavaScript中并没有类，实质上是一个语法糖。
:::
```js
class Animal {
  constructor(name) {
    this.name = name;
    this.colors = ['red','blue'];
  }
  eat() {
    console.log(this.name + ' is eating');
  }
}
class Dog extends Animal {
  constructor(name) {
    // 必须先写父类继承
    super(name);
  }
}
var dog1 = new Dog('dog1');
var dog2 = new Dog('dog2');
dog1.colors.push('yellow');
console.log(dog1.name);  // dog1
console.log(dog2.colors);// ['red','blue']
console.log(dog2.eat()); // dog2 is eating
```

### 异常 Error
常见错误类型：
1. 未定义
2. 不是一个函数
3. let 不能在初始化之前使用
4. 常量值不能改变
5. 超出最大执行栈
6. 无效参数
7. const声明没有赋值错误

#### throw
::: tip
`throw`语句用来抛出一个用户自定义的异常。当前函数的执行将被停止（`throw`之后的语句将不会执行），并且控制将被传递到调用堆栈中的第一个`catch`块。如果调用者函数中没有`catch`块，程序将会终止。
:::

#### try...catch
::: tip
`try...catch`语句用于捕获异常，如果`try`语句中的内容没成功出现异常，你可以在`catch`语句中控制接下来发生的事情。如果在try块中有任何一个语句（或者从try块中调用的函数）抛出异常，控制立即转向catch子句。如果在try块中没有异常抛出，会跳过catch子句。
:::
```js
try {
    const err = 'this is Error'
    throw err // 抛出异常
} catch (error) {
    // catch捕获
    console.log(error);
}
```

### JS异步

#### 并发和并行
并行和并发是两个概念，容易混淆是因为并行和并发在中文意思上相近，其实在英文中，这是完全不相同的东西，并行(parallelism)、并发(concurrency)
::: tip 概念理解
并行(parallelism)：是微观概念，假设CPU有两个核心，则我们就可以同时完成任务A和任务B，同时完成多个任务的情况就可以称之为并行。<br/>
并发(concurrency)：是宏观概念，现在有任务A和任务B，在一段时间内，通过任务之间的切换完成这两个任务，这种情况称之为并发。
:::

#### 回调函数
回调函数广泛存在于我们所编写的`JavaScript`代码中，它表现在事件绑定，Ajax请求或者其他的情况下，一个回调函数可表现成如下形式
```js
ajax(url, () => {
  console.log('这里是回调函数');
})
```
**回调地狱：** 回调函数很好的解决了某些异步情况，但过度滥用回调函数会造成回调地狱，即回调函数过长，嵌套过深。过长或者嵌套过深的回调函数，会让回调函数存在强耦合关系，一旦有一个函数有所改动，那么可能会牵一发而动全身。一个回调地狱可能如下所示：
```js
ajax(firstUrl, () => {
  console.log('这里是首次回调函数');
  ajax(secondUrl, () => {
    console.log('这里是第二次回调函数');
    ajax(threeUrl, () => {
      console.log('这里是第三次回调函数');
      // todo更多
    })
  })
})
```

#### Generator
在ES6之前，一个函数一旦执行将不会被中断，一直到函数执行完毕，在ES6之后，由于`Generator`的存在，函数可以暂停自身，待到合适的机会再次执行。用`Generator`可以解决回调地狱。
```js
function *fetch() {
  yield ajax(url, () => {console.log('这里是首次回调函数');});
  yield ajax(url, () => {console.log('这里是第二次回调函数');});
  yield ajax(url, () => {console.log('这里是第三次回调函数');});
}
const it = fetch();
const result1 = it.next();
const result2 = it.next();
const result3 = it.next();
```

#### Promise
`Promise`翻译过来就是期约的意思，`Promise`一共有三种状态：`pending(等待中)`、`resolve(完成)`和`reject(拒绝)`，这个期约意味着在将来一定会有一个表决，并且只能表决一次，表决的状态一定是`resolve(完成)`或者`reject(拒绝)`，一个`Promise`可能会是如下的形式：
```js
// 普通的Promise
function foo() {
  return new Promise((resolve,reject) => {
    // 第一次表决有效，其后无论是resolve()还是reject()都无效
    resolve(true); 
    resolve(false);
  })
}

// Promise解决回调地狱
ajax(url).then(res => {
  console.log('这里是首次回调函数');
}).then(res => {
  console.log('这里是第二次回调函数');
}).then(res => {
  console.log('这里是第三次回调函数');
})
```

**Promise.all()：** `Promise.all()`方法是把一个或者几个`Promise`组合在一个数组里，只有当数组中的所有`Promise`全部表决完成，才返回。
```js
const p1 = Promise.resolve(1);
const p2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(2);
  }, 100);
})
var p3 = 3;
Promise.all([p1,p2,p3]).then(res => {
  console.log(res); // => [1,2,3]
})
```
**Promise.race()：** `Promise.race()`方法把一个或者几个`Promise`组合在一个数组里，只要数组中有一个表决了，就返回。
```js
const p1 = Promise.resolve(1);
const p2 = new Promise(resolve => {
  setTimeout(() => {
    resolve(2);
  }, 100);
})
const p3 = 3;
Promise.race([p2,p1,p3]).then(res => {
  console.log(res); // => 1
})
```


#### async/await
如果一个方法前面加上了`async`，那么这个方法就会返回一个`Promise`，`async`就是将函数用`Promise.resolve()`包裹了下，并且`await`只能配合`async`使用，不能单独出现。一个`async/await`可能会是如下的形式：
```js
// 普通的async/await
async function fn() {
  const number = await 3; // await自动用promise.resolve()包装
  console.log(number);
}
fn();

// async/await解决回调地狱
async function fetch() {
  const result1 = await ajax(url1);
  const result2 = await ajax(url2);
  const result3 = await ajax(url3);
}
fetch();
```

#### setInterval、setTimeout和requestAnimationFrame
**setTimeout** `setTimeout`延时执行某一段代码，但`setTimeout`由于`EventLoop`的存在，并不百分百是准时的，一个`setTimeout`可能会表示如下的形式：
```js
// 延时1s之后，打印hello,world
setTimeout(() => {
  console.log('hello,world');
}, 1000)
```
**setInterval：** `setInterval`在指定的时间内，重复执行一段代码，与`setTimeout`类似，它也不是准时的，并且有时候及其不推荐使用`setInterval`定时器，因为它与某些耗时的代码配合使用的话，会存在执行积累的问题，它会等耗时操作结束后，一起一个或者多个执行定时器，存在性能问题。一个`setInterval`可能会表示如下的形式：
```js
setInterval(() => {
  console.log('hello,world');
}, 1000)
```

**requestAnimationFrame：** 翻译过来就是请求动画帧，它是html5专门用来设计请求动画的API，它与`setTimeout`相比有如下优势：
1. 根据不同屏幕的刷新频率，自动调整执行回调函数的时机。
2. 当窗口处于未激活状态时，`requestAnimationFrame`会停止执行，而`setTimeout`不会
3. 自带函数节流功能
```js
let progress = 0;
let timer = null;
function render() {
  progress += 1;
  if (progress <= 100) {
    console.log(progress);
    timer = window.requestAnimationFrame(render);
  } else {
    cancelAnimationFrame(timer);
  }
}
//第一帧渲染
window.requestAnimationFrame(render);
```


### EventLoop事件循环

#### 进程和线程
::: tip
`JavaScript`是单线程执行的，在`JavaScript`运行期间，有可能会阻塞UI渲染，这在一方面说明`JavaScript`引擎线程和UI渲染线程是互斥的。`JavaScript`被设计成单线程的原因在于，`JavaScript`可以修改DOM，如果在`JavaScript`工作期间，UI还在渲染的话，则可能不会正确渲染DOM。单线程也有一些好处，如下：
1. 节省内存空间
2. 节省上下文切换时间
3. 没有锁的问题存在
:::
**进程：** CPU在运行指令及加载和保存上下文所需的时间，放在应用上一个程序就是一个进程，一个浏览器tab选项卡就是一个进程 <br/>
**线程：** 线程是进程中更小的单位，描述了执行一段指令所需的时间。

#### 执行栈
::: tip
可以把执行栈看成是一个存储函数调用的栈结构，遵循先进后出的原则。
:::

#### EventLoop
函数会在执行栈中执行，当遇到异步代码后，会将其挂起在Task队列中，一旦执行栈为空，就会从Task中拿出需要执行的代码执行，所以本质上讲JS中的异步还是同步行为。

不同的异步任务是有区别的，异步任务又可以划分如下：
1. 宏任务可以有多个队列
   * `script`
   * `setTimeout`
   * `setInterval`
   * `setImmidiate`
   * `I/O`
   * `UI Rendering`
2. 微任务只能有一个队列
   * `procress.nextTick`
   * `Promise.then`
   * `Object.observe`
   * `mutataionObserver`

**执行顺序：** 当执行栈执行完毕后，会首先执行微任务队列，当微任务队列执行完毕再从宏任务中读取并执行，当再次遇到微任务时，放入微任务队列。
```js
setTimeout(() => {
  console.log(1);
  Promise.resolve().then(() => {
    console.log(2);
  })
}, 0)
setTimeout(() => {
  console.log(3);
}, 0)
Promise.resolve().then(() => {
  console.log(4);
})
console.log(5);
// 输出结果：5 4 1 2 3
```

**代码分析：**
1. `console.log(5)`是唯一的同步任务，首先执行，输出5
2. 将所有异步任务放在Task队列中，挂起
3. 同步任务执行完毕，开始执行微任务队列，即`Promise.then`，输出4
4. 微任务队列执行完毕，执行宏任务队列`setTimeout`
5. 宏任务队列中首先执行同步任务，再次遇到微任务，放入微任务队列中，输出1
6. 同步任务执行完毕，执行微任务队列，输出2
7. 微任务队列执行完毕，执行宏任务队列`setTimeout`，输出3