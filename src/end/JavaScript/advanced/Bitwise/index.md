# 位运算

- 位运算是直接对二进制位进行的计算，直接处理每一个比特位，是非常底层的运算，好处是速度极快，缺点是可读性较差。

- 位运算只对整数起作用，如果一个运算数不是整数，会自动转为整数后再运行。

- 在 `JavaScript` 内部，数值都是以 64 位浮点数的形式储存，但是做位运算的时候，是以 32 位带符号的整数进行运算的，并且返回值也是一个 32 位带符号的整数。

参考资料：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)

## 位操作符

### 按位与（&）

`按位与（&）` 运算符在两个操作数对应的二进位都为 1 时，该位的结果值才为 1。

```JavaScript
const a = 5; // 00000000000000000000000000000101
const b = 3; // 00000000000000000000000000000011

console.log(a & b); // 00000000000000000000000000000001
// => 1
```

### 按位或（|）

`按位或（|）` 运算符在其中一个或两个操作数对应的二进制位为 1 时，该位的结果值为 1。

```JavaScript
const a = 5; // 00000000000000000000000000000101
const b = 3; // 00000000000000000000000000000011

console.log(a | b); // 00000000000000000000000000000111
// => 7
```

### 按位异或（^）

`按位异或（^）` 运算符在两个操作数有且仅有一个对应的二进制位为 1 时，该位的结果值为 1。

```JavaScript
const a = 5; // 00000000000000000000000000000101
const b = 3; // 00000000000000000000000000000011

console.log(a ^ b); // 00000000000000000000000000000110
// => 6
```

### 按位非（~）

`按位非（~）` 运算符将操作数的位反转，将操作数转化为 32 位的有符号整型。

```JavaScript
const a = 5; // 00000000000000000000000000000101
const b = -3; // 11111111111111111111111111111101

console.log(~a); // 11111111111111111111111111111010
// => -6

console.log(~b); // 00000000000000000000000000000010
// => 2
```

### 左移（<<）

`左移（<<）` 操作符将第一个操作数向左移动指定位数，左边超出的位数将会被清除，右边将会补零。

```JavaScript
const a = 5; // 00000000000000000000000000000101
const b = 2; // 00000000000000000000000000000010

console.log(a << b); // 00000000000000000000000000010100
// => 20
```

### 右移（>>）

`右移（>>）` 操作符将指定操作数的二进制位向右移动指定的位数。向右被移出的位被丢弃，拷贝最左侧的位以填充左侧。由于新的最左侧的位总是和以前相同，符号位没有被改变。所以被称作“符号传播”。

```JavaScript
const a = 5; //  00000000000000000000000000000101
const b = 2; //  00000000000000000000000000000010
const c = -5; //  11111111111111111111111111111011

console.log(a >> b); //  00000000000000000000000000000001
// => 1

console.log(c >> b); //  11111111111111111111111111111110
// => -2
```

### 无符号右移（>>）

`无符号右移（>>）` 操作符将第一个操作数向右移动指定的位数。向右被移出的位被丢弃，左侧用 0 填充。因为符号位变成了 0，所以结果总是非负的。

```JavaScript
const a = 5; //  00000000000000000000000000000101
const b = 2; //  00000000000000000000000000000010
const c = -5; //  11111111111111111111111111111011

console.log(a >>> b); //  00000000000000000000000000000001
// => 1

console.log(c >>> b); //  00111111111111111111111111111110
// => 1073741822
```

## 应用

###

## 位运算权限设计

传统的权限系统里，存在很多关联关系，如用户和权限的关联，用户和角色的关联。系统越大，关联关系越多，越难以维护。而引入位运算，可以巧妙的解决该问题。

下文所有的讨论都是基于这两个前提的：

1. 每种权限码都是唯一的（这是显然的）
2. 所有权限码的二进制数形式，有且只有一位值为 1，其余全部为 0（2^n）

这里用文件的读、写、执行权限做示例：

| 权限 | 字母表示 | 数字表示 | 二进制 |
| :--: | :------: | :------: | :----: |
|  读  |    r     |    4     | 0b100  |
|  写  |    w     |    2     | 0b010  |
| 执行 |    x     |    1     | 0b001  |

