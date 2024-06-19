# 执行上下文和堆栈

现在我们来研究一下递归调用是如何工作的。为此，我们会先看看函数底层的工作原理。

有关正在运行的函数的执行过程的相关信息被存储在其 **执行上下文** 中。

[执行上下文](https://tc39.github.io/ecma262/#sec-execution-contexts) 是一个内部数据结构，它包含有关函数执行时的详细细节：当前控制流所在的位置，当前的变量，this 的值（此处我们不使用它），以及其它的一些内部细节。

一个函数调用仅具有一个与其相关联的执行上下文。

当一个函数进行嵌套调用时，将发生以下的事儿：

- 当前函数被暂停；
- 与它关联的执行上下文被一个叫做 执行上下文堆栈 的特殊数据结构保存；
- 执行嵌套调用；
- 嵌套调用结束后，从堆栈中恢复之前的执行上下文，并从停止的位置恢复外部函数。

# 尾调用

> 尾调用指的是函数的返回另一个函数的调用

# 尾递归

> 函数尾调用自身，就是尾递归

下面代码就是尾递归

```
function pow(x, n) {
  if (n == 1) {
    return x;
  } else {
    return x * pow(x, n - 1);
  }
}

alert( pow(2, 3) );

```

**任何递归都可以用循环来重写。通常循环变体更有效。**

……但有时重写很难，尤其是函数根据条件使用不同的子调用，然后合并它们的结果，或者分支比较复杂时。而且有些优化可能没有必要，完全不值得。

递归可以使代码更短，更易于理解和维护。并不是每个地方都需要优化，大多数时候我们需要一个好代码，这就是为什么要使用它。

# 尾递归优化

## 蹦床函数

```
function trampoline(f) {
  while (f && typeof f === 'function') {
    f = f()
  }
  return f
}

function f(n, m = 1, o = 1) {
  if (n <= 2) {
    return o
  }
  return f.bind(null, n - 1, o, m + o)
}

trampoline(f(40)) // 102334155
trampoline(f(100000)) // Infinity
```

## 深度遍历算法
```
function tco(func) {
  var value
  var active = false
  const accumulated = []

  return function accumulator(...args) {
    accumulated.push(args)

    if (!active) {
      active = true
      while (accumulated.length) {
        value = func.apply(this, accumulated.shift())
      }
      active = false

      return value
    }
  }
}

const f = tco(function fibonacci(n, m = 1, o = 1) {
  if (n <= 2) {
    return o
  }
  return f(n - 1, o, m + o)
})

f(40) // 102334155
f(100000) // Infinity

```
