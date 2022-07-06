# 拖放

拖放是一个很常用且方便的界面解决方案。取某件东西并将其拖放是执行许多东西的一种简单明了的方式，比如从文件管理器中拖拽上传或者复制，粘贴。或者将商品拖放到购物车。

在 HTML 中，我们实现拖放会用到一些特殊事件，包括例如 dragstart 和 dragend 等。

这些事件使我们能够支持特殊类型的拖放，例如处理从 OS 文件管理器中拖动文件，并将其拖放到浏览器窗口中。之后，JavaScript 便可以访问此类文件中的内容。

但是，原生的拖放事件也有其局限性。例如，我们无法阻止从特定区域的拖动。而且，移动设备对此类事件的支持非常有限。

现在我们看一下怎么在浏览器上实现拖放。

## 实现

### 先让元素可以拖放

1. 在 mousedown 上 —— 根据需要准备要移动的元素（也许创建一个它的副本，向其中添加一个类或其他任何东西）。
2. 然后在 mousemove 上，通过更改 position:absolute 情况下的 left/top 来移动它。
3. 在 mouseup 上 —— 执行与完成的拖放相关的所有行为。

```js
ball.onmousedown = function (event) {
  // (1) 准备移动：确保 absolute，并通过设置 z-index 以确保球在顶部
  ball.style.position = "absolute";
  ball.style.zIndex = 1000;

  // 将其从当前父元素中直接移动到 body 中
  // 以使其定位是相对于 body 的
  document.body.append(ball);

  // 现在球的中心在 (pageX, pageY) 坐标上
  function moveAt(pageX, pageY) {
    ball.style.left = pageX - ball.offsetWidth / 2 + "px";
    ball.style.top = pageY - ball.offsetHeight / 2 + "px";
  }

  // 将我们绝对定位的球移到指针下方
  moveAt(event.pageX, event.pageY);

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // (2) 在 mousemove 事件上移动球
  document.addEventListener("mousemove", onMouseMove);

  // (3) 放下球，并移除不需要的处理程序
  ball.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    ball.onmouseup = null;
  };
};
```

如果运行会发现，拖放的开始时候有些问题，这是因为浏览器对图片有自己的默认操作，我们需要将其屏蔽。
![拖放2.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38721882687a4d12995de15b4981cfcf~tplv-k3u1fbpfcp-watermark.image?)

```js
ball.ondragstart = function () {
  return false;
};
```

另一个重要的方面是 —— 我们在 document 上跟踪 mousemove，而不是在 ball 上。乍一看，鼠标似乎总是在球的上方，我们可以将 mousemove 放在球上。

但正如我们所记得的那样，mousemove 会经常被触发，但是浏览器会有自己的防抖，所以不是所有像素都会触发。因此，在快速移动鼠标后，鼠标指针可能会从球上跳转至文档中间的某个位置（甚至跳转至窗口外）。

因此，我们应该监听 document 以捕获它。

### 修正球的位置

在点击后 我们看到球会跳动一下，将位置变为正中间，但是我们如何让鼠标保持在一开始按住的位置上呢？

1. 当访问者按下按钮（mousedown）时 —— 我们可以在变量 shiftX/shiftY 中记住鼠标指针到球左上角的距离。我们应该在拖动时保持这个距离。

我们可以通过坐标相减来获取这个偏移：

```js
// onmousedown
let shiftX = event.clientX - ball.getBoundingClientRect().left;
let shiftY = event.clientY - ball.getBoundingClientRect().top;
```

2. 然后，在拖动球时，我们将鼠标指针相对于球的这个偏移也考虑在内，像这样：

```js
// onmousemove
// 球具有 position: absolute
ball.style.left = event.pageX - shiftX + "px";
ball.style.top = event.pageY - shiftY + "px";
```

![拖放3.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2814f5b83d2d43f69572c6c50534e223~tplv-k3u1fbpfcp-watermark.image?)

### 拖动到对应位置的提示

通常，我们将元素拖放到另一个元素上会有一些提示。比如将文件拖放到可以上传的位置。