### 添加权限

```JavaScript
const r = 0b100;
const w = 0b010;
const x = 0b001;

// 给用户赋全部权限
let user = r | w | x;
console.log(user); // => 7
console.log(user.toString(2)); // 111
```

### 校验权限

```JavaScript
const r = 0b100;
const w = 0b010;
const x = 0b001;

// 给用户赋 r w 两个权限
let user = r | w;

console.log((user & r) === r); // true  有 r 权限
console.log((user & w) === w); // true  有 w 权限
console.log((user & x) === x); // false 没有 x 权限
```

### 删除权限

::: code-group

```JavaScript [无则增，有则减]
const r = 0b100;
const w = 0b010;
const x = 0b001;
let user = r | w; // 有 r w 两个权限

// 执行异或操作，删除 r 权限
user = user ^ r;

console.log((user & r) === r); // false 没有 r 权限
console.log((user & w) === w); // true  有 w 权限
console.log((user & x) === x); // false 没有 x 权限

// 再执行一次异或操作
user = user ^ r;

console.log((user & r) === r); // true  有 r 权限
console.log((user & w) === w); // true  有 w 权限
console.log((user & x) === x); // false 没有 x 权限
```

```JavaScript [纯删除权限]
const r = 0b100;
const w = 0b010;
const x = 0b001;
let user = 0b110; // 有 r w 两个权限

// 删除 r 权限
user = user & ~r;

console.log((user & r) === r); // false 没有 r 权限
console.log((user & w) === w); // true  有 w 权限
console.log((user & x) === x); // false 没有 x 权限

// 再执行一次
user = user & ~r;

console.log((user & r) === r); // false 没有 r 权限
console.log((user & w) === w); // true  有 w 权限
console.log((user & x) === x); // false 没有 x 权限
```

:::

### 局限性和解决办法

上述的所有都有前提条件：

1. 每种权限码都是唯一的。
2. 每个权限码的二进制数形式，有且只有一位值为 1（2^n）。

则权限码只能是 1, 2, 4, 8,...,1024,...JavaScript 的按位操作符又是将其操作数当作 32 位比特序列的，那么同一个应用下可用的权限数就非常有限了，这也是该方案的局限性。

为了突破这个限制，这里提出一个叫“权限空间”的概念，既然权限数有限，那么不妨就多开辟几个空间来存放。

基于权限空间，我们定义两个格式：

1. 权限 code，字符串，形如 `index,pos`。其中 `pos` 表示 32 位二进制数中 1 的位置（其余全是 0）； `index` 表示权限空间，用于突破 JavaScript 数字位数的限制，是从 0 开始的正整数，每个权限 code 都要归属于一个权限空间。
2. 用户权限，字符串，形如 ` 1,16,16`。如 `1,16,16` 的意思就是，权限空间 0 的权限值是 1，权限空间 1 的权限值是 16，权限空间 2 的权限是 16。

示例代码：

