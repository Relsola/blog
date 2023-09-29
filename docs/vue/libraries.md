---
sidebar: auto
---

# Vue2 核心插件

## Vue Router

::: warning 注意
基于 `Vue2` 的 `v3.x` 版本 `vue-router`
:::

### 安装与使用

安装：
```sh
npm install vue-router
# OR
vue add router
```
使用：
```sh
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

### 入门 

页面布局：
* `router-link` 导航，通过传递 `to` 来指定跳转地址。
* `router-view` 路由出口，路由匹配到的组件将渲染在这里。

```html
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
    <router-link to="/">Go to Home</router-link>
    <router-link to="/about">Go to About</router-link>
  </p>

  <!-- 路由出口 -->
  <router-view></router-view>
</div>
```

定义路由组件：
```js
// 导入组件
import Home from "@/views/Home";

const routes = [
  { 
    path: '/', 
    // 可以给路由命名 方便跳转
    name: 'home'
    component: Home  
  },
  { 
    path: '/about',
    // 路由懒加载
    component: () => import('@/views/About')
  },
]

// 创建路由实例
const router = VueRouter.createRouter({
  // 默认情况下 我们使用的是hash路由
  mode: "history", // 使用history路由
  routes,
})

// 创建和挂载根实例
const app = new Vue({
  router
}).$mount('#app')
```

访问路由：
* `this.$router` 访问路由器
  
* `this.$route` 访问当前路由
```js
// Home.vue
export default {
  computed: {
    username() {
      return this.$route.params.username
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    }
  }
}
```

### 动态路由匹配

#### 动态路径参数
```js
const routes = [
  // 动态路径参数 以冒号开头
  { path: '/user/:id', component: User }
]
```
`$route` 中可以获取参数信息。

::: warning 注意
当使用路由参数时，例如从 `/user/foo` 导航到 `/user/bar`，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，这也意味着组件的生命周期钩子不会再被调用。
:::

复用组件时，想对路由参数的变化作出响应的话:
1. `watch` (监测变化) `$route` 对象
```js
watch: {
    $route(to, from) {
      // 对路由变化作出响应...
    }
  }
```
2. `beforeRouteUpdate` 导航守卫
```js
beforeRouteUpdate(to, from, next) {
  // react to route changes...
  // don't forget to call next()
}
```

#### 捕获所有路由或 404 Not found 路由
使用通配符 (*)匹配任意路径：
```js
{
  // 会匹配所有路径
  path: '*'
}
{
  // 会匹配以 `/user-` 开头的任意路径
  path: '/user-*'
}
```
当使用一个通配符时，$route.params 内会自动添加一个名为 pathMatch 参数。它包含了 URL 通过通配符被匹配的部分：

```js
// 给出一个路由 { path: '/user-*' }
this.$router.push('/user-admin')
this.$route.params.pathMatch // 'admin'
// 给出一个路由 { path: '*' }
this.$router.push('/non-existing')
this.$route.params.pathMatch // '/non-existing'
```

有时候，同一个路径可以匹配多个路由，此时，匹配的优先级就按照路由的定义顺序：路由定义得越早，优先级就越高。


### 嵌套路由

在 `VueRouter` 的参数中使用 `children` 配置进行路由嵌套

```html
<!-- App.vue -->
<div id="app">
  <router-view></router-view>
</div>

<!-- User.vue -->
<div class="user">
  <h2>User {{ $route.params.id }}</h2>
  <router-view></router-view>
</div>
```

```js
{
  path: '/user/:id',
  component: User,
  children: [
    {
      // 当 /user/:id/profile 匹配成功，
      // UserProfile 会被渲染在 User 的 <router-view> 中
      path: 'profile',
      component: UserProfile
    },
    {
      // 当 /user/:id/posts 匹配成功
      // UserPosts 会被渲染在 User 的 <router-view> 中
      path: 'posts',
      component: UserPosts
    }
  ]
}
```

### 路由跳转和传参

你可以通过 `$router` 访问路由实例，使用 `router.push` 方法导航到不同的 URL，这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。
  
当你点击 `<router-link>` 时，这个方法会在内部调用，等同于调用 `router.push`。
  
该方法的参数可以是一个字符串路径，或者一个描述地址的对象。

```js
// 字符串
$router.push('home')

// 对象
$router.push({ path: "home" })

// 命名的路由
$router.push({ name: "user", params: { userId: "123" }})

// 带查询参数，变成 /register?plan=private
$router.push({ path: "/register", query: { plan: 'private' }});

