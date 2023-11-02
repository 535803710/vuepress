# 用浏览器实现一个屏幕录制功能

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/11/6fe99702c64eee6efb07a114d32b9b46.gif)

## 省流

将这段代码复制到控制台点击 ‘屏幕录制’ 按钮

```js
const button = document.createElement("button");
button.innerHTML = "屏幕录制";
button.style = "position: fixed; top:200px; z-index: 99999999999;";
document.body.append(button);
button.addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getDisplayMedia();

  const recoder = new MediaRecorder(stream);
  recoder.start();
  const [video] = stream.getVideoTracks();
  const [video] = stream.getVideoTracks();
  video.addEventListener("ended", () => {
    recoder.stop();
  });
  recoder.addEventListener("dataavailable", (evt) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(evt.data);
    a.download = "capture.webm";
    a.click();
  });
});
```

## 解析

1. 用 `document.createElement("button")` 创建一个 button ，填充文字，添加到 body 上
2. 为了安全考虑，只监听用户行为来触发
3. 用 `navigator.mediaDevices.getDisplayMedia()` 来提示用户去选择和授权捕获展示的内容或部分内容
4. 用 `MediaRecorder` 来进行媒体录制的接口
5. 创建 `a` 标签来保存录制数据，并且下载

## 使用场景

- 提供给测试，能够快速屏幕录制
- 代码演示
- 其它用法去评论区留言，让大家开开眼

## 配合使用
在线文件转换：https://convertio.co/zh/download/3052875cc022267698ed5152d90402a01651bd/

图片压缩：https://docsmall.com/

## 兼容性

- getDisplayMedia
  ![getDisplayMedia](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/11/33b919193ae760bf9f70c895ee6c5377.png)

- MediaRecorder()
  ![MediaRecorder](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/11/73cdbbc78fb662b88ed5938535941a19.png)

## 参考

https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getDisplayMedia

https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder/MediaRecorder

https://dev.to/ninofiliu/simple-screen-recorder-in-20-lines-of-javascript-4ina
