# WebWorker

> 本文前半部分关于 Web Worker 的简介，原理，适用场景和兼容性。
>
> 关于动态创建 Web Worker 可直接跳转到 【动态 Worker 的简单封装】

## 简介

Web Worker 是浏览器提供的一种 JavaScript API，用于在后台线程中执行耗时的任务，以避免阻塞主线程。它可以提高网页的响应性能和用户体验。

当网页执行耗时的任务时，例如进行复杂的计算或处理大量数据，如果这些任务在主线程中执行，会导致主线程被占用，页面可能会出现卡顿、无响应的情况。使用 Web Worker 可以将这些耗时的任务放在后台线程中进行，不会影响主线程的运行，页面仍然可以保持流畅的交互。

Web Worker 的作用不仅限于提高网页的响应性能，它还可以改善用户体验。通过将耗时的任务放在后台线程中执行，用户在与页面进行交互时不会感到卡顿，页面的响应速度更快，给用户带来更好的体验。

Web Worker 是一种强大的工具，可以帮助开发者优化网页性能，提高用户体验。在下一部分，我们将更详细地探讨使用 Web Worker 的好处。

## Web Worker 的工作原理
![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/b1a7eafc278cda5ff8bb395867d33866.png)

当使用 Web Worker 时，开发者可以创建一个独立的后台线程，该线程可以执行一些复杂的计算、处理大量数据或执行其他耗时的操作。主线程可以继续执行其他任务，而不会受到后台线程的影响。
Web Worker 的工作原理如下：

1. 开发者创建一个新的 Web Worker 对象，并指定要执行的脚本文件。
2. 浏览器会为该 Web Worker 创建一个独立的后台线程，该线程会加载并执行指定的脚本文件。
3. 在后台线程中，开发者可以通过监听事件来接收和发送消息。例如，可以通过 postMessage 方法向后台线程发送消息，后台线程可以通过 onmessage 事件监听来接收消息。
4. 后台线程执行完任务后，可以通过 postMessage 方法向主线程发送消息，主线程可以通过 onmessage 事件监听来接收消息。
5. 主线程和后台线程之间的通信是通过消息传递机制实现的，这样可以确保线程之间的安全性和可靠性。

## Web Worker 的适用场景

### 以下是一些 Web Worker 的适用场景：

1. 计算密集型任务：如果你的应用需要执行大量的计算操作，例如图像处理、数据分析、物理模拟等，使用 Web Worker 可以将这些任务放在后台线程中执行，避免阻塞用户界面的响应性能。
2. 大规模数据处理：当你需要处理大量数据时，Web Worker 可以帮助你并行执行任务，提高处理速度。例如，在前端绘制图表时，你可以将数据处理和绘制分离到不同的线程中，以提高绘制性能。
3. 长时间运行的任务：某些任务可能需要较长的时间才能完成，例如文件上传、数据导入等。使用 Web Worker 可以将这些任务放在后台线程中执行，使用户可以同时进行其他操作，而不会感觉到应用程序的卡顿。
4. 多线程编程：Web Worker 提供了多线程编程的能力，可以将任务分解为多个子任务，并在多个线程中并行执行。这对于某些复杂的算法或任务来说非常有用，可以提高执行效率。

### 但并不是所有的场景都适合使用 Web Worker，如：

1. 用户界面交互：如果你的应用需要频繁地更新用户界面或响应用户输入，使用 Web Worker 可能会导致延迟和不一致的用户体验。因为 Web Worker 在后台运行，无法直接访问用户界面元素。
2. DOM 操作：Web Worker 不能直接访问或修改 DOM 元素。如果你的任务需要对页面上的 DOM 进行操作，那么 Web Worker 并不适合。
3. 安全限制：由于安全性考虑，Web Worker 有一些限制。例如，它们不能访问某些浏览器 API，如 localStorage 和 IndexedDB。如果你的任务需要访问这些 API，那么 Web Worker 可能不适合。
4. 简单任务：如果你的任务很简单且不需要大量计算资源，使用 Web Worker 可能会增加复杂性而不带来明显的性能提升。

## 兼容性和限制

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/223aaee5d473dc4d757beb13824f0227.png)

### 兼容性：

- Web Worker 在现代浏览器中得到广泛支持，包括 Chrome、Firefox、Safari 和 Edge 等主流浏览器。
- 但是，旧版的 Internet Explorer 不支持 Web Worker。

### 限制：

- Web Worker 无法直接访问 DOM 元素，因此不能执行与 DOM 相关的操作，如修改页面内容或操作表单等。
- Web Worker 不能访问一些浏览器 API，如 localStorage 和 IndexedDB。这是出于安全性考虑，以防止恶意代码访问用户的敏感数据。
- 由于 Web Worker 在后台运行，它们无法直接与主线程进行通信。必须使用消息传递机制来在主线程和 Web Worker 之间传递数据和命令。
- Web Worker 只能执行纯粹的 JavaScript 代码，不能执行与浏览器环境相关的操作，如打开新窗口或重定向页面等。

