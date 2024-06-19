框架类型（运行时，编译时，运行+编译）

# 运行时

用户写一个树形结构的对象，框架将用户的结构通过 `render` 函数插入到页面中

```js
const obj = {
  tag: "div",
  children: [{ tag: "span", childern: "hello" }],
};
```

```js
function Render(obj, root) {
  const el = document.createElement(obj.tag);
  if (typeof obj.children === "string") {
    const text = document.createTextNode(obj.children);
    el.appendChild(text);
  } else if (obj.children) {
    obj.children.forEach((child) => Render(child));
  }
  root.appendChild(el);
}
```

这样，我们就能够将用户的对象转换成渲染内容

# 运行时+编译时

这类框架可以将 `html` 标签转换成 `VNode` ，再对其进行操作（ `diff` 之类）然后编译成需要渲染的内容。
比如 vue

- 先将 html 标签通过 `Compiler` 转换成树形结构对象，
- 然后再用 `Render` 函数转换为渲染内容

# 纯编译时

这类框架就是直接将 html 标签转换为渲染内容
-先将 `html` 标签通过 `Compiler` 转换成 js 操作 `DOM` 的语句
