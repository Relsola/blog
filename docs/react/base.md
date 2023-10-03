---
sidebar: auto
---

# React基础

## 创建项目

### 官方脚手架
```sh
# create-react-app创建:

npx create-react-app test-demo --template typescript
```

### Vite创建
```sh
# 推荐

pnpm create vite@latest react-demo-vite --template react-ts
```

## JSX语法

### JSX是什么
::: tip JSX是什么
1. 一种标签语法、JS 进行的语法扩展
2. 不是字符串、不是 HTML 标签
3. 描述 UI 呈现与交互的直观的表现形式
4. 生成 React 元素
:::

```jsx
class MyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { openStatus: false };
  }
  statusChange() {
    this.setState({
      openStatus: !this.state.openStatus
    })
  }
  render() {
    // JSX 遵循JS的命名规范，一般使用camelCase小驼峰
    // class => className  tabindex => tabindex
    return (
      <div className='container'>
        <p className='text'>
          {
            // 插值表达式
            this.state.openStatus ? '打开状态' : '关闭状态'
          }
        </p>
        <button onClick={ this.statusChange.bind(this) }>
          { this.state.openStatus ? '关闭' : '打开' }
        </button>
      </div>
    )
  }
}

ReactDOM.render(React.createElement(MyButton), document.getElementById("app"));
```

#### 标签
* 首字母大写表示组件，小写是 `html` 原生标签
* 每段 `JSX` 片段只能有一个根节点，即单根节点（vue3可以是多根节点）
* `JSX` 中空标签 `（<></>）` 表示 `Fragment`，可以作为根节点

#### 属性
`jsx` 的属性就是 `html` 的属性，只有些微区别：
* `class` 要写为 `className`，为了防止和`类(class)`关键字冲突
* `style` 要使用 `Object`形式，且必须是驼峰写法
* `label` 的 `for` 要写为 `htmlFor`，避免与`for循环`冲突

#### 事件
* 写法使用 `onXxx` 形式
* 必须传入一个函数，**是 `fn` 不能是执行结果 `fn()`**

### 插值表达式

* 我们可以使用 `{ XXX }` 插入JS变量，函数，表达式
* 可以插入普通文本，属性
* 可以用于注释

#### JSX中的条件渲染

* 使用 `&&`，适用隐藏显示单个元素
* 三目运算符`（? :）`，适用两个元素的来回切换
* `if` 语句来选择性地返回 `JSX` 表达式

```jsx
const show = true

const WhoShow = () => {
	if (show) {
		return <p>true</p>;
	} else {
		return <p>false</p>;
	}
};

<div>{show && <p>hello</p>}</div>
<div>{show ? <p>nothing</p> : <p>hello</p>}</div>
<WhoShow></WhoShow>
```

#### JSX中的循环渲染

使用数组 `map`
::: warning 注意
* 每个**item**元素都需要一个**key**
* **key**同级别唯一
* 不要使用**index**作为**key**
:::

```jsx
const list = [
	{ username: "zhangsan", name: "张三" },
	{ username: "lisi", name: "李四" },
	{ username: "wangwu", name: "王五" }
];

<ul>
	{list.map(user => {
		const { username, name } = user;
		return <li key={username}>{name}</li>;
	})}
</ul>
```

## 组件

### 定义组件

#### 定义class组件
```tsx
import React, { Component, ReactNode } from 'react';

class ClassComponentDemo extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<>
				<h1>ClassComponent</h1>
			</>
		)
	}
}

export default ClassComponentDemo
```

#### 定义一个函数组件
```tsx
import React from 'react'

function FunctionComponentDemo(props) {
	return <div>FunctionComponentDemo</div>
}

export default FunctionComponentDemo
```
::: tip 推荐使用函数组件
`React16` 以后，官方推荐使用 **函数组件 + hooks**  
:::

### state

`state` 是组件内部的状态信息（组件的独家记忆），不对外，只有 `state` 变化，才能触发组件更新，重新执行 `render` 方法，渲染页面。
::: warning 注意
永远都不要去修改 `state` 的值，如果需要改变，而是应该使用 `set` 方法完整替换改变 `state`
:::

#### class组件的state

使用 `this.setState()` 更新 `state`,**禁止直接更改 `state`**。
  
`class` 组件中的 `this` 绑定：
1. 在 `construct` 内 `bind(this)`
```jsx
import React, { Component, ReactNode } from 'react';

class ClassComponentDemo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			count: 0,
		}
		// bind(this)
		this.addCount = this.addCount.bind(this)
	}

	render() {
		// 插值表达式
		return (
			<>
				<div>{this.state.count}</div>
				<div>
                    {/* 事件绑定 */}
					<button onClick={this.addCount}>add</button>
				</div>
			</>
		)
	}

	addCount() {
        // 如果没有 bind（this） 指向undefined 后续会报错找不到state
		console.log(this)
		this.setState({count: this.state.count + 1})
	}
}
export default ClassComponentDemo;
```

