# 浏览器相关

### 跨域

跨域（Cross-Origin Resource Sharing, CORS）指的是浏览器在同源策略（Same-Origin Policy）限制下，网页脚本只能访问与其相同源的资源。一个源（Origin）由协议、域名和端口三部分组成。例如，来自 http://example.com:80 的网页脚本不能访问 http://another-domain.com:80 的资源，因为它们的源不同。

**解决方案**

- JSONP：适用于简单的 GET 请求，但安全性较差，不适用于现代应用。
- CORS：是解决跨域问题的标准方法，推荐使用，但需要后端支持。
- 代理服务器：适合在开发环境中使用，配置简单。
- 服务器端中转：适用于复杂的请求或后端逻辑，但增加了服务器的负担。
- img 标签通常不会受到跨域影响

[从 url 到渲染](./浏览器渲染/README.md)

[浏览器缓存](./http缓存/README.md)

[屏幕录制](./屏幕录制/README.md)

[阻止默认事件](./阻止默认事件/README.md)

[CSS 的 color()](<./CSS的color()/README.md>)

[V8 引擎](./浏览器渲染/README.md)
![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/7f81b9b58b95ccfa0cee828eac417fdd.webp)
