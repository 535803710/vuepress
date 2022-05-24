# 浏览器渲染

## 浏览器接收到 HTML 文件并转换为 DOM 树

1. 获取字节数据解析成字符串

2. 字符串 会通过 **标记化** 将字符串转为 **标记（Token）** ，`HTML` 就是超文本标记语言。
   标记是什么？字符串，构成代码的最小单位
   ![](https://kekeon.github.io/front-end-interview/13-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86_files/167540a7b5cef612)

3. 标记转化为 `Node`。
   ![](https://kekeon.github.io/front-end-interview/13-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86_files/1675416cbea98c3c)
4. `Node` 转化为 `DOM` 树

## 将 CSS 文件转化为 CSSOM 树

过程和渲染 DOM 树过程类似
![](https://kekeon.github.io/front-end-interview/13-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86_files/167542a9af5f193f)

不要写过于具体的 CSS 选择器 因为会递归 CSSOM ，不要添加 无意义的 HTML 标记

## 生成渲染树

![](https://kekeon.github.io/front-end-interview/13-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86_files/16754488529c48bd)

渲染树只包括需要显示的节点。如果是 `display:none` 则不会在渲染树中。

生成渲染树后会进行布局（回流），GPU 绘制，合成图层，显示在屏幕。

## 为什么操作 DOM 慢

DOM 是渲染引擎的东西，JS 是 JS 引擎的东西，操作 DOM 的时候涉及了两个线程的通讯

> 经典面试题：插入几万个 DOM，如何实现页面不卡顿？

解决问题的重点应该是如何分批次部分渲染 DOM。大部分人应该可以想到通过 requestAnimationFrame 的方式去循环的插入 DOM，其实还有种方式去解决这个问题：虚拟滚动（virtualized scroller）。

这种技术的原理就是只渲染可视区域内的内容，非可见区域的那就完全不渲染了，当用户在滚动的时候就实时去替换渲染的内容。

![](https://kekeon.github.io/front-end-interview/13-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86_files/167b1c6887ecbba7)

从上图中我们可以发现，即使列表很长，但是渲染的 DOM 元素永远只有那么几个，当我们滚动页面的时候就会实时去更新 DOM，这个技术就能顺利解决这道经典面试题。

## 阻塞渲染的情况

解析 script 的时候

- 可以加上 defer 并行下载

- 没有依赖的 JS 文件，加上 async ，表示文件下载和解析不会阻塞。

## 重绘和回流

- 重绘不会改变布局，比如改变 color
- 回流会改变布局和几何属性

回流必定重绘，重绘不定回流，回流成本高

与 EventLoop 有关

1. Eventloop 执行 Microtasks 后，会看 document 是否需要更新，浏览器刷新率 60Hz，每 16.6ms 更新。
2. 判断 resize 和 scroll 事件，所以自带节流，每 16ms 更新
3. 判断是否触发了 media query 自适应媒体查询
4. 更新动画并且发送事件
5. 判断是否有全屏操作事件
6. 执行 requestAnimationFrame 回调
7. 执行 IntersectionObserver 回调，懒加载用
8. 更新页面
9. 一帧会最的事，有空闲执行 requestIdleCallback 回调。

### 减少重绘和回流

- 使用 visibility 替换 display: none ，因为前者只会引起重绘，后者会引发回流
- 不把节点属性放在循环里
- 不使用 table 布局，小改动会重新布局
- 使用 requestAnimationFrame
- CSS 选择符从右往左匹配查找，避免节点层级过多
- 将频繁重绘或者回流的节点设置为图层，可以使用下面方法
  - will-change
  - video、iframe 标签