我们需要知道：

- 在拖放结束时，所拖动的元素要放在哪里 —— 执行相应的行为
- 并且，最好知道我们所拖动到的 “droppable” 的元素的位置，并高亮显示 “droppable” 的元素。

可能我们第一时间想到的是 `onmouseover/mouseup`来做处理。但其实这是不行的。这是因为的那个我们拖动时，鼠标始终会放在最顶层的元素上，而无法触发下面的元素的事件。

就像这样 ，红色完全覆盖到蓝色上面 ，就无法触发到蓝色的事件。

```js
<style>
  div {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 0;
  }
</style>
<div style="background:blue" onmouseover="alert('never works')"></div>
<div style="background:red" onmouseover="alert('over red!')"></div>
```

![拖放4.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d72924481014a9cb49777d753c4efd5~tplv-k3u1fbpfcp-watermark.image?)

所以我们需要使用另外一个方法 `document.elementFromPoint(clientX, clientY)`，这个方法我们可以知道坐标下面的元素，如果有多个元素返回最上面的。

再配合我们先将 ball 隐藏。实现如下

```js
// 在一个鼠标事件处理程序中
ball.hidden = true; // (*) 隐藏我们拖动的元素

let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
// elemBelow 是球下方的元素，可能是 droppable 的元素

ball.hidden = false;
```

注意 `(*)` 行，先隐藏求，不然我们拿不到下面的元素，就和原来一样，最顶部的元素：`elemBelow=ball`。

然后我们就可以检查我们鼠标划过的是什么元素了。扩展代码如下。

```js
// 我们当前正在划过的潜在的 droppable 的元素
let currentDroppable = null;

function onMouseMove(event) {
  moveAt(event.pageX, event.pageY);

  ball.hidden = true;
  let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
  ball.hidden = false;

  // mousemove 事件可能会在窗口外被触发（当球被拖出屏幕时）
  // 如果 clientX/clientY 在窗口外，那么 elementfromPoint 会返回 null
  if (!elemBelow) return;

  // 潜在的 droppable 的元素被使用 "droppable" 类进行标记（也可以是其他逻辑）
  let droppableBelow = elemBelow.closest(".droppable");

  if (currentDroppable != droppableBelow) {
    // 我们正在划入或划出...
    // 注意：它们两个的值都可能为 null
    //   currentDroppable=null —— 如果我们在此事件之前，鼠标指针不是在一个 droppable 的元素上（例如空白处）
    //   droppableBelow=null —— 如果现在，在当前事件中，我们的鼠标指针不是在一个 droppable 的元素上

    if (currentDroppable) {
      // 处理“划出” droppable 的元素时的处理逻辑（移除高亮）
      leaveDroppable(currentDroppable);
    }
    currentDroppable = droppableBelow;
    if (currentDroppable) {
      // 处理“划入” droppable 的元素时的逻辑
      enterDroppable(currentDroppable);
    }
  }
}
```

呈现最后实现的效果。
![拖放5.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cccba264f571472ebbada982bf502cb5~tplv-k3u1fbpfcp-watermark.image?)



## 总结

我们考虑了一种基础的拖放算法。

关键部分：

- 事件流：`ball.mousedown` → `document.mousemove` → `ball.mouseup`（不要忘记取消原生 `ondragstart`）。
- 在拖动开始时 —— 记住鼠标指针相对于元素的初始偏移（shift）：`shiftX/shiftY`，并在拖动过程中保持它不变。
- 使用 `document.elementFromPoint` 检测鼠标指针下的 “droppable” 的元素。

我们可以在此基础上做很多事情。

- 在 mouseup 上，我们可以智能地完成放置（drop）：更改数据，移动元素。
- 我们可以高亮我们正在“划过”的元素。
- 我们可以将拖动限制在特定的区域或者方向。
- 我们可以对 mousedown/up 使用事件委托。一个大范围的用于检查 event.target 的事件处理程序可以管理数百个元素的拖放。
等。
