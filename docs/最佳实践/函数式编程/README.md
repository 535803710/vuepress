# 函数式编程

## 前言

函数式编程中最简单的两个规则，只要保证这两条就能写好函数式编程。

1. 保持数据不变
2. 保持纯函数 —— 至少接受一个参数，返回一个数据或者函数。

## 保持数据的不可变

在函数式编程中，我们要保证数据是不可变的。所以我们有时候要使用原始数据的拷贝。

### 什么是数据不可变呢？

要理解什么是数据不可变，就需要知道怎么样会让数据改变，可以看到下面的示例：

### 函数改变源数据

下面定义了一个对象， `title` 属性值是 `dog` ， `color` 属性值是 `#000`

```js
let color_dog = {
  title: "dog",
  color: "#000",
};
```

❌ 错误的操作

```js
function changeColorTitle(color, title) {
  color.title = title;
  return color;
}

console.log(changeColorTitle(color_dog, "cat").title); // cat
console.log(color_dog.title); //cat
```

我们可以看到上面的例子中，对象发生了改变，这是因为我们在使用对象的时候用的是引用地址，本质上是在同一个储存空间中的内容。所以当我们改变对象的属性后，原对象也会发生改变。

✔️ 正确的操作

```js
let changeColorTitle = (color, title) => {
  return Object.assign({}, color, { title });
};

console.log(changeColorTitle(color_dog, "cat").title); // cat
console.log(color_dog.title); // dog
```

✔️ 正确的操作 2

```js
let changeColorTitle = (color, title) => ({ ...color, title }); // *
console.log(changeColorTitle(color_dog, "cat").title); // cat
console.log(color_dog.title); // dog
```

看！现在我们就有了正确的属性。

这是因为我们使用了扩展运算符（或者是 `Object.assign`）来创建（浅拷贝）一个新的对象。这个新的空白对象和原来的对象是不相等的。

> `*` 在这一行中因为我们直接返回了结果，所以我们可以省略 `return`

当我们熟练的使用 ES 的新语法后，我们就可以快速的写出简洁优雅的代码了。

### 操作改变源数据

小心，有时候我们使用数组上面原生的方法也会改变源数据。

```js
let list = [
    { color: "red" },
    { color: "bule" }, 
    { color: "pink" }];
```

❌ 错误的操作

当我们想增加 list 的数据时我们自然的会想到 `Array.prototype.push()` 方法。可能就写出了下面的代码

```js
var addColor = function (color, list) {
  list.push({ color: color });
  return list;
};

console.log(addColor("Green", list).length); // 4
console.log(list.length); // 4
```

但是这并不是一个纯函数，因为我们改变了源数据，数据的长度不应该发生改变。

✔️ 正确的操作

```js
const addColor = (color, list1) => list1.concat({ color });

console.log(addColor("Green", list).length); // 4
console.log(list.length); // 3
```

我们利用 `Array.prototype.concat()` 来把新的对象添加到 `list1` 中，然后但会的是 `list1` ，如此一来，我们就实现了一个纯函数，毫无副作用。

✔️ 正确的操作 2

```js
const addColor = (color, list2) => [...list2, { title }];
console.log(addColor("Green", list).length); // 4
console.log(list.length); // 3
```

或者我们可以使用 ES6 的扩展运算符，创建一个数组，将 `list` 解构到数组中，添加对象`{title}` 。

## 纯函数

纯函数是一个无副作用的函数，接受参数，返回参数或者函数。

### 定义

- 纯函数至少需要一个参数,总是返回一个值或另一个函数
- 不会引起副作用，不会设置全局变量，或改变任何关于应用程序状态
- 不会改变传入的参数

❌ 错误的操作

```js
var authLevel1 = {
  name: "level1",
  canRead: false,
  canWrite: false,
};

function setAuth() {
  authLevel1.canRead = true;
  authLevel1.canWrite = true;
  return authLevel1;
}

setAuth();
console.log(authLevel1);
// {
//   name: "level1",
//   canRead: true,
//   canWrite: true,
// }
```

`setAuth` 函数不是一个纯函数，因为下面几点

- 它不带任何参数
- 它改变了外部作用域的数据

当 `setAuth` 函数被调用的时候，就会产生副作用，改变了 `authLevel1`

✔️ 正确的操作

```js
const authLevel1 = {
  name: "level1",
  canRead: false,
  canWrite: false,
};

const setAuth1 = (auth) => ({ ...auth, canRead: true, canWrite: true });

const newAuthLevel1 = setAuth1(authLevel1);
console.log(newAuthLevel1);
console.log(authLevel1);
// {
//   name: "level1",
//   canRead: true,
//   canWrite: true,
// }
// {
//   name: "level1",
//   canRead: false,
//   canWrite: false,
// }
```

在这个函数中，我们接受一个参数 `auth`，并且返回一个新的对象，没有对程序产生副作用。也没有对传入的参数进行改变。

## 总结

“函数式”或“声明式”的概念是 JavaScript 技术面试中经常被问到的问题之一。函数式编程除了不可变性和纯函数之外还有更多的核心概念，但这两个概念足以回答面试官希望求职者给出的问题和最基本的答案。
