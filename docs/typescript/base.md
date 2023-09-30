---
sidebar: auto
---
# TypeScript

`TypeScript`是`JavaScript`的一个超集，主要提供了**类型系统**和对**ES6**的支持，它于2012年10月正式发布第一个版本。

优势：
* 能在开发过程中更快的发现潜在问题。
* 对编辑器更友好的代码提示功能。
* 代码语义更清晰易懂。

## 安装

在命令行中：
```sh
# 安装命令
$ npm install -g typescript

# 安装完毕后，查看版本号
$ tsc -v
```

## 开始

创建一个叫做`TypeScript`的文件夹：
```sh
# 创建文件夹
$ mkdir TypeScript
```

随后在`TypeScript`文件夹中创建`demo.ts`文件：
```ts
console.log('Hello,world')
```

`.ts`中的代码一般而言是不能直接运行在浏览器的，需要我们把`typescript`代码进行编译成普通的`javascript`代码以后才能运行在浏览器，我们可以使用如下命令来进行编译：
```sh
# 编译命令
$ tsc demo.ts
```

当编译完毕后，我们可以在文件夹中看到多出来了一个叫做`demo.js`文件：
```sh
|-- TypeScript
|   |-- demo.js
|   |-- demo.ts
```

随后我们需要使用如下命令来执行我们编译后的`javascript`代码：
```sh
# 执行
$ node demo.js
```
当执行完毕以上命令后，你可以在终端上看到输出一下内容：
```sh
Hello,world
```

**简化过程**：我们发现，如果要运行一个`.ts`文件，我们首先需要使用`tsc`命令去编译它，随后再使用`node`命令去执行它，那么有没有一种工具能够一个步骤就帮我们做完以上的事情呢？我们需要全局安装一个叫做`ts-node`的工具：
```sh
# 安装ts-node
$ npm install ts-node -g

# 安装完毕，查看版本号
$ ts-node -v
```

在`ts-node`安装完毕后，我们先删除`demo.js`文件，随后使用`ts-node`命令来编译并执行我们的代码：
```sh
# 删除demo.js文件
$ rm demo.js

# 编译并执行
$ ts-node demo.ts
```
以上命令执行完毕后，你将会看到与上面实例相同的输出结果。

## 数据类型

### 七种原始数据类型

```ts
const str: string = "str";
const num: number = 24;
const bool: boolean = true;
const u: undefined = undefined;
const n: null = null;
const obj: object = { num: 1 };
const big: bigint = 100n;
const sym: symbol = Symbol("symbol");
```

默认情况下 `null` 和 `undefined`是所有类型的子类型，就是说你可以把 `null` 和 `undefined` 赋值给其他类型。
    
如果你在 `tsconfig.json` 指定了 `"strictNullChecks":true` ，`null` 和 `undefined` 只能赋值给 `void` 和它们各自的类型。

### Array 数组

对数组类型的定义有两种方式：
```ts
const arr: string[] = ['1', '2'];
const arr2: Array<number> = [1, 2];
const arr3: (string | number)[] = [1, "2"];
const arr4: Array<string | number> = ["1", 2];
```

定义指定对象成员的数组：
```ts
interface Test {
    name: string,
    age: number
}
const arr: Test[] = [{ name: "张三", age: 17 }];
const arr2: Array<Test> = [{ name: "李四", age: 21 }];
```

### Function 函数

函数声明：
```ts
function sum(x: number, y: number): number {
    return x + y
}
```

用函数表达式接口定义函数的方式时，对等号左侧进行类型限制，可以保证以后对函数名赋值时保证参数个数、参数类型、返回值类型不变。
  
用接口定义函数类型：
```ts
interface SearchFunc {
    (source: string, subString: string): boolean
};

const fn: SearchFunc = (a, b) => a === b;
```

#### 可选参数
  
参数默认值：
```ts
const reduce = (x: number = 0, y?: number): number => {
    if (y === undefined) return x;
    return y - x;
};
```
::: warning 注意
可选参数后面不允许再出现必需参数
:::

#### 剩余参数：
```ts
const push = (arr: any[], ...items: any[]): void => {
    for (const item of items) arr.push(item);
};

const a: any[] = [];
push(a, '1', 2, true);
console.log(a); // => [ '1', 2, true ] 
```

#### 函数重载

函数重载是使用相同名称和不同参数数量或类型创建多个方法的一种能力。  
为同一个函数提供多个函数类型定义来进行函数重载。  
编译器会根据这个列表去处理函数的调用。  
```ts
function add(x: number, y: number): number;
function add(x: number, y: string): string;
function add(x: string, y: number): string;
function add(x: string, y: string): string;
function add(x: number | string, y: number | string) {
    if (typeof x === 'string' || typeof y === 'string') {
        return x.toString() + y.toString()
    }
    return x + y
}

const result = add(1, '2')
console.log(result.split('')); // =>  [ '1', '2' ]
```

### Tuple 元组

元组最重要的特性是可以限制数组元素的个数和类型，它特别适合用来实现多值返回。  
::: warning 注意
元组类型只能表示一个已知元素数量和类型的数组，长度已指定，越界访问会提示错误。如果一个数组中可能有多种类型，数量和类型都不确定，那就直接any[]
:::
元祖用于保存定长定数据类型的数据：
```ts
let x: [string, number]; // 类型必须匹配且个数必须为2

x = ['hello', 10]; // OK

x = ['hello', 10, 10]; // Error
x = [10, 'hello']; // Error
```

#### 可选元素

```ts
type Tuple = [number, string?];

const one: Tuple = [123, "123"];
const two: Tuple = [123];
```

#### 元组类型的剩余元素

元组类型里最后一个元素可以是剩余元素，形式为 ...X，这里 X 是数组类型。剩余元素代表元组类型是开放的，可以有零个或多个额外的元素，例如 `[number, ...string[]]` 表示带有一个 `number` 元素和任意数量 `string` 类型元素的元组类型。

```ts
type ResTuple = [number, ...string[]];
const rt1: ResTuple = [666, "99", "88"];
```

#### 只读的元组类型

