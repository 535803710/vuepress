# 防抖和节流的原理和实现

防抖和节流可以想成一个电梯的运行，防抖是每次有人上电梯就开门，节流是有人上电梯后每 10s 关一次门。

## 防抖

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/536c3fccd39549e6b84788f3417c9a21~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

### 原理

就是在一个时间段内只能有一次事件的触发

### 步骤

1. 防抖函数接收一个执行函数 `fn`，一个时间参数`time`（用于控制定时器的时间）
2. 定义一个变量 timer 用于接收定时器
3. return 一个匿名函数`(...args)`形成闭包，接收传参
   1. 清除定时器
   2. timer 赋值为一个定时器，时间为 `time`,内部函数为 fn 的调用执行

### 代码

```js
const debounce = (fn, time) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(this, [args]);
    }, time);
  };
};
```

### 验证

```js
const a = debounce((num) => {
  console.log(+num + 1);
}, 100);
a(1);
a(2);
a(3);
a(4); //5
```

## 节流

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92f6baa40d7d4840a80b1d9c0f28d506~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

### 原理

事件一直触发，节流函数会规定在一段时间内事件只触发一次，超过这段时间，重新计时

### 步骤
接收两个参数
- 一个执行函数
- 执行间隔时间

1. 初始化上一次执行时间为 0 
2. return 一个函数形成闭包
   1. 获取当前时间
   2. 判断 当前时间 - 上次执行的时间 > 传入的执行间隔时间
   3. fn 的调用执行
   4. last 赋值为 当前时间

### 代码 + 验证

```js
const throttle = (fn, time) => {
  let last = 0;
  return (...args) => {
    const now = new Date();
    if (now - last > time) {
      last = now;
      fn.apply(this, [args]);
    }
  };
};
const b = throttle((num) => {
  console.log(+num + 1);
}, 1000);

setInterval(() => {
  b(2);
}, 50);
```
