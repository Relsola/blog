---
sidebar: auto
---

# Vue3 源码解读

源码阅读中...  
这里手写代码尽可能与源码相符合，不考虑过多的边界情况

## 响应式

### proxy数据劫持

::: tip vue2响应式弊端：
* 响应化过程需要递归遍历，消耗较大
* 新加或删除属性无法监听
* 数组响应化需要额外实现
* `Map`、`Set`、`Class`等无法响应式
* 修改语法有限制
:::

proxy实现数据响应
```js
// demo

const isObject = val => val !== null && typeof val === "object";
const toProxy = new WeakMap();

function reactive(obj) {
	if (!isObject(obj)) return obj;
	if (toProxy.has(obj)) return toProxy.get(obj);

	const observed = new Proxy(obj, {
		get(target, p, receiver) {
			const result = Reflect.get(target, p, receiver);
            // Proxy惰性劫持
			return isObject(result) ? reactive(result) : result;
		},
		set(target, p, value, receiver) {
			const result = Reflect.set(target, p, value, receiver);
			return result;
		},
		deleteProperty(target, p) {
			const result = Reflect.deleteProperty(target, p);
			return result;
		}
	});
	toProxy.set(obj, observed);
	return observed;
}

const obj = reactive({
	a: 10,
	b: { a: 10 }
});

// 获取
obj.a;
// 设置已存在属性
obj.a = 20;
// 设置不存在属性
obj.c = "10";
// 删除属性
delete obj.c;
// 嵌套对象
obj.b.a = 20;
```

::: tip 总结
* `proxy` 数据劫持是惰性（用时）劫持， 性能要好很多
* `proxy` 远比存取器劫持方式强大很多，支持多种对象操作
* 修改语法无限制（数组的用法与对象完全一致）
* `proxy` 搭配 `Reflect` 使用绑定 `this`
:::

### reactive

测试用例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>

<body>
    <div id="app"></div>

    <script type="module">
        import { reactive, effect} from "./main.js"
        const info = reactive({ name: "张三" })

        effect(() => {
            document.getElementById("app").textContent = info.name
        })

        setTimeout(() => {
            info.name = "李四"
        }, 2000)

    </script>
</body>

</html>
```

`reactive` 核心代码
```js
// reactivity/reactive.js
import { trigger, track } from './effect.js'

// Map缓存 observed
export const reactiveMap = new WeakMap();

export function reactive(target) {
    // 如果对象已经被劫持，返回之前的proxy
	if (reactiveMap.has(target)) {
		return reactiveMap.get(target);
	}
	// 这里只考虑 get 和 set
	const observed = new Proxy(target, {
		get(target, key, receiver) {
			const result = Reflect.get(target, key, receiver);
			track(target, key);
			return result;
		},
		set(target, key, value, receiver) {
			const result = Reflect.set(target, key, value, receiver);
			trigger(target, key);
			return result;
		}
	});
	reactiveMap.set(target, observed);
	return observed;
}
```

实现三个函数建立响应数据 `key`和更新函数之间的对应关系：
* `effect`：将回调函数保存起来备用，立即执行一次回调函数触发它里面一些响应数据的 `getter`
* `track`：`getter` 中调用 `track`，把前面存储的回调函数和当前 `target`，`key` 之间建立映射关系
* `trigger`：`setter` 中调用 `trigger`，把 `target`和`key`对应的响应函数都执行一遍
```js
// reactivity/effect.js
export function effect(fn) {
    // 保存回调函数
	const _effect = new ReactiveEffect(fn);
	_effect.run();
}

const targetMap = new WeakMap();

export let activeEffect;

export class ReactiveEffect {
	constructor(fn) {
		this.fn = fn;
	}
	run() {
		activeEffect = this;
		this.fn();
	}
}

export function track(target, key) {
	const depsMap = targetMap.get(target);
    // 保存 target 对应 key 的回调函数
	if (!depsMap) {
		targetMap.set(target, (depsMap = new Map()));
	}
	const dep = depsMap.get(key);
	if (!dep) {
		depsMap.set(key, (dep = new Set()));
	}
	dep.add(activeEffect);
}

export function trigger(target, key) {
	const depsMap = targetMap.get(target);
	if (!depsMap) return;
	const dep = depsMap.get(key);
	if (!dep) return;
    // 如果映射关系存在 通知更新
	triggerEffects(dep);
}