为任何元组类型加上 `readonly` 关键字前缀，以使其成为只读元组。使用 `readonly` 关键字修饰元组类型之后，任何企图修改元组中元素的操作都会抛出异常。
```ts
type ResTuple = readonly [number, ...string[]];
const rt1: ResTuple = [666, "99", "88"];
console.log(rt1); // => [ 666, '99', '88' ]
rt1[0] = 100 // Error
```

### void 空值

`void` 表示没有任何类型，和其他类型是平等关系，不能直接赋值:
```ts
let a: void; // Error
```

你只能为它赋予null和undefined（在 `strictNullChecks` 未指定为 `true` 时），一般也只有在函数没有返回值时去声明。
```ts
let a: void = null
let b: void = undefined

const fun = (): void => { 1 + 1 }
```

### never 不存在的值

`never` 类型表示的是那些永不存在的值的类型。  
值会永不存在的两种情况：
1. 如果一个函数执行时抛出了异常，那么这个函数永远不存在返回值（因为抛出异常会直接中断程序运行，这使得程序运行不到返回值那一步，即具有不可达的终点，也就永不存在返回了）
  
2. 函数中执行无限循环的代码（死循环），使得程序永远无法运行到函数返回值那一步，永不存在返回

```ts
const err = (msg: string): never => { throw new Error(msg) }

const lop = (): never => { while (true) { } }
```

`never` 类型同 `null` 和 `undefined` 一样，是任何类型的子类型，也可以赋值给任何类型，但是没有类型是 `never` 的子类型或可以赋值给 `never` 类型（除了 `never` 本身之外），即使 `any` 也不可以赋值给 `never`。

```ts
let ne: never;
let any: any;

ne = 123; // Error
ne = an; // Error
ne = (() => { throw new Error("异常"); })(); // OK
```

::: tip
使用 `never` 避免出现新增了联合类型没有对应的实现。  
目的就是写出类型绝对安全的代码。  
在 `TypeScript` 中，可以利用 `never` 类型的特性来实现全面性检查。  
:::
```ts
type Foo = string | number;

function controlFlowAnalysisWithNever(foo: Foo) {
    if (typeof foo === "string") {
        // 这里 foo 被收窄为 string 类型
    } else if (typeof foo === "number") {
        // 这里 foo 被收窄为 number 类型
    } else {
        // foo 在这里是 never
        const check: never = foo
    }
}
```

### Any 任意值

任意值 `Any` 用来表示可以接受任何类型的值。  
在 `TypeScript` 中，任何类型都可以被归为 `any` 类型，这让 `any` 类型成为了类型系统的顶级类型。
  
如果是一个普通类型，在赋值过程中改变类型是不被允许的，但如果是 any 类型，则允许被赋值为任意类型。
  
在 `any` 上访问任何属性都是允许的,也允许调用任何方法，变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型。

```ts
let a: string = "seven";
a = 7;  // Error: Type 'number' is not assignable to type 'string'.

let b: any = "seven";
b = 7; // OK

let c; // any
c = [7];
if (c.name === undefined) console.log(c[0]);
```

### unknown

`unknown` 与 `any` 一样，所有类型都可以分配给 `unknown`。  
`unknown` 与 `any` 的最大区别是： 
任何类型的值可以赋值给 `any`，同时 `any`类型的值也可以赋值给任何类型。`unknown` 任何类型的值都可以赋值给它，但它只能赋值给 `unknown` 和 `any`

```ts
let notSure: unknown = 4;
notSure = "maybe a string instead"; // OK
notSure = false; // OK

let ms: unknown = 4;
let msg: any = ms;
let mss: unknown = ms;
let num:number = ms // Error
```

如果不缩小类型，就无法对 `unknown` 类型执行任何操作，这种机制起到了很强的预防性，更安全，这就要求我们必须缩小类型，我们可以使用 `typeof`、类型断言等方式来缩小未知范围。

```ts
const getDog = (): string => "dog";
const dog: unknown = { hello: getDog };
dog.hello() // Error

const getCat = () => {
	let x: unknown;
	return x;
};

const cat = getCat();
// 直接使用
const upName = cat.toLowerCase(); // Error

// typeof
if (typeof cat === "string") {
	const upName = cat.toLowerCase();
}

// 类型断言
const upName = (cat as string).toLowerCase(); // OK
```

### 对象类型

`Number`、`String`、`Boolean`、`Symbol`，从类型兼容性上看，原始类型兼容对应的对象类型，反过来对象类型不兼容对应的原始类型。
```ts
let num: number = 1;
let Num: Number = 1;

Num = num; // OK
num = Num; // Error
```

`object` （首字母小写，以下称“小 object”）  
`Object` （首字母大写，以下称“大 Object”）  
`{}` （以下称“空对象”）  
  
大 Object 代表所有拥有 `toString`、`hasOwnProperty` 方法的类型，所以所有原始类型、非原始类型都可以赋给 `Object`。同样，在严格模式下，`null` 和 `undefined` 类型也不能赋给 `Object`。
```ts
let obj: Object;
obj = 1; // OK
obj = true; // OK
obj = {}; // OK
obj = undefined; // Error
obj = null; // Error
```

大 Object 不仅是小 object 的父类型，同时也是小 object 的子类型。
```ts
type isLowerCaseObjectExtendsUpperCaseObject =
	object extends Object ? true : false; // true

type isUpperCaseObjectExtendsLowerCaseObject =
	Object extends object ? true : false; // true

let objM: Object = {};
let objX: object = {};

objM = objX; // OK
objX = objM; // OK
```
::: warning 注意 
尽管官方文档说可以使用小 object 代替大 Object，但是我们仍要明白大 Object 并不完全等价于小 object。
:::

{}空对象类型和大 Object 一样，也是表示原始类型和非原始类型的集合，并且在严格模式下，`null` 和 `undefined` 也不能赋给 `{}`
```ts
let ObjectLiteral: {};
ObjectLiteral = 1; // ok
ObjectLiteral = "a"; // ok
ObjectLiteral = true; // ok
ObjectLiteral = null; // Error
ObjectLiteral = undefined; // Error
ObjectLiteral = {}; // ok
```

::: tip 总结
{}、大 Object 是比小 object 更宽泛的类型（least specific），{} 和大 Object 可以互相代替，用来表示原始类型（null、undefined 除外）和非原始类型；而小 object 则表示非原始类型。
:::