2. 在绑定事件时 `bind(this)`
::: tip 不推荐
因为每次更新都会重新执行 `render` 方法，每次更新都会执行 `bind(this)`，`construct` 只有初始化时执行一次 `bind(this)`，所以性能更好。
:::
```jsx
render(): {
    return (
            <>
                <div>{this.state.count}</div>
                <div>
                    <button onClick={this.addCount.bind(this)}>add</button>
                </div>
            </>
    )
}
```

3. 定义方法的时候使用箭头函数, 箭头函数内的 `this` 为函数的上级作用域的 `this`
::: tip 推荐
使用箭头函数，简洁。
:::
```jsx
addCount = () => {
    // 组件本身
    console.log(this)
    this.setState({count: this.count + 1})
}
```

#### 函数组件的state

1. 函数组件的 `state` 需要借助钩子 `useState` 的帮助
2. 使用 `useState` 返回的 `set` 方法修改 `state` ，禁止直接更改 `state`
```jsx
import React, { useState } from 'react';

const FunctionComponentDemo: FC = () => {
	const [count, setCount] = useState(0)

	const addCount = () => {
		setCount(count + 1)
        // 这里的count是setCount之前的count
		console.log(count) 
	}

	// 插值表达式
	return (
		<>
			<div>{count}</div>
			<div onClick={addCount}>
				<button>add</button>
			</div>
		</>
	)
}

export default FunctionComponentDemo
```

#### 使用immer释放不可变值的心理负担

由于 `state` 是不可变数据，操作成本比较高，有很大的不稳定性，你可能会忘了解构，忘了变更地址，使用 `immer` 可避免这一问题
  
```sh
# 安装

npm install immer --save
```
```jsx
import React, { useState } from 'react';
import produce from 'immer';

const Demo = () => {
	const [userInfo, setUserInfo] = useState({ name: 'lisi', age: 18 })
	const changeAge = () => {
		// userInfo.age = 21 修改失败，这里是直接对state的值进行修改
		// 传入一个新的值，修改成功
		// userInfo.age = 21
		// setUserInfo({ ...userInfo })

        // 使用immer
		setUserInfo(
			produce(draft => {
				draft.age = 21
				draft.a = 10
			})
		)
	}

	const [list, setList] = useState(['x', 'y'])
	const changeList = () => {
		// list[2] = 'z' 修改失败，与上面同理
		// const newList = [...list]
		// newList[1] = 'z'
		// setList(newList)

		setList(
			produce(draft => {
				draft[1] = 'z'
			})
		)
	}
	return (
		<div>
			<h2>state 不可变数据</h2>
			<div>{JSON.stringify(userInfo)}</div>
			<button onClick={changeAge}>修改年龄</button>
			<div>{JSON.stringify(list)}</div>
			<button onClick={changeList}>修改数组</button>
		</div>
	)
}

export default Demo;
```

#### state使用注意点

1. 为什么不能直接修改 `state`
   * 不触发更新：如果直接修改状态的值，`React` 无法检测到状态的变化，因此不会触发组件的重新渲染`(rerender)`。结果是组件的输出不会更新，导致显示的内容不符合预期。
   * 性能问题：`React` 通过比较前后状态的差异来判断是否需要重新渲染组件。当直接修改状态值时，`React` 无法确定状态是否发生了变化，因此可能会导致频繁的重新渲染，降低性能。
   * 可追踪性问题：`React` 通过 `setState` 方法记录状态的变化历史，这样可以追踪状态的修改，帮助进行调试和排查问题。直接修改状态会失去这种历史记录，使得错误的定位和修复更加困难。

2. `set` 方法是异步的，想要获取改变之后的 `state`
   * `class组件`需要通过向 `setState()` 传入 `callback` 去获取，`callback` 会在 `rerender` 之后触发
   * `Function组件`需要借助 `useEffect()` 的帮助

3. `set` 时如果传入的是一个值，不是函数，操作会被合并
  
4. `set` 时如果传入的是一个返回值的函数并且使用该函数提供的 `prevState` 操作不会被合并
   * 使用函数，会将函数传入异步队列，利用 `eventLoop` 的机制顺序执行这些函数。

5. 如果一个变量不用于 `JSX` 片段请不要使用 `state` 来管理它

