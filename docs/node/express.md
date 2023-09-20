## 1.5 使用Express搭建Web server

### 1.5.1 Express 框架概览

- 高度包容，快速而简单的Node.js Web框架
- 拥有稳定可靠丰富的社区和中间件生态
- 易于学习，可定制程度高，开箱即用
- 精巧的Express为Web和移动应用程序提供了一组强大的功能

### 1.5.2 Express的能力

- 封装http模块，方便地创建Web应用
- 通过中间件机制实现可扩展性
- 提供路由机制，便于组织业务应用
- 提供多种模版引擎，支持了静态文件的渲染和托管
- 便于添加错误处理，方便对系统进行容错处理
- 便于添加数据库连接，操作数据库数据

#### Express中间件

- 路由和中间件是Express的基础，路由是特殊的中间件

- Express是一系列中间件函数调用的过程

- 中间件是对处理过程的封装，输入请求对象/响应对象，通过next进入下一个中间件处理过程

- 使用app.use()将中间件注册到应用实例上，路由中间件注册到路由实例上

![](~@/node/routerMiddle.png)

#### 编写Express中间件

![](~@/node/writeMiddle.png)

#### Express 路由机制

- 路由是一段Express代码，它将http动词、URL路径/模式和处理函数三者关联起来

- Express的应用程序设计要从路由设计入手，将服务的能力描述起来

- 还可以使用Router中间件，实现路由逻辑模块化设计

![](~@/node/routingMe.png)

#### Express 性能评估

![](~@/node/preform.png)

#### Express 最佳实践

- 使用中间件压缩响应数据，在反向代理层做最佳

- 避免在业务逻辑处理中使用同步阻塞操作

- 引入完善的基建保障，记录日志，处理异常

- 需要重启的时候立即重启，保证程序可以自动重启启动

### 1.5.3 Express Web Server实战

- 实现一个可以生成邮件的模版管理系统
- 有配置界面，可以沉淀业务域中的邮件模版，可以新增模版
- 可以预览最终的邮件样式

![](~@/node/requirement.png)

#### 邮件模版系统-功能设计

![](~@/node/fundesign.png)

### 1.5.4扩展学习

