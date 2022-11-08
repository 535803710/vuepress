# 拦截器设计
## 介绍
拦截器是由很多个拦截切面构成。所谓拦截切面实际上是一个函数，它的函数签名如下：

```js
async (ctx, next) => {
  do sth...
}
```

它有两个参数。第一个参数是一个上下文，这个上下文在多个拦截切面中是共享的。第二个参数是一个 `next` 函数，调用它会进入下一个拦截切面，也就是下一个函数。

## 实现
先来实现一个拦截器模块（interceptor）

```js
class Interceptor {
  constructor() {
    this.aspects = []; // 用于存储拦截切面
  }

  use(/* async */ functor) {
    // 注册拦截切面
    this.aspects.push(functor);
    return this;
  }

  async run(context) {
    // 执行注册的拦截切面
    const aspects = this.aspects;

    // 将注册的拦截切面包装成一个洋葱模型
    const proc = aspects.reduceRight(
      function (next, currentFunc) {
        // eslint-disable-line
        return async () => {
          await currentFunc(context, next);
        };
      },
      () => Promise.resolve()
    );
    try {
      await proc(); //从外到里执行这个洋葱模型
    } catch (ex) {
      console.error(ex.message);
    }

    return context;
  }
}

module.exports = Interceptor;
```

这段代码只有二三十行，却运用了函数式编程的思想实现了能够注册多个拦截切面函数，并将这些拦截切面包装成一个异步的洋葱模型的拦截器框架。

其中， `use` 方法将拦截切面存入 `aspects` 数组。 `run` 方法通过数组的 `reduceRight` 方法迭代 `aspects` 数组，将所有注册的拦截切面拼接成异步调用嵌套的洋葱模式并执行它。




你可能会对这段代码感到困惑，没有关系，我们通过一个简单的例子来理解这个框架是如何拼接和执行所有拦截切面的。

```js
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const inter = new Interceptor();

const task = function (id) {
  return async (ctx, next) => {
    console.log(`task ${id} start`);
    ctx.count++;
    await wait(1500);
    console.log(`count: ${ctx.count}`);
    await next();
    console.log(`task ${id} end`);
  };
};

// 将多个任务以拦截切面的方式注册到拦截器中
inter.use(task(0));
inter.use(task(1));
inter.use(task(2));
inter.use(task(3));
inter.use(task(4));

// 从外到里依次执行拦截切面
inter.run({ count: 0 });
```

## 详解
上面的代码意思是：

1. 注册 5 个拦截器切面，
2. 调用 `run` 方法 并且传入 `context` 参数

- `next` 就是下面这一段函数，每次在执行
```js
return async () => {
  await currentFunc(context, a);
};
```

- `currentFunc` 是 `task` 返回的函数 也就是
```js
 async (ctx, next) => {
    console.log(`task ${id} start`);
    ctx.count++;
    await wait(1500);
    console.log(`count: ${ctx.count}`);
    await next();
    console.log(`task ${id} end`);
  };
```
首先将 `task` 注册成5个拦截切面存放在 `aspects` 中。

在调用 `run` 函数的时候，会使用 `reduceRight()` 方法，从最后一个元素开始，每次都包裹一层函数再外面，所以会得到5 个切面会拼接成如下
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c701ea68031740889d117fe9a7dd1d59~tplv-k3u1fbpfcp-watermark.image?)\*\*\*\*

通过下图可以比较好的理解

这个洋葱模型执行结果如下

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/047426250f394aaab47fb387f03032ce~tplv-k3u1fbpfcp-watermark.image?)

这是一个层层深入的异步嵌套调用模型，但写法上却是同步的写法。

拦截器通过 `use` 方法将不同业务逻辑的拦截切面串联起来，然后通过 `run` 方法依次执行。

还可以使用 `try...catch`，使得其中一个拦截切面执行失败，就阻止后续拦截切面继续运行：

```js
const task = function (id) {
  return async (ctx, next) => {
    try {
      console.log(`task ${id} begin`);
      ctx.count++;
      await wait(1000);
      console.log(`count: ${ctx.count}`);
      await next();
      console.log(`task ${id} end`);
    } catch (ex) {
      throw new Error(ex);
    }
  };
};
```

## 总结
- 拦截器是由很多个拦截切面构成。
- 拦截器的实现通过拦截切面拼接成异步调用嵌套的洋葱模型。
- 洋葱模型会先执行 `next()` 前的代码 再进入next调用的下一个函数 最后返回到最外层执行的函数。
- 拦截器是常用的思想，比如用户信息验证、表单数据验证、业务逻辑处理等等。
