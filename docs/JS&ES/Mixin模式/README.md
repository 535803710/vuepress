# Mixin 模式深度理解

> 前言，本文针对有一定基础的前端工程师，需要
>
> - 了解类的原理
> - 了解原型

## Mixin 是用来干什么

在 JavaScript 中我们只能继承单个对象，因为每个对象的 [[proptotype]] 属性只有一个，并且每个类只能扩展另一个类。

但是，有时我们想继承两个类的时候，该怎么做呢，比如：我们有一个 User 类，想要继承 Person 类和 Man 类，这时我们就需要使用 mixin 模式。

或者，我们有一个 User 类和一个 EventEmitter 类来实现事件生成（event generation），并且我们想将 EventEmitter 的功能添加到 User 中，以便我们的用户可以触发事件（emit event）。

这些使用 mixin 模式 对我们就很有帮助，或者你在使用 vue-class-component 的时候，有没有想过其中的 mixin 是怎么实现的呢？

这里是 [Mixin](https://developer.mozilla.org/zh-CN/docs/Glossary/Mixin) 在 MDN 上的解释，稍后我们总结一下其中的优缺点。

## 如何简单实现

在 JavaScript 中实现 mixin 最简单的方法就是创建一个有方法对象，然后与类上的原型合并。

```js
// mixin
let sayHiMixin = {
  sayHi() {
    alert(`Hello ${this.name}`);
  },
  sayBye() {
    alert(`Bye ${this.name}`);
  },
};

// 用法：
class User {
  constructor(name) {
    this.name = name;
  }
}

// 拷贝方法
Object.assign(User.prototype, sayHiMixin);

// 现在 User 可以打招呼了
new User("Dude").sayHi(); // Hello Dude!
```

上面的例子没有继承，其实继承也是一样的使用 mixin

```js
class User extends Person {
  // ...
}

Object.assign(User.prototype, sayHiMixin);
```

mixin 也可以内部继承

```js
let sayMixin = {
  say(phrase) {
    alert(phrase);
  },
};

let sayHiMixin = {
  __proto__: sayMixin, // (或者，我们可以在这使用 Object.setPrototypeOf 来设置原型)

  sayHi() {
    // 调用父类方法
    super.say(`Hello ${this.name}`); // (*)
  },
  sayBye() {
    super.say(`Bye ${this.name}`); // (*)
  },
};

class User {
  constructor(name) {
    this.name = name;
  }
}

// 拷贝方法
Object.assign(User.prototype, sayHiMixin);

// 现在 User 可以打招呼了
new User("Dude").sayHi(); // Hello Dude!
```

在 `(*)` 这一行，我们使用 super 调用了父类的方法，并且，此处一直会指向父类，不会因为 this 而改变。具体原理可以[参考这里](https://535803710.github.io/vuepress/JS&ES/%E5%8E%9F%E5%9E%8B%E5%92%8C%E5%8E%9F%E5%9E%8B%E9%93%BE/#homeobject-%E5%92%8C%E5%86%85%E9%83%A8%E6%8E%A2%E7%A9%B6)。

示意图如下

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6095c86ac6ca4a4ca8600712c9f2f933~tplv-k3u1fbpfcp-watermark.image?)

这是因为方法 sayHi 和 sayBye 最初是在 sayHiMixin 中创建的。因此，即使复制了它们，但是它们的 [[HomeObject]] 内部属性仍引用的是 sayHiMixin，如上图所示。

当 super 在 [[HomeObject]].[[Prototype]] 中寻找父方法时，意味着它搜索的是 sayHiMixin.[[Prototype]]，而不是 User.[[Prototype]]。

## 使用 EventMixin 实现发布订阅

前端中很常见的一个设计模式就是发布订阅，而我们可以实现一个 EventMixin 来帮助我们实现发布订阅模式，使我们能够轻松地将与事件相关的函数添加到任意 class/object 中。

- .trigger(name, [...data]) 方法，以在发生重要的事情时“生成一个事件”。name 参数（arguments）是事件的名称，[...data] 是可选的带有事件数据的其他参数（arguments）。
- .on(name, handler) 方法，它为具有给定名称的事件添加了 handler 函数作为监听器（listener）。当具有给定 name 的事件触发时将调用该方法，并从 .trigger 调用中获取参数（arguments）。
- .off(name, handler) 方法，它会删除 handler 监听器（listener）。

当一个菜单项被选中时，menu 可以生成 "select" 事件，其他对象可以分配处理程序以对该事件作出反应。诸如此类。

```js
let eventMixin = {
  /**
   * 订阅事件，用法：
   *  menu.on('select', function(item) { ... }
   */
  on(eventName, handler) {
    if (!this._eventHandlers) this._eventHandlers = {};
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = [];
    }
    this._eventHandlers[eventName].push(handler);
  },

  /**
   * 取消订阅，用法：
   *  menu.off('select', handler)
   */
  off(eventName, handler) {
    let handlers = this._eventHandlers?.[eventName];
    if (!handlers) return;
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1);
      }
    }
  },

  /**
   * 生成具有给定名称和数据的事件
   *  this.trigger('select', data1, data2);
   */
  trigger(eventName, ...args) {
    if (!this._eventHandlers?.[eventName]) {
      return; // 该事件名称没有对应的事件处理程序（handler）
    }

    // 调用事件处理程序（handler）
    this._eventHandlers[eventName].forEach((handler) =>
      handler.apply(this, args)
    );
  },
};
```

- `.on(eventName, handler)` — 指定函数 `handler` 以在具有对应名称的事件发生时运行。实现的话有一个用于存储每个事件名称对应的处理程序（handler）的 `_eventHandlers` 对象 ，将这个 `handler` 添加到列表中。
- `.off(eventName, handler)` — 从处理程序列表中删除指定的函数。
- `.trigger(eventName, ...args) `— 生成事件：所有 `_eventHandlers[eventName]` 中的事件处理程序（`handler`）都被调用，并且 `...args` 会被作为参数传递给它们。

### 使用方法

```js
// 创建一个 class
class Menu {
  choose(value) {
    this.trigger("select", value);
  }
}
// 添加带有事件相关方法的 mixin
Object.assign(Menu.prototype, eventMixin);

let menu = new Menu();

// 添加一个事件处理程序（handler），在被选择时被调用：
menu.on("select", (value) => alert(`Value selected: ${value}`));

// 触发事件 => 运行上述的事件处理程序（handler）并显示：
// 被选中的值：123
menu.choose("123");
```
现在，如果我们希望任何代码对菜单选择作出反应，我们可以使用 menu.on(...) 进行监听。

使用 eventMixin 可以轻松地将此类行为添加到我们想要的多个类中，并且不会影响继承链。

## 总结

在 JavaScript 中是单继承，所以可以通过将方法拷贝到原型中来实现 mixin。

我们可以使用 mixin 来扩充类的方法。

优点: 可用于简化多个接口需要包含相同的方法何与属性的 API 的设计。
缺点: 命名会冲突，不太好阅读
