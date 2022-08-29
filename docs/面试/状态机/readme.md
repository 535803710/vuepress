# 状态机 （finite-state-machines）
> 我们这里纸讨论有限状态机
> 
当我们在进行复杂的流程开发，或者在编写一些基础的编译工作的时候，我们都会使用状态机的这种设计模式。

听名字你可能觉得很高大上，不要先急着去搜资料（[MDN 上状态机](https://developer.mozilla.org/en-US/docs/Glossary/State_machine)），如果你不是刚刚入门，那么你一定接触过状态机。

比如说下面都是使用了状态机的设计模式：

- 正则表达式
- REACT/VUE 等现代框架的编译模块
- Promise

## 什么是状态机

最简单的例子就是红绿灯
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8880da526724ed18823e65938b13c99~tplv-k3u1fbpfcp-watermark.image?)

概念：
- 状态(state)：可以有很多种状态，当然这些状态是有限的，**每个FSM都有一个初始状态**。例如：开关可以划分为开启状态、关闭状态；红绿灯可以划分为关、一档、二档、三档等状态。
- 状态转换(State transitions)：根据当前状态和系统输入从当前状态到下一个状态的规则。

**状态的转换必须是互斥的。这意味着给定的输入不会导致转换为两种状态。这确保了我们系统的确定性行为。**

## 实现一个小例子

让我们从动画的角度来解决这个问题。假设你正在创建一个加载动画，它在任何给定时间只能处于四种状态之一：

- idle（尚未加载）
- loading
- failure
- success

你的动画不可能同事处于“加载”和“失败”两种状态。

下面就需要考虑状态是如何转换

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67c9025246274510acf146abaa2fafbb~tplv-k3u1fbpfcp-watermark.image?)


箭头指向就是展示的一个状态通过事件转换到另一种状态，这些状态过度我们都可以实现动画。

现在你知道CSS中的 `CSS transitions` 是怎么来的吧，它是用来描述CSS中的一种视觉“状态”如何转换到另一种视觉“状态”的。

换句话说，如果你使用 `CSS transitions` ，那么你一直都在使用状态机，可能你自己都不知道。

步骤：


- 使用css的属性选择器来控制样式
```CSS
.button[data-state="loading"] .text[data-show="loading"] {
  display: inline-block;
}
.button[data-state="loading"] .text[data-show]:not([data-show="loading"]) {
  display: none;
}
```

- 我们可以用代码实现状态的动态转换
```js
// ...
const buttonMachine = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'loading'
      }
    },
    loading: {
      on: {
        ERROR: 'failure',
        RESOLVE: 'success'
      }
    },
    failure: {
      on: {
        RETRY: 'loading'
      }
    },
    success: {}
  }
};
let currentState = buttonMachine.initial;
function transitionButton(currentState, event) {
  return buttonMachine
    .states[currentState]
    .on[event] || currentState; // fallback to current state
}
// ...
// use the same send() function
```

## Vue编译中的状态机使用
比如说我们需要编译下面一段模板
```xml
<p>Vue</p>
```

解析器会把这段字符串分割成3个Token（标记）
- 开始标签`<p>`
- 文本标签`Vue`
- 结束标签`</p>`

那么解析器是如何操作的呢？

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62404aab940c4b31a216055bdad2dfb0~tplv-k3u1fbpfcp-watermark.image?)

用普通话翻译一下上面的图
- 状态机开始处于初始状态
- 读取到 < 状态改变到 2
- 读取到字母 状态改变到 3
- 读取到 > 状态改变到 1
- 读取到字母 状态改变到 4 
- 状态 4 直到读取到 < ，状态改变到 2
- 读取到 / 状态改变到 5  
- 读取到字母，状态改变到 6
- 读取到 > 状态改变到 1

经历过上面的一圈后，我们就可以获得开始时说到的 Token 了


## 总结
有限状态机的状态是确定的，当我们进行状态转换时，我们可以实现动态的自动状态机。

当我们遇到了带流程的表单场景，或者我们需要处理类似红绿灯的情况时，我们就有了新的解决方案。

总体而言，使用有限状态机来管理页面的状态应该是前端状态管理的一个新思路。