[MDN 中提供的 Express 课程](https://developer.mozilla.org/zh-CN/docs/learn/Server-side/Express_Nodejs/Introduction)

[使用 Node.js + Express 搭建一个简单的微博网站](https://cythilya.github.io/2014/11/23/nodejs-express-microblog/)

[NodeJS express框架核心原理全揭秘](https://zhuanlan.zhihu.com/p/56947560)

## 1.6 使用Nodejs编写 RESTful API

### 1.6.1 RESTful API

rest是暴露服务端资源的一种约定方式，同时提供获取这种资源的动词，基于rest架构的web server api，我们就称为RESTful API。

#### REST概念

- URI资源定位

REST是面向资源，而资源通过URI进行暴露

- 链接资源状态

服务器生成包含状态转移的表征数据，用来响应客户端对一个资源的请求，客户端可据此了解状态转移的方式

- 使用HTTP已有特性

REST很用利用了HTTP本身的一些特性，如HTTTP动词、HTTP状态码、HTTP头部信息

- 统一资源规范

包含一组受限的预定义的操作，资源都通过使用项目接口进行资源的访问

#### 充分利用HTTP描述URI资源

![](~@/node/httpres.png)

### 1.6.2 REST 工程实践

### REST 接口设计-路由

```js
   //接口要遵循http动词
  GET /xhr/v1/templateList // 获取模版列表
  GET /xhr/v1/templateDetail?id=xx   // 模版单个模版详情
  POST /xhr/v1/templateCreate // 创建模版
  PUT  /xhr/v1/templateChange/1 // 修改模版,
  DELETE /xhr/v1/templateDelate/1 // 删除模版
```

### 数据表设计-封装数据服务

- 选用MongoDB存储数据
- 引用mongoose构建数据模型

- 邮件模版Schema
  - id String 唯一识别邮件模版的id
  - template text 可支持HTML
  - data  邮件模版中填充的数据

  ### 1.6.3 REST 最佳实践

 - 充分理解并使用HTTP请求
 - 使用API测试工具而非浏览器测试你的API接口
 - 选择合适的文档生成工具，删除API文档
 - REST只是规范并不强制，最合适团队的才是最好的
 - 找个实践REST较好的框架胜过自己造轮子

:tomato: 开始实战

1. 项目结构

 ```bash
  ├── server    
  │   ├──  middleware # 自己写的中间件；可以用于处理一些业务逻辑
  │   ├──  model      # 数据模型，接口的数据模型
  │   ├──  routes     # 接口的业务代码
  │   ├── index.js    # 入口文件
  └─ package.json     # 管理项目运行的依赖、及描述信息                                  
 ```
 2. 下载所需要的依赖

`yarn add express mongoose nodemon body-parser`

mongoose ：简化操作mongodb的库

body-parser：处理post请求时返回thunk，它会自动帮我们加入res.body中

```json  
用nodemon启动项目，当我们保存时，nodemon会帮助我们启动项目
"scripts": {
    "dev": "nodemon server/index.js",
  }
```

3. 编写入口文件index.js

编写入口文件，需要连接数据库，这里我们使用mogodb，mongodb的安装教程在本文的最下面，当然会mysql，也可以用mysql。

```js
const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const templateRouter=require('./routes/template')
const app=express()
// 连接mongodb，temp是我们数据库的名称
mongoose.connect('mongodb://127.0.0.1:27017/temp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
var db=mongoose.connection
db.on('error',function(){
    console.log('监听错误');
})
// 监听mogodb是否连接成功
db.once('open',function(){
    console.log('数据库连接成功');
})
// 我们编写的中间件，提供$sucess和#error来处理返回的数据
require('./middleware/index')(app)
// 用bodyParser处理post请求，处理返回chunk
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:false
}))
// 我们的路由前缀/xhr/v1/，如果匹配在url中匹配到了/xhr/v1/，就会进入子路由templateRouter
app.use('/xhr/v1/',templateRouter)
// 前面都没有匹配到调用next()就会进入下一个中间件
app.use((req,res,next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})
app.listen(2000,()=>{
    console.log('server is running on http://localhost:2000')
})
```
4. 在model中编写数据模型

```js
// 数据模型
const mongoose=require('mongoose')
const templateSchema=mongoose.Schema({
    name:String,
    template:String,
    data:String
})
//第一个参数 当前模型名称，第二个参数 schema
module.exports=mongoose.model('template',templateSchema)

```
5. 编写处理返回数据的中间件

```js
// 处理错误的中间件
module.exports=(req,res,next)=>{
    res.$success=(data,code=200)=>{
        const _data = {
            code
        }
        if(typeof data==='object'){
            _data.msg='sucess'
            _data.data=data
        }else {
            _data.msg=data
        }
        res.json(_data)
    }
    res.$error=(err,code=500)=>{
        const _data = {
            code
        }
        if(typeof data==='objcet'){
            _data.msg='error'
            _data.data=JSON.stringify(err)
        }else {
            _data.msg=err
        }
        res.json(_data)
    }
    next()
}
```
6. 在routes编写业务接口

```js
  // 路由模块，业务模块
const express=require('express')
const router=express.Router()
const Template=require('../model/template')

// 查询模版列表
router.get('/templateList',async (req,res,next)=>{
    const temps=await Template.find({}).sort({update_at:-1})
    res.$success(temps)
})
// 创建模版
router.post('/templateCreate',async (req,res,next)=>{
    const temps =await Template.create(req.body)
    res.$success(temps)
})
// 查询模版详情
router.get('/templateDetail',async (req,res,next)=>{
    const { id }=req.query
    const temps = await Template.findById({_id:id})
   res.$success(temps)
})
// 更新模版
router.put('/templateChange/:id',async (req,res,next)=>{
    const { id }=req.params
    const temps = await Template.findByIdAndUpdate({_id:id},req.body,{
        new:true
    })
   res.$success(temps)
})
// 删除模版
router.delete('/templateDelate/:id',async (req,res,next)=>{
    const { id }=req.params
    const temps = await Template.findByIdAndRemove({_id:id})
   res.$success(temps)
})
module.exports=router
```

7. 其它

测试接口可以用postman

```json
请求创建模版接口示例：http://localhost:2000/xhr/v1/templateCreate
在headers要加入Content-Type:application/json
请求的参数：
{
	"name":"test1",
	"template":"<h1>express<h1>",
	"data":"{name:'test1'}"
	
}
返回的数据，其中_id是mongodb为我们创建的
{
    "code": 200,
    "msg": "sucess",
    "data": [
        {
            "_id": "5f2c19c81a53ff25e7d94953",
            "name": "test1",
            "template": "<h1>express<h1>",
            "data": "{name:'test1'}",
            "__v": 0
        }
    ]
}
```
```js
// 源码地址
 https://github.com/hejialianghe/Senior-FrontEnd/tree/master/examples/node/1.6

```

:tomato: 安装mongodb

 <font color="red">**window下安装mongodb**</font>

<font color="blue"> 1. 下载安装</font>

 传送门：https://www.mongodb.com/download-center/community

<font color="blue"> 2. 配置数据库数据存放目录和日志存放目录</font>

例如在D盘下创建数据目录 

mkdir D:\data\db

创建日志目录  

mkdir D:\data\log

数据和日志放哪都可以，不一定是D盘

<font color="blue"> 3. 配置mongod.cfg</font>

进入C盘C:\mongodb目录下创建mongod.cfg文件，并把以下内容复制进去

```bash
storage:
  dbPath:  D:\data\db
  journal:
    enabled: true
systemLog:
  destination: file
  logAppend: true
  path:  D:\data\log\mongod.log
net:
  port: 27017
  bindIp: 127.0.0.1
# 权限验证,是否用密码连接数据库，开始不要设置密码，如果设置权限验证，就把#去掉
#security:
    #authorization: enabled
```

<font color="blue"> 4. 安装mongodb服务</font>

在C:\mongodb\bin目录下打开shell，并执行以下命令

mongod.exe --config "C:\mongodb\mongod.cfg" --install

启动mongodb服务

net start MongoDB

如果执行成功，会输出以下信息

2015-09-25T15:54:09.212+0800 I CONTROL  Hotfix KB2731284 or later update is notinstalled, will zero-out data files2015-09-25T15:54:09.229+0800 I JOURNAL  [initandlisten] journal dir=c:\data\db\j
ournal2015-09-25T15:54:09.237+0800 I JOURNAL  [initandlisten] recover : no journal fil
es present, no recovery needed2015-09-25T15:54:09.290+0800 I JOURNAL  [durability] Durability thread started2015-09-25T15:54:09.294+0800 I CONTROL  [initandlisten] MongoDB starting : pid=2488 port=27017 dbpath=c:\data\db 64-bit host=WIN-1VONBJOCE882015-09-25T15:54:09.296+0800 I CONTROL  [initandlisten] targetMinOS: Windows 7/W
indows Server 2008 R22015-09-25T15:54:09.298+0800 I CONTROL  [initandlisten] db version v3.0.6

<font color="blue"> 5. 其它指令</font>

net stop MongoDB //关闭MongoDB服务

mongod.exe --remove  //移除 MongoDB 服务，要在C:\mongodb\bin目录下打开shel执行该命令或点击mongo.exe 

mongo.exe //进入mongodb管理后台，要在C:\mongodb\bin目录下打开shell执行该命令或点击mongo.exe 

<font color="blue"> 6. window版数据库管理工具navicatmongodb</font>

链接: https://pan.baidu.com/s/14NYuD-rkG7p4YsX3UZgBOA 提取码: xeah

<font color="red">**mac下安装mongodb（linux上同理）**</font>

<font color="blue"> 1. mac下安装mongodb</font>

手动安装

传送门：https://www.mongodb.com/download-center/community

1.打开finder按shift+command+g 输入/usr/local 进入这个目录下

2.在/usr/local下创建mongodb文件夹

3.把下载好的包拖入/usr/local/mongodb目录下

4打开命令行输入cd /usr/local/mongodb

5.解压

sudo tar zxvf mongodb-linux-x86_64-rhel70-4.2.0.tgz //解压，手动点击也可以

6.修改文件名

sudo mv mongodb-linux-x86_64-rhel70-4.2.0 mongodbserver  //修改文件名，手动修改也可以

<font color="blue"> 2. 创建data和log</font>

sudo mkdir data  //创建data文件

sudo mkdir log  //创建log文件

<font color="blue"> 3. 在/usr/local/mongodb/目录下创建配置文件mongod.conf</font>

1.vim  /usr/local/mongodb/mongod.conf //编辑文件，命令行中执行

2.输入i 进入输入模式

3.把以下内容复制到mongod.conf文件里

```bash
  dbpath=/usr/local/mongodb/data/  #数据存放路径 
  logpath=/usr/local/mongodb/log/mongodb.log #日志存放路径
  fork=true #后台运行 bind_ip=0.0.0.0 #允许任何IP进行连接 
  auth=false #true是要进行密码验证连接数据库，false不需要
```
4.按esc 进入编辑

5.按 ：进入末尾

6.按 wq 进行保存并退出

<font color="blue"> 4. 配置全局环境变量</font>

1.vim /etc/profile //进入编辑profile模式，命令行中执行

2.把以下内容复制到profile中

export PATH=$PATH:/usr/local/mongodb/mongodbserver/bin

3.按esc 进入编辑,.按 ：进入末尾,按 wq 进行保存并退出

4.source /etc/profile //重新加载,命令行中执行

<font color="blue"> 5. 启动mongodb</font>

mongod --config /usr/local/mongodb/mongod.conf //命令行中运行

显示：child process started sucessfully，parent exiting 说明运行成功

查看mongodb是否启动成功

ps -ef | grep mongodb 

ps -axu |grep mongo  获取进程号

<font color="blue"> 6. 创建数据库</font>

```bash
mongo # 连接数据库
use temp #temp就是我们创建的数据库，用show dbs 查看数据库是不显示的，因为里面没有数据
```

<font color="blue"> 7. 其他指令</font>

mongorestore -h 127.0.0.1:27017 -d testdata --drop /home/data/  // 导入数据，testdata是数据库的名称，/home/data/是老数据存放地址

mongod --shutdown --dbpath  /usr/local/mongodb/data/ //关掉服务

数据库用户及权限管理

提示：如果想进行账号密码连接数据库，请看1，2，3，4，,5设置密码后请修改

mongodb.conf 里的配置项auth=true

``` js
1.mongo //命令行输入

2.use admin //进入admin

3.db.createUser({user:"xxx",pwd:"xxx",roles:[{role:"userAdminAnyDatabase",db:"admin"}]}); //创建超级管理员

4.use testdata //进入testdata数据库

5.db.createUser({user:"xxx",pwd:"xxx",roles:[{role:"readWrite",db:"testdata"}]});//建立testdata数据库管理员

db.auth("xxx","xxx") //创建完成后可以进行管理员验证，看是否设置成功

db.changeUserPassword("xxx","xxxx"); //修改用户密码
```

show users //查看已有用户

show dbs  //查询数据库列表

<font color="blue"> 8. mac下数据库管理工具Robo</font>

传送门：https://robomongo.org/download
