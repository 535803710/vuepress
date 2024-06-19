# 配置

## Entry

想让源文件加入到构建流程中去被 Webpack 控制，配置  `entry`

## Output

想自定义输出文件的位置和名称，配置  `output`。

## Module

配置 loader 的 解析 js css 等
想自定义解析和转换文件的策略，配置  `module`，通常是配置  `module.rules`  里的 Loader。

## Reslove

想要自定义寻找依赖模块的策略 （找 npm 包的）

## Plubin

其他操作

# 基本概念

在了解 Webpack 原理前，需要掌握以下几个核心概念，以方便后面的理解：

- **Entry**：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
- **Module**：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- **Chunk**：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- **Loader**：模块转换器，用于把模块原内容按照需求转换成新内容。
- **Plugin**：扩展插件，在 Webpack 构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情。

## 流程

- **初始化参数** ：通过配置文件和 shell 完成初始化参数
- **开始编译** ： 用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
- **确定入口** ： 找到 enter 的所有入口
- **编译模块** ： 从入口文件开始 调用 loader 来进行编译，然后找到文件引用的文件，递归调用，直到所有入口文件引用的文件处理过
- **完成模块编译** ：得到每个模块的依赖关系
- **输出资源** ：根据依赖关系，把每个模块生成对应的 chunk，再把每个 chunk 生成单独的文件添加到输出列表，通过一个立即执行函数接受一个数组 数组中都是函数 来模拟 require 执行第 0 个元素（就是 main.js） 来完成输出
- **完成输出资源** ：根据配置输出到对应的位置和名称

## 流程细节

构建分为三大阶段

- 初始化 ：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler。
- 编译 ：从 enter 出发，根据 Module 串行调用对应的 Loader 去翻译文件内容，然后再找出 Module 依赖的 Module，递归编译
- 输出 ：编译后的 module 组合成 chunk 把 chunk 转化成文件，输出

如果是一次流程 走到输出就结束了 但是如果监听模式，就会重复编译，如下

![监听模式的构建流程](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/7bc6f5dc69faad9efa9a7d4a73401989.png)

<!-- ![监听模式的构建流程.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a64b3ed9e4d41c3b3e87409dc344c5d~tplv-k3u1fbpfcp-watermark.image?) -->

## loader 实现

在 Webpack 中，loader 是用于转换模块文件的功能。Loader 本质上是一个函数，它接收源文件作为输入，进行处理后返回结果。通过 loader，Webpack 可以处理 JavaScript 以外的其他类型的文件，例如 CSS、图片、以及现代 JavaScript 特性（如 ES6、TypeScript）。

1. 创建 loader 文件：编写一个 JavaScript 文件，实现 loader 的逻辑。
2. 配置 Webpack：在 Webpack 配置文件中添加自定义 loader。
3. 运行 Webpack：确保 loader 被应用到指定的文件上。

```js
// uppercase-loader.js
module.exports = function (source) {
  // `source` 是文件的内容
  if (typeof source === "string") {
    return source.toUpperCase();
  }
  return source;
};
```

## plugin 实现

在 Webpack 中，插件（plugin）是用来扩展其功能的机制。插件可以处理更多复杂的任务，例如优化打包文件、注入环境变量、甚至生成 HTML 文件。与 loader 不同，loader 主要是处理单个文件的转换，而插件则是处理整个构建过程的各个环节。

1. 创建插件类：编写一个 JavaScript 类，实现插件的逻辑。
2. 配置 Webpack：在 Webpack 配置文件中使用自定义插件。
3. 运行 Webpack：确保插件被正确应用。

**在不同的 hook 中插入逻辑**

```js
// MyPlugin.js
class MyPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    // 在编译开始时执行
    compiler.hooks.compile.tap("MyPlugin", () => {
      console.log("编译开始");
    });

    // 在编译完成时执行
    compiler.hooks.done.tap("MyPlugin", (stats) => {
      console.log("编译完成！");
      console.log("Options:", this.options);
    });

    // 在生成资源时执行
    compiler.hooks.emit.tapAsync("MyPlugin", (compilation, callback) => {
      const assetNames = Object.keys(compilation.assets);
      console.log("生成的资源:", assetNames);

      // 可以修改资源或生成新的资源
      const content = "Hello, this is a new file!";
      compilation.assets["new-file.txt"] = {
        source: () => content,
        size: () => content.length,
      };

      callback();
    });
  }
}

module.exports = MyPlugin;
```
