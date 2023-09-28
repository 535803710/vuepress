
# 性能优化

## 指标
### 真实指标
- [First Contentful Paint (FCP) ](https://web.dev/fcp/) —— 页面上的任何内容渲染完成的时间
- [Largest Contentful Paint(LCP)](https://web.dev/lcp/) —— 指的是页面首次开始加载的时间开始到可视区域内最大图像或文本完成的渲染时间
- [First Input Delay(FID)](https://web.dev/fid/) —— 测量用户第一次与页面交互直到浏览器做出响应，并能开始处理事件经过的时间
- [Cumulative Layout Shift(CLS)](https://web.dev/cls/) —— 布局发生偏移

### 实验室指标
- [Total Blocking Time(TBT)](https://web.dev/tbt/) —— 指的是FCP(首次内容绘制)与TTI(可交互时间)之前的总时间
- [Time to Interactive(TTI)](https://web.dev/tti/) —— TTI 指标测量页面从开始加载到完成渲染，并且能够响应用户交互的时间。

## 评估工具
- Chrome DevTools
- LightHouse
- PageSpeed Insights
- WebPageTest

## 优化方案

### 压缩
- 代码压缩  [UglifyJS](https://github.com/mishoo/UglifyJS)
- 文本压缩（gzip，Brotli，ZopFli）
- [Tree-shaking](https://webpack.docschina.org/guides/tree-shaking/)
- [Code-splitting(代码分离)](https://webpack.docschina.org/guides/code-splitting/)
  >常用的代码分离方法有三种：
  - 入口起点：使用 entry 配置手动地分离代码。
  - 防止重复：使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk。
  - 动态导入：通过模块的内联函数调用来分离代码。
### 图片优化
- 小图优化（css sprite、iconfont、dataURl、svg）
- 压缩
- 图片格式
- 响应式

### 加载策略
- 懒加载
- [预请求 Prefetching](../预请求策略/README.md)
- DNS预解析、预加载、预渲染
- 离线化（[serviceWorker](https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorker)、AppCache、离线包）
- [HTTP缓存](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching)
- 数据缓存（localStorage，sessionStorage）
- 资源加载（顺序、位置、异步）[async,defer](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script)
- 请求合并
- HTTP2
- CDN
- 服务端渲染

### 执行渲染
- CSS代码优化（选择器、启用GPU、避免表达式）
- 使用requestAnimationFrame实现视觉变化 动画
- 降低复杂度或使用 Web Worker （service worker 基于web worker，浏览器与服务器间的代理服务器 异步）
- 避免大型、复杂的布局和布局抖动（CLS）
- 输入程序防抖
- 简化绘制复杂度、减少绘制区域

### 感官体验优化
- 骨架屏
- Snapshot
- Loading
