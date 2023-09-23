# Less

## 前言
Less 是一门 CSS 预处理语言，通过工具可以编译成CSS，它扩展了 CSS 语言，增加了嵌套、变量、Mixin混合、函数、继承等特性，Less可以帮助我们更好地组织CSS代码，提高代码复用率和可维护性。

[Less中文网址](https://less.nodejs.cn/)  
[Less Playground](https://lesscss.org/less-preview)

## 安装

`Less`是没有办法直接使用在浏览器上面的，只有`css`才能直接使用到浏览器的上面。所以我们要把`Less`编译成`css`。  
  
可以使用如下两种方式来使用`Less`：

1. 页面中使用 引入 `Less.js`。
  * 可在[官网](https://less.nodejs.cn/)下载
  * 或使用CDN

```html
<link rel="stylesheet/less" type="text/css" href="styles.less" />
<script src="https://cdn.jsdelivr.net/npm/less" ></script>
```

::: warning 注意
`link` 标签一定要在 `Less.js` 之前引入，并且 link 标签的 rel 属性要设置为`stylesheet/less`。
:::

2. 项目中使用 `Less`开发

```bash
$ npm install less less-loader -D
```

配合webpack使用
```js
// webpack.config.js
module.exports = {
  module: {
    // ...
    rules: [
      {
        test: /\.less$/i, 
        // 将 less 文件编译成 css 文件，注意 Webpack Loader 加载顺序从右到左
        loader: [ 'style-loader', 'css-loader', 'less-loader']
      }
    ]
  }
};
```
::: tip
实际上`Vue`官方`CLI`或者`Vite`已经帮你集成了`CSS`预处理器，在脚手架初始化项目时勾选上自己喜欢的预处理器就好了。
:::

## 基本语法

### 变量

`Less`中的变量是常量 ，只能定义一次，不能重复使用，合理使用可以减少重复代码的书写。

#### 值变量

以`@`开头定义变量，直接使用。

```less
/* Less */
@color: #adf;
@fontSize: 14px;
@wrap: 1156px;
header {
    background-color: @color;
    font-size: @fontSize;
    width: @wrap;
}

/* 生成后的 CSS */
header {
  background-color: #adf;
  font-size: 14px;
  width: 1156px;
}
```
在平时工作中，我们就可以把常用的变量 封装到一个文件中，这样利于代码组织维护。

```less
@lightPrimaryColor: #c5cae9;
@textPrimaryColor: #fff;
@accentColor: rgb(99, 137, 185);
@primaryTextColor: #646464;
@secondaryTextColor: #000;
@dividerColor: #b6b6b6;
@borderColor: #dadada;
```

#### 变量运算

* 加减法时 以第一个数据的单位为基准
* 如果只有一个有单位，则使用该单位
* 乘除法时 注意单位一定要统一

```less
/* Less */
@width: 300px;
@color: #222;

#wrap {
    width: @width - 20;
    height: @width - 20*5;
    margin: (@width - 20)*5;
    color: @color*2;
    background-color: @color + #111;
}

/* 生成后的 CSS */
#wrap {
  width: 280px;
  height: 200px;
  margin: 1400px;
  color: #444444;
  background-color: #333333;
}
```

#### 选择器变量

让选择器变成动态
```less
/* Less */
@mySelector: #wrap;
@Wrap: wrap;
@{mySelector} {
  //变量名 必须使用大括号包裹
  color: #999;
  width: 50%;
}
.@{Wrap} {
  color: #ccc;
}
#@{Wrap} {
  color: #666;
}

/* 生成的 CSS */
#wrap {
  color: #999;
  width: 50%;
}
.wrap {
  color: #ccc;
}
#wrap {
  color: #666;
}
```

#### 属性变量
可减少代码书写量

```less
/* Less */
@borderStyle: border-style;
@Solid: solid;
#wrap {
    @{borderStyle}: @Solid; //变量名 必须使用大括号包裹
}

/* 生成的 CSS */
#wrap {
  border-style: solid;
}
```

#### url 变量
项目结构改变时，修改其变量即可。

```less
/* Less */
@images: "../img"; //需要加引号
body {
    background: url("@{images}/dog.png"); //变量名 必须使用大括号包裹
}

/* 生成的 CSS */
body {
  background: url("../img/dog.png");
}
```

#### 声明变量
有点类似于 下面的 混合方法：
* 结构: @name: { 属性: 值 ;};
* 使用：@name();

```less
/* Less */
@background: {
  background: red;
};
#main {
  @background();
}
@Rules: {
  width: 200px;
  height: 200px;
  border: solid 1px red;
};
#con {
  @Rules();
}

/* 生成的 CSS */
#main {
  background: red;
}
#con {
  width: 200px;
  height: 200px;
  border: solid 1px red;
}
```

#### 变量作用域

一句话理解就是：就近原则。
借助官网的Demo：
```less
/* Less */
@var: @a;
@a: 100%;
#wrap {
  width: @var;
  @a: 9%;
}

/* 生成的 CSS */
#wrap {
  width: 9%;
}
```

#### 用变量去定义变量
```less
/* Less */
@ford:  "I am ford.";
@var:    "ford";
#wrap::after{
  //将@var替换为其值 content:@ford;
  content: @@var; 
}

/* 生成的 CSS */
#wrap::after {
  content: "I am ford.";
}
```

### 嵌套

#### 普通嵌套
```less
/* Less */
#app {
  #header {
    .logo {
      color: white;
    }

    // &:代表上一层选择器的名字，此例便是header
    &:after {
      content: "hello";
    }
  }
}

/* 生成的 CSS */
#app #header .logo {
  color: white;
}
#app #header:after {
  content: "hello";
}
```

#### 媒体查询

`Less`提供了一个十分便捷的方式，唯一的缺点就是 每一个元素都会编译出自己 `@media` 声明，并不会合并。

```less
/* Less */
.left {
  height: 500px;
  background-color: #adb;

  // >=1200
  @media screen and(min-width:1200px) {
    background: #6e4848;
  }

  // >=1200,<=900
  @media screen and(max-width:1200px) and (min-width: 900px) {
    background: #baa;
  }

  //<900
  @media screen and (max-width: 900px) {
    background: #abd;
  }
}

/* 生成的 CSS */
.left {
  height: 500px;
  background-color: #adb;
}
@media screen and (min-width: 1200px) {
  .left {
    background: #6e4848;
  }
}
@media screen and (max-width: 1200px) and (min-width: 900px) {
  .left {
    background: #baa;
  }
}
@media screen and (max-width: 900px) {
  .left {
    background: #abd;
  }
}
```

### 混合方法
将重复使用的代码封装到一个类中，在需要使用的地方调用。

#### 普通混合
```less
/* Less */
.card() {
  background: #f6f6f6;
  -webkit-box-shadow: 0 1px 2px rgba(151, 151, 151, 0.58);
  box-shadow: 0 1px 2px rgba(151, 151, 151, 0.58);
}
#wrap {
  .card();
}

/* 生成的 CSS */
#wrap {
  background: #f6f6f6;
  -webkit-box-shadow: 0 1px 2px rgba(151, 151, 151, 0.58);
  box-shadow: 0 1px 2px rgba(151, 151, 151, 0.58);
}
```

#### 参数混合

* Less 可以使用默认参数，如果 没有传参数，那么将使用默认参数。
* `@arguments` 犹如 JS 中的 `arguments` 指代的是 全部参数。
* 传的参数中 必须带着单位。

```less
/* Less */
.getBG(@picName) {
  background-image: url("../img/@{picName}");
  background-size: 100%;
  background-position: center;
}
#header {
  .getBG('01png');
}

/* 生成的 CSS */
#header {
  background-image: url("../img/01png");
  background-size: 100%;
  background-position: center;
}
```

#### 参数默认值

```less
/* Less */
.border(@a:10px,@b:50px,@c:30px,@color:#000){
    border:solid 1px @color;
    //指代的是 全部参数
    box-shadow: @arguments;
}
#main{
    //必须带着单位
    .border(0px,5px,30px,red);
}
#wrap{
    .border(0px);
}
#content{
    //等价于 .border()
    .border;
}

/* 生成的 CSS */
#main {
  border: solid 1px red;
  box-shadow: 0px 5px 30px red;
}
#wrap {
  border: solid 1px #000;
  box-shadow: 0px 50px 30px #000;
}
#content {
  border: solid 1px #000;
  box-shadow: 10px 50px 30px #000;
}
```

#### 数量不定的参数
如果你希望你的方法接受数量不定的参数，你可以使用`...` ，犹如 ES6 的扩展运算符。
```less
/* Less */
.boxShadow(...) {
  box-shadow: @arguments;
}
.textShadow(@a,...) {
  text-shadow: @arguments;
}
#main {
  .boxShadow(1px,4px,30px,red);
  .textShadow(1px,4px,30px,red);
}

/* 生成后的 CSS */
#main {
  box-shadow: 1px 4px 30px red;
  text-shadow: 1px 4px 30px red;
}
```

#### 方法的匹配模式
```less
/* Less */
.triangle(top,@width:20px,@color:#000) {
  border-color: transparent transparent @color transparent;
}
.triangle(right,@width:20px,@color:#000) {
  border-color: transparent @color transparent transparent;
}

.triangle(bottom,@width:20px,@color:#000) {
  border-color: @color transparent transparent transparent;
}
.triangle(left,@width:20px,@color:#000) {
  border-color: transparent transparent transparent @color;
}
.triangle(@_,@width:20px,@color:#000) {
  border-style: solid;
  border-width: @width;
}
#main {
  .triangle(left, 50px, #999);
}

/* 生成的 CSS */
#main {
  border-color: transparent transparent transparent #999;
  border-style: solid;
  border-width: 50px;
}
```
要点
* 第一个参数 `left` 要会找到方法中匹配程度最高的，如果匹配程度相同，将全部选择，并存在着样式覆盖替换。
* 如果匹配的参数 是变量，则将会匹配，如 `@_` 。

#### 方法的命名空间

让方法更加规范
```less
/* Less */
#card() {
  background: #723232;
  .d(@w:300px) {
    width: @w;

    #a(@h:300px) {
      //可以使用上一层传进来的方法
      height: @h; 
    }
  }
}
#wrap {
  // 父元素不能加 括号
  #card > .d > #a(100px);
}
#main {
  #card .d();
}
#con {
  //不得单独使用命名空间的方法
  //.d() 如果前面没有引入命名空间 #card ，将会报错

  #card; // 等价于 #card();
  .d(20px); //必须先引入 #card
}

/* 生成的 CSS */
#wrap {
  height: 100px;
}
#main {
  width: 300px;
}
#con {
  background: #723232;
  width: 20px;
}
```

#### 条件混合

`Less` 没有 `if else`，可是它有 `when`

```less
/* Less */
#card {
  // and 运算符 ，相当于 与运算 &&，必须条件全部符合才会执行
  .border(@width,@color,@style) when (@width>100px) and(@color=#999) {
    border: @style @color @width;
  }

  // not 运算符，相当于 非运算 !，条件为 不符合才会执行
  .background(@color) when not (@color>=#222) {
    background: @color;
  }

  // , 逗号分隔符：相当于 或运算 ||，只要有一个符合条件就会执行
  .font(@size:20px) when (@size>50px) , (@size<100px) {
    font-size: @size;
  }
}
#main {
  #card > .border(200px,#999,solid);
  #card .background(#111);
  #card > .font(40px);
}

/* 生成后的 CSS */
#main {
  border: solid #999 200px;
  background: #111;
  font-size: 40px;
}
```
要点：
* 比较运算有： > >= = =< <。
* = 代表的是等于
* 除去关键字 true 以外的值都被视为 false

#### 循环方法

`Less` 并没有提供 `for` 循环功能，是使用递归去实现。 下面是官网中的一个 Demo，模拟了生成栅格系统。

```less
/* Less */
.generate-columns(4);

.generate-columns(@n, @i: 1) when (@i =< @n) {
  .column-@{i} {
    width: (@i * 100% / @n);
  }
  .generate-columns(@n, (@i + 1));
}

/* 生成后的 CSS */
.column-1 {
  width: 25%;
}
.column-2 {
  width: 50%;
}
.column-3 {
  width: 75%;
}
.column-4 {
  width: 100%;
}
```

#### 方法使用important！
使用方法 非常简单，在方法名后 加上关键字即可。
```less
/* Less */
.border {
  border: solid 1px red;
  margin: 50px;
}
#main {
  .border() !important;
}

/* 生成后的 CSS */
#main {
  border: solid 1px red !important;
  margin: 50px !important;
}
```

#### 属性拼接方法

`+_` 代表的是 空格；`+` 代表的是 逗号

```less
/* Less */
.Animation() {
  transform+_: scale(2);
}
.main {
  .Animation();
  transform+_: rotate(15deg);
}

/* 生成的 CSS */
.main {
  transform: scale(2) rotate(15deg);
}
```

```less
/* Less */
.boxShadow() {
  box-shadow+: inset 0 0 10px #555;
}
.main {
  .boxShadow();
  box-shadow+: 0 0 20px black;
}

/* 生成后的 CSS */
.main {
  box-shadow: inset 0 0 10px #555, 0 0 20px black;
}
```

#### 实战技巧

下面是官网中的一个非常赞的 Demo

```less
/* Less */
.average(@x, @y) {
  @average: ((@x + @y) / 2);
}

div {
  .average(16px, 50px); // 调用 方法
  padding: @average;    // 使用返回值
}

/* 生成的 CSS */
div {
  padding: 33px;
}
```

### 继承
类似混合方法，混合是直接把代码结果拿出来，而`extend`是把选择器提取出来，公共的代码写到一起。

#### extend
```less
/* Less */
.animation {
  transition: all 0.3s ease-out;
  .hide {
    transform: scale(0);
  }
}
#main {
  &:extend(.animation);
}
#con {
  &:extend(.animation .hide);
}

/* 生成后的 CSS */
.animation,
#main {
  transition: all 0.3s ease-out;
}
.animation .hide,
#con {
  transform: scale(0);
}
```

### all 全局搜索替换

使用选择器匹配到的 全部声明。

```less
/* Less */
#main {
  width: 200px;
}
#main {
  &:after {
    content: "Less is good!";
  }
}
#wrap:extend(#main all) {}

/* 生成的 CSS */
#main,
#wrap {
  width: 200px;
}
#main:after,
#wrap:after {
  content: "Less is good!";
}
```

### 导入与注释

`Less` 支持组件化，对一些公共文件进行复用，从而优化css文件目录结构

* 导`less`文件，后缀可省略
```less
@import "index"; 
//等价于
@import "index.less";
```

* 导入`css`文件需要加文件后缀
```less
@import "common.css"; 
```

* Less 里面的注释跟 JS 注释基本一样
```less
// 这是一句行注释 
@color: white;

/* 
 * 这是一个 
 * Less块注释
 */
@fontSize: 12px;
```

### 函数
`Less` 里面的函数与运算使用频率不是特别高,毕竟实际上`JS`操作起来更方便高效，具体内容可以参考官方手册，这里简单提一下。

[官方文档](https://www.runoob.com/manual/lessguide/functions/) 

1. 函数和混合的区分：

* 混合相当于是自定义函数
* 函数相当于是内置函数

2. 数学函数

* ceil 向上取整
* floor 向下取整
* percentage 将小数转化为 『百分比』

3. 颜色操作

* lighten 加亮
* darken 加暗
* fadein 提高透明度
* fadeout 降低透明度