## 类型推断

### 类型推断

在很多情况下，TypeScript 会根据上下文环境自动推断出变量的类型，无须我们再写明类型注解，我们把 TypeScript 这种基于赋值表达式推断类型的能力称之为类型推断。
  
在 TypeScript 中，具有初始化值的变量、有默认值的函数参数、函数返回的类型都可以根据上下文推断出来，比如我们能根据 return 语句推断函数返回的类型。

`let` 声明：
```ts
let str = "this is string";
let num = 1;
let bool = true;

// 等价于
let str: string = "this is string";
let num: number = 1;
let bool: boolean = true;
```
  
`const` 声明
```ts
// const str: "this is string"
const str = "this is string";
// const num: 1
const num = 1;
// const bool: true
const bool = true; 

// 不等价
const str: string = "this is string";
const num: number = 1;
const bool: boolean = true;
```


``` ts
const add1 = (a: number, b: number) => a + b;
const x1 = add1(1, 1); // 推断出 x1 的类型也是 number

// (a: number, b?: number) => number
const add2 = (a: number, b = 1) => a + b;
const x2 = add2(1);
const x3 = add2(1, "1") // Error
```
::: warning 注意
如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 `any` 类型而完全不被类型检查。
  
在项目中特别是大型项目中，还是建议完整写完类型注解，因为ts进行类型推断是消耗性能的，而且ts类型推断并不是绝对准确的。
:::

### 类型断言

TypeScript 类型检测无法做到绝对智能，毕竟程序不能像人一样思考，有时会碰到我们比 TypeScript 更清楚实际类型的情况。
    
通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”，类型断言好比其他语言里的类型转换，但是不进行特殊的数据检查和解构，它没有运行时的影响，只是在编译阶段起作用。
    
类型断言有两种语法：

`as` 语法：
```ts
const arr: number[] = [1, 2, 3, 4, 5];
const greaterThan2: number = arr.find(num => num > 2); // Error
// 类型断言
const greaterThan2: number = arr.find(num => num > 2) as number
```

尖括号语法：
```ts
let val: any = "this is string";
val = (<string>val).length;
```
::: tip 
两种方式虽然没有任何区别，但是尖括号格式会与 `react` 中 `JSX` 产生语法冲突，因此更推荐使用 `as` 语法。
:::

### 非空断言

在上下文中当类型检查器无法断定类型时，一个新的后缀表达式操作符 `!` 可以用于断言操作对象是非 `null` 和非 `undefined` 类型，具体而言，`x!` 将从 `x` 值域中排除 `null` 和 `undefined`。
```ts
let str: null | undefined | string;
str.toString(); // Error

str?.toString(); // OK
str!.toString(); // OK

type n = () => number;

const fn = (ns: n | undefined) => {
    const num = ns(); // Error
    const num = ns!(); // OK
}
```

## TS类型

### 字面量类型

在 TypeScript 中，字面量不仅可以表示值，还可以表示类型，目前，TypeScript 支持 3 种字面量类型：
1. 字符串字面量类型
2. 数字字面量类型
3. 布尔字面量类型

```ts
const s: "this" = "this";
const n: 789 = 789;
const t: true = true;
```

我们可以限制函数的参数为指定的字面量类型集合，然后编译器会检查参数是否是指定的字面量类型集合里的成员。  
相较于使用 `string` 类型，使用字面量类型（组合的联合类型）可以将函数的参数限定为更具体的类型，这不仅提升了程序的可读性，还保证了函数的参数类型，可谓一举两得。
  
推荐写法：
```ts
type d = "up" | "down";
const move = (dir: d): null => null;
move("up"); // OK
```

### Let 和 const 分析

`const` 定义为一个不可变更的常量，在缺省类型注解的情况下，TypeScript 推断出它的类型直接由赋值字面量的类型决定：
```ts
const str = "this is string"; // str : 'this is string'
const num = 1; // num : 1
const bool = true; // bool : true
```

`let` 定义一个可变更的变量，缺少显式类型注解的可变更的变量的类型转换为了赋值字面量类型的父类型：
```ts
let str = "this is string"; // string
let num = 2; // number
let bool = true;  // boolean

str = 'any string';
num = 5;
bool = false;
```

### 类型拓宽(Type Widening)

我们将 TypeScript 的字面量子类型转换为父类型的这种设计称之为 `"literal widening"`，也就是字面量类型的拓宽。
    
所有通过 `let` 或 `var` 定义的变量、函数的形参、对象的非只读属性，如果满足指定了初始值且未显式添加类型注解的条件，那么它们推断出来的类型就是指定的初始值字面量类型拓宽后的类型，这就是字面量类型拓宽。

```ts
let str = 'this is string'; // 类型是 string
let strFun = (str = 'this is string') => str; // 类型是 (str?: string) => string;
const specifiedStr = 'this is string'; // 类型是 'this is string'
let str2 = specifiedStr; // 类型是 'string'
let strFun2 = (str = specifiedStr) => str; // 类型是 (str?: string) => string;
```

可以从下面这个例子理解类型拓宽：
```ts
const str: 'this is string' = 'this is string'; // str: 'this is string'
let str2 = str; // 即便使用 let 定义，类型是 'this is string'
```
因为常量不可变更，类型没有拓宽，所以 `str` 的类型是 `'this is string'` 字面量类型。因为赋予的值 `str` 的类型是字面量类型，且没有显式类型注解，所以 `str2` 的类型是字面量类型。 
  
当你在一个值之后使用 `const` 断言时，TypeScript 将为它推断出最窄的类型，没有拓宽，对于真正的常量，这通常是你想要的。
```ts
// 提供显式类型注释
const obj: { x: 1 | 2 | 3 } = { x: 1 };

// const 断言
const obj1 = { x: 1, y: 2 }; // {x: number; y: number}
const obj2 = { x: 1 as const, y: 2 }; // {x: 1; y: number}
const obj3 = { x: 1, y: 2 } as const; //  {readonly x: 1; readonly y: 2}

const arr1 = [1, 2, 3]; // number[]
const arr2 = [1, 2, 3] as const; // readonly [1, 2, 3]
```

### 类型缩小(Type Narrowing)

