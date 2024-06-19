# 深入模块Import 和 CommonJS

## Import
ES6的模块是基于`<script type="module">` attribute 来告诉浏览器，该文件是模块。

使用了`<script type="module">`就可以使用 import/export 

模块相对于一般的脚本差别：
    - 默认延迟解析（deferred）
    - Async 可用于内联脚本 就是说 在script 上添加 attribute async 后，里面的 `import {xxx} from './xxx.js'` 会异步执行。
    - 如果跨域请求外部脚本的话需要再header中允许
    - 重复的模块脚本会被忽略

ESM的特性
- 有自己的作用域，可以使用 `import/export` 交换功能
- 始终 严格模式 
- 值会执行一次。导出仅创建一次，然后在导入之间共享。

### 动态导入

import(module) 加载模块并返回一个promise 

## CommonJS
CommonJS 是 通过 require/module.exports 来导入

通过一个立即执行函数来形成闭包，保证作用域的干净

require是一个函数，如下实现
``` js
// 定义导入类，参数为模块路径
function Require(modulePath) {
    // 获取当前要加载的绝对路径
    let absPathname = path.resolve(__dirname, modulePath);
    // 创建模块，新建Module实例
    const module = new Module(absPathname);
    // 加载当前模块
    tryModuleLoad(module);
    // 返回exports对象
    return module.exports;
}
```

整理实现步骤
1. 导入相关模块，创建一个require方法
2. 抽离通过Module._load方法，用于加载模块。
3. Module.resolveFilename 根据相对路径，转换成绝对路径。
4. Module._cache 缓存模块 不重复加载
5. 创建模块id属性保存内容是exports = {}，相当于this
6. 利用tryModuleLoad(module, filename) 尝试加载模块。
7. Module._extensions使用读取文件。
8. Module.wrap: 把读取到的js包裹一个函数。
9. 将拿到的字符串使用runInThisContext运行字符串。
10. 让字符串执行并将this改编成exports。

## 区别
- CommonJS 是同步的 ESM 是默认异步的（应为是基于script的attribute），后者不影响浏览器渲染
- CommonJS是值的拷贝，改变导出值，需要重新导入（应为是立即执行函数，已经执行过了），后者是利用浏览器的导入，实时绑定，导入导出指向同一内存地址。
- ESM 会编译成 require/exports 来执行 

