# Redux

## 了解Redux

redux 主要涉及到的仓库有：[redux](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Freduxjs%2Fredux)、[redux-toolkit](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Freduxjs%2Fredux-toolkit)、[redux-thunk](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Freduxjs%2Fredux-thunk)、[react-redux](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Freduxjs%2Freact-redux)

- redux 为 redux core
- redux-toolkit 为 redux 的工具包
- redux-thunk 为 redux 的中间件, 使 dispatch 可以接受函数，赋予其执行异步操作的能力
- react-redux 为 react 的 redux 绑定库, 使 react 组件可以使用 redux， 且当 redux store 发生变化时，可以自动更新 react 组件

## Redux 核心 createStore 

- 通过 createStore 来创建一个 rootStore（存放 state 的根对象）
- 然后提供 dispatch 方法用来更新 store 里的 state
- 同时提供 getState 方法用来获取 store 里的 state
- 以及 subscribe 方法用来订阅 store 里的 state 变化
- 内部通过 combineReducers 将多个 reducer 的 state 合并成一个 rootState 来进行管理, 并通过 key 进行 state 隔离

```js
const store = createStore(reducer, [preloadedState], [enhancer]);
const { dispatch, getState, subscribe } = store;
```

- `reducer` 为一个 function, 包含 state 和 action 两个参数，其中 `action 为一个包含 type 的对象`, 并返回新的 state， 如下

  ```js
  function counter(state, action) {
    if (typeof state === "undefined") {
      return 0;
    }
  
    switch (action.type) {
      case "INCREMENT":
        return state + 1;
      case "DECREMENT":
        return state - 1;
      default:
        return state;
    }
  }
  
  var store = Redux.createStore(counter);
  ```

- `preloadedState` 为初始状态值

- `enhancer` 为中间件，可以添加多个，如下

  ```js
  const store = createStore(reducer, undefined, applyMiddleware(thunk, logger));
  ```

- `dispatch` 通过传入 action 来更新 state， action 为对象情况下，更新是同步的，如下

  ```js
  // action 为一个含type的对象， currentReducer 为之前的reducer对象集合
  dispatch(action) {
     currentState = currentReducer(currentState, action)
  }
  ```

- `getState` 实时获取当前的 state

- `subscribe` 订阅，当 state 发生变化时，执行回调函数，每个 dispatch 都会触发 subscribe

  > react-redux 的 connect 方法就是通过 subscribe 来实现的， useSelector 是通过 useContext 来实现的

  ```js
  // listener 为一个function, 当dispatch执行完后（即state更新后）再执行
  subscribe(listener: () => void)
  ```

## Redux 中间件

中间件用于`增强 dispatch 功能`，返回一个增强后的 dispatch（比如 redux-thunk 使 action 可以为 function）

### 添加中间件

```js
const store = createStore(reducer, undefined, applyMiddleware(thunk, logger));
```

### 中间件的写法

1. 一个有 extraArgument 参数的方法， 返回一个中间件函数

2. 这个中间件函数接收一个参数对象，对象中有两个属性，一个是 dispatch，一个是 getState

3. 并返回一个固定格式的函数 (next) => (action) => {}，

   > 其中 next 为上一个中间件加强后的 dispatch（第一个中间件接收的 dispatch 为 store.dispatch），action 为实际调用 dispatch 时传入的 action 参数

```js
export default function thunk(extraArgument?: any) {
  // 中间件函数
  return ({ dispatch, getState }) => {
    // 中间件函数返回固定格式的函数
    return (next) => (action) => {
      if (typeof action === "function") {
        return action(dispatch, getState, extraArgument);
      }

      return next(action);
    };
  };
}
```

### 中间件为何这样写？

中间件要返回一个接收一个参数的 function，因为 applyMiddleware 里的 `middleware({getState, dispatch})(store.dispatch)`, 需要通过 middleware({getState, dispatch})返回的 function 接收 store.dispatch 这个参数， 同时将`{getState, dispatch}`传入 middleware

```js
const thunkMiddleware = function ({ getState, dispatch }) {
  // 这里的 next 为 store.dispatch
  return function (next) {
    // your code ...
  };
};
```

中间件返回的 function 的内部，仍然需要返回一个新的 function，且这个新的 function 必须接收一个参数 action，因为 `dispatch = middleware({getState, dispatch})(store.dispatch)`, 即中间件包装后(`middleware({getState, dispatch})(store.dispatch`)，最终返回的是一个 接收 action 的 dispatch function

```js
const thunkMiddleware = function ({ getState, dispatch }) {
  // your code 1...
  return function (next) {
    // your code 2...
    return (action) => {
      // your code 3...
    };
  };
};
```

所以事实上，中间件内部有 3 处可以编写代码逻辑， 而 thunkMiddleware 将逻辑写在了 code3 的位置

### redux-thunk 中间件

redux 的 dispatch 只能接收一个对象，`redux-thunk 允许 dispatch 可以接收一个对象，也可以接收一个 function`，这个 function 接收 dispatch, getState 两个参数

代码实现