在 TypeScript 中，我们可以通过某些操作将变量的类型由一个较为宽泛的集合缩小到相对较小、较明确的集合，这就是 "Type Narrowing"。
```ts
// 类型守卫
const func = (anything: any) => {
	if (typeof anything === "string") return anything;
	else if (typeof anything === "number") return anything;
	return null;
};

// 同样，我们可以使用类型守卫将联合类型缩小到明确的子类型
const fun = (anything: string | number) => {
	if (typeof anything === "string") return anything;
	else if (typeof anything === "number") return anything;
};
```

通过字面量类型等值判断（===）或其他控制流语句（包括但不限于 if、三目运算符、switch 分支）将联合类型收敛为更具体的类型：
```ts
type Goods = "pen" | "pencil" | "ruler";

const getConst = (item: Goods) => {
	if (item === "pen") {
		item; // item => 'pen'
	} else {
		item; // => 'pencil' | 'ruler'
	}
};

interface UploadEvent {
	type: "upload";
	filename: string;
	contents: string;
}

interface DownloadEvent {
	type: "download";
	filename: string;
}

type AppEvent = UploadEvent | DownloadEvent;

function handleEvent(e: AppEvent) {
	switch (e.type) {
		case "download":
			e; // Type is DownloadEvent
			break;
		case "upload":
			e; // Type is UploadEvent
			break;
	}
}
```

### 联合类型

联合类型表示取值可以为多种类型中的一种，使用 `|` 分隔每个类型。联合类型通常与 `null` 或 `undefined` 一起使用。
```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = "seven"; // OK
myFavoriteNumber = 7; // OK

let num: 0 | 1 = 1;
type EventNames = "click" | "scroll" | "mousemove";
```

### 类型别名

类型别名用来给一个类型起个新名字。类型别名常用于联合类型。
```ts
type Message = string | string[];
const greet = (message: Message) => {};
```

### 交叉类型

交叉类型是将多个类型合并为一个类型，这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性，使用 `&` 定义交叉类型。
```ts
type useLess = string & number; // never

type t = { id: number; name: string } & { age: number };
const m1: t = { id: 1, name: "张三", age: 18 };
```
如果我们仅仅把原始类型、字面量类型、函数类型等原子类型合并成交叉类型，是没有任何用处的，因为任何类型都不能满足同时属于多种原子类型，因此，在上述的代码中，类型别名 `useless` 的类型就是个 `never`。

交叉类型真正的用武之地就是将多个接口类型合并成一个类型，从而实现等同接口继承的效果，也就是所谓的合并接口类型。

::: tip
如果合并的多个接口类型存在同名属性，如果同名属性的类型不兼容，那么其类型就会成为 `never`。  
如果同名属性的类型兼容 类型就是两者中的子类型。  
属性是非基本数据类型 可以成功合并。
:::

```ts
// 1. 同名属性的类型不兼容
type One = { id: number; name: 2 } & {
	age: number;
	name: number;
};
const obj:One = { id: 1, name: "string", age: 2 } // Error
// 'string' 类型不能赋给 'never' 类型

// 2. 同名属性的类型兼容
type Tow = { id: number; name: 2 } & {
	age: number;
	name: number;
};
// number & 2  --> 子类型 2
const obj: Tow = {
	id: 1,
	name: 2, // OK
	// name: 18, // Error
	age: 18
};

// 3. 属性是非基本数据类型
interface A {
	x: { d: true };
}
interface B {
	x: { e: string };
}
interface C {
	x: { f: number };
}
type ABC = A & B & C;
	
const abc: ABC = { x: { d: true, e: "", f: 666 } }; // OK
```

## 接口与泛型

### 接口

在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。
    
TypeScript 中的接口是一个非常灵活的概念，除了可用于 对类的一部分行为进行抽象 以外也常用于对 对象的形状（Shape） 进行描述。
  
接口一般首字母大写，定义的变量比接口少了一些属性是不允许的，多一些属性也是不允许的：
```ts
interface Person {
	name: string;
	age: number;
	once?: number; // 可选属性
}

let Tom: Person = { name: "Tom", age: 18 };
let Tom1: Person = { name: 'Tom', age: 18 ,gender:"男"} // Error 多了gender属性
let Tom2: Person = { name: 'Tom' } // Error 少了age属性
```

#### 任意属性

有时候我们希望一个接口中除了包含必选和可选属性之外，还允许有其他的任意属性，这时我们可以使用 `索引签名` 的形式来满足上述要求。

::: warning 注意
一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集。  
一个接口中只能定义一个任意属性，如果接口中有多个类型的属性，则可以在任意属性中使用联合类型。
:::

```ts
interface Person {
	readonly name: string; // 只读
	age?: number; // 这里真实的类型应该为：number | undefined
	[key: string]: string | number | undefined;
}

const tom: Person = {
	name: "Tom",
	age: 17,
	gender: "male"
};
```

#### 只读属性

只读属性用于限制只能在对象刚刚创建的时候修改其值，TypeScript 还提供了 `ReadonlyArray<T>` 类型确保数组创建后再也不能被修改。
```ts
let a: number[] = [1, 2, 3];
let ro: ReadonlyArray<number> = a;
// ro[0] = 12 // Error
// ro.push(5) // Error
// ro.length = 100 // Error
// a = ro // Error
```

### 接口与类型别名的区别

实际上，在大多数的情况下使用接口类型和类型别名的效果等价，但是在某些特定的场景下这两者还是存在很大区别。
  
TypeScript 的核心原则之一是对值所具有的结构进行类型检查，而接口的作用就是为这些类型命名和为你的代码或第三方代码定义数据模型。
  
`type`(类型别名)会给一个类型起个新名字，`type` 有时和 `interface` 很像，但是可以作用于原始值（基本类型），联合类型，元组以及其它任何你需要手写的类型，起别名不会新建一个类型，它创建了一个新名字来引用那个类型，给基本类型起别名通常没什么用，尽管可以做为文档的一种形式使用。
  
接口与类型别名的区别：
1. 接口可以定义多次,会被自动合并为单个接口，类型别名不可以。
2. 接口只能给对象指定类型，类型别名可以为任意类型指定别名。
3. 接口通过 `extends` 关键字进行继承，类型别名的扩展就是交叉类型，通过 `&` 来实现。
4. `type` 可以使用 `in` 关键字生成映射类型 `interface` 不行。
  