```js
const [count, setCount] = useState(0);

// 渲染更新后，count=1
const addCount = () => {
	setCount(count + 1)
	setCount(count + 1)
	setCount(count + 1)
}

// 渲染更新后，count=3
const addCount = () => {
	setCount(count => count + 1)
	setCount(count => count + 1)
	setCount(count => count + 1)
}
```

### Props

完成父子通信：
* 组件是可嵌套的，有层级关系
* 父组件可以给子组件传递数据
* 子组件接收数据，并显示数据

父组件：
```jsx
import React, { useState } from 'react'
import FunctionComponentDemo from './FunctionComponentDemo'
import ClassComponentDemo from './ClassComponentDemo'
import styles from './index.module.scss'
import classnames from 'classnames'

const BaseUseDemo = () => {
	const [count, setCount] = useState(0)

	const [isRedBorder, setIsRedBorder] = useState(false)
	const [isYellowBackground, setIsYellowBackground] = useState(false)
	const [isBlueColor, setIsBlueColor] = useState(false)

	const dynamicClassName = classnames({
		[styles['container']]: true,
		[styles['red-border']]: isRedBorder,
		[styles['yellow-background']]: isYellowBackground,
		[styles['blue-color']]: isBlueColor,
	})

	const toggleBorderStyle = () => {
		setIsRedBorder(!isRedBorder)
		setIsYellowBackground(!isYellowBackground)
		setIsBlueColor(!isBlueColor)
	}

	const countAdd = () => {
		setCount(count + 1)
	}

	// 1. 传递普通数据，不会rerender
	let message = '0'
	const sendMessage = () => {
		message = Math.random() * 100 + ''
	}

	// 传递state数据，可以触发rerender
	// const [message, setMessage] = useState('0')
	// const sendMessage = () => {
	// 	setMessage(Math.random() * 100 + '')
	// }

	// 2. 传递组件给子组件渲染
	const comp = (
		<ul>
			<li>我是父组件排下来巡查的</li>
		</ul>
	)

	// 3. 传递普通函数给子组件执行
	const [classCompMsg, setClassCompMsg] = useState('无msg')
	const [funcCompMsg, setFuncCompMsg] = useState('无msg')

	// 传递函数给子组件，接收子组件传递的函数
	let addFuncCompCount
	const getFuncCompAddCount = callback => {
		addFuncCompCount = callback
	}

	let addClassCompCount
	const getClassCompAddCount = callback => {
		addClassCompCount = callback
	}

	return (
		<div className={dynamicClassName}>
			<div className={styles.item}>
				<h3>function 组件</h3>
				<div>
					<FunctionComponentDemo
						msg={message}
						addParentCount={countAdd}
						setParentMsg={setFuncCompMsg}
						comp={comp}
						transCallback={getFuncCompAddCount}
					/>
				</div>
			</div>
			<div className={styles.item}>
				<div>class组件消息:{classCompMsg}</div>
				<div>function组件消息:{funcCompMsg}</div>
				<div>count: {count}</div>
				<button onClick={sendMessage}>sendMessage</button>
				<button
					onClick={() => {
						addClassCompCount()
					}}
				>
					addClassCompCount
				</button>
				<button
					onClick={() => {
						addFuncCompCount()
					}}
				>
					addFuncCompCount
				</button>
				{/* <button onClick={toggleBorderStyle}>显示/隐藏红边框</button> */}
			</div>
			<div className={styles.item}>
				<h3>class 组件</h3>
				<div>
					<ClassComponentDemo
						msg={message}
						addParentCount={countAdd}
						setParentMsg={setClassCompMsg}
						comp={comp}
						transCallback={getClassCompAddCount}
					/>
				</div>
			</div>
		</div>
	)
}

export default BaseUseDemo;
```

Class子组件：
```jsx
import React, { Component, ReactNode } from 'react';

class ClassComponentDemo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			count: 0,
		}
		console.log('111')
		// bind(this)
		this.addCount = this.addCount.bind(this)

		// 传递 方法 给父组件
		props.transCallback(this.addCount)
	}

	render(): ReactNode {
		// 插值表达式
		return (
			<>
				<div>{this.state.count}</div>
				<div>
					<button onClick={this.addCount}>add</button>
				</div>

				{/* 使用父组件传递的数据 */}
				<div>parentMsg:{this.props.msg}</div>

				<div>
					{/* 调用父组件传递的方法 */}
					<button onClick={this.props.addParentCount}>addParentCount</button>

					{/* 传递数据给父组件 */}
					<button
						onClick={() => {
							this.props.setParentMsg('这是Class组件设置的信息')
						}}
					>
						setParentMsg
					</button>

					{/* 渲染父组件传递的组件 */}
					<>渲染父组件传递的组件：{this.props.comp}</>
				</div>
			</>
		)
	}

	addCount() {
        // 如果没有 bind（this） 指向undefined 后续会报错找不到state
		console.info(this)
		this.setState(
			prevState => ({ count: prevState.count + 1 }),
            // 最新的state
			() => {console.log(this.state.count)}
		)
        // 这里的state永远是setState之前的state
		console.info(this.state.count)
	}
        
    componentDidUpdate(prevProps, prevState, snapshot) {
		// 更新后传递 方法 给父组件
		this.props.transCallback(this.addCount)
	}
}
export default ClassComponentDemo
```

