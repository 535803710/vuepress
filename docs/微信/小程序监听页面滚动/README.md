
在工作中我们经常遇到需要监听页面中元素位置，当元素超出显示区域或即将显示到页面上，我们就可以做一些动画或者操作。最常见的操作比如预加载，懒加载，TAB滚动跟随。

# 目录
- `Intersection Observer` 在MDN上的介绍
- 小程序中 `IntersectionObserver` 的使用

# 实现效果

![intersection.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55ef7f16a79d433fa2b10425a6c4bc51~tplv-k3u1fbpfcp-watermark.image?)


在浏览器的情况下，我们可以使用 `Intersection Observer`


# 下面是`Intersection Observer`在MDN上的介绍
[MDN链接](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)

`IntersectionObserver`**接口** (从属于[Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)) 提供了一种异步观察目标元素与其祖先元素或顶级文档视窗([viewport](https://developer.mozilla.org/zh-CN/docs/Glossary/Viewport))交叉状态的方法。祖先元素与视窗([viewport](https://developer.mozilla.org/zh-CN/docs/Glossary/Viewport))被称为**根(root)。**

当一个`IntersectionObserver`对象被创建时，其被配置为监听根中一段给定比例的可见区域。一旦IntersectionObserver被创建，则无法更改其配置，所以一个给定的观察者对象只能用来监听可见区域的特定变化值；然而，你可以在同一个观察者对象中配置监听多个目标元素。

**简单来说，就是我们能不能看到想要观察的对象。**

在网页中，我们很容易就可以用实现Intersection Observer，而在小程序中，我们需要再多掌握一点知识。


# IntersectionObserver
[小程序中`IntersectionObserver`的文档地址](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/IntersectionObserver.html)

IntersectionObserver 对象，用于推断某些节点是否可以被用户看见、有多大比例可以被用户看见。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60eff9d7e69b4859885c63ffca805a27~tplv-k3u1fbpfcp-watermark.image?)

## relativeToViewport
指定页面显示区域作为参照区域之一
```
Page({
  onLoad: function(){
    wx.createIntersectionObserver().relativeToViewport({bottom: 100}).observe('.target-class', (res) => {
      res.intersectionRatio // 相交区域占目标节点的布局区域的比例
      res.intersectionRect // 相交区域
      res.intersectionRect.left // 相交区域的左边界坐标
      res.intersectionRect.top // 相交区域的上边界坐标
      res.intersectionRect.width // 相交区域的宽度
      res.intersectionRect.height // 相交区域的高度
    })
  }
})
```

### 接受参数 Object margins

用来扩展（或收缩）参照节点布局区域的边界

| 属性     | 类型     | 默认值 | 必填 | 说明         |
| ------ | ------ | --- | -- | ---------- |
| left   | number |     | 否  | 节点布局区域的左边界 |
| right  | number |     | 否  | 节点布局区域的右边界 |
| top    | number |     | 否  | 节点布局区域的上边界 |
| bottom | number |     | 否  | 节点布局区域的下边界

## observe(string targetSelector, function callback)

##### 参数
(targetSelector:string，callback:function)

##### Object res

| 属性                 | 类型                   | 说明        |
| ------------------ | -------------------- | --------- |
| id                 | string               | 节点 ID     |
| dataset            | Record.<string, any> | 节点自定义数据属性 |
| intersectionRatio  | number               | 相交比例      |
| intersectionRect   | Object               | 相交区域的边界   |
| boundingClientRect | Object               | 目标边界      |
| relativeRect       | Object               | 参照区域的边界   |
| time               | number               | 相交检测时的时间戳

# 小程序中监听页面的其他方法
## [ page-meta](https://developers.weixin.qq.com/miniprogram/dev/component/page-meta.html)
页面属性配置节点，用于指定页面的一些属性、监听页面事件。只能是页面内的第一个节点。可以配合 `navigation-bar` 组件一同使用。

######

## [scroll-view](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html)
可滚动视图区域。使用竖向滚动时，需要给 `scroll-view`一个固定高度，通过 WXSS 设置 height。组件属性的长度单位默认为px。

######



# 总结
在小程序中，我们可以用 `IntersectionObserver` ，来监听页面的元素与页面交叉的距离，如此一来我们便可以在小程序中实现懒加载，预加载，动画等效果。

我们也可以用 `page-meta` 和 `scroll-view` 来实现滚动监听，具体需要结合实际场景。