```JavaScript
let userCode = ''; // 用户的权限 code

// 模拟系统里有这些权限，正常情况下是按顺序尽可能占满一个权限空间，再使用下一个
const permissions = {
  SYS_SETTING: {
    value: '0,0', // index = 0, pos = 0
    info: '系统权限'
  },
  DATA_ADMIN: {
    value: '0,8',
    info: '数据库权限'
  },
  USER_ADD: {
    value: '0,22',
    info: '用户新增权限'
  },
  USER_EDIT: {
    value: '0,30',
    info: '用户编辑权限'
  },
  USER_VIEW: {
    value: '1,2', // index = 1, pos = 2
    info: '用户查看权限'
  },
  USER_DELETE: {
    value: '1,17',
    info: '用户删除权限'
  },
  POST_ADD: {
    value: '1,28',
    info: '文章新增权限'
  },
  POST_EDIT: {
    value: '2,4',
    info: '文章编辑权限'
  },
  POST_VIEW: {
    value: '2,19',
    info: '文章查看权限'
  },
  POST_DELETE: {
    value: '2,26',
    info: '文章删除权限'
  }
};

// 添加权限
const addPermission = (userCode, permission) => {
  const userPermission = userCode ? userCode.split(',') : [];
  const [index, pos] = permission.value.split(',');

  userPermission[index] = (userPermission[index] || 0) | Math.pow(2, pos);

  return userPermission.join(',');
};

// 删除权限
const delPermission = (userCode, permission) => {
  const userPermission = userCode ? userCode.split(',') : [];
  const [index, pos] = permission.value.split(',');

  userPermission[index] = (userPermission[index] || 0) & ~Math.pow(2, pos);

  return userPermission.join(',');
};

// 判断是否有权限
const hasPermission = (userCode, permission) => {
  const userPermission = userCode ? userCode.split(',') : [];
  const [index, pos] = permission.value.split(',');
  const permissionValue = Math.pow(2, pos);

  return (userPermission[index] & permissionValue) === permissionValue;
};

// 列出用户拥有的全部权限
const listPermission = userCode => {
  const results = [];

  if (!userCode) {
    return results;
  }

  Object.values(permissions).forEach(permission => {
    if (hasPermission(userCode, permission)) {
      results.push(permission.info);
    }
  });

  return results;
};

const log = () => {
  console.log(`userCode: ${JSON.stringify(userCode, null, ' ')}`);
  console.log(`权限列表: ${listPermission(userCode).join('; ')}`);
  console.log('');
};

userCode = addPermission(userCode, permissions.SYS_SETTING);
log();
// userCode: "1"
// 权限列表: 系统权限

userCode = addPermission(userCode, permissions.POST_EDIT);
log();
// userCode: "1,,16"
// 权限列表: 系统权限; 文章编辑权限

userCode = addPermission(userCode, permissions.USER_EDIT);
log();
// userCode: "1073741825,,16"
// 权限列表: 系统权限; 用户编辑权限; 文章编辑权限

userCode = addPermission(userCode, permissions.USER_DELETE);
log();
// userCode: "1073741825,131072,16"
// 权限列表: 系统权限; 用户编辑权限; 用户删除权限; 文章编辑权限

userCode = delPermission(userCode, permissions.USER_EDIT);
log();
// userCode: "1,131072,16"
// 权限列表: 系统权限; 用户删除权限; 文章编辑权限

userCode = delPermission(userCode, permissions.USER_EDIT);
log();
// userCode: "1,131072,16"
// 权限列表: 系统权限; 用户删除权限; 文章编辑权限

userCode = delPermission(userCode, permissions.USER_DELETE);
userCode = delPermission(userCode, permissions.SYS_SETTING);
userCode = delPermission(userCode, permissions.POST_EDIT);
log();
// userCode: "0,0,0"
// 权限列表:

userCode = addPermission(userCode, permissions.SYS_SETTING);
log();
// userCode: "1,0,0"
// 权限列表: 系统权限
```

### 适用场景和问题

如果按照当前使用最广泛的 [RBAC](https://zh.wikipedia.org/wiki/%E4%BB%A5%E8%A7%92%E8%89%B2%E7%82%BA%E5%9F%BA%E7%A4%8E%E7%9A%84%E5%AD%98%E5%8F%96%E6%8E%A7%E5%88%B6) 模型设计权限系统，那么一般会有这么几个实体：应用，权限，角色，用户。用户权限可以直接来自权限，也可以来自角色：

- 一个应用下有多个权限
- 权限和角色是多对多的关系
- 用户和角色是多对多的关系
- 用户和权限是多对多的关系

在此种模型下，一般会有用户与权限，用户与角色，角色与权限的对应关系表。想象一个商城后台权限管理系统，可能会有上万，甚至十几万店铺（应用），每个店铺可能会有数十个用户，角色，权限。随着业务的不断发展，刚才提到的那三张对应关系表会越来越大，越来越难以维护。
而进制转换的方法则可以省略对应关系表，减少查询，节省空间。当然，省略掉对应关系不是没有坏处的，例如下面几个问题：

- 如何高效的查找我的权限？
- 如何高效的查找拥有某权限的所有用户？
- 如何控制权限的有效期？

所以进制转换的方案比较适应用极其多，而每个应用中用户，权限，角色数量较少的场景。
