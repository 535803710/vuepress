# 阻止默认事件

许多事件会自动触发浏览器执行某些行为。

例如：

- 点击一个链接 —— 触发导航（navigation）到该 URL。
- 点击表单的提交按钮 —— 触发提交到服务器的行为。
- 在文本上按下鼠标按钮并移动 —— 选中文本。

如果我们处理一个事件的时候，我们通常不会希望浏览器的默认事件发生，因此我们需要阻止默认事件，并且实现其他行为进行替代。

## 阻止浏览器行为

有两种方式来告诉浏览器我们不希望它执行默认行为：

主流的方式是使用 `event` 对象。有一个 `event.preventDefault()` 方法。
如果处理程序是使用 `on<event>`（而不是 `addEventListener`）分配的，那返回 `false` 也同样有效。

```html
<a href="/" onclick="return false">Click here</a>
<!-- or -->
<a href="/" onclick="event.preventDefault()">here</a>
```

点击链接不会触发导航（navigation），浏览器不会执行任何操作.

⚠️ 从处理程序返回 `false` 是一个例外

> 事件处理程序返回的值通常会被忽略。
> 唯一的例外是从使用 on<event> 分配的处理程序中返回的 return false。
> 在所有其他情况下，return 值都会被忽略。并且，返回 true 没有意义。

某些事件会相互转化。如果我们阻止了第一个事件，那就没有第二个事件了。

例如，在 <input> 字段上的 `mousedown` 会导致在其中获得焦点，以及 `focus` 事件。如果我们阻止 `mousedown` 事件，在这就没有焦点了。

尝试点击下面的第一个 <input> —— 会发生 `focus` 事件。但是如果你点击第二个，则没有聚焦

```html
<input value="Focus works" onfocus="this.value=''" />
<input onmousedown="return false" onfocus="this.value=''" value="Click me" />
```

这是因为浏览器行为在 `mousedown` 上被取消。如果我们用另一种方式进行输入，则仍然可以进行聚焦。例如，可以使用 Tab 键从第一个输入切换到第二个输入。但鼠标点击则不行。

## 处理程序选项 “passive”

`addEventListener` 的可选项 `passive: true` 向浏览器发出信号，表明处理程序将不会调用 `preventDefault()`。

为什么需要这样做？主要是针对移动设备的一些情况

移动设备上会发生一些事件，例如 `touchmove`（当用户在屏幕上移动手指时），默认情况下会导致滚动，虽然可以使用处理程序的 `preventDefault()` 来阻止滚动。

但是，当浏览器检测到此类事件时，它必须首先处理所有处理程序，然后如果没有任何地方调用 preventDefault，则页面可以继续滚动。但这可能会导致 UI 中不必要的延迟和“抖动”。

**最佳实践**

`passive: true` 选项告诉浏览器，处理程序不会取消滚动。然后浏览器立即滚动页面以提供最大程度的流畅体验，并通过某种方式处理事件。

对于某些浏览器（Firefox，Chrome），默认情况下，`touchstart` 和 `touchmove` 事件的 `passive` 为 true。

## 实践

```html
<script>
  function handler() {
    alert("...");
    return false;
  }
</script>

<a href="https://baidu.com" onclick="handler()">go baidu</a>
```

上面这段代码还是会跳到百度，为什么呢？

当浏览器读取诸如 onclick 之类的 on\* 特性（attribute）时，浏览器会根据其内容创建对应的处理程序。

对于 onclick="handler()" 来说，函数是：

```js
function(event) {
  handler() // onclick 的内容
}
```

修复一下

```html
<a href="https://baidu.com" onclick="return handler()">go baidu</a>
```

或者

```js
<script>
  function handler(event) {
    alert("...");
    event.preventDefault();
  }
</script>
```

## 总结

有很多默认的浏览器行为：

- `mousedown` —— 开始选择（移动鼠标进行选择）。
- 在` <input type="checkbox">` 上的 click —— 选中/取消选中的 input。
- `submit` —— 点击 `<input type="submit">` 或者在表单字段中按下 `Enter` 键会触发该事件，之后浏览器将提交表单。
- `keydown` —— 按下一个按键会导致将字符添加到字段，或者触发其他行为。
- `contextmenu` —— 事件发生在鼠标右键单击时，触发的行为是显示浏览器上下文菜单。
  ……还有更多……
  如果我们只想通过 `JavaScript` 来处理事件，那么所有默认行为都是可以被阻止的。

想要阻止默认行为 —— 可以使用 `event.preventDefault()` 或 `return false`。**第二个方法只适用于通过 on<event> 分配的处理程序。**

`addEventListener` 的 `passive: true` 选项告诉浏览器该行为不会被阻止。这对于某些移动端的事件（像 `touchstart` 和 `touchmove`）很有用，用以告诉浏览器在滚动之前不应等待所有处理程序完成。

如果默认行为被阻止，`event.defaultPrevented` 的值会变成 true，否则为 false。
