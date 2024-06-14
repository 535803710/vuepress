# 前端性能优化：使用 Web Workers 实现轮询

## 🎯 痛点

轮询是一种常见的客户端与服务器端通信的方法，通过定期发送 HTTP 请求来获取最新数据。这种方法虽然简单易实现，但在某些情况下会对主线程性能产生负面影响，比如需要兼容性能较差的手机和需要高性能页面不影响主进程时。

在面对性能较差的手机时，我们需要尽量的减少主线程的 CPU 占用，因为主线程需要进行 UI 渲染，用户操作。主线程被频繁占用可能导致页面响应变慢，影响用户体验。例如，用户可能会感觉到页面滚动不流畅，按钮点击反应迟缓等。

因此 我想结合之前说过的 webworker 来解决，利用 Web Workers 将轮询任务移出主线程。

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2024/06/ae4e0c74a03623770e92a071bbb35cbe.png)
Web Worker 为浏览器提供了多线程处理能力，允许在后台线程执行脚本，避免了长时间运行的脚本导致的页面失去响应。这意味着，像轮询这样的耗时任务可以委托给 Worker 线程处理，保证了用户界面的流畅性。

关于 webworker 可以参考我之前写的这篇 [《你不要命啦？动态创建 Web Worker 还能这样用啊！》](https://juejin.cn/post/7270114845403922471#heading-9)

## ✨ 实现步骤

1. 创建 Worker 脚本：首先，定义一个包含轮询逻辑的 JavaScript 代码字符串，并将其封装进一个 Blob 对象。此 Blob 对象随后被用来创建一个新的 Worker 实例。

```js
const blob = new Blob(
  [
    `
      let requestCount = 0
        // 处理收到的消息
        self.onmessage = function(event) {
            ...
        };
        // 开始轮询函数
        function startPolling(interval, url, data, headers) {
            ...
        }
    `,
  ],
  { type: "application/javascript" }
);

const worker = new Worker(URL.createObjectURL(blob));
```

2. 定义轮询函数：在 Worker 脚本中，定义 `startPolling` 函数，它负责执行实际的 HTTP 请求并设置下一次轮询的定时器。这样，一旦接收到主线程发来的启动命令，Worker 就会开始周期性地调用该函数。

```js
function startPolling(interval, url, data, headers) {
  function poll() {
    fetch(url, {
      method: "POST",
      headers: new Headers(headers),
      body: JSON.stringify({ ...data }),
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        // 将请求结果发送回主线程
        self.postMessage({ res, requestCount: requestCount++ });
      })
      .catch((error) => {
        console.log("Request failed:", error);
      });

    // 调用自身以实现持续轮询
    setTimeout(poll, interval);
  }

  // 立即执行一次
  poll();
}
```

3. 配置与启动轮询：在主线程中，创建 Worker 实例后，通过 `postMessage` 方法向 Worker 发送初始化信息，包括轮询间隔、请求的 URL、请求头和数据。Worker 接收到这些信息后，开始执行轮询逻辑。

```js
worker.postMessage({
  type: "start",
  interval: 5000,
  url: "http://192.168.110.145:18200/gateway/xxxxxx",
  headers: {
    "content-type": "application/json; charset=utf-8",
    time: Base64.encode(serverTimeStamp().toString()),
    accountId: Base64.encode(tipWords.userId) || "",
    authToken: TOKEN,
    requestId: getRandomNumberFn(),
  },
  data: {
    secretCode: RsaAndAes.encrypt(Key),
    encryptedData: RsaAndAes.encryptAes(saveData),
    // userId: tipWords.userId
  },
}); // 每5秒轮询一次
```

4. 处理响应与错误：Worker 内部的轮询函数通过 fetch API 发起请求，并处理响应或错误。成功获取到数据后，通过 self.postMessage 将结果传回主线程，以便进一步解密和处理。

5. 定义终止条件，停止 webworker。

```js
worker.onmessage = function (event) {
  if (event.data.requestCount > 2) {
    worker.terminate();
  }
  // 业务逻辑
};
```

## 📦实现代码
```js
// pollWorker.js
import { Base64 } from 'js-base64';
import RsaAndAes from '~/composables/RsaAndAes';
import { getRandomNumberFn } from '~/composables/baseRequest';

export function createWorker() {
  const blob = new Blob(
    [
      `
let requestCount = 0;
// 处理收到的消息
self.onmessage = function (event) {
  if (event.data.type === "start") {
    // 开始轮询
    const interval = event.data.interval;
    startPolling(interval, event.data.url, event.data.data, event.data.headers);
  }
};

// 开始轮询函数
function startPolling(interval, url, data, headers) {
  function poll() {
    fetch(url, {
      method: "POST",
      headers: new Headers(headers),
      body: JSON.stringify({ ...data }),
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        // 将请求结果发送回主线程
        self.postMessage({ res, requestCount: requestCount++ });
      })
      .catch((error) => {
        console.log("Request failed:", error);
      });

    // 调用自身以实现持续轮询
    setTimeout(poll, interval);
  }

  // 立即执行一次
  poll();
}
    `
    ],
    { type: 'application/javascript' }
  );

  const worker = new Worker(URL.createObjectURL(blob));
  // 将post函数传递给WebWorker

  const TOKEN = '';
  const saveData = JSON.parse(JSON.stringify({} || {}));
  const config = {};
  const interDomainName = '';
  const ENV = '';
  const nodeEnv = ''; 
  const Key = ''; //存储公钥

  // 发送开始消息给WebWorker，传递轮询间隔
  worker.postMessage({
    type: 'start',
    interval: 5000,
    url: 'http://192.168.110.145:18200/gateway/xxxxxxx',
    headers: {
      'content-type': 'application/json; charset=utf-8',
      partnerId: 'MTAy',
      time: '',
      accountId: '',
      countries: '',
      authToken: TOKEN,
      requestId: ''
    },
    data: {
      secretCode: RsaAndAes.encrypt(Key),
      encryptedData: RsaAndAes.encryptAes(saveData)
    }
  }); // 每5秒轮询一次
  return worker;
}

```


## 总结

使用 Web Workers 实现轮询能够显著改善前端性能，尤其是在移动设备或低性能设备上。通过将轮询任务移至后台线程，主线程得以专注于用户界面的渲染和交互，提高了应用的响应速度和流畅度。

优势：
🚀 - 将耗时的网络请求和数据处理任务从主线程移至 Web Worker，减少了对主线程的占用，使用户界面更流畅。
💪- 主线程的空闲时间增加，有助于提升滚动、点击等用户操作的响应速度，避免页面卡顿现象。
🛡️- Worker 自身沙盒特性使项目更加安全可靠