函数子组件：
```jsx
import React, { useState, useEffect } from 'react';

const FunctionComponentDemo = props => {
	const [count, setCount] = useState(0)

	useEffect(() => {
        // 获取最新的count
		console.log(count)
	}, [count])

	const addCount = () => {
		setCount(prevCount => prevCount + 1)
	}

	// 传递 方法 给父组件
	props.transCallback(addCount)

	// 插值表达式
	return (
		<>
			<div>{count}</div>
			<div>
				<button onClick={addCount}>add</button>
			</div>

			{/* 使用父组件传递的数据 */}
			<div>parentMsg:{props.msg}</div>

			<div>
				{/* 调用父组件传递的方法 */}
				<button onClick={props.addParentCount}>addParentCount</button>

				{/* 传递数据给父组件 */}
				<button
					onClick={() => {
						props.setParentMsg('这是Function组件设置的信息')
					}}
				>
					setParentMsg
				</button>

				{/* 渲染父组件传递的组件 */}
				<>渲染父组件传递的组件：{props.comp}</>
			</div>
		</>
	)
}

export default FunctionComponentDemo;
```

#### props的3种应用

1. 传递数据
  
传递普通数据，数据变化时，不会引起子组件 `rerender`
```jsx
// 传递普通数据，不会rerender
let message = '0'
const sendMessage = () => {
        message = Math.random() * 100 + ''
}
<FunctionComponentDemo  msg={message}  />
<ClassComponentDemo  msg={message}  />
```

传递状态，状态变化时，引起子组件 `rerender`
```jsx
// 传递state数据，可以触发rerender
const [message, setMessage] = useState('0')
const sendMessage = () => {
        setMessage(Math.random() * 100 + '')
}
<FunctionComponentDemo  msg={message}  />
<ClassComponentDemo  msg={message}  />
```

2. 传递组件给子组件，子组件渲染该组件
  
自定义属性传递，组件内通过该属性获取而后渲染
```jsx
// 传递组件给子组件渲染
const comp = (
        <ul>
                <li>我是父组件排下来巡查的</li>
        </ul>
)
<FunctionComponentDemo  comp={comp}  />
<ClassComponentDemo comp={comp}  />
```

也可以直接插入，组件内部通过 `props.children` 获取而后渲染
```jsx
<FunctionComponentDemo  comp={comp}>
        <div>123123</div>
</FunctionComponentDemo>

const FunctionComponentDemo = props => {
        return(
                <div>
                        {/* 渲染父组件传递的组件 */}
                        <>渲染父组件传递的组件：{props.comp}</>
                        <>{props.children}</>
                </div>
        )
}
```

3. 传递函数给子组件
  
传递父组件的方法给子组件使用
```jsx
const [count, setCount] = useState(0)
const countAdd = () => {
        setCount(count + 1)
}

// 3. 传递普通函数给子组件执行
const [classCompMsg, setClassCompMsg] = useState('无msg')
const [funcCompMsg, setFuncCompMsg] = useState('无msg')

<FunctionComponentDemo  setParentMsg={setFuncCompMsg} addParentCount={countAdd}  />
<ClassComponentDemo  setParentMsg={setClassCompMsg} addParentCount={countAdd}  />
```

传递函数给子组件，子组件调用该函数，传递自身的方法给父组件使用, 同理，也能传数据给父组件
```jsx
// 传递函数给子组件，接收子组件传递的函数
let addFuncCompCount: () => void
const getFuncCompAddCount = (callback: () => void) => {
        addFuncCompCount = callback
}

let addClassCompCount: () => void
const getClassCompAddCount = (callback: () => void) => {
        addClassCompCount = callback
}

<FunctionComponentDemo  transCallback={getFuncCompAddCount}  />
<ClassComponentDemo  transCallback={getClassCompAddCount}  />
```
::: warning 注意
class组件：首次执行时在 `construct` 内传递方法给父组件，更新时还需要在 `componentDidUpdate` 传递方法给父组件
:::

