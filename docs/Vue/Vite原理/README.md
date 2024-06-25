# 什么是 Vite

基于 esbuild 与 Rollup，依靠浏览器自身 ESM 编译功能， 实现极致开发体验的新一代构建工具！

**开发环境**

- **利用浏览器原生的 ES Module 编译能力**，省略费时的编译环节，直给浏览器开发环境源码，dev server 只提供轻量服务。
- 浏览器执行 ESM 的 import 时，会向 dev server 发起该模块的 ajax 请求，服务器对源码做简单处理后返回给浏览器。
- Vite 中 HMR 是在原生 ESM 上执行的。当编辑一个文件时，Vite 只需要精确地使已编辑的模块失活，使得无论应用大小如何，HMR 始终能保持快速更新。
- 使用 esbuild 处理项目依赖，esbuild 使用 go 编写，比一般 node.js 编写的编译器快几个数量级。

**生产环境**

集成 Rollup 打包生产环境代码，依赖其成熟稳定的生态与更简洁的插件机制。

# Vite 核心功能实现原理

- ESbuild 编译
- HRM 原理
  - Vite本地启动时会创建一个WebSocket连接，同时去监听本地的文件变化
  - 当用户修改了本地的文件时，WebSocket的服务端会拿到变化的文件的ID或者其他标识，并推送给客户端
  - 客户端获取到变化的文件信息之后，便去请求最新的文件并刷新页面
- 依赖预构建
  - 模块化兼容： 如开头背景所写，现仍共存多种模块化标准代码，Vite 在预构建阶段将依赖中各种其他模块化规范(CommonJS、UMD)转换 成 ESM，以提供给浏览器。
  - 性能优化： npm 包中大量的 ESM 代码，大量的 import 请求，会造成网络拥塞。Vite 使用 esbuild，将有大量内部模块的 ESM 关系转换成单个模块，以减少 import 模块请求次数。
- 按需加载
  - 服务器只在接受到 import 请求的时候，才会编译对应的文件，将 ESM 源码返回给浏览器，实现真正的按需加载。
- 缓存
  - HTTP 缓存： 充分利用 http 缓存做优化，依赖（不会变动的代码）部分用 max-age,immutable 强缓存，源码部分用 304 协商缓存，提升页面打开速度。
  - 文件系统缓存： Vite 在预构建阶段，将构建后的依赖缓存到 node_modules/.vite ，相关配置更改时，或手动控制时才会重新构建，以提升预构建速度。
- 重写模块路径
  - 浏览器 import 只能引入相对/绝对路径，而开发代码经常使用 npm 包名直接引入 node_module 中的模块，需要做路径转换后交给浏览器。
  ```js
  // 开发代码
  import { createApp } from "vue";
  // 转换后
  import { createApp } from "/node_modules/vue/dist/vue.js";
  ```

# 与 webpack 对比

- Webpack 配置丰富使用极为灵活但上手成本高，Vite 开箱即用配置高度集成
- Webpack 启动服务需打包构建，速度慢，Vite 免编译可秒开
- Webpack 热更新需打包构建，速度慢，Vite 毫秒响应
- Webpack 成熟稳定、资源丰富、大量实践案例，Vite 实践较少
- Vite 使用 esbuild 编译，构建速度比 webpack 快几个数量级
