(window.webpackJsonp=window.webpackJsonp||[]).push([[43],{577:function(t,a,s){"use strict";s.r(a);var n=s(1),e=Object(n.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"bom"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#bom"}},[t._v("#")]),t._v(" BOM")]),t._v(" "),a("p",[t._v("BOM是浏览器对象模型，将浏览器看做是一个对象，定义了与浏览器进行交互的方法和接口，通过JS操作浏览器。")]),t._v(" "),a("h3",{attrs:{id:"url的组成"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#url的组成"}},[t._v("#")]),t._v(" url的组成")]),t._v(" "),a("p",[t._v("URL（Uniform Resource Locator，统一资源定位符）是互联网上标准资源的地址，互联网上每个文件（即资源）都有一个唯一的URL，它包含了文件的位置以及浏览器处理方式等信息。URL地址由协议头、服务器地址、文件路径三部分组成。")]),t._v(" "),a("h4",{attrs:{id:"协议头-protocol-head"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#协议头-protocol-head"}},[t._v("#")]),t._v(" 协议头 "),a("code",[t._v("Protocol Head")])]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"center"}},[t._v("常见协议")]),t._v(" "),a("th",{staticStyle:{"text-align":"center"}},[t._v("代表类型")]),t._v(" "),a("th",{staticStyle:{"text-align":"center"}},[t._v("示例")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"center"}},[t._v("file")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("访问本地计算机的资源")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("file:///Users/Relsola/Desktop/index.html")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"center"}},[t._v("ftp")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("访问共享主机的文件资源")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("ftp://ftp.baidu.com/movies")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"center"}},[t._v("http")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("超文本传输协议，访问远程网络资源")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("http://image.baidu.com/channel/wallpaper")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"center"}},[t._v("https")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("安全的ssl加密传输协议，访问远程网络资源")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("https://image.baidu.com/channel/wallpaper")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"center"}},[t._v("mailto")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("访问电子邮件地址")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("mailto:null@Relsola.cn")])])])]),t._v(" "),a("p",[t._v("其中最常用的是HTTP协议和HTTPS协议，分别由协议头http和https指定。")]),t._v(" "),a("h4",{attrs:{id:"服务器地址-hostname-或-ip-端口-port"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#服务器地址-hostname-或-ip-端口-port"}},[t._v("#")]),t._v(" 服务器地址 "),a("code",[t._v("Hostname")]),t._v(" 或 "),a("code",[t._v("IP")]),t._v("  端口 "),a("code",[t._v("port")])]),t._v(" "),a("p",[t._v("服务器地址指存放资源的服务器的主机名或者IP地址，其目的在于标识互联网上的唯一一台计算机，通过这个地址来找到这台计算机。")]),t._v(" "),a("p",[t._v("端口是在地址和冒号后面的数字，用于标识在一台计算机上运行的不同程序。每个网络程序，都对应一个或多个特定的端口号，例如HTTP程序的默认端口号为80，HTTPS程序的默认端口号为443。")]),t._v(" "),a("h4",{attrs:{id:"路径-path"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#路径-path"}},[t._v("#")]),t._v(" 路径 "),a("code",[t._v("path")])]),t._v(" "),a("p",[t._v("路径是由0或者多个“/”符号隔开的字符串，一般用于指定本次请求的资源在服务器中的位置。")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 典型的URL地址")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("https")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("www"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("baidu"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("443")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("home"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("admin\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// https:         协议")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// www.baidu.com  主机地址")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 443            端口号")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// home/admin     路径名")]),t._v("\n")])])]),a("h3",{attrs:{id:"window-对象"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#window-对象"}},[t._v("#")]),t._v(" "),a("code",[t._v("window")]),t._v(" 对象")]),t._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),a("p",[a("code",[t._v("window")]),t._v("对象是"),a("code",[t._v("BOM")]),t._v("的顶级对象，称作浏览器窗口对象，全局变量会成为"),a("code",[t._v("window")]),t._v("对象的属性，全局函数会成为"),a("code",[t._v("window")]),t._v("对象的方法。")])]),t._v(" "),a("div",{staticClass:"custom-block warning"},[a("p",{staticClass:"custom-block-title"},[t._v("注意")]),t._v(" "),a("p",[t._v("浏览器中顶级对象是"),a("code",[t._v("window")]),t._v("，"),a("code",[t._v("node")]),t._v("中顶级对象是"),a("code",[t._v("global")]),t._v(",这两个环境中，都可以用"),a("code",[t._v("globalThis")]),t._v("访问其顶级对象。")])]),t._v(" "),a("h4",{attrs:{id:"常见window实例方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#常见window实例方法"}},[t._v("#")]),t._v(" 常见"),a("code",[t._v("window")]),t._v("实例方法")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 弹出框 ")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("alert")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Hello World'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 询问框 confirm")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("confirm")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'确定删除吗？'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 信息输入框")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("prompt")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'获得信息'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 打开新窗口")]),t._v("\nwindow"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("open")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("url"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 关闭当前窗口")]),t._v("\nwindow"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("close")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 整个浏览器的高度")]),t._v("\nwindow"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("outerHeight\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 窗口内容区的高度 不包含边框和菜单栏")]),t._v("\nwindow"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("innerHeight\n")])])]),a("h3",{attrs:{id:"常见的全局对象"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#常见的全局对象"}},[t._v("#")]),t._v(" 常见的全局对象")]),t._v(" "),a("h4",{attrs:{id:"location-对象"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#location-对象"}},[t._v("#")]),t._v(" "),a("code",[t._v("Location")]),t._v(" 对象")]),t._v(" "),a("p",[a("code",[t._v("Location")]),t._v(" 对象提供了url相关的属性和方法。")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回当前加载页面的完整URL")]),t._v("\nlocation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("href"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回页面使用的协议")]),t._v("\nlocation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("protocol\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回URL的查询字符串，查询?开头的的字符串")]),t._v("\nlocation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("search\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 开一个新的URL 一个新窗口  有记录可以返回")]),t._v("\nlocation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("assign")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'https://www.baidu.com'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 替换 打开一个新的url同时替换掉原本网页 不会留下记录  不能返回")]),t._v("\nlocation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("replace")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'https://www.baidu.com'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 重新加载页面 强制刷新 会清除缓存")]),t._v("\nlocation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("reload")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("h4",{attrs:{id:"history-对象"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#history-对象"}},[t._v("#")]),t._v(" "),a("code",[t._v("history")]),t._v(" 对象")]),t._v(" "),a("p",[a("code",[t._v("history")]),t._v(" 对象允许我们访问浏览器曾经的历史会话记录。")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 去到指定页面 传参数去到指定的页面")]),t._v("\nhistory"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("go")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 只能去到下一页 不能传参数")]),t._v("\nhistory"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("forward")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 回到上一页")]),t._v("\nhistory"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("back")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("h4",{attrs:{id:"screen-对象"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#screen-对象"}},[t._v("#")]),t._v(" "),a("code",[t._v("screen")]),t._v(" 对象")]),t._v(" "),a("p",[a("code",[t._v("screen")]),t._v(" 主要记录浏览器窗口外面的客户端显示器的信息。")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回屏幕的宽度。")]),t._v("\nscreen"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("width"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回屏幕的高度（单位：像素）")]),t._v("\nscreen"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("height"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("h4",{attrs:{id:"navigator-对象"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#navigator-对象"}},[t._v("#")]),t._v(" "),a("code",[t._v("navigator")]),t._v(" 对象")]),t._v(" "),a("p",[a("code",[t._v("navigator")]),t._v("提供了浏览器相关的信息，比如浏览器的名称、版本、语言、系统平台等信息。")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//浏览器名称")]),t._v("\nnavigator"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("appName"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//浏览器内核")]),t._v("\nnavigator"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("product\n")])])]),a("h4",{attrs:{id:"sessionstorage-和-localstorage-对象"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#sessionstorage-和-localstorage-对象"}},[t._v("#")]),t._v(" "),a("code",[t._v("sessionStorage")]),t._v(" 和 "),a("code",[t._v("localStorage")]),t._v(" 对象")]),t._v(" "),a("h2",{attrs:{id:"dom"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#dom"}},[t._v("#")]),t._v(" DOM")])])}),[],!1,null,null,null);a.default=e.exports}}]);