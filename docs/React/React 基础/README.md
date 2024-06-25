- [什么是 React 组件](#什么是-react-组件)
  - [那么，**函数组件**和**类组件**本质的区别是什么呢？](#那么函数组件和类组件本质的区别是什么呢)
  - [组件通信方式](#组件通信方式)
- [State](#state)
  - [useState 原理](#usestate-原理)
- [Props](#props)
- [lifeCycle](#lifecycle)
    - [componentDidMount 替代方案](#componentdidmount-替代方案)
    - [componentWillUnmount 替代方案](#componentwillunmount-替代方案)
    - [componentWillReceiveProps 替代方案](#componentwillreceiveprops-替代方案)
    - [componentDidUpdate 替代方案](#componentdidupdate-替代方案)
- [Ref](#ref)
  - [forwardRef 转发 Ref 解决 ref 不能跨层级捕获和传递的问题。](#forwardref-转发-ref-解决-ref-不能跨层级捕获和传递的问题)
  - [函数组件 forwardRef + useImperativeHandle](#函数组件-forwardref--useimperativehandle)
  - [逻辑流程图](#逻辑流程图)
- [Context](#context)
- [模块化 CSS](#模块化-css)
- [HOC](#hoc)

# 什么是 React 组件

组件本质上就是类和函数，不同的是组件承载了渲染视图的 UI 和更新视图的 setState 、 useState 等方法。

React 组件本质——
**UI + update + 常规的类和函数 = React 组件**

## 那么，**函数组件**和**类组件**本质的区别是什么呢？

- 对于类组件来说，底层只需要实例化一次，实例中保存了组件的 state 等状态。对于每一次更新只需要调用 render 方法以及对应的生命周期就可以了。

- 但是在函数组件中，每一次更新都是一次新的函数执行，一次函数组件的更新，里面的变量会重新声明。

## 组件通信方式

1. props 和 callback 方式
   1. 父组件 -> 通过自身 state 改变，重新渲染，传递 props -> 通知子组件
   2. 子组件 -> 通过调用父组件 props 方法 -> 通知父组件。
2. ref 方式。
3. React-redux 或 React-mobx 状态管理方式。
4. context 上下文方式。
5. event bus 事件总线。
   1. 致命缺点
   2. 需要手动绑定和解绑。
   3. 对于小型项目还好，但是对于中大型项目，这种方式的组件通信，会造成牵一发动全身的影响，而且后期难以维护，组件之间的状态也是未知的。
   4. 一定程度上违背了 React 数据流向原则。

# State

state 到底是同步还是异步的？
回答出 batchUpdate 批量更新概念，以及批量更新被打破的条件。

dispatch 更新特点

- 函数组件更新就是函数的执行，在函数一次执行过程中，函数内部所有变量重新声明，所以改变的 state ，只有在下一次函数组件执行时才会被更新。
- 不要传入相同的 state，会导致视图不更新
  ```js
  const handleClick = () => {
    // 点击按钮，视图没有更新。
    state.name = "Alien";
    dispatchState(state); // 直接改变 `state`，在内存中指向的地址相同。
    dispatchState({ ...state }); // 重新分配内存空间
  };
  ```

## useState 原理

[useState 原理](../React%20原理/README.md#状态派发-usestate-原理)

setState 和 useState 有什么异同？

**相同点：**

- 首先从原理角度出发，setState 和 useState 更新视图，底层都调用了 scheduleUpdateOnFiber 方法，而且事件驱动情况下都有批量更新规则。

**不同点：**

- 在不是 pureComponent 组件模式下， setState 不会浅比较两次 state 的值，只要调用 setState，在没有其他优化手段的前提下，就会执行更新。但是 useState 中的 dispatchAction 会默认比较两次 state 是否相同，然后决定是否更新组件。
- setState 有专门监听 state 变化的回调函数 callback，可以获取最新 state；但是在函数组件中，只能通过 useEffect 来执行 state 变化引起的副作用。
- setState 在底层处理逻辑上主要是和老 state 进行合并处理，而 useState 更倾向于重新赋值。

# Props

什么是 props ？

无论是函数组件还是类组件 父组件在子组件的标签里绑定的属性或者方法 最终都会变成 props 传给子组件

props 可以是什么？

1. props 作为一个子组件渲染数据源。
2. props 作为一个通知父组件的回调函数。
3. props 作为一个单纯的组件传递。
4. props 作为渲染函数。
5. render props ， 和 ④ 的区别是放在了 children 属性上。
6. render component 插槽组件。

隐式注入 props

```js
React.cloneElement(prop.children, { mes: "let us learn React !" });
```

# lifeCycle

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2024/06/cde33557412f13a7f6b331460145300f.png)

一句话概括如何选择 **useEffect** 和 **useLayoutEffect** ：修改 DOM ，改变布局就用 useLayoutEffect ，其他情况就用 useEffect 。

执行顺序
useInsertionEffect > useLayoutEffect > useEffect

｜--------问与答---------｜

问：React.useEffect 回调函数 和 componentDidMount / componentDidUpdate 执行时机有什么区别 ？

答：useEffect 对 React 执行栈来看是异步执行的，而 componentDidMount / componentDidUpdate 是同步执行的，useEffect 代码不会阻塞浏览器绘制。在时机上 ，componentDidMount / componentDidUpdate 和 useLayoutEffect 更类似。

｜---------end----------｜

### componentDidMount 替代方案

```js
React.useEffect(() => {
  /* 请求数据 ， 事件监听 ， 操纵dom */
}, []); /* 切记 dep = [] */
```

### componentWillUnmount 替代方案

```js
React.useEffect(() => {
  /* 请求数据 ， 事件监听 ， 操纵dom ， 增加定时器，延时器 */
  return function componentWillUnmount() {
    /* 解除事件监听器 ，清除定时器，延时器 */
  };
}, []); /* 切记 dep = [] */
```

### componentWillReceiveProps 替代方案

- 首先因为二者的执行阶段根本不同，一个是在 render 阶段，一个是在 commit 阶段。
- 其次 useEffect 会初始化执行一次，但是 componentWillReceiveProps 只有组件更新 props 变化的时候才会执行。

```js
React.useEffect(() => {
  console.log("props变化：componentWillReceiveProps");
}, [props]);
```

### componentDidUpdate 替代方案

useEffect 是异步执行，componentDidUpdate 是同步执行 ，但都是在 commit 阶段 。

```js
React.useEffect(() => {
  console.log("组件更新完成：componentDidUpdate ");
}); /* 没有 dep 依赖项 */
```

# Ref

```js
{
    current:null , // current指向ref对象获取到的实际内容，可以是dom元素，组件实例，或者其它。
}
```

## forwardRef 转发 Ref 解决 ref 不能跨层级捕获和传递的问题。

**forwardRef** 的初衷就是解决 ref 不能跨层级捕获和传递的问题。

## 函数组件 forwardRef + useImperativeHandle

对于函数组件，本身是没有实例的，但是 React Hooks 提供了，useImperativeHandle 一方面第一个参数接受父组件传递的 ref 对象，另一方面第二个参数是一个函数，函数返回值，作为 ref 对象获取的内容。一起看一下 useImperativeHandle 的基本使用。

useImperativeHandle 接受三个参数：

第一个参数 ref : 接受 forWardRef 传递过来的 ref 。
第二个参数 createHandle ：处理函数，返回值作为暴露给父组件的 ref 对象。
第三个参数 deps :依赖项 deps，依赖项更改形成新的 ref 对象。

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2024/06/7b64df2ff8db6d0e6dbf1cac73721761.png)

```js
// 子组件
function Son(props, ref) {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  useImperativeHandle(
    ref,
    () => {
      const handleRefs = {
        onFocus() {
          /* 声明方法用于聚焦input框 */
          inputRef.current.focus();
        },
        onChangeValue(value) {
          /* 声明方法用于改变input的值 */
          setInputValue(value);
        },
      };
      return handleRefs;
    },
    []
  );
  return (
    <div>
      <input placeholder="请输入内容" ref={inputRef} value={inputValue} />
    </div>
  );
}

const ForwarSon = forwardRef(Son);
// 父组件
class Index extends React.Component {
  cur = null;
  handerClick() {
    const { onFocus, onChangeValue } = this.cur;
    onFocus(); // 让子组件的输入框获取焦点
    onChangeValue("let us learn React!"); // 让子组件input
  }
  render() {
    return (
      <div style={{ marginTop: "50px" }}>
        <ForwarSon ref={(cur) => (this.cur = cur)} />
        <button onClick={this.handerClick.bind(this)}>操控子组件</button>
      </div>
    );
  }
}
```

## 逻辑流程图

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2024/06/6036e881bb8bb7fdcb4380c1f5a694aa.png)

# Context

提供者 Provider 的用法。

```js
const ThemeContext = React.createContext(null); //
const ThemeProvider = ThemeContext.Provider; //提供者
const ThemeConsumer = ThemeContext.Consumer; // 订阅消费者

export default function ProviderDemo() {
  const [contextValue, setContextValue] = React.useState({
    color: "#ccc",
    background: "pink",
  });
  return (
    <div>
      <ThemeProvider value={contextValue}>
        <Son />
      </ThemeProvider>
    </div>
  );
}
```

消费者 Consumer 三种用法

1. 类组卷 `this.context`
2. 函数组件 `useContext(ThemeContext)`
3. Consumer 方式

   ```js
   const ThemeConsumer = ThemeContext.Consumer; // 订阅消费者

   function ConsumerDemo(props) {
     const { color, background } = props;
     return <div style={{ color, background }}>消费者</div>;
   }

   // 将 context 内容转化成 props
   const Son = () => (
     <ThemeConsumer>
       {(contextValue) => <ConsumerDemo {...contextValue} />}
     </ThemeConsumer>
   );
   ```

# 模块化 CSS

1.  CSS Modules

    ```js
    import style from "./style.css";
    export default () => (
      <div>
        <div className={style.text}>验证 css modules </div>
      </div>
    );
    ```

2.  CSS IN JS

    ```js
    import React from "react";

    import Style from "./style";

    export default function Index() {
      return (
        <div style={Style.boxStyle}>
          <span style={Style.textStyle}>hi , i am CSS IN JS!</span>
        </div>
      );
    }
    ```

# HOC

HOC 的产生根本作用就是解决大量的代码复用，逻辑复用问题。、

**那么具体复用了哪些逻辑呢？**

- 本质上是对渲染的控制，对渲染的控制可不仅仅指是否渲染组件，还可以像 dva 中 dynamic 那样懒加载/动态加载组件。
- 还有一种场景，比如项目中想让一个非 Route 组件，也能通过 props 获取路由实现跳转，但是不想通过父级路由组件层层绑定 props ，这个时候就需要一个 HOC 把改变路由的 history 对象混入 props 中，于是 withRoute 诞生了。所以 HOC 还有一个重要的作用就是让 props 中混入一些你需要的东西。
- 还有一种情况，如果不想改变组件，只是监控组件的内部状态，对组件做一些赋能，HOC 也是一个不错的选择，比如对组件内的点击事件做一些监控

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2024/06/57dcf0d30f47d3b1d2e0f5d842c799c2.png)

下面对 HOC 具体能实现那些功能，和如何编写做一下总结：

1. 强化 props ，可以通过 HOC ，向原始组件混入一些状态。
2. 渲染劫持，可以利用 HOC ，动态挂载原始组件，还可以先获取原始组件的渲染树，进行可控性修改。
3. 可以配合 import 等 api ，实现动态加载组件，实现代码分割，加入 loading 效果。
4. 可以通过 ref 来获取原始组件实例，操作实例下的属性和方法。
5. 可以对原始组件做一些事件监听，错误监控等。