```
::: warning 注意
如果提供了 path，params 会被忽略，你需要提供路由的 name 或手写完整的带有参数的 path
:::

```js
const userId = '123'

$router.push({ name: 'user', params: { userId }}) // -> /user/123

$router.push({ path: `/user/${userId}` }) // -> /user/123

// 这里的 params 不生效
$router.push({ path: '/user', params: { userId }}) // -> /user

```

#### `router.go(n)`
这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 `window.history.go(n)`。

```js
// 在浏览器记录中前进一步，等同于 history.forward()
$router.go(1)

// 后退一步记录，等同于 history.back()
$router.go(-1)

// 前进 3 步记录
$router.go(3)

// 如果 history 记录不够用，那就默默地失败呗
$router.go(-100)
$router.go(100)
```

#### `router.replace`

使用 `router.replace` 跳转页面会将 跳转页记录替换当前页
```js
$router.replace("/")
```

### 命名视图
```html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

```js
routes: [
  {
    path: '/',
    components: {
      default: Foo,
      a: Bar,
      b: Baz
    }
  }
]
```

### 重定向和别名

#### 重定向

在 `routes` 里配置 `redirect` 重定向。

```js
routes: [
  // 从 /a 重定向到 /b
  { path: '/a', redirect: '/b' },

  // 重定向的目标也可以是一个命名的路由
  { path: '/bar', redirect: { name: 'foo' }},

  // 甚至是一个方法，动态返回重定向目标
  { path: '/good', redirect: to => {
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
  }}
]
```

#### 别名

* “重定向”指用户访问 /a 时，URL 将会被替换成 /b，然后匹配路由为 /b
  
* /a 的别名是 /b，指当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样

```js
routes: [
  { path: '/a', component: A, alias: '/b' }
]
```

### 路由组件传参

在组件中使用 `$route` 会使之与其对应路由形成高度耦合，从而使组件只能在某些特定的 URL 上使用，限制了其灵活性。
  
使用 `props` 将组件和路由解耦：

`$route` 耦合:
```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const router = new VueRouter({
  routes: [{ path: '/user/:id', component: User }]
})
```
`props` 解耦:
```js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    // 布尔模式
    { path: '/user/:id', component: User, props: true },

    // 对象模式
    {
      path: '/promotion/from-newsletter', 
      component: Promotion, 
      props: { newsletterPopup: false }
    },

    // 函数模式
    {
      path: '/search/:q', 
      component: Search, 
      props: route => ({ query: route.query.q })
    },


    // 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项：
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})
```

### 路由守卫
`vue-router` 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。有多种机会植入路由导航过程中：全局的, 单个路由独享的, 或者组件级的。

::: warning 注意
参数或查询的改变并不会触发进入/离开的导航守卫。你可以通过观察 `$route` 对象来应对这些变化，或使用 `beforeRouteUpdate` 的组件内守卫。
:::

#### 全局前置守卫
```js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```
当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 `resolve` 完之前一直处于 **等待中**。

每个守卫方法接收三个参数：

* `to: Route`: 即将要进入的目标 路由对象

* `from: Route`: 当前导航正要离开的路由

* `next: Function`: 一定要调用该方法来 `resolve` 这个钩子。执行效果依赖 `next` 方法的调用参数。
  - `next()`: 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 **confirmed** (确认的)
  
  - `next(false)`: 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址

  - `next('/')` 或者 `next({ path: '/' })`: 当前的导航被中断，然后跳转到新的导航。你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: 'home' 之类的选项以及任何用在 router-link 的 to prop 或 router.push 中的选项
  
  - `next(error)`: 导航会被终止且该错误会被传递给 `router.onError()` 注册过的回调


#### 全局后置钩子

和全局前置守卫差不多，不过这个钩子不会接受 `next` 函数也不会改变导航本身
```js
router.afterEach((to, from) => {
  // ...
})
```

#### 路由独享的守卫
可以在路由配置上直接定义 `beforeEnter` 守卫，参数与全局前置守卫一致。
```js
routes: [
  {
    path: '/foo',
    component: Foo,
    beforeEnter: (to, from, next) => {
      // ...
    }
  }
]
```

#### 组件内的守卫
在路由组件内直接定义以下路由导航守卫：
* beforeRouteEnter
* beforeRouteUpdate
* beforeRouteLeave

```js
beforeRouteEnter(to, from, next) {
  // 在渲染该组件的对应路由被 confirm 前调用
  // 不！能！获取组件实例 `this`
  // 因为当守卫执行前，组件实例还没被创建
},

beforeRouteUpdate(to, from, next) {
  // 在当前路由改变，但是该组件被复用时调用
  // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
  // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
  // 可以访问组件实例 `this`
},
beforeRouteLeave(to, from, next) {
  // 导航离开该组件的对应路由时调用
  // 可以访问组件实例 `this`
}
```