建议：公共的用 `interface` 实现，不能用 `interface` 实现的再用 `type` 实现。

```ts
// interface

interface Point {
	x: number;
}

interface Point {
	y: number;
}

interface SetPoint {
	(x: number, y: number): void;
}

const point: Point = { x: 1, y: 2 };


// Type
type Name = string;

// object
type PartialPointX = { x: number };
type PartialPointY = { y: number };
type SetPointType = (x: number, y: number) => void;

// union
type PartialPoint = PartialPointX | PartialPointY;

// tuple
type Data = [number, string];

// dom
let div = document.createElement("div");
type B = typeof div;

// 映射
type Keys = "name" | "age";
type DudeType = {
	[key in Keys]: string | number;
};
const tom: DudeType = {
	name: "Tom",
	age: 18
};
```

两者的扩展方式不同，但并不互斥，接口可以扩展类型别名，同理，类型别名也可以扩展接口，接口的扩展就是继承，通过 `extends` 来实现，类型别名的扩展就是交叉类型，通过 `&` 来实现。
```ts
	
// 接口扩展接口
interface PointX {
	x: number;
}
interface Point extends PointX {
	y: number;
}
let point: Point = { x: 1, y: 2 };
	
// 类型别名扩展类型别名
type PointX = { x: number };
type Point = PointX & { y: number };
let point: Point = { x: 1, y: 2 };

// 接口扩展类型别名
type PointX = { x: number };
interface Point extends PointX {
	y: number;
}
		
// 类型别名扩展接口
interface PointX {
	x: number;
}
type Point = PointX & { y: number };
```

### 绕开额外属性检查的方式

下面代码，在参数里写对象就相当于是直接给 `labeledObj` 赋值，这个对象有严格的类型定义，所以不能多参或少参。而当你在外面将该对象用另一个变量 `myObj` 接收，`myObj`不会经过额外属性检查，但会根据类型推论为 `let myObj: { size: number; label: string } = { size: 10, label: "Size 10 Object" }`；然后将这个 `myObj` 再赋值给 `labeledObj`，此时根据类型的兼容性，两种类型对象，参照鸭式辨型法，因为都具有 `label` 属性，所以被认定为两个相同，故而可以用此法来绕开多余的类型检查。
```ts
interface LabeledValue {
	label: string;
}

function printLabel(labeledObj: LabeledValue) {
	console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj); // OK

// printLabel({ size: 10, label: "Size 10 Object" }); // Error
```

类型断言的意义就等同于你在告诉程序，你很清楚自己在做什么，此时程序自然就不会再进行额外的属性检查了。
```ts
interface Props {
	name: string;
	age: number;
	money?: number;
}

let p: Props = {
	name: "张三",
	age: 25,
	money: -100000,
	girl: false
} as Props; // OK
```

索引签名：
```ts
interface Props {
	name: string;
	age: number;
	money?: number;
	[key: string]: boolean | string | number | undefined;
}

let p: Props = {
	name: "张三",
	age: 25,
	money: -100000,
	girl: false,
	once: 123
}; // OK
```

### 泛型

#### 泛型介绍

下面代码中 `T` 代表 `Type`，在定义泛型时通常用作第一个类型变量名称，但实际上 `T` 可以用任何有效名称代替。除了 `T` 之外，以下是常见泛型变量代表的意思：
1. `K（Key）`：表示对象中的键类型；
2. `V（Value）`：表示对象中的值类型；
3. `E（Element）`：表示元素类型。
```ts
const identities = <T, U>(value: T, message: U): T => {
	console.log(message);
	return value;
};

identities<number, string>(12, "string");

// 除了为类型变量显式设定值之外，一种更常见的做法是使编译器自动选择这些类型，从而使代码更简洁。我们可以完全省略尖括号
identities(17, "semLinker");
```

#### 泛型约束

如下假如我想打印出参数的 `size` 属性，如果完全不进行约束 TS 是会报错的，报错的原因在于 `T` 理论上是可以是任何类型的，不同于 `any`，你不管使用它的什么属性或者方法都会报错（除非这个属性和方法是所有集合共有的），那么直观的想法是限定传给 `trace` 函数的参数类型应该有 `size` 类型，这样就不会报错了。
  
实现这个需求的关键在于使用类型约束，使用 `extends` 关键字可以做到，简单来说就是你定义一个类型，然后让 `T` 实现这个接口即可。
```ts
function trace<T>(arg: T): T {
	// console.log(arg.size); // Error
	return arg;
}

// 解决
interface Sizeable {
	size: number;
	push: Function;
}
const fn = <T extends Sizeable>(arg: T): T => {
	console.log(arg.size);
	arg.push(12);
	return arg;
};
```

## TS 中的关键字

### typeof

`typeof` 的主要用途是在类型上下文中获取变量或者属性的类型，此外，`typeof` 操作符除了可以获取对象的结构类型之外，它也可以用来获取函数对象的类型。

```ts
interface Person {
    name: string;
    age: number;
}

const sem: Person = { name: "张三", age: 18 };
type Sem = typeof sem; // type Sem = Person
const son: Sem = { name: "李四", age: 17 };

const message = {
    name: "jimmy",
    age: 18,
    address: {
        province: '四川',
        city: '成都'
    }
}
type Message = typeof message;

function toArray(x: number): Array<number> {
    return [x];
}

type Func = typeof toArray; // -> (x: number) => number[]

const num = 10
type n = typeof num // 也支持基本类型和字面量类型
```

### keyof

`keyof` 可以用于获取某种类型的所有键，其返回类型是联合类型。
```ts
interface Person {
	name: string;
	age: number;
}
type K1 = keyof Person; // "name" | "age"
type K2 = keyof []; // "length"  | "pop" | "push" ...
type K3 = keyof { [x: string]: Person }; // string | number

let k1: K1 = "name";
k1 = "age";

let k2: K2 = 2; // 数组是数字索引
k2 = "join";

let k3: K3 = 4;
k3 = "this is string";
```
::: warning 注意
在 TypeScript 中支持两种索引签名，数字索引和字符串索引。
  