export function triggerEffects(effects) {
    // 执行回调函数
	for (const effect of effects) effect.run();
}
```

### ref

* `ref`支持复杂数据（对象类型）和简单数据（基本类型）
* 复杂数据的支持是借助 `reactive` 的依赖收集

测试用例：
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
</head>

<body>
    <div id="app"></div>

    <script type="module">
        import { ref, effect } from "./main.js"
        const info = ref({ name: "张三" })

        effect(() => {
            document.getElementById("app").textContent = info.value.name
        })

        setTimeout(() => {
            info.value.name = "李四"
        }, 2000)

    </script>
</body>

</html>
```

先实现复杂数据的支持：
```js
// reactivity/ref.js
import { activeEffect } from "./effect.js";
import { reactive } from "./reactive.js";

export const isObject = val =>
	val !== null && typeof val === "object";

export function ref(value) {
	return new RefImpl(value);
}

class RefImpl {
	constructor(value) {
		// 代理value
		this._value = toReactive(value);
		// 保存原型
		this._rawValue = value;
		this.dep = new Set();
	}
	// 收集依赖
	get value() {
		if (activeEffect) {
			this.dep.add(activeEffect);
		}
		return this._value;
	}
}

// 对象形式转换成reactive代理
export const toReactive = value =>
	isObject(value) ? reactive(value) : value;
```

原生类型数据的支持：
```js
class RefImpl {
    // ...

	set value(newVal) {
		// 确定两个值是否为相同值。
		if (!Object.is(newVal, this._rawValue)) {
			this._rawValue = newVal;
            // 新设置的值是是对象继续让reactive代理
			this._value = toReactive(newVal);
			// 触发依赖
			if (this.dep) {
				triggerEffects(this.dep);
			}
		}
	}    
}
```

```js
//  index.html
import { ref, effect } from "./main.js"

const info = ref("张三")
effect(() => {
    document.getElementById("app").textContent = info.value
})
setTimeout(() => {
    info.value = "李四"
}, 2000)
```

### computed

测试用例：
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
</head>

<body>
    <div id="app"></div>

    <script type="module">
        import { reactive, effect, computed } from "./main.js"
        const info = reactive({ name: "张三" })
        const myName = computed(() => `我是${info.name}`)

        effect(() => {
            document.getElementById("app").textContent = myName.value
        })

        setTimeout(() => {
            info.name = "李四"
        }, 2000)
    </script>
</body>

</html>
```

先实现 `get` 功能：
```js
// reactivity/computed.js
import { ReactiveEffect, activeEffect } from "./effect.js";

export function computed(getterOrOptions) {
	// 这里只考虑简单情况 即 getterOrOptions 为 getter
	const getter = getterOrOptions;
	return new ComputedRefImpl(getter);
}

export class ComputedRefImpl {
	constructor(getter) {
		// 保存getter
		this.effect = new ReactiveEffect(getter);
		this.dep = undefined;
	}
	get value() {
		// 收集依赖
		this.dep ??= new Set();
		this.dep.add(activeEffect);
		this._value = this.effect.run();
		return this._value;
	}
}
```

```js
// reactivity/effect.js
export class ReactiveEffect {
	constructor(fn) {
		this.fn = fn;
	}
	run() {
		activeEffect = this;
		return this.fn();
	}
}
```

响应式的实现：
```js
// reactivity/computed.js

export class ComputedRefImpl {
	constructor(getter) {
		// 保存getter
		this.effect = new ReactiveEffect(getter, () => {
            // 重新计算并渲染
			if (!this._dirty) {
				this._dirty = true;
				this.dep && triggerEffects(this.dep);
			}
		});
		this.dep = undefined;
		// 是否重新计算 默认值为true
		this._dirty = true;
	}
	get value() {
		// 收集依赖
		this.dep ??= new Set();
		this.dep.add(activeEffect);
		if (this._dirty) {
			this._dirty = false;
			// 执行run函数
			this._value = this.effect.run();
		}
		return this._value;
	}
}
```

```js
// reactivity/effect.js

export class ReactiveEffect {
	constructor(fn, scheduler) {
		this.fn = fn;
		this.scheduler = scheduler;
		this.computed = !!scheduler;
	}
}

export function triggerEffects(effects) {
	// 执行回调函数
    // 防止副作用递归死循环
	for (const effect of effects) {
		if (effect.computed) {
			effect.scheduler();
		}
	}
	for (const effect of effects) {
		if (!effect.computed) {
			effect.run();
		}
	}
}
```
这里比较难以理解，建议多看几遍，明白副作用如何执行。