`beforeRouteEnter` 守卫不能访问 `this`，因为守卫组件创建前调用。不过，可以通回调给 `next` 来访问组件实例。
```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
```
::: warning 注意
`beforeRouteEnter` 是支持给 `next` 传递回调的唯一守卫。  
对于 `beforeRouteUpdate` 和 `beforeRouteLeave` 来说，this 已经可用了。
:::
```js
beforeRouteUpdate (to, from, next) {
  // just use `this`
  this.name = to.params.name
  next()
}
```

离开守卫通常用来禁止用户在还未保存修改前突然离开，该导航可以通过 `next(false)` 来取消。
```js
beforeRouteLeave (to, from, next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  answer ? next() : next(false)
}
```

#### 完整的导航解析流程
1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

### 路由元信息
定义路由的时候可以配置 `meta` 字段：
```js
routes: [
  {
    path: '/foo',
    component: Foo,
    children: [
      {
        path: 'bar',
        component: Bar,
        // a meta field
        meta: { requiresAuth: true }
      }
    ]
  }
]
```

访问 `meta` 字段应用：
```js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
```

### 数据获取
这里使用官网的一段demo

```vue
<template>
  <div class="post">
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      post: null,
      error: null
    }
  },
  created () {
    // 组件创建完后获取数据，
    // 此时 data 已经被 observed 了
    this.fetchData()
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // replace getPost with your data fetching util / API wrapper
      getPost(this.$route.params.id, (err, post) => {
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
      })
    }
  }
}
</script>
```

#### 在导航完成前获取数据

```js
export default {
  data () {
    return {
      post: null,
      error: null
    }
  },
  beforeRouteEnter (to, from, next) {
    getPost(to.params.id, (err, post) => {
      next(vm => vm.setData(err, post))
    })
  },
  // 路由改变前，组件就已经渲染完了
  // 逻辑稍稍不同
  beforeRouteUpdate (to, from, next) {
    this.post = null
    getPost(to.params.id, (err, post) => {
      this.setData(err, post)
      next()
    })
  },
  methods: {
    setData (err, post) {
      if (err) {
        this.error = err.toString()
      } else {
        this.post = post
      }
    }
  }
}
```

### 滚动行为

当创建一个 `Router` 实例，你可以提供一个 `scrollBehavior` 方法:
```js
// 创建路由实例
const router = VueRouter.createRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
  }
})
```

`scrollBehavior` 方法接收 `to` 和 `from` 路由对象。第三个参数 `savedPosition` 当且仅当 `popstate` 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。

返回值：
* `{ x: number, y: number }`
* `{ selector: string, offset? : { x: number, y: number }}`

应用：
```js
const router = VueRouter.createRouter({
  routes,
  // 每次切换路由回到页面顶部
  scrollBehavior: () => ({ x: 0, y: 0 }),
})
```

```js
// 滚动到锚点 (还可以利用路由元信息更细颗粒度地控制滚动)
scrollBehavior (to, from, savedPosition) {
  if (to.hash)  return { selector: to.hash }
}
```

### 导航故障

触发导航故障的情况：
* 用户已经位于他们正在尝试导航到的页面
* 一个导航守卫通过调用 `next(false)` 中断了这次导航
* 一个导航守卫抛出了一个错误，或者调用了 `next(new Error())`

这些失败都不会打印出错误，要检查一个错误是否来自于路由器，可以使用 `isNavigationFailure` 函数：

```js
import VueRouter from 'vue-router'
const { isNavigationFailure, NavigationFailureType } = VueRouter

// 正在尝试访问 admin 页面
router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    // 向用户显示一个小通知
    showToast('Login in order to access the admin panel')
  }
})
```
::: tip
如果你忽略第二个参数：`isNavigationFailure(failure)`，那么就只会检查这个错误是不是一个导航故障。
:::

#### 导航故障的属性
所有的导航故障都会有 `to` 和 `from` 属性，分别用来表达这次失败的导航的目标位置和当前位置。
```js
// 正在尝试访问 admin 页面
router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    failure.to.path // '/admin'
    failure.from.path // '/'
  }
})
```
在所有情况下，`to` 和 `from` 都是规范化的路由位置。

## Vuex

`Vuex` 是一个专为 `Vue.js` 应用程序开发的状态管理库。

### 安装

```sh
npm install vuex@next --save
# OR
yarn add vuex@next --save
```

