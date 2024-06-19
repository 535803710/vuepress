# 浏览器渲染

1. URL 解析和 DNS 查询
   URL 解析：浏览器解析用户输入的 URL，提取协议（如 HTTP、HTTPS）、域名、端口号（如果有）和路径等信息。
   DNS 查询：浏览器通过 DNS（域名系统）服务器将域名解析为 IP 地址。浏览器首先检查本地缓存，如果没有找到，就向 DNS 服务器发送查询请求。
2. 建立连接
   TCP 连接：使用 IP 地址，浏览器与目标服务器建立 TCP 连接。这个过程包括三次握手（三次握手确保客户端和服务器双方都准备好发送和接收数据）。
   TLS 握手：如果使用 HTTPS 协议，浏览器和服务器之间会进行 TLS 握手来建立加密连接，确保数据传输的安全性。
3. 发送 HTTP 请求
   发送请求：建立连接后，浏览器发送 HTTP 请求到服务器，请求资源（如 HTML 文档、CSS 文件、JavaScript 文件、图片等）。
   请求头：请求包含各种头信息（如用户代理、接受的内容类型、Cookie 等），帮助服务器处理请求。
4. 服务器处理请求
   服务器响应：服务器处理请求，生成响应。响应包含状态码（如 200 成功、404 未找到、500 服务器错误等）和响应头，以及请求的资源（如 HTML 内容）。
5. 浏览器接收响应
   接收响应：浏览器接收服务器的响应，并检查响应状态码。如果状态码是 200，浏览器开始处理响应内容。
6. [渲染过程](#浏览器接收到-html-文件并转换为-dom-树)
   解析 HTML：浏览器开始解析 HTML 文档，构建 DOM 树（Document Object Model）。HTML 标签被转换为 DOM 树中的节点。
   解析 CSS：浏览器解析 CSS 文件和内联样式，构建 CSSOM 树（CSS Object Model），并应用样式到相应的 DOM 节点。
   处理 JavaScript：浏览器解析并执行 JavaScript 代码。JavaScript 可能会操作 DOM 和 CSSOM，动态修改页面内容和样式。
7. 布局和绘制
   布局（Reflow）：浏览器根据 DOM 和 CSSOM 计算各个元素的几何信息（位置和尺寸），生成布局树。
   绘制（Painting）：浏览器将布局树中的各个节点绘制到屏幕上。这个过程涉及将每个节点的样式和内容转换为像素，并在浏览器窗口中显示出来。
8. 交互和更新
   事件处理：浏览器处理用户交互（如点击、输入、滚动等）和其他事件（如定时器、网络请求完成等），并根据事件更新页面内容。
   重绘和重排：如果 JavaScript 或 CSS 动画改变了页面内容或布局，浏览器可能需要重新计算布局（重排）并重新绘制页面（重绘）。

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
