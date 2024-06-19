# JSX 最后会变成什么

1.  SX 元素节点 会被 bable 编译成 React Element 形式。那么，我们首先来看一下 React.createElement 的用法。
2.  React.createElement 处理后会 React element 对象的每一个子节点都会形成一个与之对应的 fiber 对象，然后通过 sibling、return、child 将每一个 fiber 对象联系起来。
    fiber 对应关系
    - child： 一个由父级 fiber 指向子级 fiber 的指针。
    - return：一个子级 fiber 指向父级 fiber 的指针。
    - sibling: 一个 fiber 指向下一个兄弟 fiber 的指针。

# 可控性 render

1. 返回的 children 虽然是一个数组，但是数组里面的数据类型却是不确定的，有对象类型( 如 ReactElement ) ，有数组类型(如 map 遍历返回的子节点)，还有字符串类型(如文本)；
2. 无法对 render 后的 React element 元素进行可控性操作。

- 将上述 children 扁平化处理，将数组类型的子节点打开 ；
- 干掉 children 中文本类型节点；
- 向 children 最后插入 say goodbye 元素；
- 克隆新的元素节点并渲染。

# Babel 解析 JSX 流程

1 @babel/plugin-syntax-jsx 和 @babel/plugin-transform-react-jsx

Automatic Runtime 模式的时候不用引入 React createElement
**因为 plugin-syntax-jsx 已经向文件中提前注入了 \_jsxRuntime api。不过这种模式下需要我们在 .babelrc 设置 runtime: automatic 。 **

bable 解析 jsx
const fs = require('fs')
const babel = require("@babel/core")

/_ 第一步：模拟读取文件内容。 _/

```js
const fs = require("fs");
const babel = require("@babel/core");

/* 第一步：模拟读取文件内容。 */
fs.readFile("./element.js", (e, data) => {
  const code = data.toString("utf-8");
  /* 第二步：转换 jsx 文件 */
  const result = babel.transformSync(code, {
    plugins: ["@babel/plugin-transform-react-jsx"],
  });
  /* 第三步：模拟重新写入内容。 */
  fs.writeFile("./element.js", result.code, function () {});
});
```

处理后

```js
import React from "react";

function TestComponent() {
  return /*#__PURE__*/ React.createElement("p", null, " hello,React ");
}

function Index() {
  return /*#__PURE__*/ React.createElement(
    "div",
    null,
    /*#__PURE__*/ React.createElement(
      "span",
      null,
      "\u6A21\u62DF babel \u5904\u7406 jsx \u6D41\u7A0B\u3002"
    ),
    /*#__PURE__*/ React.createElement(TestComponent, null)
  );
}
export default Index;
```
