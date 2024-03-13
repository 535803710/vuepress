# 网页调用摄像头识别物体后做成行为

## 背景
![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2024/03/02fe6f3072e818c465dd376a7d91a6c1.png)
家里有一条狗🐶，很喜欢乘人不备睡沙发🛋️，恰好最近刚搬家 + 狗迎来了掉毛期 不想让沙发上很多毛。所以希望能识别到狗，然后播放“gun 下去”的音频📣。

## 需求分析

- 需要一个摄像头📷
  - 利用 chrome 浏览器可以调用手机摄像头，获取权限，然后利用 video 将摄像头的内容绘制到 video 上。
- 通过摄像头实时识别画面中的狗🐶
  - 利用 [tensorflow](https://tensorflow.google.cn/js/models?hl=zh-cn) 和预训练的 COCO-SSD MobileNet V2 模型进行对象检测。
  - 将摄像头的视频流转化成视频帧图像传给模型进行识别
- 录制一个音频
  - 识别到目标（狗）后播放音频📣
- 需要部署在一个设备上
  - 找一个不用的旧手机📱，Android 系统
  - 安装 termux 来实现开启本地 http 服务🌐

## 技术要点

1.  利用浏览器 API 调用手机摄像头，将视频流推给 video

    ```js
    const stream = await navigator.mediaDevices.getUserMedia({
      // video: { facingMode: "environment" },  // 摄像头后置
      video: { facingMode: "user" },
    });

    const videoElement = document.getElementById("camera-stream");
    videoElement.srcObject = stream;
    ```

2.  加载模型，实现识别

    ```js
    let dogDetector;

    async function loadDogDetector() {
      // 加载预训练的SSD MobileNet V2模型
      const model = await cocoSsd.load();
      dogDetector = model; // 将加载好的模型赋值给dogDetector变量
    }
    ```

3.  监听 video 的播放，将视频流转换成图像传入模型检测

    ```js
    videoElement.addEventListener("play", async () => {
      requestAnimationFrame(processVideoFrame);
    });

    async function processVideoFrame() {
      if (!videoElement.paused && !videoElement.ended) {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // 获取当前帧图像数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // 对帧执行预测
        let predictionClasses = "";
        const predictions = await dogDetector.detect(imageData);
        // 处理预测结果，比如检查是否有狗被检测到
        for (const prediction of predictions) {
          predictionClasses += `${prediction.class}\n`; // 组装识别的物体名称
          if (prediction.class === "dog") {
            // 播放声音
            playDogBarkSound();
          }
        }
        nameContainer.innerText = predictionClasses.trim(); // 移除末尾的换行符

        requestAnimationFrame(processVideoFrame);
      }
    }
    ```

4.  播放音频

    ```js
    async function playDogBarkSound() {
      if (playing) return;
      playing = true;
      const audio = new Audio(dogBarkSound);
      audio.addEventListener("ended", () => {
        playing = false;
      });
      audio.volume = 0.5; // 调整音量大小
      await audio.play();
    }
    ```

5.  手机开启本地 http 服务

    - 安装 [termux]()
    - 安装 python3
    - 运行 python3 -m http.server 8000

6.  将项目上传到 termux 的目录
    - 直接用 termux 打开文件
    - 访问 http://localhost:8000

## 项目代码(改为 html 文件后)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mobile Dog Detector</title>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js"></script>
    <style>
      #camera-stream {
        width: 200px;
        height: auto;
      }
      #name {
        height: 200px;
        overflow-y: auto;
        font-family: Arial, sans-serif;
      }
    </style>
  </head>
  <body>
    <video id="camera-stream" autoplay playsinline></video>
    <div id="name" style="height: 200px"></div>

    <script>
      let playing = false;
      let dogDetector;

      async function loadDogDetector() {
        // 加载预训练的SSD MobileNet V2模型
        const model = await cocoSsd.load();
        dogDetector = model; // 将加载好的模型赋值给dogDetector变量
        console.log("dogDetector", dogDetector);
        startCamera();
      }
      // 调用函数加载模型
      loadDogDetector();

      async function startCamera() {
        const stream = await navigator.mediaDevices.getUserMedia({
          // video: { facingMode: "environment" },  // 摄像头后置
          video: { facingMode: "user" },
        });
        const nameContainer = document.getElementById("name");
        const videoElement = document.getElementById("camera-stream");
        videoElement.srcObject = stream;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        videoElement.addEventListener("play", async () => {
          requestAnimationFrame(processVideoFrame);
        });
        async function processVideoFrame() {
          if (!videoElement.paused && !videoElement.ended) {
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );

            let predictionClasses = "";
            const predictions = await dogDetector.detect(imageData);
            for (const prediction of predictions) {
              predictionClasses += `${prediction.class}\n`;
              if (prediction.class === "dog") {
                // 修改为检测到狗时播放声音
                playDogBarkSound();
              }
            }
            nameContainer.innerText = predictionClasses.trim();

            requestAnimationFrame(processVideoFrame);
          }
        }

        async function playDogBarkSound() {
          if (playing) return;
          playing = true;
          const audio = new Audio("./getout.mp3");
          audio.addEventListener("ended", () => {
            playing = false;
          });
          audio.volume = 0.5; // 调整音量大小
          await audio.play();
        }
      }
    </script>
  </body>
</html>
```

## 实现效果

效果很好👍，用旧手机开启摄像头后，检测到狗就播放声音了。

但是，家里夫人直接做了一个围栏晚上给狗圈起来了🚫
![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2024/03/da09507c43a9f5d10d698b70fbd8a1a5.png)
## 实现总结

该方案通过以下步骤实现了一个基于网页的实时物体检测系统，专门用于识别画面中的狗并播放特定音频以驱赶它离开沙发。具体实现过程包括以下几个核心部分：

- 调用摄像头：

使用浏览器提供的 navigator.mediaDevices.getUserMedia API 获取用户授权后调用手机摄像头，并将视频流设置给 video 元素展示。

- 加载物体检测模型：

使用 TensorFlow.js 和预训练的 COCO-SSD MobileNet V2 模型进行对象检测，加载模型后赋值给 dogDetector 变量。
处理视频流与图像识别：

监听 video 元素的播放事件，通过 requestAnimationFrame 循环逐帧处理视频。
将当前视频帧绘制到 canvas 上，然后从 canvas 中提取图像数据传入模型进行预测。
在模型返回的预测结果中，如果检测到“dog”，则触发播放音频函数。

- 播放音频反馈：

定义一个异步函数 playDogBarkSound 来播放指定的音频文件，确保音频只在前一次播放结束后才开始新的播放。

- 部署环境准备：

使用旧 Android 手机安装 Termux，创建本地 HTTP 服务器运行项目代码。
上传项目文件至 Termux 目录下并通过访问 localhost:8000 启动应用。


通过以上技术整合，最终实现了在旧手机上部署一个能够实时检测画面中狗的网页应用，并在检测到狗时播放指定音频。
