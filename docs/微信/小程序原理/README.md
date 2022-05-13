## 目录
- [目录](#目录)
- [双线程架构](#双线程架构)
  - [小程序的双线程架构设计。](#小程序的双线程架构设计)
    - [webview 是什么？](#webview-是什么)
  - [双线程对比单线程的优势在哪里。](#双线程对比单线程的优势在哪里)
  - [Native 层在双线程架构中起到怎样的作用。](#native-层在双线程架构中起到怎样的作用)
  - [如何解决传统 h5 的安全管控问题](#如何解决传统-h5-的安全管控问题)
- [WXML 标签语言设计](#wxml-标签语言设计)
  - [WXML 语法设计思路](#wxml-语法设计思路)
  - [WXSS 语法概念](#wxss-语法概念)
- [PageFrame 实现快速渲染](#pageframe-实现快速渲染)
- [小程序组件系统 Exparser 设计原理](#小程序组件系统-exparser-设计原理)
  - [WebComponent 原理](#webcomponent-原理)
    - [Custom Elements 规范](#custom-elements-规范)
    - [Template 规范](#template-规范)
    - [Shadow DOM 规范](#shadow-dom-规范)
    - [Exparser 框架原理](#exparser-框架原理)
      - [内置组件](#内置组件)
      - [自定义组件](#自定义组件)
      - [组件间通信](#组件间通信)
- [WXSS 编译原理及动态适配](#wxss-编译原理及动态适配)
    - [rpx](#rpx)
  - [编译](#编译)
    - [设备信息](#设备信息)
    - [转换 rpx 部分](#转换-rpx-部分)
    - [setCssToHead 函数将样式插入到 head](#setcsstohead-函数将样式插入到-head)
- [VirtualDOM 渲染流程](#virtualdom-渲染流程)
- [事件系统和通讯系统](#事件系统和通讯系统)
  - [什么是事件？](#什么是事件)
  - [事件系统](#事件系统)
  - [通讯系统](#通讯系统)
- [逻辑语法和生命周期](#逻辑语法和生命周期)
  - [js 结构](#js-结构)
  - [生命周期](#生命周期)
- [小程序路由](#小程序路由)
- [扩展](#扩展)
## 双线程架构

### 小程序的双线程架构设计。

小程序渲染层和逻辑层分别由两个线程控制，渲染层使用 `webview` 渲染，逻辑层使用 `JSCore` 运行 `JavaScript` 代码。

![双线程](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b29e220dcf3241a7aad242055c0f8b0c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

小程序逻辑层和渲染层分开运行，渲染层可以有多个 webview ，两个线程通过 Native 层统一处理。

#### webview 是什么？

简单来说 webview 是手机中内置了一款高性能 webkit 内核浏览器，在 SDK 中封装的一个组件。不过没有提供地址栏和导航栏，只是单纯的展示一个网页界面。

### 双线程对比单线程的优势在哪里。

运行速度大幅提升

原来的单线程会导致阻塞，加上请求的时间，所以需要缓存

### Native 层在双线程架构中起到怎样的作用。

微信将 `WXSDK` 通过 `Native` 层注入到双线程，需要的时候再动态注入。

`Native` 层除了做一些资源的动态注入，还负责着很多的事情，请求的转发，离线存储，组件渲染等等。界面主要由成熟的 `Web` 技术渲染，辅之以大量的接口提供丰富的客户端原生能力。同时，每个小程序页面都是用不同的 `WebView` 去渲染，这样可以提供更好的交互体验，更贴近原生体验，也避免了单个 `WebView` 的任务过于繁重。

### 如何解决传统 h5 的安全管控问题

因为原生的 js 非常灵活，所以要避免直接获取小程序的内部

所以需要一个沙盒来隔离浏览器和逻辑层。在客户端有 `javaScript 的解释引擎`，可以单独建一个线程去执行 `JavaScript` 代码。然后渲染层渲染多个 `webview` 通过这个逻辑层去控制 `webview` 的渲染。

## WXML 标签语言设计

### WXML 语法设计思路

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53f097976ab64d8e940fd61144ebdafd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)
通过 `Exparser框架` 将小程序的 WXML 转换为 `webComponents` 的自定义标签。 将上图转化为下图
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d16937a3e0045efbfabcfd4894fd3dc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

> 因为 html 可以通过脚本来改变，为了安全需要将 webComponents 转成自定义标签

### WXSS 语法概念

`WXSS` (WeiXin Style Sheets)是一套样式语言，用于描述 WXML 的组件样式。 先看一下代码中的 wxss 文件结构及语法。

同时最重要的是将单位按照像素比转换，不需要再做适配了。

> wxss 会编译为 js 然后再 html 中执行

## PageFrame 实现快速渲染

小程序每个视图层页面内容都是通过 pageframe.html 模板来生成的，包括小程序启动的首页；下面来看看小程序为快速打开小程序页面做的技术优化：

- 首页启动时，即第一次通过 pageframe.html 生成内容后，后台服务会缓存 pageframe.html 模板首次生成的 html 内容。
- 非首次新打开页面时，页面请求的 pageframe.html 内容直接走后台缓存
- 非首次新打开页面时，pageframe.html 页面引入的外链 js 资源(如上图所示)走本地缓存

这样在后续新打开页面时，都会走缓存的 pageframe 的内容，避免重复生成，快速打开一个新页面。

## 小程序组件系统 Exparser 设计原理

### WebComponent 原理

所有的自定义元素都继承自 window 内置的 HTML 类 `HTMLElement`

#### Custom Elements 规范

- 自定义元素的名称，必须包含短横线（-）。它可以确保 html 解析器能够区分常规元素和自定义元素，还能确保 html 标记的兼容性。
- 自定义元素只能一次定义一个，一旦定义无法撤回。
- 自定义元素不能单标记封闭。比如`<custom-component />`，必须写一对开闭标记。比如 `<custom-coponent></custom-component>`。

对于自定义组件挂载的相关 API：

- window.customElement.define('custom-component', CustomComponent, extendsInit) // 定义一个自定义元素
- window.customElement.get('custom-component') // 返回已定义的自定义元素的构造函数
- window.customElement.whenDefined('custom-component') // 接收一个 promise 对象，是当定义自定义元素时返回的，可监听元素状态变化但无法捕捉内部状态值。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf9bad534b0c4068940193ffd8a2de0c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

#### Template 规范

[点击这里](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/template)

HTML templates（HTML 模板）： `<template> `和` <slot>` 元素使您可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。

#### Shadow DOM 规范

Web components 的一个重要属性是封装——可以将标记结构、样式和行为隐藏起来，并与页面上的其他代码相隔离，保证不同的部分不会混在一起，可使代码更加干净、整洁。其中，Shadow DOM 接口是关键所在，它可以将一个隐藏的、独立的 DOM 附加到一个元素上。本篇文章将会介绍 Shadow DOM 的基础使用。
![](https://mdn.mozillademos.org/files/15788/shadow-dom.png)

注意，不管从哪个方面来看，Shadow DOM 都不是一个新事物——在过去的很长一段时间里，浏览器用它来封装一些元素的内部结构。以一个有着默认播放控制按钮的 `<video>` 元素为例。你所能看到的只是一个 `<video>` 标签，实际上，在它的 Shadow DOM 中，包含了一系列的按钮和其他控制器。Shadow DOM 标准允许你为你自己的元素（custom element）维护一组 Shadow DOM。

[基本使用](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95)

#### Exparser 框架原理

Exparser 是微信小程序的组件组织框架，内置在小程序基础库中，为小程序提供各种各样的组件支撑。内置组件和自定义组件都有 Exparser 组织管理。

Exparser 参照 Shadow DOM 模型实现，并且进行了一些修改。

Exparser 的组件模型与 WebComponents 标准中的 Shadow DOM 高度相似。Exparser 会维护整个页面的节点树相关信息，包括节点的属性、事件绑定等，相当于一个简化版的 Shadow DOM 实现。Exparser 的主要特点包括以下几点：

- 基于 Shadow DOM 模型：模型上与 WebComponents 的 Shadow DOM 高度相似，但不依赖浏览器的- 原生支持，也没有其他依赖库；实现时，还针对性地增加了其他 API 以支持小程序组件编程。
- 可在纯 JS 环境中运行：这意味着逻辑层也具有一定的组件树组织能力。
- 高效轻量：性能表现好，在组件实例极多的环境下表现尤其优异，同时代码尺寸也较小。

##### 内置组件

把一个组件内置到小程序框架里的一个重要原则是：这个组件是基础的。换句话说，没有这个组件的话，在小程序架构里无法实现或者实现不好某类功能。

比如像一些开放类组件，有 open-data 组件提供展示群名称、用户信息等微信体系下的隐私信息，有 button 组件里 open-type 属性所提供分享、跳转 App 等敏感操作的能力。

**js 动画问题**，如果是纯 css 动画是在视图层进行，如果是 js 动画，逻辑层和视图层分开，通讯非常频繁，性能很大的损耗，所以微信开放了一个 `<WXS>`，让渲染层写 js 逻辑，避免线程直线的通讯导致性能和延时问题

##### 自定义组件

在自定义组件的概念基础上，我们可以把所有组件都进行分离，这样，各个组件也将具有各自独立的逻辑空间。每个组件都分别拥有自己的独立的数据、setData 调用。

整个页面节点树实质上被拆分成了若干个 ShadowTree（页面的 body 实质上也是一个组件，因而也是一个 ShadowTree）最终组成了小程序中的 Composed Tree。

在这个时候可以看一下官方的这句话，就非常好理解了。

> 小程序中，所有节点树相关的操作都依赖于 Exparser，包括 WXML 到页面最终节点树的构建、createSelectorQuery 调用和自定义组件特性等。

##### 组件间通信

Exparser 的事件系统完全模仿 Shadow DOM 的事件系统。在通常的理解中，事件可以分为冒泡事件和非冒泡事件，但在 Shadow DOM 体系中，冒泡事件还可以划分为在 Shadow Tree 上冒泡的事件和在 Composed Tree 上冒泡的事件。如果在 Shadow Tree 上冒泡，则冒泡只会经过这个组件 Shadow Tree 上的节点，这样可以有效控制事件冒泡经过的范围。

在自定义组件中使用 triggerEvent 触发事件时，可以指定事件的 bubbles、composed 和 capturePhase 属性，用于标注事件的冒泡性质。这一点和前面讲的自定义事件相互呼应，triggerEvent 可以理解为小程序中的自定义事件 [createEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createEvent) 。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8337ac81330416b92258ec86239e605~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

## WXSS 编译原理及动态适配

本章节内容分解：

- WXSS 语法解析
- WXSS 编译原理
- WXSS 动态适配设计

与 CSS 相比，WXSS 扩展的特性有：尺寸单位和样式导入两个方面，我们最为熟悉的就是尺寸单位 rpx。

#### rpx

rpx （responsive pixel）直译为：响应像素。写过小程序的都知道这个单位，可以自动适配所有大小的屏幕，而不必使用一些第三方插件进行响应式布局。

通常我们开发移动端 Web 的时候，总会遇到像素点适配问题，其中就存在布局问题，曾经我们为了做一些响应式的布局，引入 REM，VW 等，或者工程化之后使用 px2remvw,这样的自动转化插件。而小程序的适配方案则为 rpx。我们继续分析。

### 编译

WXSS 并不可以直接执行在 webview 层进行渲染，而是通过了一层编译。

wxss 会先被编译为 js 文件

分三个部分看

#### 设备信息

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a869ebcf8aed435cb1a054b210faafed~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

#### 转换 rpx 部分

```js
var eps = 1e-4;
var transformRPX =
  window.__transformRpx__ ||
  function (number, newDeviceWidth) {
    if (number === 0) return 0;
    number = (number / BASE_DEVICE_WIDTH) * (newDeviceWidth || deviceWidth);
    number = Math.floor(number + eps);
    if (number === 0) {
      if (deviceDPR === 1 || !isIOS) {
        return 1;
      } else {
        return 0.5;
      }
    }
    return number;
  };
```

最主要是这两行

```js
number = (number / BASE_DEVICE_WIDTH) * (newDeviceWidth || deviceWidth);
number = Math.floor(number + eps);
```

#### setCssToHead 函数将样式插入到 head

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/411a61d797ce465c8bdd126ab4bbe6fc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)
主要功能
将 wxss 的文件内容数据结构改变，方便 `makeup` 组装，将有 rpx 单位的数据改成[0,20] 这样。transformRPX 转换 。

**makeup 组装之后，创建`<style>`标记，插入到`<head>`中。**

在渲染层中使用 `eval` 方法执行上面编译后的 js 文件，然后插入到 head 中
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7133062a9b514d169a52cdc6803f35e2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

## VirtualDOM 渲染流程

和 WXSS 一样，生成一下 wxml.js

可以看到主体就一个函数 `$gwx`,作用是生成 虚拟 dom 树，用于渲染真实节点。

编译后的 WXML 文件以 js 的形式插入到渲染层的 `<script>` 标签

然后找到执行的位置 看到传入的是路径

```js
var decodeName = decodeURI("./pages/index/index.wxml");
var generateFunc = $gwx(decodeName);
```

返回的是 generateFunc()

generateFunc() 执行的时候需要动态注入数据，生成 DOM 树
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/003c00d6dbbe43a4818173661db53a40~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

## 事件系统和通讯系统

### 什么是事件？

- 事件是视图层到逻辑层的通讯方式。
- 事件可以将用户的行为反馈到逻辑层进行处理。
- 事件可以绑定在组件上，当达到触发事件，就会执行逻辑层中对应的事件处理函数。
- 事件对象可以携带额外信息，如 id, dataset, touches。

事件可以绑定在组件上，在 Exparser 组件系统章节的时候我们讲解到了 Shadow DOM 的事件系统。

### 事件系统

WXML 需要处理成 HTML 结构在可以完成事件绑定

底层基础库中 `applyProperties` 解析 `virtualDom` ,`attr属性解析，包括事件解析，`
解析到 `attr` 属性名后，对其通过 `addListener` 进行事件绑定，将 `tap` 与原生 `click` 之间映射， `addListener` 的事件触发的回调函数中组装了函数的 event 信息值，并且触发了 `sendData` 方法。

这样的话只要 tap 事件触发的话，就会调用这个回调方法。

到这步流程
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea3bd75174b042baac4641bf44841d4c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

小程序的事件都是和 js 原生事件相互转换，小程序的 tap 底层是 mouseup 事件转换来

分为几个过程：
为 window 绑定捕获阶段的 mouseuop 事件

- 包括返回一些坐标信息、目标元素信息。
- 创建一个 exparser 事件

函数 C 的返回值触发目标元素的 exparser 事件，通过 exparser.Event.dispatchEvent 方法，执行这个方法就会走 exparser 事件系统的流程。看到这里忘了的可以回顾一下 exparser 组件系统章节。

流程如下
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b58e0e358c4340688f3f16fbef30158c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

### 通讯系统

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2eb7e12a87f145d19a016e2bb9f503b5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

可以看到 sendData 并不是直接指向逻辑层的（也就是 Event 这两条线）。小程序逻辑层和渲染层的通信会由 `Native` （微信客户端）做中转，逻辑层发送网络请求也经由 `Native` 转发。

在微信小程序执行过程中， `Native` 层，也就是客户端层分别向渲染层与逻辑层注入 `WeixinJSBridge` 以达到线程通讯的目的，前面章节中在分析渲染层结构和逻辑层结构中我们也都看到了其中`WeixinJSBridge`的`<script>`标记注入

## 逻辑语法和生命周期

### js 结构

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cac8fa64eb484336b7b3b88ead5807da~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

data 和 view 相互绑定，WXML 中的动态数据就是 data，使用 setData 改变 data

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/353ba899cbf647b49b61f2040703089b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

两个线程同时进行，渲染层完成初始化后通知逻辑层，逻辑层完成初始化返回初始 Data

### 生命周期

生命周期也是挂在在 data 同一级。
配合整体架构图来看一下生命周期。
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce58a08a0adf4f71991792d45428cb0e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

小程序的每个页面都是一个 webview 实例，但是逻辑层中只有一个 APP 实例，所有页面的逻辑都在一个逻辑线程中执行。

## 小程序路由

回顾一下小程序页面加载的原理，如果我们跳转到一个新页面，那么在渲染层中会插入一个 webview，渲染层中可以有多个 webview。

这样类似多页面，保留上一个页面的状态，这里对于 webview 的添加或删除都会有一个载体来维护，这就是路由栈。

![打开页面的路由内部流程](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d21182563a546e983f869c59975c788~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)
打开页面的路由内部流程

## 扩展

[小程序硬件框架](https://developers.weixin.qq.com/doc/oplatform/Miniprogram_Frame/)