## Web Worker 的使用

Worker() 构造函数创建一个 [Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker) 对象，该对象执行指定的 URL 脚本。这个脚本必须遵守 **同源策略** 。

`const myWorker = new Worker(aURL, options);`

[MDN 参考链接](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker/Worker)

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/cd5d0db5721d2192f9c2d547079a0f37.png)
**注意： 我们可以看到脚本的 MIME 类型必须为 text/javascript。**

所以我们可以利用 Blob 来动态创建 WebWorker，这样我们就可以在实际工程中更好的使用。我们希望 Web Worker 能解决如下几个问题：

- 可根据不同业务属性动态创建不同的 Web Worker；
- API 简单易用，例如通过 Promise 链式调用替换相对较为繁琐的事件监听处理逻辑；
- 代码可复用，且最好不需对项目所依赖的构建工具进行更改；

## 动态 Worker 的简单封装

下面我们先来写一个简单的 Web Worker 示例，假设我们在 Worker 收到数据时有一个简单的判断逻辑，即只处理 method='format' 的消息：

```js
window.URL = window.URL || window.webkitURL;

const response = `onmessage = ({ data: { data } }) => {
  console.log('Message received **from** main script');
  const {method} = data;
  if (data.data && method === 'format') {
    postMessage({
      data: {
        'res': 'I am a customized result string.',
      }
    });
  }
  console.log('Posting message back to main script');
}`;
const blob = new Blob([response], { type: "application/javascript" });

const worker = new Worker(URL.createObjectURL(blob));

// 事件处理
worker.onmessage = (e) => {
  alert(`Response: ${JSON.stringify(e)}`);
};
worker.postMessage({
  method: "format",
  data: [],
});
```

这个 Demo 会建立一个 Web Worker 并向其发送一段文本，而 Worker 在处理完毕后主线程会把结果弹窗显示出来。接下来，我们就用它继续操作。

一个动态 Worker 结构应该长成如下这样，包含构造函数、动态调用函数以及 Worker 销毁函数，而构造函数中至少应该定义好 Worker 用到的全局变量、数据处理函数以及 onmessage 事件处理函数：

```js
const BASE_DATASETS = "";
class DynamicWorker {
  constructor(worker) {
    /**
     * 依赖的全局变量声明
     * 如果 BASE_DATASETS 非字符串形式，可调用 JSON.stringify 等方法进行处理
     * 保证变量的正常声明
     */
    const CONSTS = `const base = ${BASE_DATASETS};`;

    /**
     * 数据处理函数
     */
    const formatFn = `const formatFn = ${worker.toString()};`;

    /**
     * 内部 onmessage 处理
     */
    const onMessageHandlerFn = `self.onmessage = ()=>{}`;

    /**
     * 返回结果
     * @param {*} param0
     */
    const handleResult = () => {};

    const blob = new Blob(
      [`(()=>{${CONSTS}${formatFn}${onMessageHandlerFn}})()`],
      { type: "text/javascript" }
    );
    this.worker = new Worker(URL.createObjectURL(blob));
    this.worker.addEventListener("message", handleResult);

    URL.revokeObjectURL(blob);
  }

  /**
   * 动态调用
   */
  send(data) {}

  close() {}
}
```

以上代码有几点需要解释下，比如生成 Blob 对象时，由于入参是字符串数组，如果只是调用 .toString()，便无法拿到函数名，因此所有字符串采用变量命名的形式定义。接着我们调用 URL.createObjectURL 生成对象 URL，在创建完 Worker 后调用 URL.revokeObjectURL() 让浏览器知道不再需要对这个文件保持引用。

URL.revokeObjectURL() 静态方法用来释放一个之前通过调用 URL.createObjectURL() 创建的已经存在的 URL 对象。当你结束使用某个 URL 对象时，应该通过调用这个方法来让浏览器知道不再需要保持这个文件的引用了。详见 MDN API.

内部接收与响应消息的函数应该做逻辑判断并发送对应信息返回主线程，我们这样完善 onMessageHandlerFn：

```js
const onMessageHandlerFn = `self.onmessage = ({ data: { data } }) => {
      console.log('Message received from main script');
      const {method} = data;
      if (data.data && method === 'format') {
        self.postMessage({
          data: formatFn(data.data)
        });
      }
      console.log('Posting message back to main script');
}`;
```

利用 Promise 的链式调用，我们可以隐藏较为琐碎的事件监听处理程序。来写一个 send 方法允许开发者动态调用，内部我们接收到数据后，改变 resolve 的状态，并返回这个 Promise：