### 入门

创建 store ：
```js
import { createApp } from 'vue'
import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

const app = createApp({ /* 根组件 */ })

// 将 store 实例作为插件安装
app.use(store)
```

使用 store ：
```js
// 通过 store.state 来获取状态对象
console.log(store.state.count) // -> 1

// 通过 store.commit 方法触发状态变更
store.commit('increment')
```

在 `Vue` 组件中， 可以通过 `this.$store` 访问 store 实例。
```js
methods: {
  increment() {
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}
```
::: warning 注意
我们需要通过提交 `mutation` 的方式，而非直接改变 `store.state.count`，是因为这样能更明确地追踪到状态的变化。
::: 

### state

通过 `this.$store` 可以直接访问 `store`
  
在 `Vue` 组件中获得 `Vuex` 状态:
```js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

`mapState` 辅助函数可以帮助我们生成计算属性：
```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
    // mapState 函数返回的是一个对象 
    // 使用对象展开运算符将此对象混入到外部对象中
  computed: ...mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 `mapState` 传一个字符串数组。
```js
computed: ...mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```
 
### Getter

Vuex 允许我们在 store 中定义 `getter`（可以认为是 store 的计算属性）。

```js
const store = createStore({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos (state) {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

Getter 会暴露为 `store.getters` 对象，可以以属性的形式访问这些值：

```js
$store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getter 接受其他 `getter` 作为第二个参数：

```js
getters: {
  // ...
  doneTodosCount (state, getters) {
    return getters.doneTodos.length
  }
}

$store.getters.doneTodosCount // -> 1
```

也可以通过让 `getter` 返回一个函数，来实现给 `getter` 传参：
```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}

$store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

#### `mapGetters` 辅助函数

```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

如果你想将一个 getter 属性另取一个名字，使用对象形式：
```js
...mapGetters({
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```

### Mutation

更改 `Vuex` 的 store 中的状态的唯一方法是提交 `mutation` 。  
每个 `mutation` 都有一个字符串的**事件类型 (type)和一个回调函数 (handler)**。  
这个回调函数就是我们实际进行状态更改的地方，并且它会接受 `state` 作为第一个参数，额外的参数即 `mutation` 的载荷（`payload`）。

```js
const store = createStore({
  state: {
    count: 1
  },
  mutations: {
    // 在大多数情况下，载荷应该是一个对象
    increment (state, payload) {
      state.count += payload.amount
    }
  }
})

$store.commit('increment',{amount: 10})
```

对象风格的提交方式：
```js
$store.commit({
  type: 'increment',
  amount: 10
})

mutations: {
  // 当使用对象风格的提交方式，整个对象都作为载荷传给 mutation 函数
  // 因此处理函数保持不变
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

使用常量替代 Mutation 事件类型：
```js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'


// store.js
import { createStore } from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = createStore({
  state: { ... },
  mutations: {
    // 我们可以使用 ES2015 风格的计算属性命名功能
    // 来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // 修改 state
    }
  }
})
```

::: warning Mutation 必须是同步函数
一条重要的原则就是要记住 mutation 必须是同步函数。
:::

#### 使用 `mapMutations` 辅助函数

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

### Action

Action 类似于 mutation，不同在于：

* Action 提交的是 mutation，而不是直接变更状态。
* Action 可以包含任意异步操作。

```js
const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

`Action` 函数接受一个与 store 实例具有相同方法和属性的 `context` 对象，因此你可以调用 `context.commit` 提交一个 `mutation`，或者通过 `context.state` 和 `context.getters` 来获取 `state` 和 `getters`。
  
实践中，我们会经常用到 ES2015 的参数解构来简化代码
```js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

`Action` 通过 `store.dispatch` 方法触发：
```js
$store.dispatch('increment',{ amount: 10 });

actions: {
  incrementAsync ({ commit }, payload) {
    setTimeout(() => {
      commit('increment', payload)
    }, 1000)
  }
}

// 以对象形式分发
$store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

#### 使用 `mapActions` 辅助函数

```js
methods: {
  ...mapActions([
  'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

   // `mapActions` 也支持载荷：
   'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
 ]),
 ...mapActions({
   add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
 })
}
```
#### 组合 Action
`$store.dispatch` 触发的 `action` 返回 `Promise`：
```js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}

store.dispatch('actionA').then(() => {
  // ...
})
```

`actions` 中也可以派发 `action`
```js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

使用 `async / await`：
```js
// 假设 getData() 和 getOtherData() 返回的是 Promise

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

### Module 模块化

