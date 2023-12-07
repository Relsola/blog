<script setup>
import { ref } from 'vue';
import RegExpTester from '../RegExp/RegExpTester.vue';
import SearchRegExp from '../RegExp/SearchRegExp.vue';
const regV = ref('');
const exampleV = ref('');
const testExample = ({reg, example}) => { regV.value = reg; exampleV.value = example };
</script>

# 正则表达式

::: tip 注意
这里只是一个备忘单，提供常用正则查询，不是正则表达式所有功能和细微差别的完整指南。  
学习正则表达式参考文章：  
[MDN 正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_expressions)  
[JS 正则表达式完整教程](https://juejin.cn/post/6844903487155732494)
:::

## 创建一个正则表达式

```JavaScript
const reg = /ab+c/gim;

const re = new RegExp('ab+c','gim');
```

推荐直接用字面量创建，一些情况下可以使用模板字符串调用 `RegExp` 对象创建。

## 正则表达式中的特殊字符

### 模式修饰符

| 标志 | 描述                              |
| :--: | --------------------------------- |
| `g`  | 全局匹配。                        |
| `i`  | 不区分大小写匹配。                |
| `m`  | 多行匹配。                        |
| `s`  | 允许 `.` 匹配换行符。             |
| `u`  | 使用 `unicode` 码的模式进行匹配。 |
| `y`  | 粘性匹配。                        |

### 常用修饰符

| 字符 | 描述                             |     等价于      |
| :--: | -------------------------------- | :-------------: |
| `.`  | 匹配除换行符之外的任何单个字符。 |    `[^\n\r]`    |
| `\d` | 匹配一个数字。                   |     `[0-9]`     |
| `\D` | 匹配一个非数字字符。             |    `[^0-9]`     |
| `\w` | 匹配一个单字字符。               | `[0-9a-zA-Z_]`  |
| `\W` | 匹配一个非单字字符。             | `[^0-9a-zA-Z_]` |
| `\s` | 匹配一个空白字符。               | `[\f\n\r\t\v]`  |
| `\S` | 匹配一个非空白字符。             | `[^\f\n\r\t\v]` |

### 数量词

|  字符   | 描述                                                            | 等价于  |
| :-----: | --------------------------------------------------------------- | :-----: |
|   `*`   | 匹配前一个表达式 0 次或多次。                                   | `{0,}`  |
|   `+`   | 匹配前面一个表达式 1 次或者多次。                               | `{1,}`  |
|   `?`   | 匹配前面一个表达式 0 次或者 1 次。                              | `{0,1}` |
|  `{n}`  | `n` 是一个正整数，匹配前面一个字符刚好出现了 `n` 次。           |         |
| `{n,}`  | `n` 是一个正整数，匹配前一个字符至少出现了 `n` 次。             |         |
| `{n,m}` | `n` 和 `m` 都是正整数，匹配前面的字符至少 `n` 次，最多 `m` 次。 |         |

### 表达式

|  表达式   | 描述                                      |
| :-------: | ----------------------------------------- |
|   `(x)`   | 匹配 `x` 并捕获。                         |
|  `x\|y`   | 匹配 `x` 或 `y`。                         |
|  `(?:x)`  | 匹配 `x` 不捕获。                         |
| `x(?=y)`  | 先行断言，仅匹配 `x` 后面跟着`y`。        |
| `(?<=y)x` | 后行断言，仅匹配 `x` 前面是 `y`。         |
| `x(?!y)`  | 正向否定查找，仅匹配 `x` 后面不跟着 `y`。 |
| `(?<!y)x` | 反向否定查找，仅匹配 `x` 前面不是 `y`。   |

### 特殊字符

|   字符   | 描述                                                         |
| :------: | ------------------------------------------------------------ |
|   `\`    | 转义符。                                                     |
|   `^`    | 匹配开始，如果开启了多行匹配，那么也匹配换行符后紧跟的位置。 |
|   `$`    | 匹配结束，如果开启了多行匹配，那么也匹配换行符前的位置。     |
|   `\b`   | 匹配一个词的边界。                                           |
|   `\B`   | 匹配一个非单词边界。                                         |
|   `\0`   | 匹配 NULL `(U+0000)` 字符                                    |
|   `\t`   | 匹配一个水平制表符。                                         |
|   `\v`   | 匹配一个垂直制表符。                                         |
|   `\n`   | 匹配一个换行符。                                             |
|   `\r`   | 匹配一个回车符。                                             |
|   `\f`   | 匹配一个换页符。                                             |
| `[xyz]`  | 字符集合，匹配方括号中的任意字符。                           |
| `[^xyz]` | 反向字符集，匹配任何没有包含在方括号中的字符。               |
| `[a-z]`  | 使用破折号 `-` 来指定一个字符范围进行匹配。                  |

## 使用正则表达式

### `exec`

- 在一个指定字符串中执行一个搜索匹配，返回一个数组，未匹配到则返回 `null`。
- 设置全局匹配时，会移动 [lastIndex](#lastindex) 属性。

```JavaScript
const reg = /hello/gim;
const result = reg.exec('Hello world javascript hello');

console.log(reg.lastIndex); // 5

console.log(result);
// => ['Hello', index: 0, input: 'Hello world javascript hello', groups: undefined]
```

### `match`

- 检索字符串与正则表达式进行匹配的结果，如果没有匹配，则返回 `null`。
- 如果使用 `g` 标志，则将返回与完整正则表达式匹配的所有结果，但不会返回捕获组。
- 如果没有使用 `g` 标志，则只返回第一个完整匹配及其相关捕获组。

::: code-group

```js [不使用标识符 <code>g</code>]
const str = 'see Chapter 3.4.5.1';
const regexp = /see (chapter \d+(\.\d)*)/i;
const result = str.match(regexp);

console.log(result);
// => ['see Chapter 3.4.5.1', 'Chapter 3.4.5.1', '.1', index: 0, input: 'see Chapter 3.4.5.1', groups: undefined]
```

```ts [使用标识符 <code>g</code>]
const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const regexp = /[A-E]/gi;
const result = str.match(regexp);

console.log(result);
// => ['A', 'B', 'C', 'D', 'E', 'a', 'b', 'c', 'd', 'e']
```

:::

### `replace`

- 字符串模式只会被替换一次，要执行全局搜索和替换，需要使用带有 `g` 标志的正则表达式。
- 第二个参数还可以指定插值或使用函数作为替换项。

::: code-group

```js [指定插值作为替换项]
const regexp = /(\w+)\s(\w+)/;
const str = 'Maria Cruz';
const newStr = str.replace(regexp, '$2, $1');

console.log(newStr); // Cruz, Maria
```

```ts [使用函数作为替换项]
const str = 'borderTop';
function upperToHyphenLower(match, offset, string) {
  return (offset > 0 ? '-' : '') + match.toLowerCase();
}
const newStr = str.replace(/[A-Z]/g, upperToHyphenLower);

console.log(newStr); // border-top
```

:::

### 其他方法

|    方法    | 描述                                                           |  对象  |
| :--------: | -------------------------------------------------------------- | :----: |
|   `test`   | 查看正则表达式与指定的字符串是否匹配，返回 `true` 或 `false`。 |  实例  |
| `toSting`  | 返回一个表示该正则表达式的字符串。                             |  实例  |
|  `split`   | 将字符串分割成数组。                                           | 字符串 |
| `matchAll` | 返回一个迭代器，包含匹配的所有结果，包括捕获组。               | 字符串 |
|  `search`  | 查找匹配正则的字符串第一次出现时的位置，无则返回 `null1`。     | 字符串 |

### `lastIndex`

- `lastIndex` 是正则表达式的一个读写属性，用来指定下一次匹配的起始索引，初始为 0。
- 只有正则表达式使用了全局检索的 `g` 或者粘性检索 `y` 时，该属性才会起作用。
- 如果 `test` 和 `exec` 匹配成功，`lastIndex` 会被设置为最近一次成功匹配的下一个位置。
- 如果 `test` 和 `exec` 匹配失败，`lastIndex` 会被设置为 0。
- 如果 `lastIndex` 大于字符串的长度，则 `test` 和 `exec` 将会匹配失败。

其他只读属性： `source`，`ignoreCase`，`global`，`multiline`。

## 正则测试器

<RegExpTester :regV="regV" :exampleV="exampleV" />

## 常用正则表达式

<SearchRegExp @test-example="testExample" />
