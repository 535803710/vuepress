# 长轮询

轮询是客户端与服务器保持持久连接的最简单的方式，不用任何协议 比如 webSocket 或者 Server Sent Event


## 常规轮询
常规轮训简单的实现了每隔几秒向服务器发起请求来查看状态是否改变，比如说：客户端使用 `setInterval` 每隔10m向服务端发起请求，

>客户端：“服务端，我能吃饭了么？” ，服务端：“还没做好呢。”
>
>10m后
>
>客户端：“服务端，我能吃饭了么？” ，服务端：“还没做好呢。”
>
>...

虽然可以实现轮训，但是也有些缺点：

1. 消息传递的延迟最多为 10 秒（两个请求之间）。
2. 即使没有消息，服务器也会每隔 10 秒被请求轰炸一次，即使用户切换到其他地方或者处于休眠状态，也是如此。就性能而言，这是一个很大的负担。


## 长轮询

长轮询是一种更好的轮询服务器方式

流程如下：

1. 浏览器发送请求
2. 服务器接收后挂起，在没有改变的消息之前不会关闭连接
3. 服务器查询到消息改变后返回到浏览器
4. 浏览器重新发起请求

这样一来，服务端在没有收到消息改变的时候都是将请求挂起，而当有消息改变时才会返回浏览器而后重新建立连接。

如果连接失败或丢失，浏览器会重新发起一个请求。

### 如图所示
![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/bed0555adfa967718cff424d81df7125.png)
<!-- ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/020275eb192b4ecd9b7f0b5f8e62af1f~tplv-k3u1fbpfcp-watermark.image?) -->

### 实现代码
```` js
async function subscribe() {
  let response = await fetch("/subscribe");

  if (response.status == 502) {
    // 状态 502 是连接超时错误，
    // 连接挂起时间过长时可能会发生，
    // 远程服务器或代理会关闭它
    // 让我们重新连接
    await subscribe();
  } else if (response.status != 200) {
    // 一个 error —— 让我们显示它
    showMessage(response.statusText);
    // 一秒后重新连接
    await new Promise(resolve => setTimeout(resolve, 1000));
    await subscribe();
  } else {
    // 获取并显示消息
    let message = await response.text();
    showMessage(message);
    // 再次调用 subscribe() 以获取下一条消息
    await subscribe();
  }
}

subscribe();
````

## 总结
如果是消息比较少的时候会适合用。

当消息很多的时候上面的图就会变成锯齿状

而且每一个请求都带有header，身份证明（auth token）等开销

所以，我们还可以用其他的方法来保证浏览器和服务端的持久连接，比如 WebSocket，Server Sent Events。