将 store 分割成模块：
```js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = createStore({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

$store.state.a // -> moduleA 的状态
$store.state.b // -> moduleB 的状态
```

对于模块内部的 `mutation` 和 `getter`，接收的第一个参数是模块的局部状态对象：
```js
const moduleA = {
  state: () => ({
    count: 0
  }),
  mutations: {
    increment (state) {
      // 这里的 `state` 对象是模块的局部状态
      state.count++
    }
  },
  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

模块内部的 `action`，局部状态通过 `context.state` 暴露出来，根节点状态则为 `context.rootState`：
```js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

对于模块内部的 getter，根节点状态会作为第三个参数暴露出来：
```js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

#### 命名空间

添加 `namespaced: true` 使其成为带命名空间的模块。当模块被注册后，它的所有 `getter`、`action` 及 `mutation` 都会自动根据模块注册的路径调整命名
```js
const store = createStore({
  modules: {
    account: {
      namespaced: true,

      // 模块内容（module assets）
      state: () => ({ ... }), // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,

          state: () => ({ ... }),
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

::: tip 在带命名空间的模块内访问全局内容
使用全局 `state` 和 `getter`，`rootState` 和 `rootGetters` 会作为第三和第四参数传入 `getter`，也会通过 `context` 对象的属性传入 `action`。
  
若需要在全局命名空间内分发 `action` 或提交 `mutation`，将 `{ root: true }` 作为第三参数传给 `dispatch` 或 `commit` 即可。 
:::
```js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // 在这个模块的 getter 中，`getters` 被局部化了
      // 你可以使用 getter 的第四个参数来调用 `rootGetters`
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
        rootGetters['bar/someOtherGetter'] // -> 'bar/someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // 在这个模块中， dispatch 和 commit 也被局部化了
      // 他们可以接受 `root` 属性以访问根 dispatch 或 commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'
        rootGetters['bar/someGetter'] // -> 'bar/someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

若需要在带命名空间的模块注册全局 `action`，你可添加 `root: true`，并将这个 `action` 的定义放在函数 `handler` 中。例如：
```js
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

#### 带命名空间的绑定函数

当使用 mapState、mapGetters、mapActions 和 mapMutations 这些函数来绑定带命名空间的模块时，写起来可能比较繁琐：
```js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  }),
  ...mapGetters([
    'some/nested/module/someGetter', // -> this['some/nested/module/someGetter']
    'some/nested/module/someOtherGetter', // -> this['some/nested/module/someOtherGetter']
  ])
},
methods: {
  ...mapActions([
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar' // -> this['some/nested/module/bar']()
  ])
}
```
对于这种情况，你可以将模块的空间名称字符串作为第一个参数传递给上述函数，这样所有绑定都会自动将该模块作为上下文。于是上面的例子可以简化为：
```js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  }),
  ...mapGetters('some/nested/module', [
    'someGetter', // -> this.someGetter
    'someOtherGetter', // -> this.someOtherGetter
  ])
},
methods: {
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}
```
而且，你可以通过使用 createNamespacedHelpers 创建基于某个命名空间辅助函数。它返回一个对象，对象里有新的绑定在给定命名空间值上的组件绑定辅助函数：
```js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // 在 `some/nested/module` 中查找
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // 在 `some/nested/module` 中查找
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

#### 模块动态注册
在 store 创建之后，你可以使用 store.registerModule 方法注册模块：
```js
import { createStore } from 'vuex'

const store = createStore({ /* 选项 */ })

// 注册模块 `myModule`
store.registerModule('myModule', {
  // ...
})

// 注册嵌套模块 `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

#### 模块重用

为了避免状态对象被污染，使用函数来声明（和 data 的问题一样）：
```js
const MyReusableModule = {
  state: () => ({
    foo: 'bar'
  }),
  // mutation、action 和 getter 等等...
}
```

### 组合式API
为了访问 state 和 getter，需要创建 computed 引用以保留响应性:

```js
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // 在 computed 函数中访问 state
      count: computed(() => store.state.count),

      // 在 computed 函数中访问 getter
      double: computed(() => store.getters.double),

      // 使用 mutation
      increment: () => store.commit('increment'),

      // 使用 action
      asyncIncrement: () => store.dispatch('asyncIncrement')
    }
  }
}
```


### 插件

Vuex 的 store 接受 plugins 选项，这个选项暴露出每次 mutation 的钩子。Vuex 插件就是一个函数，它接收 store 作为唯一参数：
```js
const myPlugin = (store) => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
  })
}

const store = createStore({
  // ...
  plugins: [myPlugin]
})
```