**既然是事件委托**

# 先解释事件：
**事件** 是某事发生的信号。所有的 DOM 节点都生成这样的信号（但事件不仅限于 DOM）。

包括鼠标事件，键盘事件，表单元素事件，css事件等。

### 事件对象

**浏览器会在事件发生的时候创建一个事件对象`event`，作为参数传入给处理函数**

事件对象的属性

- `event.type`事件类型
- `event.currentTarget`处理事件的元素。
- `event.clientX / event.clientY`指针事件（pointer event）的指针的窗口相对坐标。


# 再解释冒泡和捕获

## 冒泡
冒泡的原理很简单

**当一个事件发生在元素上，首先会执行当前元素上处理程序，然后执行他的父级元素上的处理程序，然后执行祖先上的处理程序**

这个过程就是冒泡

## event.target

父元素上的处理程序始终可以获取事件实际发生位置的详细信息。

**引发事件的那个嵌套层级最深的元素被称为目标元素,可以通过 `event.target` 访问。**

要注意的是this和event.target不是同一个东西

this指的是当前的元素，event.target不会改变，始终是引发事件的元素

## 捕获
事件处理的另一个阶段就是捕获

[DOM 事件](http://www.w3.org/TR/DOM-Level-3-Events/)标准描述了事件传播的 3 个阶段：

1.  捕获阶段（Capturing phase）—— 事件（从 Window）向下走近元素。
1.  目标阶段（Target phase）—— 事件到达目标元素。
1.  冒泡阶段（Bubbling phase）—— 事件从元素上开始冒泡。

那么怎么做到事件捕获的？

我们需要将处理程序的 `capture` 选项设置为 `true`


```js
elem.addEventListener(..., {capture: true}) 
// 或者，用 {capture: true} 的别名 "true" 
elem.addEventListener(..., true)
```
`capture` 选项有两个可能的值：

-   如果为 `false`（默认值），则在冒泡阶段设置处理程序。
-   如果为 `true`，则在捕获阶段设置处理程序。

## 小总结一下

当一个事件发生的时候，事件发生最深的元素被标记为“目标对象”`event.target`

- 事件从文档根节点向下移动到目标对象，期间执行捕获（`elem.addEventListener(..., true)`）的处理程序
- 触发目标元素的处理程序
- 然后冒泡到根，调用使用 `on<event>`、HTML 特性（attribute）和没有第三个参数的，或者第三个参数为 `false/{capture:false}` 的 `addEventListener` 分配的处理程序。


每个处理程序都可以访问event
- event.target——事件发生的最深元素
- event.currentTarget  ——事件发生的当前元素 
- event.eventPhase——事件发生的阶段

# 事件委托
事件捕获和冒泡可以让我们实现事件委托

这个想法是，如果我们有许多以类似方式处理的元素，那么就不必为每个元素分配一个处理程序 —— 而是将单个处理程序放在它们的共同祖先上。

在处理程序中，我们获取 `event.target` 以查看事件实际发生的位置并进行处理。

这些大家都知道或者百度下示例。。。


## 事件委托还有其他用途。

例如，我们想要编写一个有“保存”、“加载”和“搜索”等按钮的菜单。并且，这里有一个具有 `save`、`load` 和 `search` 等方法的对象。如何匹配它们？

第一个想法可能是为每个按钮分配一个单独的处理程序。但是有一个更优雅的解决方案。我们可以为整个菜单添加一个处理程序，并为具有方法调用的按钮添加 `data-action` 特性（attribute）：

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/71176f7efaaaf87fc9349ba3c6a769d9.png)
<!-- ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7d693eb7f964522974c2e956b3dce4c~tplv-k3u1fbpfcp-watermark.image?) -->

## 总结

事件委托非常的普遍，这是 DOM 事件最有用的模式之一。

它通常用于为许多相似的元素添加相同的处理，但不仅限于此。

算法：

1.  在容器（container）上放一个处理程序。
1.  在处理程序中 —— 检查源元素 `event.target`。
1.  如果事件发生在我们感兴趣的元素内，那么处理该事件。

好处：

-   简化初始化并节省内存：无需添加许多处理程序。
-   更少的代码：添加或移除元素时，无需添加/移除处理程序。
-   DOM 修改 ：我们可以使用 `innerHTML` 等，来批量添加/移除元素。

事件委托也有其局限性：

-   首先，事件必须冒泡。而有些事件不会冒泡。此外，低级别的处理程序不应该使用 `event.stopPropagation()`。
-   其次，委托可能会增加 CPU 负载，因为容器级别的处理程序会对容器中任意位置的事件做出反应，而不管我们是否对该事件感兴趣。但是，通常负载可以忽略不计，所以我们不考虑它。