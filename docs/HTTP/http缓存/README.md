# http缓存

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/808ffb42cdf834744c225a81231a88f2.png)
<!-- ![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/07/808ffb42cdf834744c225a81231a88f2.png) -->


## 强缓存

不需要向服务器发送请求，读取浏览器本地缓存，HTTP状态码是200，由三个属性控制 Expires、Cache-Control 和 Pragma
- Pragma
  - Pragma 只有一个属性值，就是 no-cache ，效果和 Cache-Control 中的 no-cache 一致，不使用强缓存，需要与服务器验证缓存是否新鲜，在 3 个头部属性中的优先级最高。
- Cache-Control
  - max-age：单位是秒，缓存时间计算的方式是距离发起的时间的秒数，超过间隔的秒数缓存失效
  - no-cache：不使用强缓存，需要与服务器验证缓存是否新鲜
  - no-store：禁止使用缓存（包括协商缓存），每次都向服务器请求最新的资源
  - private：专用于个人的缓存，中间代理、CDN 等不能缓存此响应
  - public：响应可以被中间代理、CDN 等缓存
  - must-revalidate：在缓存过期前可以使用，过期后必须向服务器验证

- Expires
  - 是一个HTTP日期，发起请求时会根据系统时间个Expire对比，优先级最低，会存在本地时间和服务器时间不一致情况。


## 协商缓存
先去服务器验证缓存是否过期，过期则重新请求，否则HTTP状态码返回304并且设置Last-Modified或者Etag属性。

- Etag/If-None-Match
  - 用一串hash码代表资源的标识符，文件发生变化才会改变hash码。通过If-None-Match 和 文件的hash比较一样则命中缓存。
- Last-Modified/If-Modified-Since
  - 值代表文件最后修改的时间，第一次会把文件修改的时间放到Last-Modified，第二次发起请求的时候，请求头会带上上一次响应头中的 Last-Modified 的时间，并放到 If-Modified-Since 请求头属性中，服务端根据文件最后一次修改时间和 If-Modified-Since 的值进行比较，如果相等，返回 304 ，并加载浏览器缓存。


ETag/If-None-Match 的出现主要解决了 Last-Modified/If-Modified-Since 所解决不了的问题：

- 如果文件的修改频率在秒级以下，Last-Modified/If-Modified-Since 会错误地返回 304
- 如果文件被修改了，但是内容没有任何变化的时候，Last-Modified/If-Modified-Since 会错误地返回 304 ，上面的例子就说明了这个问题

## HTTP缓存流程
![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/07/4bf8c40f58597b70d097f0d90703f2fe.webp)
<!-- ![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fea0fec0b4668~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp) -->