```js
send(data) {
    const w = this.worker;
    w.postMessage({
      data,
    });

    return new Promise((res) => {
      this.resolve = res;
    })
}
```

我们定义一个 this.resolve 用于记录 Promise 的状态，然后在 Worker 收到响应后便判断 this.resolve 然后决定是否 resolve 计算结果：

```js
const handleResult = ({ data: { data } }) => {
  if (this.resolve) {
    resolve(data);
    this.resolve = null;
  }
};
```

如此一来，接下来我们就可以在主进程中这样调用 DynamicWorker 了：

```js
import DataWorker from "./dynamicWorker.js";

const formatFunc = () => {
  return {
    res: "I am a customized result string.",
  };
};

const worker = new DataWorker(formatFunc);

const result = []; // demo 数据

worker
  .send({
    method: "format",
    data: result,
  })
  .then((e) => {
    alert(`Response: ${JSON.stringify(e)}`);
  });
```

### 调用区分优化

当然，如果我们没有频繁调用 Worker，那么上面的代码貌似已经足够。但如果你需要短时间多次传输数据进行处理，那么调用的多个方法与对应的多个结果间可能会相互混淆。为什么呢，原因在于我们在构造函数中写的这行：

this.worker.addEventListener('message', handleResult);
这个事件监听处理函数是区分不出每次调用的，在收到消息后它只会执行 resolve。那么该如何解决呢？其实也较为简单，加入一个标志位用于区分不同调用即可。

首先，在构造函数里我们加上这么一行：

`this.flagMapping = {};`

简单起见，我们直接取日期作为标志位 key，改写后的 send 方法长成这样：

```js
send(data) {
    const w = this.worker;
    const flag = new Date().toString();
    w.postMessage({
      data,
      flag,
    });

    return new Promise((res) => {
      this.flagMapping[flag] = res;
    })
}
```

最后，根据 flag 传参我们改写 Worker 内部的 onmessage 函数以及返回结果函数的判断逻辑：

```js
const onMessageHandlerFn = `self.onmessage = ({ data: { data, flag } }) => {
  console.log('Message received from main script');
  const {method} = data;
  if (data.data && method === 'format') {
    self.postMessage({
      data: formatFn(data.data),
      flag
    });
  }
  console.log('Posting message back to main script');
}`;

// ...

const handleResult = ({ data: { data, flag } }) => {
  const resolve = this.flagMapping[flag];

  if (resolve) {
    resolve(data);
    delete this.flagMapping[flag];
  }
};
```

至此，一个可动态创建、可复用的 Web Worker 便写完了。

## 对比使用 Web Worker 和不使用 Web Worker 的性能

### 不使用 Web Worker

```js
// no-worker

const start = new Date().getTime();
console.log("开始计算斐波那契数任务");
function calculateFibonacci(n) {
  if (n <= 1) {
    return n;
  } else {
    return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
  }
}

console.log("完成计算斐波那契数任务,结果：", calculateFibonacci(40));
const end = new Date().getTime();

console.log("继续主线程，耗时：", end - start);
```

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/6ca52ba46bc99221938f1564167ed3ec.png)

### 使用 Web Worker

```js
// use-worker
import DataWorker from "./dynamicWorker.js";

const start = new Date().getTime();
console.log("开始计算斐波那契数任务");
const formatFunc = (n) => {
  const res = calculateFibonacci(n);

  function calculateFibonacci(n) {
    if (n <= 1) {
      return n;
    } else {
      return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
    }
  }
  return {
    res,
  };
};
const worker = new DataWorker(formatFunc);
const n = 40; // demo 数据
worker
  .send({
    method: "format",
    data: n,
  })
  .then(({ res }) => {
    const end = new Date().getTime();
    console.log("完成计算斐波那契数任务,结果：", res);
    console.log("完成计算斐波那契数任务,耗时：", end - start);
  });

const end = new Date().getTime();
console.log("继续主线程，耗时：", end - start);
```

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/a8a33f98cf71fdf6257b58cae111f88d.png)

## 总结
关于 Web Worker 的使用，我们往往只局限在demo上，但是当我们能够在工程中动态的创建 Web Worker 的时候我们便可以解决开始时我们提到的问题。

同时我们也要注意不要过度的依赖 Web Worker ，并不是所有的场景都适合使用这个API。

## 参考链接

- https://developer.mozilla.org/zh-CN/docs/Web/API/Worker
- https://caniuse.com/?search=Web%20Worker
- https://zhuanlan.zhihu.com/p/59981684?hmsr=toutiao.io&utm_medium=toutiao.io
- https://html.spec.whatwg.org/multipage/workers.html#workers

