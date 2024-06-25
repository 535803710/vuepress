- [React 事件原理](#react-事件原理)
  - [事件绑定——事件初始化](#事件绑定事件初始化)
  - [事件触发](#事件触发)
- [Fiber](#fiber)
  - [什么是 fiber ? Fiber 架构解决了什么问题？](#什么是-fiber--fiber-架构解决了什么问题)
  - [不同 fiber 之间如何建立起关联的？](#不同-fiber-之间如何建立起关联的)
  - [Fiber root 和 root fiber 有什么区别？](#fiber-root-和-root-fiber-有什么区别)
  - [Fiber 更新机制](#fiber-更新机制)
  - [双缓冲树](#双缓冲树)
  - [fiber 树的构建与更新](#fiber-树的构建与更新)
- [Hooks 原理](#hooks-原理)
  - [问题](#问题)
  - [Hooks 出现本质上原因是：](#hooks-出现本质上原因是)
  - [函数组件触发原理](#函数组件触发原理)
  - [状态派发 useState 原理](#状态派发-usestate-原理)
    - [dispatchAction 原理](#dispatchaction-原理)
  - [处理副作用 useEffect 原理](#处理副作用-useeffect-原理)
    - [初始化](#初始化)
    - [更新](#更新)
  - [useRef 原理](#useref-原理)
  - [useMemo 原理](#usememo-原理)
- [Context 原理](#context-原理)

# React 事件原理

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2024/06/d6191473dc76a716878f4687855dd897.png)

```js
function Index() {
  const refObj = React.useRef(null);
  useEffect(() => {
    const handler = () => {
      console.log("事件监听");
    };
    refObj.current.addEventListener("click", handler);
    return () => {
      refObj.current.removeEventListener("click", handler);
    };
  }, []);
  const handleClick = () => {
    console.log("冒泡阶段执行");
  };
  const handleCaptureClick = () => {
    console.log("捕获阶段执行");
  };
  return (
    <button
      ref={refObj}
      onClick={handleClick}
      onClickCapture={handleCaptureClick}
    >
      点击
    </button>
  );
}
```

捕获阶段执行 -> 事件监听 -> 冒泡阶段执行

## 事件绑定——事件初始化

写完 jsx 会转换成 react element 再转换成 fiber

在 createRoot 的时候进行了通过 listenToAllSupportedEvents 注册事件

listenToAllSupportedEvents 做的事情： 在保存的浏览器事件中遍历，如果是冒泡事件就绑定冒泡事件，捕获事件一直需要绑定，绑定用得 addEventListener

**listenToNativeEvent 本质上就是向原生 DOM 中去注册事件**

一下向所有外层容器的注册完全部事件
捕获和冒泡都注册 ，所以一次点击事件触发两次 `dispatchEvent`

- 第一次捕获阶段的点击事件；
- 第二次冒泡阶段的点击事件；

## 事件触发

执行 `dispatchEvent`

**当发生一次点击事件，React 会根据事件源对应的 fiber 对象，根据 return 指针向上遍历，收集所有相同的事件**，比如是 onClick，那就收集父级元素的所有 onClick 事件，比如是 onClickCapture，那就收集父级的所有 onClickCapture。

收集所有绑定的 listener

如果是捕获阶段执行的函数，那么 listener 数组中函数，会从后往前执行，

如果是冒泡阶段执行的函数，会从前往后执行，用这个模拟出冒泡阶段先子后父，捕获阶段先父后子。

在 React 事件系统中，事件源也不是原生的事件源，而是 React 自己创建的事件源对象，所以在事件中执行 e.stopPropagation 事件源感知到了后 判断 event.isPropagationStopped 后阻止

# Fiber

## 什么是 fiber ? Fiber 架构解决了什么问题？

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2024/06/cc0168b6938dac14dcd24becbf53a0b3.png)
首先必须需要弄明白 React.element ，fiber 和真实 DOM 三者是什么关系。

- element 是 React 视图层在代码层级上的表象，也就是开发者写的 jsx 语法，写的元素结构，都会被创建成 element 对象的形式。上面保存了 props ， children 等信息。
- DOM 是元素在浏览器上给用户直观的表象。
- fiber 可以说是是 element 和真实 DOM 之间的交流枢纽站，一方面每一个类型 element 都会有一个与之对应的 fiber 类型，element 变化引起更新流程都是通过 fiber 层面做一次调和改变，然后对于元素，形成新的 DOM 做视图渲染。

## 不同 fiber 之间如何建立起关联的？

- return： 指向父级 Fiber 节点。
- child： 指向子 Fiber 节点。
- sibling：指向兄弟 fiber 节点。

## Fiber root 和 root fiber 有什么区别？

- fiberRoot：首次构建应用， 创建一个 fiberRoot ，作为整个 React 应用的根基。
- rootFiber： 如下通过 ReactDOM.render 渲染出来的，如上 Index 可以作为一个 rootFiber。一个 React 应用可以有多 ReactDOM.render 创建的 rootFiber ，但是只能有一个 fiberRoot（应用根节点）。

## Fiber 更新机制

1. 初始化
   - 第一步：创建 fiberRoot 和 rootFiber
   - 第二步：workInProgress 和 current
   - 第三步：深度调和子节点，渲染视图
2. 更新
   1. 首先会走如上的逻辑，重新创建一颗 workInProgresss 树，复用当前 current 树上的 alternate ，作为新的 workInProgress ，由于初始化 rootfiber 有 alternate ，所以对于剩余的子节点，React 还需要创建一份，和 current 树上的 fiber 建立起 alternate 关联。渲染完毕后，workInProgresss 再次变成 current 树。

## 双缓冲树

canvas 绘制动画的时候，如果上一帧计算量比较大，导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。为了解决这个问题，canvas 在内存中绘制当前动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。这种在内存中构建并直接替换的技术叫做双缓存。

React 用 workInProgress 树(内存中构建的树) 和 current (渲染树) 来实现更新逻辑。双缓存一个在内存中构建，一个渲染视图，两颗树用 alternate 指针相互指向，在下一次渲染的时候，直接复用缓存树做为下一次渲染树，上一次的渲染树又作为缓存树，这样可以防止只用一颗树更新状态的丢失的情况，又加快了 DOM 节点的替换与更新。

## fiber 树的构建与更新

1. mount 过程 render 阶段

   - 向下调和 beginWork
     - 对于组件，执行部分生命周期，执行 render ，得到最新的 children 。
     - 向下遍历调和 children ，复用 oldFiber ( diff 算法)
     - 打不同的副作用标签 effectTag ，比如类组件的生命周期，或者元素的增加，删除，更新。
   - 向上归并 completeUnitOfWork
     - 首先 completeUnitOfWork 会将 effectTag 的 Fiber 节点会被保存在一条被称为 effectList 的单向链表中。在 commit 阶段，将不再需要遍历每一个 fiber ，只需要执行更新 effectList 就可以了。
     - completeWork 阶段对于组件处理 context ；对于元素标签初始化，会创建真实 DOM ，将子孙 DOM 节点插入刚生成的 DOM 节点中；会触发 diffProperties 处理 props ，比如事件收集，style，className 处理

2. update 过程 commit 阶段

   - Before mutation 阶段（执行 DOM 操作前）；
     - 因为 Before mutation 还没修改真实的 DOM ，是获取 DOM 快照的最佳时期，如果是类组件有 getSnapshotBeforeUpdate ，那么会执行这个生命周期。
     - 会异步调用 useEffect ，在生命周期章节讲到 useEffect 是采用异步调用的模式，其目的就是防止同步执行时阻塞浏览器做视图渲染。
   - mutation 阶段（执行 DOM 操作）；
     - 置空 ref ，在 ref 章节讲到对于 ref 的处理。
     - 对新增元素，更新元素，删除元素。进行真实的 DOM 操作。
   - layout 阶段（执行 DOM 操作后）
     - commitLayoutEffectOnFiber 对于类组件，会执行生命周期，setState 的 callback，对于函数组件会执行 useLayoutEffect 钩子。
     - 如果有 ref ，会重新赋值 ref 。

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2024/06/83733933eff224bcdf5131e7004ff5e1.png)

# Hooks 原理

## 问题

- React Hooks 为什么必须在函数组件内部执行？React 如何能够监听 React Hooks 在外部执行并抛出异常。
  - 1 ContextOnlyDispatcher： 第一种形态是防止开发者在函数组件外部调用 hooks ，所以第一种就是报错形态，只要开发者调用了这个形态下的 hooks ，就会抛出异常。
  - 2 HooksDispatcherOnMount： 第二种形态是函数组件初始化 mount ，因为之前讲过 hooks 是函数组件和对应 fiber 桥梁，这个时候的 hooks 作用就是建立这个桥梁，初次建立其 hooks 与 fiber 之间的关系。
  - 3 HooksDispatcherOnUpdate：第三种形态是函数组件的更新，既然与 fiber 之间的桥已经建好了，那么组件再更新，就需要 hooks 去获取或者更新维护状态。
- React Hooks 如何把状态保存起来？保存的信息存在了哪里？
  - memoizedState
- React Hooks 为什么不能写在条件语句中？
  - hooks 和 fiber 建立关系，hooks 通过 next 链表建立顺序， 在复用 hooks 过程中，会产生复用 hooks 状态和当前 hooks 不一致的问题。
- useMemo 内部引用 useRef 为什么不需要添加依赖项，而 useState 就要添加依赖项。
  - 为改变 useRef 的.current 值并不直接引起 React 组件的重新渲染，也不意味着计算逻辑需要更新。而 useState 则必须作为依赖项列出，因为它会触发组件重新渲染，影响到 useMemo 计算逻辑的输入。
- useEffect 添加依赖项 props.a ，为什么 props.a 改变，useEffect 回调函数 create 重新执行。
- React 内部如何区别 useEffect 和 useLayoutEffect ，执行时机有什么不同？
  - render 的时候标记 effecTag useEffect 和 useLayoutEffect 不同 然后 commit 的时候 useEffect 和异步执行 useLayoutEffect 同步执行

## Hooks 出现本质上原因是：

1. 让函数组件也能做类组件的事，有自己的状态，可以处理一些副作用，能获取 ref ，也能做数据缓存。
2. 解决逻辑复用难的问题。
3. 放弃面向对象编程，拥抱函数式编程。

hooks 本质是离不开函数组件对应的 fiber 的。 hooks 可以作为函数组件本身和函数组件对应的 fiber 之间的沟通桥梁。

## 函数组件触发原理

- ContextOnlyDispatcher 第一种形态是防止开发者在函数组件外部调用 hooks ，所以第一种就是报错形态，只要开发者调用了这个形态下的 hooks ，就会抛出异常。
- HooksDispatcherOnMount： 第二种形态是函数组件初始化 mount ，因为之前讲过 hooks 是函数组件和对应 fiber 桥梁，这个时候的 hooks 作用就是建立这个桥梁，初次建立其 hooks 与 fiber 之间的关系。
- HooksDispatcherOnUpdate：第三种形态是函数组件的更新，既然与 fiber 之间的桥已经建好了，那么组件再更新，就需要 hooks 去获取或者更新维护状态。

```js
let currentlyRenderingFiber;
function renderWithHooks(current, workInProgress, Component, props) {
  currentlyRenderingFiber = workInProgress;
  workInProgress.memoizedState =
    null; /* 每一次执行函数组件之前，先清空状态 （用于存放hooks列表）*/
  workInProgress.updateQueue = null; /* 清空状态（用于存放effect list） */
  ReactCurrentDispatcher.current =
    current === null || current.memoizedState === null
      ? HooksDispatcherOnMount
      : HooksDispatcherOnUpdate; /* 判断是初始化组件还是更新组件 */
  let children = Component(
    props,
    secondArg
  ); /* 执行我们真正函数组件，所有的hooks将依次执行。 */
  ReactCurrentDispatcher.current =
    ContextOnlyDispatcher; /* 将hooks变成第一种，防止hooks在函数组件外部调用，调用直接报错。 */
}
```

遇到 fiber 是 FunctionComponent 类型 updateFunctionComponent ，内部就会调用 renderWithHooks

- 对于函数组件 fiber ，用 memoizedState 保存 hooks 信息。
- 对于函数组件 fiber, updateQueue 里面放要在 commit 阶段更新的副作用
- 判断是初始化还是更新，初始化走 HooksDispatcherOnMount 引用的 **React hooks 都是从 ReactCurrentDispatcher.current 中的， React 就是通过赋予 current 不同的 hooks 对象达到监控 hooks 是否在函数组件内部调用。**
- Component ( props ， secondArg ) 这个时候函数组件被真正的执行，里面每一个 hooks 也将依次执行。
- 每个 hooks 内部为什么能够读取当前 fiber 信息，因为 currentlyRenderingFiber ，函数组件初始化已经把当前 fiber 赋值给 currentlyRenderingFiber ，每个 hooks 内部读取的就是 currentlyRenderingFiber 的内容。 （第一步）

## 状态派发 useState 原理

`const [ number,setNumber ] = React.useState(0) `

- **useState(0) 本质上做了些什么？** 上面的 state 会被当前 hooks 的 memoizedState 保存下来，每一个 useState 都会创建一个 queue 里面保存了更新的信息（上次，这次state）。

- 每个 useState 创建一个更新函数 setXXX 本质上是一个 dispatchAction 里面有绑定 fiber 和 queue
- 最后返回 memoizedState 和 dispatch

### dispatchAction 原理

- 首先用户每一次调用 dispatchAction（比如如上触发 setNumber ）都会先创建一个 update ，然后把它放入待更新 pending 队列中。
- 然后判断如果当前的 fiber 正在更新，那么也就不需要再更新了。
- 反之，说明当前 fiber 没有更新任务，那么会拿出上一次 state 和 这一次 state 进行对比，如果相同，那么直接退出更新。如果不相同，那么发起更新调度任务。这就解释了，为什么函数组件 useState 改变相同的值，组件不更新了。

## 处理副作用 useEffect 原理

### 初始化

在 render 阶段没有真正的 DOM 操作，而是把不同操作变成 effectTag 到了 commit 处理，useEffect 和 useLayoutEffect 也是同理

```js
function mountEffect(create, deps) {
  const hook = mountWorkInProgressHook(); // 和fiber建立关联
  const nextDeps = deps === undefined ? null : deps;
  currentlyRenderingFiber.effectTag |= UpdateEffect | PassiveEffect;
  hook.memoizedState = pushEffect(
    HookHasEffect | hookEffectTag,
    create, // useEffect 第一次参数，就是副作用函数
    undefined,
    nextDeps // useEffect 第二次参数，deps
  );
}
```

1. mountWorkInProgressHook 创建一个 hook 和 fiber 建立关联
2. pushEffect 创建一个 Effect 放在 memoizedState 中
3. pushEffect 除了创建一个 effect 还会行成一个副作用链表 绑定在 fiber 的 updateQueue 上

### 更新

```js
function updateEffect(create, deps) {
  const hook = updateWorkInProgressHook();
  if (areHookInputsEqual(nextDeps, prevDeps)) {
    /* 如果deps项没有发生变化，那么更新effect list就可以了，无须设置 HookHasEffect */
    pushEffect(hookEffectTag, create, destroy, nextDeps);
    return;
  }
  /* 如果deps依赖项发生改变，赋予 effectTag ，在commit节点，就会再次执行我们的effect  */
  currentlyRenderingFiber.effectTag |= fiberEffectTag;
  hook.memoizedState = pushEffect(
    HookHasEffect | hookEffectTag,
    create,
    destroy,
    nextDeps
  );
}
```

- 看 deps 有没有更新，没有变化的话 更新副作用链表就可以，变化了就打执行副作用标签：fiber => fiberEffectTag，hook => HookHasEffect。在 commit 阶段就会根据这些标签，重新执行副作用。

## useRef 原理

**初始化**

```js
function mountRef(initialValue) {
  const hook = mountWorkInProgressHook();
  const ref = { current: initialValue };
  hook.memoizedState = ref; // 创建ref对象。
  return ref;
}
```

**更新**

```js
function updateRef(initialValue) {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState; // 取出复用ref对象。
}
```

## useMemo 原理

**创建：**

```js
function mountMemo(nextCreate, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = nextCreate(); //执行计算函数(nextCreate)并保存结果:
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```

- useMemo 初始化会执行第一个函数得到想要缓存的值，将值缓存到 hook 的 memoizedState 上。

**更新：**

```js
function updateMemo(nextCreate, nextDeps) {
  const hook = updateWorkInProgressHook();
  const prevState = hook.memoizedState;
  const prevDeps = prevState[1]; // 之前保存的 deps 值
  if (areHookInputsEqual(nextDeps, prevDeps)) {
    //判断两次 deps 值
    return prevState[0];
  }
  const nextValue = nextCreate(); // 如果deps，发生改变，重新执行
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```

- useMemo 更新流程就是对比两次的 **dep 是否发生变化**，如果没有发生变化，直接返回缓存值，如果发生变化，执行第一个参数函数，重新生成缓存值，缓存下来，供开发者使用。

# Context 原理

provide 会深度遍历所有关联组件

context 会控制是否 render 和 beginwork
