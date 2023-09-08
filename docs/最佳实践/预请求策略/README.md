# 预请求策略

## 引言

预取是一种通过下载资源(甚至整个页面)来加快页面加载速度的技术，这些资源在不久的将来可能需要。

研究表明，更快的加载时间会带来更高的转化率和更好的用户体验。

## 预请求策略

Prefetching 已经是一项很成熟的技术了，但是我们还是需要小心谨慎的使用。

因为它会为不是立即需要的资源消耗额外的带宽。比如，我们现在为了更好的用户体验去提前加载下一页的内容，目的是为了达到用户无感知的浏览。但是，用户也有可能会关闭程序或者重新浏览别的内容，这样，我们所加载的资源消费的带宽就被浪费了。

所以应该谨慎地应用 Prefetching 技术以避免不必要的数据使用。

### 何时使用 Prefetching ？

- 检测用户浏览的内容位置:使用 Intersection Observer API 检测用户行为，来查看用户浏览的位置以便预测用户的行为。
- 增加必要的判断条件：上面提到，Prefetching 是一种推测性的性能改进，会消耗额外的数据，我们很可能不是在每种情况下都想要的结果。为了减少浪费带宽的情况，可以使用 Network Information API 和 Device Memory API 来决定是否获取下一项内容：
  - 连接速度至少为 3G，设备内存至少为 4GB
  - IOS 系统
- CPU 空闲：通过使用 requestIdleCallback 检查 CPU 是否空闲并能够执行额外的工作，这个函数将在浏览器空闲时期被调用。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。

满足了这些条件可确保我们仅在必要时获取数据，从而节省带宽和电池的寿命，并最大限度地减少最终未使用的 prefetching 带来的副作用。

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/09/8779d7148d31f4aeb2e3a5d1c78d8b86.png)

> 满足条件时，则可以加载蓝色的个性推荐内容

## Prefetching 的原理

1. 首先检查网络类型，如果网络类型是 'slow-2g' 或 '2g'，则不进行预取（可能因为 2G 网络下预取资源可能效果不佳或者会造成不必要的流量消耗）。然后，如果设备内存小于或等于 2GB，也不进行预取（可能因为设备内存小，预取资源可能会造成页面卡顿或崩溃）。
2. 如果满足上述两个条件之一，函数就会直接返回，不执行任何操作。否则，函数会创建一个 fetchLinkList 对象，用来存储需要预取的链接。

3. 然后创建了一个 IntersectionObserver 对象，这是一个异步 API，用来观察目标元素（这里是 #child 元素）是否在视窗中。当目标元素进入视窗时，IntersectionObserver 会调用提供的回调函数，传入一个参数对象，包含了关于目标元素和其视窗的信息。

4. 在回调函数内，如果目标元素的 isIntersecting 属性为 true（表示元素在视窗内），并且元素的数据属性 href 不在 fetchLinkList 对象中（表示这个链接尚未被预取过），那么就会通过 fetch API 去预取这个链接对应的资源，并将这个链接添加到 fetchLinkList 对象中。

## Prefetching 的实际应用

```html
<!-- html -->
<div id="root">
  <div
    id="child"
    data-href="1"
    style="height: 500px; width: 200px; background-color: red"
  >
    123
  </div>
  <div
    id="child"
    data-href="2"
    style="height: 500px; width: 200px; background-color: burlywood"
  >
    123
  </div>
  <div
    data-href="3"
    id="child"
    style="height: 500px; width: 200px; background-color: salmon"
  >
    123
  </div>
  <div
    data-href="4"
    id="child"
    style="height: 500px; width: 200px; background-color: palegreen"
  >
    123
  </div>
  <div
    id="child"
    data-href="5"
    style="height: 500px; width: 200px; background-color: lawngreen"
  >
    123
  </div>
  <div
    id="child"
    data-href="6"
    style="height: 500px; width: 200px; background-color: slateblue"
  >
    123
  </div>
</div>
```

```js
// js
function prefetch(nodeLists) {
  // Exclude slow ECTs < 3g
  if (
    navigator.connection &&
    (navigator.connection.effectiveType === "slow-2g" ||
      navigator.connection.effectiveType === "2g")
  ) {
    return;
  }

  // Exclude low end device which is device with memory <= 2GB
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) {
    console.log("navigator.deviceMemory <=2 ");
    return;
  }

  const fetchLinkList = {};

  const Observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!fetchLinkList[entry.target.dataset.href]) {
          console.log("fetchLinkList", fetchLinkList);
          fetchLinkList[entry.target.dataset.href] = true;
          fetch(entry.target.dataset.href, {
            priority: "low",
          });
        }

        observer.unobserve((entry = entry.target));
      }
    });
  });

  nodeLists.forEach((el) => {
    Observer.observe(el);
  });
}

const idleCallback =
  window.requestIdleCallback ||
  function (cb) {
    let start = Date.now();

    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

idleCallback(function () {
  prefetch(document.querySelectorAll("#child"));
});
```

主要逻辑

- 预取功能在进行预取前，首先检查连接质量和设备内存是否达到最低标准。
- 使用 IntersectionObserver 来监视元素何时在视口中可见，并随后将 url 添加到一个列表中以进行预取。
- 预取过程通过 requestIdleCallback 调度，在主线程空闲时执行 prefetching 功能。

## 浏览器支持

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/09/e2be60b0e4b739610687ca1a3a7cb3cf.png)

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/09/fae0b9ecba304d7e2a7816fbe51a1fab.png)

## 结论

如果我们谨慎使用，prefetching 可以显著减少未来请求的加载时间，从而减少用户浏览中的等待时间并增加用户粘性。

prefetching 会导致加载可能不会使用的数据，因此我们采取了额外的判断，只在良好的网络条件下和有能力的设备上预取这些信息。
