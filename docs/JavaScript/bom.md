## BOM
BOM是浏览器对象模型，将浏览器看做是一个对象，定义了与浏览器进行交互的方法和接口，通过JS操作浏览器。

### url的组成
URL（Uniform Resource Locator，统一资源定位符）是互联网上标准资源的地址，互联网上每个文件（即资源）都有一个唯一的URL，它包含了文件的位置以及浏览器处理方式等信息。URL地址由协议头、服务器地址、文件路径三部分组成。

#### 协议头 `Protocol Head`

| 常见协议    |   代表类型                            |                示例                        |
|:----------:|:-------------------------------------:|:------------------------------------------:|
| file       | 访问本地计算机的资源                   | file:///Users/Relsola/Desktop/index.html   |
| ftp        | 访问共享主机的文件资源                 |   ftp://ftp.baidu.com/movies               |
| http       | 超文本传输协议，访问远程网络资源       | http://image.baidu.com/channel/wallpaper    |
| https      | 安全的ssl加密传输协议，访问远程网络资源|   https://image.baidu.com/channel/wallpaper |
| mailto     | 访问电子邮件地址                      |    mailto:null@Relsola.cn                   |

其中最常用的是HTTP协议和HTTPS协议，分别由协议头http和https指定。

#### 服务器地址 `Hostname` 或 `IP`  端口 `port`

服务器地址指存放资源的服务器的主机名或者IP地址，其目的在于标识互联网上的唯一一台计算机，通过这个地址来找到这台计算机。

端口是在地址和冒号后面的数字，用于标识在一台计算机上运行的不同程序。每个网络程序，都对应一个或多个特定的端口号，例如HTTP程序的默认端口号为80，HTTPS程序的默认端口号为443。

#### 路径 `path`
路径是由0或者多个“/”符号隔开的字符串，一般用于指定本次请求的资源在服务器中的位置。

```js
// 典型的URL地址
https://www.baidu.com:443/home/admin
// https:         协议
// www.baidu.com  主机地址
// 443            端口号
// home/admin     路径名
```

### `window` 对象
::: tip
`window`对象是`BOM`的顶级对象，称作浏览器窗口对象，全局变量会成为`window`对象的属性，全局函数会成为`window`对象的方法。
:::
::: warning 注意
浏览器中顶级对象是`window`，`node`中顶级对象是`global`,这两个环境中，都可以用`globalThis`访问其顶级对象。
:::

#### 常见`window`实例方法
```js
// 弹出框 
alert('Hello World');

// 询问框 confirm
confirm('确定删除吗？');

// 信息输入框
prompt('获得信息');

// 打开新窗口
window.open(url);

// 关闭当前窗口
window.close();

// 整个浏览器的高度
window.outerHeight

// 窗口内容区的高度 不包含边框和菜单栏
window.innerHeight
```

###  常见的全局对象

#### `Location` 对象
`Location` 对象提供了url相关的属性和方法。

```js
// 返回当前加载页面的完整URL
location.href;

// 返回页面使用的协议
location.protocol

// 返回URL的查询字符串，查询?开头的的字符串
location.search

// 开一个新的URL 一个新窗口  有记录可以返回
location.assign('https://www.baidu.com');

// 替换 打开一个新的url同时替换掉原本网页 不会留下记录  不能返回
location.replace('https://www.baidu.com');

// 重新加载页面 强制刷新 会清除缓存
location.reload(true);
```

#### `history` 对象
`history` 对象允许我们访问浏览器曾经的历史会话记录。

```js
// 去到指定页面 传参数去到指定的页面
history.go(1);

// 只能去到下一页 不能传参数
history.forward();

// 回到上一页
history.back();
```

#### `screen` 对象
`screen` 主要记录浏览器窗口外面的客户端显示器的信息。

```js
// 返回屏幕的宽度。
screen.width;

// 返回屏幕的高度（单位：像素）
screen.height;
```

#### `navigator` 对象
`navigator`提供了浏览器相关的信息，比如浏览器的名称、版本、语言、系统平台等信息。

```js
//浏览器名称
navigator.appName;

// 

//浏览器内核
navigator.product
```

#### `sessionStorage` 和 `localStorage` 对象


## DOM