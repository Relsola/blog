---
sidebar: auto
---
# SASS

## 前言
Sass是一种基于Ruby的CSS预处理器，它可以扩展CSS语言，并添加许多其他功能，如变量、嵌套规则、Mixin、函数等。Sass文件可以与标准CSS文件兼容，并且可以使用普通CSS代码和语法。
  
* [SASS官网](https://sass-lang.com/documentation/)
* [SASS Playground](https://www.sassmeister.com/)

## 安装

在项目中安装Sass
```bash
npm i sass sass-loader -D
```

配合webpack使用
```js
// webpack.config.js
module: {
  // ...
  rules: [
    {
      test: /\.(?:sa|sc|c)ss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ]
    },
  ]
}
```

## Scss还是Sass
`SASS`支持两种不同的语法，分别是文件后缀为`.scss`和`.sass`，这两种语法功能一样，只是风格不同。
```scss
// .scss语法：有括号，有分号
.box {
  button {
    outline: none;
    border: 1px solid #ccc;
  }
}

// .sass缩进语法：无括号，无分号，只有缩进和换行
.box
  button
    outline: none
    border: 1px solid #ccc
```
`scss`还是`sass`其实都一样，具体如何使用根据个人喜好即可。

## 基本语法

### 变量

#### 值变量
* `Sass`中的变量以`$`开头定义，其变量可以修改。
* `SASS`中的变量是命令式的，在修改变量前后，值可能不相同的。
* 如果变量需要镶嵌在字符串之中，就必须需要写在`#{}`之中。

```scss
$font-size: 14px;
.box {
  font-size: $font-size; // 14px
}

// 修改值
$font-size: 16px;
.item {
  font-size: $font-size; // 16px
}
```

#### 默认变量
有些时候，我们希望定义一些变量并给默认值，这样外部用户使用的时候，可以重新定义相同的变量，但变量的值由外部用户自己规定，此时可以使用默认变量`!default`：
```scss
$font-size: 14px !default;
$theme-color: #4093ff !default;

// 使用默认
.box {
  font-size: $font-size;          // 14px;
  background-color: $theme-color; // #4093ff;
}

// 自己定义
$font-size: 16px;
$theme-color: #58a;
.box {
  font-size: $font-size;          // 16px
  background-color: $theme-color; // #58a;
}
```

#### 枚举变量
`SASS`中的变量可以用定义一系列值的集合。  
集合变量通常使用`@each`进行迭代遍历。

* 列表变量遍历
```scss
// scss
/* scss */
$themes: primary, warning, danger;

@each $theme in $themes {
  .button.is-#{$theme} {
    background: #58a;
  }
}

/* 生成的 CSS */
.button.is-primary {
  background: #58a;
}
.button.is-warning {
  background: #58a;
}
.button.is-danger {
  background: #58a;
}
```

* 字典变量遍历
```scss
/* scss */
$themes: (
  primary: '#409EFF',
  warning: '#E6A23C',
  danger: '#F56C6C'
);
// key解构赋值给theme, value解构赋值给$color
@each $theme, $color in $themes {
  .button.is-#{$theme} {
    background: $color;
  }
}

/* 生成的 CSS */
.button.is-primary {
  background: "#409EFF";
}
.button.is-warning {
  background: "#E6A23C";
}
.button.is-danger {
  background: "#F56C6C";
}
```

#### 变量作用域
* 一个变量的访问范围在其定义的规则内
* 对于嵌套规则中相同命名的变量，内层的变量会覆盖外层的变量
```scss
.box {
  $color: #ccc;
  .item {
    $fontSize: 16px;
    $color: #fff;
    font-size: $fontSize; // 16px;
    color: $color; // #fff
  }
  .row {
    font-size: $fontSize; // Error
  }
}
```

#### 变量导出
`SASS`中的变量，也可以在`js`中访问，例如：
```scss
// variables.scss
$font-size: 14px;
$theme-color:#4093ff;

:export {
  fontSize: $font-size;
  themeColor: $theme-color;
}
```
需要`webpack`等打包工具的`sass-loader`支持，支持以后就可以直接在`JavaScript`中使用：
```js
import vars from 'variables.scss';

console.log(vars.fontSize)    // '14px'
console.log(vars.themeColor)  // '#4093ff'
```

### 嵌套

`SASS`允许将一套`CSS`样式嵌套进另一套样式中，避免了大量重复的选择器。
```scss
/* scss */
.box {
  background-color: #fff;
  .item {
    background-color: #58a
  }

  p, span {
    font-size: 16px;
  }
}

/* 生成的 CSS */
.box {
  background-color: #fff;
}
.box .item {
  background-color: #58a;
}
.box p, .box span {
  font-size: 16px;
}
```

#### 父级选择器(&)
`&`表示外层的父级选择器。
```scss
/* scss */
.box {
  // & 这里代表 .box
  &::after {
    content: '';
    display: inline-block;
    width: 100px;
    height: 3px;
  }
  &__item {
    background-color: #58a;
    // & 这里代表 .box__item
    &--title {
      font-size: 16px;
    }
  }
  &__row {
    background-color: #f60;
  }
}

/* 生成的 CSS */
.box::after {
  content: "";
  display: inline-block;
  width: 100px;
  height: 3px;
}
.box__item {
  background-color: #58a;
}
.box__item--title {
  font-size: 16px;
}
.box__row {
  background-color: #f60;
}
```

#### 占位符选择器(%)

占位符选择器用`%`表示，其不通过`@extend`引用则不会编译到最终的`css`代码中，减少了代码体积和命名烦恼。
```scss
%ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: no-wrap;
}

// 不引用，占位符代码不编译
.title {
  font-size: 14px;
}

// 引用，占位符代码编译
.title {
  @extend %ellipsis;
  font-size: 14px;
}
```

### 混合方法

#### @mixin和@include
`@mixin`一般是用来定义一些常用的代码，`@include`负责引用`@mixin`，从而减少重复代码的编写。

```scss
/* scss */
@mixin center($margin: 0, $width: 1200px) {
  margin: $margin auto;
  width: $width;
}
// 使用参数默认值
.box1 {
  @include center;
}
// 自定义参数
.box2 {
  @include center(10px, 1000px);
}
// 显示传值：显示给$width传递值，而$margin依旧使用参数默认值
.box3 {
  @include center($width: 1000px);
}

/* 生成的 CSS */
.box1 {
  margin: 0 auto;
  width: 1200px;
}

.box2 {
  margin: 10px auto;
  width: 1000px;
}

.box3 {
  margin: 0 auto;
  width: 1000px;
}
```

在`@mixin`中，也可以接收外部的内容，用`@content`来表示。
```scss
/* scss */
@mixin btn-hover {
  :not(.is-disabled):hover {
    @content;
  }
}

.button {
  @include btn-hover {
    border-width: 2px;
  }
}

/* 生成的 CSS */
.button :not(.is-disabled):hover {
  border-width: 2px;
}
```

#### 条件语句

`SASS`中的`@if...@else`和JS中的`if...else`是一样的。
```scss
/* scss */
@mixin triangle($size, $color, $direction) {
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: calc($size / 2);

  @if $direction == 'top' {
    border-top-color: $color;
  } @else if ($direction == 'bottom') {
    border-bottom-color: $color;
  } @else if ($direction == 'left') {
    border-left-color: $color;
  } @else if ($direction == 'right') {
    border-right-color: $color;
  } @else {
    @warn 'direction must be top, bottom, left or right'
  }
};

.box {
  @include triangle(10px, '#f60', 'right');
}

/* 生成的 CSS */
.box {
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px;
  border-right-color: "#f60";
}
```

#### 循环方法

`SASS`提供了`@for`来进行循环生成样式。
::: warning 注意
`SASS`中的循环的索引从`1`开始而不是`0`。
:::
```scss
/* scss */
@for $i from 1 to 3 {
  .item-#{$i} {
    background-color: #58a;
    font-size: 12px * $i;
  }
}

/* 生成的 CSS */
.item-1 {
  background-color: #58a;
  font-size: 12px;
}
.item-2 {
  background-color: #58a;
  font-size: 24px;
}
```


#### 函数

`SASS`中的`@function`和JS中函数相似。
```scss
@function pow($base, $exponent) {
  $result: 1;
  @for $_ from 1 through $exponent {
    $result: $result * $base;
  }
  @return $result;
}

.sidebar {
  float: left;
  margin-left: pow(4, 3) * 1px; // 64px
}
```

如果你希望你的方法接受数量不定的参数，你可以使用... ，犹如 ES6 的扩展运算符。
```scss
@function sum($numbers...) {
  $result: 0;
  @each $number in $numbers {
    $result: $result + $number
  }
  @return $result;
}

.sidebar {
  float: left;
  width: sum(10px, 20px, 30px); // 60px
}
```

## 内置函数
`SASS`内置了许多函数，这里只了解一些常见的，具体可以参考官方文档。

### math
* ceil：向上取整函数
* floor：向下取整函数
* round：四舍五入函数
* max：最大值比较函数
* min：最小值比较函数
* random：取`0-1`之间随

```scss
@use 'sass:math';

ceil(4.2);       // 5
floor(4.2);      // 4
round(4.2);      // 4
max(10px, 1px);  // 10px
min(10px, 1px);  // 1px
random();        // 0-1
```

### color

* mix: 将两种颜色进行混合，第三个参数表示混合比重
* opacify: 设置颜色透明度
* opacity: 获取颜色透明度

```scss
@use 'sass:color';

mix(#409EFF, #fff, 10%);         // #ecf5ff 更接近白色
mix(#409EFF, #fff, 90%);         // #53a8ff 更接近蓝色
opacify(rgba(#036, 0.7), 0.2);   // rgba(#036, 0.9)
opacity(rgba(#036, 0.7));        // 0.7
```

## 其他

### 注释
`SASS`中的注释一般有两种，`//`和`/**/`，和JS中的注释一致。
```scss
// 单行注释 不会出现在编译内容中

/* 
  块注释   除压缩模式以外都出现
*/
```

### 导入
```scss
@import './index.scss';
```

### 封装实用的mixins
```scss
// 单行折叠省略
@mixin ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
// 多行折叠省略
@mixin multline-ellipsis($line: 2) {
  @if type-of($line) != 'number' {
    @error '$line must be number'
  }
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $line;
  text-overflow: ellipsis;
  overflow: hidden;
}
// 取消滚动条
@mixin no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0!important;
  }
}
// 扩展可点击区域
@mixin extend-click($extend: -5px) {
  &::after {
    content: '';
    position: absolute;
    @each $direction in (top, right, bottom, left) {
      #{$direction}: $extend;
    };
  }
}
// 添加浏览器前缀
@mixin prefix($property, $value, $prefixes: ('webkit', 'moz', 'ms', 'o')) {
  @each $prefix in $prefixes {
    -#{$prefix}-#{$property}: $value;
  };
  #{$property}: $value;
}
// 清除浮动
@mixin clearfix {
  $selector: &;

  @at-root {
    #{$selector}::before,
    #{$selector}::after {
      display: table;
      content: "";
    }
    #{$selector}::after {
      clear: both
    }
  }
}
```

### 响应式设计和屏幕断点
```scss
// 屏幕断点
$breakpoints: (
  'medium': (min-width: 800px),
  'large': (min-width: 1000px),
  'huge': (min-width: 1200px),
);

// 响应式mixin
@mixin response-to ($key, $map: $breakpoints) {
  @if map-has-key($map, $key) {
    @media only screen and #{inspect(map-get($map, $key))} {
      @content;
    }
  } @else {
    @warn "undefeined points: `#{$key}`";
  }
}

.box {
  @include response-to('medium') {
    width: 100px;
  }
  @include response-to('large') {
    width: 200px;
  }
  @include response-to('huge') {
    width: 300px;
  }
}

/* css */
@media only screen and (min-width: 800px) {
  .box {
    width: 100px;
  }
}
@media only screen and (min-width: 1000px) {
  .box {
    width: 200px;
  }
}
@media only screen and (min-width: 1200px) {
  .box {
    width: 300px;
  }
}
```