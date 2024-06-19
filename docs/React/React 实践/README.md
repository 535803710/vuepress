# 自定义 hooks

自定义 Hooks 是 React Hooks 聚合产物，内部有一个或多个 React Hooks 组成的纯函数。解决业务逻辑复杂的情况

```js
function useXXX(参数A,参数B){
    /*
     ...自定义 hooks 逻辑
     内部应用了其他 React Hooks —— useState | useEffect | useRef ...
    */
    return [xxx,...]
}

```

**自定义 hooks 参数可能是以下内容：**

1. hooks 初始化值。
2. 一些副作用或事件的回调函数。
3. 可以是 useRef 获取的 DOM 元素或者组件实例。
4. 不需要参数

**自定义 hooks 返回值可能是以下内容：**

1. 负责渲染视图获取的状态。
2. 更新函数组件方法，本质上是 useState 或者 useReducer。
3. 一些传递给子孙组件的状态。
4. 没有返回值。

## 特性

#### 驱动条件

本质是一个函数，在函数组件中执行，所以**自定义 hooks 驱动本质上就是函数组件的执行。**

- props 改变使组件执行
- useState | useReducer 改变 state 引发组件更新

#### 顺序原则

因为自定义内部要执行 react hoosk 所以也要保持 hooks 规则

**不能放在条件语句中，而且要保持执行顺序的一致性。**
因为 hooks 在创建的时候会 通过 next 建立链表 会按照顺序执行，改变顺序 会导致 hooks 不能复用 找不到

#### 条件限定

问题代码

```js
function useXXX() {
  const value = React.useContext(defaultContext);
  /* .....用上下文中 value 一段初始化逻辑  */
  const newValue =
    initValueFunction(value); /* 初始化 value 得到新的 newValue  */
  /* ...... */
  return newValue;
}
```

每一次函数组件更新，就会执行此自定义 hooks ，那么就会重复执行初始化逻辑，重复执行 initValueFunction ，每一次都会得到一个最新的 newValue 。 如果 newValue 作为 useMemo 和 useEffect 的 deps ，或者作为子组件的 props ，那么子组件的浅比较 props 将失去作用。

增加条件限定，useRef 保存初始值，或者用useMemo执行

```js
function useXXX() {
  const newValue = React.useRef(null); /* 创建一个 value 保存状态。  */
  const value = React.useContext(defaultContext);
  if (!newValue.current) {
    /* 如果 newValue 不存在 */
    newValue.current = initValueFunction(value);
  }
  return newValue.current;
}
```

#### 考虑可变性

什么叫做可变性，就是**考虑一些状态值发生变化，是否有依赖于当前值变化的执行逻辑或执行副作用。**


#### 闭包效应

就是执行的时候添加依赖