```js
export default function thunk(extraArgument?: any) {
  // 这里的dispatch为其他中间件加强后的dispatch
  return ({ dispatch, getState }) => {
    // 这里的next表示的是上一次中间件加强后的dispatch，当只有一个中间件时，为原始的store.dispatch
    // action为实际调用dispatch时传入的action参数
    return (next) => (action) => {
      if (typeof action === "function") {
        return action(dispatch, getState, extraArgument);
      }

      return next(action);
    };
  };
}
```

应用 redux-thunk 后支持

```js
dispatch((dispatch, getState, extraArgument?: any) => {
  // do something
});
```

## rootState

redux 内部通过 combineReducers 将多个 reducer 融合成一个 reducer， 因为 createStore 只接受一个 reducer， 即只支持一个 rootState, dispatch 与 getState 都是针对 rootState 的

### combineReducers 的使用

```js
import { combineReducers, createStore } from "redux";
import todosReducer from "./features/todos/todosSlice";
import filtersReducer from "./features/filters/filtersSlice";

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  todos: todosReducer,
  filters: filtersReducer,
});

const store = createStore(rootReducer);
```

### 核心代码

combineReducers 内部，根据 key， 为每个 reducer 传入各自的 state，起到环境隔离作用

action.type 没有隔离, 如果 2 个 reducer 都有同名的 action.type, 则会同时触发, 依据是`const nextStateForKey = reducer(previousStateForKey, action);`

当 createRoot 传入的是 合并（combineReducers） 后的 rootReducer(格式为{key1: reducer1, key2: reducer2})，当 dispatch 时，会触发所有的 reducer， 但是每个 reducer 只会处理自己的 state

```js
let hasChanged = false;
const nextState: StateFromReducersMapObject<typeof reducers> = {};
for (let i = 0; i < finalReducerKeys.length; i++) {
  const key = finalReducerKeys[i];
  const reducer = finalReducers[key];
  // 这里是combineReducers的核心，通过reducer的key, 为每个reducer传入各自的state，起到环境隔离作用
  const previousStateForKey = state[key]; // 获取当前reducer对应的state, state为rootState
  // 遍历合成后的rootReducers, 为每个reducer执行一遍reducer(previousStateForKey, action), previousStateForKey为各自reducer的state， 并赶回执行后的当前reducer的state
  // 所以当action相同时，每个reducer都会执行一遍，但是只有对应的reducer会返回新的state，其他的reducer返回的是之前的state
  // TODO: 这里应该可以做性能优化，不必每个都执行一遍，只需要执行对应的reducer
  const nextStateForKey = reducer(previousStateForKey, action);
  nextState[key] = nextStateForKey;
  hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
}
hasChanged =
  hasChanged || finalReducerKeys.length !== Object.keys(state).length;
return hasChanged ? nextState : state;
```

## redux-toolkit

redux-toolkit 为 redux 库的工具库，内部封装了 redux-thunk、reselect 中间件，并封装了 createSlice 方法用来简化 reducer 的编写。

### 基于 redux 的业务逻辑写法

```js
const initCounterState = {
  num: 0,
};

// 这里传入的state, 为currentState, 即rootState, 并返回一个新的rootState
// dispatch执行源码： currentState = currentReducer(currentState, action)
const counterReducer = (state = initCounterState, action) => {
  const { number = 1, type } = action;
  switch (type) {
    case "incerate":
      state.num = state.num + number;
      break;
    case "reduce":
      state.num = state.num - number;
      break;
    case "reset":
      state.num = state.num || 0;
  }

  return state;
};
const store = createStore(counterReducer, undefine, applyMiddleware(thunk));
const handleAdd = () => {
  dispatch({
    type: "incerate",
    number: 1,
  });
};
```

### 基于 redux 的业务逻辑升级

```js
const studentReducer = sliceReducers({
  name: 'student'
  initState: {
    studentNum: 0,
  },
  reducer: {
    incerate: (state, action) => {
      const { number } = action
      state.studentNum = state.studentNum + number
    },
    reduce: (state, action) => {
      const { number } = action
      state.studentNum = state.studentNum - number
    },
    reset: (state, action) => {
      const { number } = action
      state.studentNum = number || 0
    },
  },
});

const teacherReducer = sliceReducers({
  name: 'teacher'
  initState: {
    teacherNum: 0,
  },
  reducer: {
    reduce: (state, action) => {
      const {number} =  action
      state.teacherNum = state.teacherNum - number
    },
    add: (state, action) => {
      const {number} =  action
      state.teacherNum = state.teacherNum + number,
    },
    reset: (state, action) => {
        const {number} =  action
        state.teacherNum = number || 0
    },
  },
});
```

将 reducer 对象转换成用于 rootReducer 的格式

```js
/**
 * 将Object格式转成常规reducer格式
 * @param {Object} reducerObject
 * @return {Object} {users : usersReducer}
 */
const sliceReducers = (reducerObject) => {
  const { name, initState, reducer } = reducerObject;

  return {
    [name]: (state = initState, action) => {
      const { type } = action;
      const handler = reducer[`${name}/${type}`];
      if (handler) {
        return handler(state, action);
      }
      return state;
    },
  };
};
```