`JavaScript` 在执行索引操作时会先把数值索引先转换为字符串索引，所以 `keyof { [x: string]: Person }` 的结果会返回 `string | number`。数字索引 -> `keyof [index: number]: string => number`。
:::

`keyof` 也支持基本数据类型：
```ts
let K1: keyof boolean; // let K1: "valueOf"
let K2: keyof number; // let K2: "toString" | "toFixed"  ...
let K3: keyof symbol; // let K1: "valueOf" ...
```

常见用法：
```ts
// 返回值是any
function prop(obj: object, key: string) {
	return obj[key];
}

function props<T extends object, K extends keyof T>(
	obj: T,
	key: K
) {
	return obj[key];
}

type Todo = {
	id: number;
	text: string;
	done: boolean;
};

const todo: Todo = {
	id: 1,
	text: "learn typescript keyof",
	done: false
};

const id = props(todo, "id"); // const id: number
const text = props(todo, "text"); // const text: string
const done = props(todo, "done"); // const done: boolean
// const date = props(todo, "date"); // Error
```

### in 

`in` 用来遍历枚举类型：
```ts
type Keys = "name" | "age" | "gender";

type Person = {
	[p in Keys]: number | string;
};

const tom: Person = {
	name: "zhangsan",
	age: 17,
	gender: "man"
};
```

### infer

在条件类型语句中，可以用 infer 声明一个类型变量并且对它进行使用：
```ts

// 获取函数返回值的类型
type ReturnType<T> = T extends (...args: any[]) => infer R
	? R
	: never;
const sum = (a: number, b: number) => a + b;
type SumReturnType = ReturnType<typeof sum>; // number

// 获取数组里的元素类型
type ArrayElementType<T> = T extends (infer U)[] ? U : never;
const numbers = [1, 2, 3, "4", "5"]; // (string | number)[]
type NumberType = ArrayElementType<typeof numbers>; // string | number

// 提取 Promise 的 resolved 类型
type ResolvedType<T> = T extends Promise<infer R> ? R : never;
async function fetchData() {
	// 省略异步操作
	return "data";
} // Promise<string>
type DataType = ResolvedType<ReturnType<typeof fetchData>>; // string
```

### extends

extends 关键字添加泛型约束。
```ts
interface Lengthwise {
	length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
	console.log(arg.length);
	return arg;
}

// 现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：
// loggingIdentity(3);  // Error, number doesn't have a .length property

// 这时我们需要传入符合约束类型的值，必须包含length属性：
loggingIdentity({ length: 10, value: 3 });

// 条件类型约束
type TypeName<T> = T extends string
	? "string"
	: T extends number
	? "number"
	: T extends boolean
	? "boolean"
	: T extends undefined
	? "undefined"
	: "object";

type TypeA = TypeName<string>; // "string"
type TypeB = TypeName<number>; // "number"
type TypeC = TypeName<boolean>; // "boolean"
type TypeD = TypeName<undefined>; // "undefined"
type TypeE = TypeName<object>; // "object"

// 条件类型递归
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type NestedArray = [1, [2, [3, [4]]]];
type FlattenedArray = Flatten<NestedArray>; // 1 | 2 | 3 | 4
```

### enum

枚举 `enum` 类型用来表示给一组数值赋予名字，这样对开发者比较友好，可以理解枚举就是一个字典：
```ts
enum Day {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
 }
```

上面定义的枚举类型的Day，它有7个值，TypeScript会为它们每个值分配编号，默认从0开始，在使用时，就可以使用名字而不需要记数字和名称的对应关系了：
```ts
console.log(Day.SUNDAY)   // 0
console.log(Day.MONDAY)   // 1
console.log(Day.SATURDAY)   // 6
```

#### 数字枚举

如果想要从其他值开始递增，可以将第一个值的索引值进行指定：
```ts
enum Color {
  Red = 2,
  Blue,
  Yellow
}
console.log(Color.Red, Color.Blue, Color.Yellow); // 2 3 4
```

可以对一个字段指定一个索引值，那他后面没有指定索引值的就会依次加一：
```ts
// 指定部分字段，其他使用默认递增索引
enum Status {
  Ok = 200,
  Created,
  Accepted,
  BadRequest = 400,
  Unauthorized
}
console.log(Status.Created, Status.Accepted, Status.Unauthorized); // 201 202 401
```

除此之外，还可以给每个字段指定不连续的任意索引值：
```ts
enum Status {
  Success = 200,
  NotFound = 404,
  Error = 500
}
console.log(Status.Success, Status.NotFound, Status.Error); // 200 404 500
```

数字枚举在定义值时，可以使用计算值。但是要注意，如果某个字段使用了计算值，那么该字段后面紧接着的字段必须设置初始值，这里不能使用默认的递增值了，如下例子：
```ts
// 初值为计算值
const getValue = () => {
  return 0;
};
enum ErrorIndex {
  a = getValue(),
  b, // error 枚举成员必须具有初始化的值
  c
}
enum RightIndex {
  a = getValue(),
  b = 1,
  c
}
```

#### 字符串枚举

TypeScript 将定义值是字符串字面量的枚举称为字符串枚举，字符串枚举值要求每个字段的值都必须是字符串字面量，或者是该枚举值中另一个字符串枚举成员：
```ts
// 使用字符串字面量
enum Message {
  Error = "Sorry, error",
  Success = "Hello, success"
}
console.log(Message.Error); // 'Sorry, error'

// 使用枚举值中其他枚举成员
enum Message {
  Error = "error message",
  ServerError = Error,
  ClientError = Error
}
console.log(Message.Error); // 'error message'
console.log(Message.ServerError); // 'error message'
```

#### 反向映射

定义枚举类型的值时，可以通过 Enum['key'] 或者 Enum.key 的形式获取到对应的值 value。TypeScript 还支持反向映射，但是反向映射只支持数字枚举，不支持字符串枚举：
```ts
enum Status {
  Success = 200,
  NotFound = 404,
  Error = 500
}
console.log(Status["Success"]); // 200
console.log(Status[200]); // 'Success'
console.log(Status[Status["Success"]]); // 'Success'
```