::: tip 建议
如果传递值非常多，可以使用解构的方式，使代码更简洁
:::

### 组件生命周期

在React中，组件具有一组生命周期方法，它们在组件的不同阶段会被自动调用。

#### class组件生命周期
1. **挂载阶段（Mounting Phase）**：组件被实例化并插入到DOM中。
   * `constructor(props)` 在组件被创建时调用，用于初始化组件的状态（`state`）和绑定事件处理方法。
   * `render()` 必需方法，在该方法中返回 `JSX` 片段。
   * `componentDidMount()` 在组件首次渲染之后调用，可以执行一些副作用操作，如访问DOM、发送网络请求等。

2. **更新阶段（Updating Phase）**：组件的 `props` 或 `state` 发生变化，导致组件重新渲染或更新。
   * `shouldComponentUpdate(nextProps, nextState)` 在组件更新之前调用，用于决定是否需要进行重渲染，默认情况下总是返回 `true`。
   * `render()`
   * `componentDidUpdate(prevProps, prevState, snapshot)` 在组件更新之后调用，可以执行一些副作用操作。

3. **卸载阶段（Unmounting Phase）**：组件从DOM中被移除。
   * `componentWillUnmount()` 在组件被卸载和销毁之前调用，可以进行一些清理操作，如取消订阅、清除计时器等。

4. **错误处理阶段（Error Handling Phase）**：组件在渲染期间、生命周期方法中发生错误。
   * `componentDidCatch(error, info)` 捕获在后代组件中生成的异常。未处理的异常将导致整个组件树卸载。

#### 函数组件'生命周期'

严格意义来说，函数组件本身就只是个`纯函数`没有生命周期，但我们可以借助 `useEffect` 模拟生命周期。
  
`useEffect` 有两个参数：
* 参数1-`effect`：`useEffect` 钩子触发时的执行函数，该函数可以返回一个函数，如果返回函数，则该返回函数会在组件时调用（模拟`componentWillUnmount`）
* 参数2-`deps`: 依赖项(非必传)
   1. 当该参数为 `[]` (空数组)时，模拟 `componentDidMount`，在组件挂载完成时执行参数1
   2. 当该参数为有依赖项的数组时，模拟 `componentDidMount`，在组件挂载完成时及数组内的依赖项发生变化时（模拟特定于这些依赖项的 `componentDidUpdate`）执行参数1
   3. 当该参数未传为 `undefined`、`null` 时，模拟 `componentDidMount`，模拟 `componentDidUpdate`，组件挂载完成时及任何状态发生改变的时候都会执行参数1

哪些东西可以作为依赖项：
1. 当前组件的 `state`
2. `props`, 前提得是父组件传递过来的 `state`, 普通数据不能作为依赖项，它不会引起 `rerender`
3. 在组件中声明的会因为重新渲染而改变的变量都可以作为依赖项，可以视为具有了状态

### 获取组件实例、DOM元素

在React中，通过使用 `ref` 来获取组件实例。 `ref` 是一个可以引用React组件、DOM元素或其他对象的特殊属性。
  
* `ref` 用于操作 `DOM`,而不触发 `rerender`，避免性能的浪费  
* 也可传入普通`JS变量`，但更新不会触发 `rerender`
* `class组件`使用 `createRef()`
* 函数组件使用 `useRef()`钩子

#### class组件
```jsx
import React, { Component, createRef } from 'react';

class ClassComponentDemo extends Component {
	private btnRef = createRef()
	render() {
		console.info('render')
		// 插值表达式
		return (
			<>
                <button ref={this.btnRef}>
                    add
                </button>
			</>
		)
	}

	componentDidMount(): void {
		console.info('componentDidMount')
		console.dir(this.btnRef.current)
	}
}
export default ClassComponentDemo;
```

#### 函数组件
```jsx
import React, { useEffect, useRef, useState } from 'react';
import ClassComponentDemo from './ClassComponentDemo';

const BaseUseDemo = () => {
	const ClassComponentDemoRef = useRef(null)

	useEffect(() => {
		console.dir(ClassComponentDemoRef.current)
	}, [ClassComponentDemoRef])
        
        return (<ClassComponentDemo
                        ref={ClassComponentDemoRef}
                        msg={message}
                        addParentCount={countAdd}
                        setParentMsg={setClassCompMsg}
                        comp={comp}
                        transCallback={getClassCompAddCount}
                />)
}

export default BaseUseDemo;
```

## Hooks

## 样式方案

## 高级特性

## 性能优化

## 状态管理