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

[[Configurable]]: 是否可配置，默认为 `true`  
[[Enumerable]]: 是否可枚举，默认为 `true`  
[[Writable]]: 是否可修改值，默认为 `true`  
[[Value]]: 属性实际的值，默认为 `undefined`

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

[[Configurable]]: 是否可配置，默认为 `true`  
[[Enumerable]]: 是否可枚举，默认为 `true`  
[[Get]]: 获取函数，默认为 `undefined`  
[[Set]]: 设置函数，默认为 `undefined`

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
如果不设置 `Configurable` , `Enumerable` , `Writable` ，
其将被默认设置为 `false`。
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

### 合并对象

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
