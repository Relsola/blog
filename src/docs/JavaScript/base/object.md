# 对象、类与面向对象编程

## 理解对象

对象是一组属性的无序集合。

创建一个对象：

```JavaScript
let person = {
  name: 'Relsola',
  age: 18,
  job: 'Software Engineer',
  sayName() {
    console.log(this.name);
  }
};
```

### 对象属性

1. 数据的属性

`[[Configurable]]`: 是否可配置，默认为 `true`  
`[[Enumerable]]`: 是否可枚举，默认为 `true`  
`[[Writable]]`: 是否可修改值，默认为 `true`  
`[[Value]]`: 属性实际的值，默认为 `undefined`

要修改属性的默认特性，就必须使用 `Object.defineProperty()` 方法

```JavaScript
let person = {};

Object.defineProperty(person, 'name', {
  writable: false,
  value: 'Relsola'
});

console.log(person.name); // Relsola
person.name = 'Nick';
console.log(person.name); // Relsola
```

2. 访问器属性

`[[Configurable]]`: 是否可配置，默认为 `true`  
`[[Enumerable]]`: 是否可枚举，默认为 `true`  
`[[Get]]`: 获取函数，默认为 `undefined`  
`[[Set]]`: 设置函数，默认为 `undefined`

```JavaScript
// 定义一个对象，包含伪私有成员 year_ 和公共成员 `edition`
let book = {
  year_: 2017,
  edition: 1
};

Object.defineProperty(book, 'year', {
  get() {
    return this.year_;
  },
  set(newVal) {
    if (newVal > 2017) {
      this.year_ = newVal;
      this.edition += newVal - 2017;
    }
  }
});
book.year = 2018;
console.log(book.edition); // {year_: 2018, edition: 2}
```

3. 定义多个属性

在同一个对象上同时定义多个属性，使用 `Object.defineProperties()` 方法

::: warning 注意
无论调用 `Object.defineProperty` 或者 `Object.defineProperties()` 方法，  
如果不设置 `Configurable` , `Enumerable` , `Writable` ，其将被默认设置为 `false`

:::

```JavaScript
let book = {};
Object.defineProperties(book, {
  year_: {
    value: 2017
  },
  edition: {
    value: 2017
  },
  year: {
    enumerable: true,
    get() {
      return this.year_;
    },
    set(newVal) {
      if (newVal > 2017) {
        this.year_ = newVal;
        this.edition += newVal - 2017;
      }
    }
  }
});
```

### 读取属性的特性

使用 `Object.getOwnPropertyDescriptor()` 方法能获取指定属性的属性描述符

- 对于数据属性包含 `Configurable` , `Enumerable` , `Writable` , `Value`
- 对于访问器属性包含 `Configurable` , `Enumerable` , `Get` , `Set`

```JavaScript
let book = {};
Object.defineProperties(book, {
  year_: {
    value: 2017
  },
  edition: {
    value: 2017
  },
  year: {
    enumerable: true,
    get() {
      return this.year_;
    },
    set(newVal) {
      if (newVal > 2017) {
        this.year_ = newVal;
        this.edition += newVal - 2017;
      }
    }
  }
});

let description = Object.getOwnPropertyDescriptor(book, 'year_');
// => {value: 2017, writable: false, enumerable: false, configurable: false}

description = Object.getOwnPropertyDescriptor(book, 'year');
// => {enumerable: true, configurable: false, get: ƒ, set: ƒ}
```

`Object.getOwnPropertyDescriptors()` 会在每个自有属性上调用 `Object.getOwnPropertyDescriptor()` 并在一个新对象中返回他们

```JavaScript
console.log(Object.getOwnPropertyDescriptors(book));
{
  year_: {
    value: 2017,
    writable: false,
    enumerable: false,
    configurable: false
  },
  edition: {
    value: 2017,
    writable: false,
    enumerable: false,
    configurable: false
  },
  year: {
    enumerable: true,
    configurable: false
  }
};
```

### 合并对象

合并 `（merge）` 对象经常会很有用，更具体的说是将源对象的所有本地属性一起复制到目标对象上，有时候这种操作也被称为混入 `mixin`

`Object.assign()` 可以将一个或多个源对象中可枚举和自有属性复制到目标对象并返回目标对象

- 必须可枚举和自有，即 `enumerable: true` 和 `Object.hasOwn()` 返回 `true`
- `Object.assign()` 执行的是浅复制
- 如果有相同的属性，会进行覆盖，使用最后一个源对象的值
- 不能在两个对象间转移 `Get` 和 `Set`
- `Object.assign()` 复制期间出错会终止操作并抛出错误，但不会回溯

```JavaScript
const dest = {
    set a(value) {
      console.log(`INVOKED DEST SETTER WITH PARAM ${value}`);
    }
  },
  src = {
    id: 'src',
    get a() {
      console.log('INVOKED DEST GETTER');
      return 'foo';
    }
  };

const result = Object.assign(dest, src, { once: true });
console.log(result); // {id: 'src', once: true}
console.log(result === dest); // true

// 调用 src 的获取方法 调用 dest 的设置方法
// 因为设置函数不进行赋值操作，所以没有把值转移过来
```

```JavaScript

```

### 对象标识及相等判定

### 增强的对象语法

### 对象解构

## 创建对象

###

## 继承

## 类

### 定义类

### 类构造函数

###

```

```