基于 sliceReducers 的实际使用

```js
const store = createStore({
  studentReducer,
  teacherReducer,
});
```

### redux-toolkit 的 createSlice

```js
createSlice({ name, initialState, reducers, extraReducers });
```

createSlice 用来将固定格式的对象 {name, initialState, reducers} 转换成可用来生成 rootReducer 的对象{name, reducer, actions, caseReducers, getInitialState}

其核心是为 action 的 type 重新赋值，改为 name/type 的格式

至于 reducer 里的 state 的隔离问题，是在 combineReducers 里实现的

createSlice 只能通过 extraReducers 的 `Build Callback` 格式才能实现 actionMatchers 能力

```js
const initialState = { value: 0 } as CounterState

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value++
    },
    decrement(state) {
      state.value--
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload
    },
    extraReducers: (builder) => {
      builder
        .addCase(incrementBy, (state, action) => {
          // action is inferred correctly here if using TS
        })
        // You can chain calls, or have separate `builder.addCase()` lines each time
        .addCase(decrement, (state, action) => {})
        // You can match a range of action types
        .addMatcher(
          isRejectedAction,
          // `action` will be inferred as a RejectedAction due to isRejectedAction being defined as a type guard
          (state, action) => {}
        )
        // and provide a default case if no other handlers matched
        .addDefaultCase((state, action) => {})
    },
  },
})

export const { increment, decrement, incrementByAmount, name } = counterSlice.actions
export default counterSlice.reducer


const store = createStore({
  [name]: counterSlice
})
```

在 createSlice 内部，对 action 的 type 进行了重命名，改为

```js
const newType = `${name}/${type}`;
```

手动实现一个 createSlice

```js
/**
 * 将Object格式转成常规reducer格式
 * @param {Object} reducerObject
 * @return {Object} {users : usersReducer}
 */
const createSlice = (reducerObject) => {
  const { name, initialState, reducers } = reducerObject;

  return {
    [name]: (state = initialState, action) => {
      const { type } = action;
      const handler = reducers[`${name}/${type}`];
      if (handler) {
        return handler(state, action);
      }
      return state;
    },
  };
};
```

## async 使用

通常的 dispatch 为同步的，执行 action 后，可以实时更新 state ，并获取最新的值

但是有些场景下，需要异步的 dispatch，比如请求接口，这时候就需要用到 redux-thunk

Q: 为什么要用 redux 的 async 写法？

A: 可以将一些 fetch 逻辑写在 redux 的 action.js 里，做到业务逻辑与 redux 分离及重用。 async 写法也可以有返回值

### thunk function 的写法

```js
function thunkFunction(_customArg) {
  return function (dispatch, getState) {
    // do something
  };
}

dispatch(thunkFunction(customArg));
```

### 业务中的使用

同步写法, 逻辑写在 Page 页面

```js
const getListData = async (userId) => {
  dispatch({ type: "update", payload: { loading: true } });
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${userId}`
  );
  const data = await res.json();
  dispatch({ type: "update", payload: { loading: false, list: data } });
};
```

异步写法, 逻辑写在 Page 页面， thunkFunction 写在 redux/action 目录下

```js
// 这里的fetchListData为一个Action, 也是一个thunkFunction, 只不过这个Action是一个function, 需要配合redux-thunk使用
// 这里的fetchListData应该放在redux的action.js里, 这样就做到了业务逻辑和redux的分离
export function fetchListData(userId) = {
  return async (dispatch, getState) => {
    dispatch({ type: "update", payload: { loading: true } });
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${userId}`
    );
    const data = await res.json();
    dispatch({ type: "update", payload: { loading: false, list: data } });
    return data;
  }
}
import { fetchListData } from "@/redux/action/user";

const getListData = async (userId) => {
  const data = await dispatch(fetchListData(userId));
};
```

### createAsyncThunk

为对 redux+redux-thunk 的封装，可以直接使用

```js
createAsyncThunk(type: string, payloadCreator: Function, options?: Options)
```

- type 为 action 的 type
- payloadCreator 为请求的函数，`({dispatch，getState，extra, requestId, signal, rejectWithValue, fulfillWithValue}) => Promise`，返回值为 Promise，可以是异步的，也可以是同步的
- options 为配置项

```js
// reducer写法（reducer非必须，有3种状态fulfilled、pending、rejected）
// 这种一般卸载extraReducers里，通过 build callback 的方式来写
const reducer = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserById.fulfilled, (state, action) => {});
  },
});
// thunk action 写法（可以写业务逻辑， 返回值非必须，可以在调用时，及reducer的action.payload中获取返回值）
const fetchUserById = createAsyncThunk(
  "users/fetchByIdStatus",
  async (userId: number, thunkAPI) => {
    const response = await userAPI.fetchById(userId);
    return response.data;
  }
);
import { fetchUserById } from "@/redux/action/user";
// 组件里的调用写法
const onClick = () => {
  dispatch(fetchUserById(userId))
    .unwrap()
    .then((originalPromiseResult) => {
      // handle result here
    })
    .catch((rejectedValueOrSerializedError) => {
      // handle error here
    });
};
```

