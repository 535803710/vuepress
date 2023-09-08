# 配置
## Entry
想让源文件加入到构建流程中去被 Webpack 控制，配置 `entry`

## Output
想自定义输出文件的位置和名称，配置 `output`。

## Module
配置loader的 解析js css 等
想自定义解析和转换文件的策略，配置 `module`，通常是配置 `module.rules` 里的 Loader。

## Reslove
想要自定义寻找依赖模块的策略 （找npm包的）

## Plubin 
其他操作

# 基本概念

在了解 Webpack 原理前，需要掌握以下几个核心概念，以方便后面的理解：

-   **Entry**：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
-   **Module**：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
-   **Chunk**：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
-   **Loader**：模块转换器，用于把模块原内容按照需求转换成新内容。
-   **Plugin**：扩展插件，在 Webpack 构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情。

## 流程
- **初始化参数** ：通过配置文件和 shell 完成初始化参数
- **开始编译** ： 用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
- **确定入口** ： 找到 enter 的所有入口
- **编译模块** ： 从入口文件开始 调用loader来进行编译，然后找到文件引用的文件，递归调用，直到所有入口文件引用的文件处理过
- **完成模块编译** ：得到每个模块的依赖关系
- **输出资源** ：根据依赖关系，把每个模块生成对应的chunk，再把每个chunk生成单独的文件添加到输出列表，通过一个立即执行函数接受一个数组 数组中都是函数 来模拟require 执行第0个元素（就是main.js） 来完成输出
- **完成输出资源** ：根据配置输出到对应的位置和名称

## 流程细节
构建分为三大阶段
- 初始化 ：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler。
- 编译 ：从enter出发，根据Module串行调用对应的Loader去翻译文件内容，然后再找出Module依赖的Module，递归编译
- 输出 ：编译后的module组合成chunk 把chunk转化成文件，输出

如果是一次流程 走到输出就结束了 但是如果监听模式，就会重复编译，如下

![监听模式的构建流程](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/7bc6f5dc69faad9efa9a7d4a73401989.png)
<!-- ![监听模式的构建流程.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a64b3ed9e4d41c3b3e87409dc344c5d~tplv-k3u1fbpfcp-watermark.image?) -->