TypeScript 中定义的枚举，编译之后其实是一个对象，生成的代码中，枚举类型被编译成一个对象，它包含了正向映射（ name -> value）和反向映射（ value -> name）。下面来看看上面代码中的 Status 编译后的效果：
```ts
{
    200: "Success",
    404: "NotFound",
    500: "Error",
    Error: 500,
    NotFound: 404,
    Success: 200
}
```

应用：
```ts
enum Animal {
  Dog,
  Cat
}

interface Dog {
  type: Animal.Dog; 
}
interface Cat {
  type: Animal.Cat; 
}

let dog: Dog = {
  type: Animal.Dog
};
```

### class

在 TypeScript 中，我们也是通过 `Class` 关键字来定义一个类, 使用 `constructor` 定义构造函数。
```ts
class Animal {
    public name: string;
    constructor(name: string) {
        this.name = name;
    }
    sayHi(): string {
        return `My name is ${this.name}`;
    }
}
```

#### 类的继承
使用 `extends` 关键字实现继承，子类中使用 `super` 关键字来调用父类的构造函数和方法。
```ts
class Animal {
    public name: string;
    constructor(name: string) {
        this.name = name;
    }
    sayHi(): string {
        return `My name is ${this.name}`;
    }
}

class Cat extends Animal {
  constructor(name) {
    super(name); // 调用父类的 constructor(name)
    console.log(this.name);
  }
  sayHi(): string { // 将子类共用的方法抽象出来放在父类中，自己特殊逻辑放在子类中重写父类的逻辑
    return 'Meow, ' + super.sayHi(); // 调用父类的 sayHi()
  }
}

let c = new Cat('Tom'); // Tom
console.log(c.sayHi()); // Meow, My name is Tom
```

#### 修饰符
* `override`：重写，指子类重写继承自父类的方法
* `overload`：重载，指为同一个函数提供多个类型定义
* `inheritance`：子类继承父类，子类除了拥有父类的所有特性外，还有一些具体的特性
* `Polymorphism`：由继承而产生了相关的不同的类，对同一个方法可以有不同的行为
* `public`：自己、自己的子类 和其他类都可以访问 (默认值)
* `private`：受保护的 自己和自己的子类能访问， 其他类不能访问
* `protected`：私有的 只能自己访问，自己的子类不能访问，其他类更不能访问
* `readonly`：变量只能在属性声明时或 构造函数 中初始化

当构造函数修饰为 `private` 时，该类不允许被继承或者实例化：
```ts
class Animal {
  public name: string;
  private constructor(name: string) {
    this.name = name;
  }
}
class Cat extends Animal { // 无法扩展类“Animal”。类构造函数标记为私有。
  constructor(name: string) {
    super(name);
  }
}

let a = new Animal('Jack'); // 类“Animal”的构造函数是私有的，仅可在类声明中访问。
```
同理，当构造函数修饰为 `protected` 时，该类只允许被继承。

#### 存取器
在 `class` 中，可以通过 `getter` 和 `setter` 来改变属性的读取和赋值行为。
```ts
class Person {
  // 私有属性，只能在类中进行访问
  name: string
  constructor (name: string) {
    this.name = name
  }
  get name () {
    return this.name
  }
  set name(name) {
    this.name = name
  }
}
let person = new Person('why')
console.log(person.name)  // why
person.name = 'AAA'
console.log(person.name)  // AAA
```

#### 抽象类
在TypeScript中，可以使用abstract关键字来定义抽象类以及抽象类中的抽象方法，在使用抽象类的过程中，有几点需要注意：
* 抽象类不能被实例化，只能被继承。
* 抽象类中的抽象方法必须被子类实现。
抽象类不能被实例化：
```ts
abstract class Animal {
  name: string
  constructor (name: string) {
    this.name = name
  }
}
class Person extends Animal{}
const person = new Person('why')
console.log(person.name)    // why
const animal = new Animal() // 编译报错
```
抽象类中的抽象方法必须被子类实现：
```ts
abstract class Animal {
  name: string
  constructor (name: string) {
    this.name = name
  }
  abstract eat (): void
}
class Person extends Animal{
  // 子类必须实现抽象类中的抽象方法
  eat () {
    console.log('person is eating')
  }
}
const person = new Person('why')
console.log(person.name)    // why
person.eat()                // person is eating
```

### 索引类型

在实际开发中，我们经常能遇到这样的场景，在对象中获取一些属性的值，然后建立对应的集合。  
可以用索引类型让TS报错 排除可以返回的 `undefined`，且让代码提示变得更加丰富。
```ts
const getValue = <T, K extends keyof T>(person: T, keys: K[]) =>
	keys.map(key => person[key]); // T[K][]

interface Person {
	name: string;
	age: number;
}

const person: Person = {
	name: "tom",
	age: 17
};

getValue(person, ["name", "age"]); // ['tom', 17]

// getValue(person, ['gender']) // 报错
```

### 映射类型

根据旧的类型创建出新的类型, 我们称之为映射类型
```ts
interface TestInterface {
	name: string;
	age: number;
}
// 我们可以通过 + / - 来指定添加还是删除

type OptionalTestInterface<T> = {
	+readonly [p in keyof T]+?: T[p];
};

type newTestInterface = OptionalTestInterface<TestInterface>;

// 等价于
type newTestInterfaceType = {
	readonly name?: string;
	readonly age?: number;
};
```

## TS内置泛型工具

### Partial

`Partial<T>` 将类型的属性变成可选

定义：
```ts
type Partial<T> = {
	[K in keyof T]?: T[K];
};
```

但是 `Partial<T>` 有个局限性，就是只支持处理第一层的属性：
```ts
interface UserInfo {
	id: number;
	name: string;
	fruits: {
		appleNumber: number;
		orangeNumber: number;
	};
}

const zhangsan: Partial<UserInfo> = { fruits: { orangeNumber: 1 } } // Error
```

如果要处理多层，就可以自己实现：
```ts
type DeepPartial<T> = {
	// 如果是 object，则递归类型
	[K in keyof T]?: T[K] extends object
		? DeepPartial<T[K]>
		: T[K];
};

const zhangsan: DeepPartial<UserInfo> = {
	fruits: { orangeNumber: 1 }
};
```

### Required

`Required<T>` 将类型的属性变成必选：
```ts
// 定义
type Required<T> = {
	// -? 移除可选
	[K in keyof T]-?: T[K];
};

interface UserInfo {
	id?: number;
	name?: string;
}

const tom: Required<UserInfo> = { id: 1, name: "tom" };
```

### Readonly

`Readonly<T>` 的作用是将某个类型所有属性变为只读属性，不能被重新赋值：
```ts
// 定义
type Readonly<T> = {
	readonly [K in keyof T]: T[K];
};

interface Todo {
	title: string;
}

const todo: Readonly<Todo> = {
	title: "Delete inactive users"
};

// todo.title = "Hello"; // Error: cannot reassign a readonly property
```

### Pick

`Pick<T, K extends keyof T>` 从某个类型中挑出一些属性出来

```ts
// 定义
type Pick<T, K extends keyof T> = {
	[P in K]: T[P];
};

interface Todo {
	title: string;
	description: string;
	completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
	title: "Clean room",
	completed: false
};
```

### Record

`Record<K extends keyof any, T>` 的作用是将 K 中所有的属性的值转化为 T 类型。
```ts
// 定义
type Record<K extends keyof any, T> = {
	[P in K]: T;
};

type Info = Record<string, string | number>;
const tom: Info = {
	id: 1,
	name: "tom",
	age: 17
};

interface PageInfo {
	title: string;
}
type Page = "home" | "about" | "contact";

const x: Record<Page, PageInfo> = {
	about: { title: "about" },
	contact: { title: "contact" },
	home: { title: "home" }
};
```

### ReturnType

`ReturnType<T extends (...arg: any[]) => any>` 用来得到一个函数的返回值类型
```ts
// 定义
type ReturnType<T extends (...arg: any[]) => any> = T extends (
	...arg: any[]
) => infer R
	? R
	: never;

type Func = (value: number) => string;
const foo: ReturnType<Func> = "string";
```

### Exclude

`Exclude<T, U>` 的作用是将某个类型中属于另一个的类型移除掉。
```ts
// 定义
type Exclude<T, U> = T extends U ? never : T;

// 如果 T 能赋值给 U 类型的话，那么就会返回 never 类型，否则返回 T 类型。最终实现的效果就是将 T 中某些属于 U 的类型移除掉。

type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | number
```

### Extract

`Extract<T, U>` 的作用是从 T 中提取出 U。
```ts
// 定义
type Extract<T, U> = T extends U ? T : never;

type T0 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T1 = Extract<string | number | (() => void), Function>; // () =>void
```

### Omit

`Omit<T, K extends keyof any>` 使用 T 类型中除了 K 类型的所有属性，来构造一个新的类型。
```ts
// 定义
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

interface Todo {
	title: string;
	description: string;
	completed: boolean;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
	title: "Clean room",
	completed: false
};
```

### NonNullable

`NonNullable<T>` 的作用是用来过滤类型中的 `null` 及 `undefined` 类型。
```ts
// 定义
type NonNullable<T> = T extends null | undefined ? never : T;
// type NonNullable<T> = Exclude<T, undefined | null>

type T0 = NonNullable<string | number | undefined>; // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```

### Parameters

`Parameters<T>` 的作用是用于获得函数的参数类型组成的元组类型。
```ts
// 定义
type Parameters<T extends (...args: any) => any> = T extends (
	...args: infer P
) => any
	? P
	: never;

type A = Parameters<() => void>; // []
type B = Parameters<typeof Array.isArray>; // [any]
type C = Parameters<typeof parseInt>; // [string, (number | undefined)?]
type D = Parameters<typeof Math.max>; // number[]
```

## tsconfig.json常见配置

`tsconfig.json` 是 `TypeScript` 项目的配置文件，如果一个目录下存在一个 `tsconfig.json` 文件，那么往往意味着这个目录就是 `TypeScript` 项目的根目录。

`tsconfig.json` 包含 `TypeScript` 编译的相关配置，通过更改编译配置项，我们可以让 `TypeScript` 编译出 `ES6、ES5、node` 的代码。
  
`tsconfig.json` 重要字段：
* **files** - 设置要编译的文件的名称；
* **include** - 设置需要进行编译的文件，支持路径模式匹配；
* **exclude** - 设置无需进行编译的文件，支持路径模式匹配；
* **compilerOptions** - 设置与编译流程相关的选项。
```json
{
  "compilerOptions": {
    /* 基本选项 */
    "target": "es5", // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs", // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [], // 指定要包含在编译中的库文件
    "allowJs": true, // 允许编译 javascript 文件
    "checkJs": true, // 报告 javascript 文件中的错误
    "jsx": "preserve", // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true, // 生成相应的 '.d.ts' 文件
    "sourceMap": true, // 生成相应的 '.map' 文件
    "outFile": "./", // 将输出文件合并为一个文件
    "outDir": "./", // 指定输出目录
    "rootDir": "./", // 用来控制输出目录结构 --outDir.
    "removeComments": true, // 删除编译后的所有的注释
    "noEmit": true, // 不生成输出文件
    "importHelpers": true, // 从 tslib 导入辅助工具函数
    "isolatedModules": true, // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.
    /* 严格的类型检查选项 */
    "strict": true, // 启用所有严格类型检查选项
    "noImplicitAny": true, // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true, // 启用严格的 null 检查
    "noImplicitThis": true, // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true, // 以严格模式检查每个模块，并在每个文件里加入 'use strict'
    /* 额外的检查 */
    "noUnusedLocals": true, // 有未使用的变量时，抛出错误
    "noUnusedParameters": true, // 有未使用的参数时，抛出错误
    "noImplicitReturns": true, // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true, // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）
    /* 模块解析选项 */
    "moduleResolution": "Node", // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./", // 用于解析非相对模块名称的基目录
    "paths": {}, // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [], // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [], // 包含类型声明的文件列表
    "types": [], // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true, // 允许从没有设置默认导出的模块中默认导入。
    /* Source Map Options */
    "sourceRoot": "./", // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./", // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true, // 生成单个 sourcemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true, // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性
    /* 其他选项 */
    "experimentalDecorators": true, // 启用装饰器
    "emitDecoratorMetadata": true // 为装饰器提供元数据的支持
  }
}
```