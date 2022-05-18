# 前端安全问题

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb8128580eea45ff955ee50bfb30d2f4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

## XSS

Cross-Site Scripting（跨站脚本攻击）为了和 CSS 区分。代码注入攻击，在目标网站上注入恶意代码。

有三种方式

### 反射型 XSS 攻击

将恶意代码发送到网站请求上，一般发生在前后端一体的应用。

### 基于 DOM 的 XSS 攻击

通过特殊的 URL 改变 HTML 获取用户信息 或者执行攻击者指定操作

### 存储型 XSS 攻击

将 JS 脚本保存到服务端中的数据库中，常见搜索、微博、贴吧

### 三者区别

- 反射型 XSS 攻击常见于通过 URL 传递参数的功能，如网站搜索、跳转等。
- 存储型 XSS 攻击常见于带有用户保存数据的网站功能，如论坛发帖、商品评论、用户私信等。
- 而基于 DOM 的 XSS 攻击中，取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞，其他两种 XSS 都属于服务端的安全漏洞。

### XSS 防范措施

攻击主要有两个步骤

- 攻击者提交恶意代码
- 浏览器执行恶意代码

#### 输入过滤

对用户输入的内容进行过滤，但可能绕过前端直接请求服务端，需要后端校验。

#### 预防存储型 XSS 攻击

- 将代码和数据分开，纯前端渲染
- HTML 做转义

#### 预防 DOM XSS 攻击

- 小心使用 .innerHTML、.outerHTML、document.write()，使用.textContent、.setAttribute()
- vue/react 不要使用 v-html/dangerouslySetInnerHTML
- DOM 中的内联事件监听器，如 location、onclick、onerror、onload、onmouseover 等，`<a>` 标签的 href 属性，JavaScript 的 eval()、setTimeout()、setInterval() 等，都能把字符串作为代码运行。如果不可信的数据拼接到字符串中传递给这些 API，很容易产生安全隐患，请务必避免。

#### Content Security Policy (CSP)

使用 W3C 提出的 CSP (Content Security Policy，内容安全策略)，定义域名白名单

## 跨站请求伪造（CSRF）

CSRF（Cross-site request forgery）跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。
主要是 cookie

### CSRF 如何攻击？

典型的 CSRF 攻击是这样的：

- 受害者登录 A 网站，并且保留了登录凭证（Cookie）
- 攻击者引诱受害者访问 B 网站
- B 网站向 A 网站发送了一个请求（这个就是下面将介绍的几种伪造请求的方式），浏览器请求头中会默认携带 A 网站的 Cookie
- A 网站服务器收到请求后，经过验证发现用户是登录了的，所以会处理请求

### 攻击类型

- GET 利用 img 不需要跨域 向被害者服务发送请求
- POST 利用 FORM 自动提交表单
- 链接类型 `<a></a>`

### CSRF 特点

- 一般发起在第三方网站
- 利用受害者在被攻击网站的凭证 cookie 冒充提交操作
- 不能获取到凭证，只能冒用
- 方法很多 img a CORS Form

### 防范

因为发生在三方域名，不能获取 cookie 只是借用

#### 同源检测

在 HTTP 协议中，每一个异步请求都会携带两个 Header，用于标记来源域名：

- Origin Header
- Referer Header

#### CSRF Token

- 发送请求时带上一个 token 放在表单隐藏的 input 里
- 提交的时候携带
- 服务端校验

#### cookie 设置合适的 SameSite

当从 A 网站登录后，会从响应头中返回服务器设置的 Cookie 信息，而如果 Cookie 携带了 SameSite=strict 则表示完全禁用第三方站点请求头携带 Cookie，比如当从 B 网站请求 A 网站接口的时候，浏览器的请求头将不会携带该 Cookie。

- Samesite=Strict，这种称为严格模式，表明这个 Cookie 在任何情况下都不可能作为第三方 Cookie

- Samesite=Lax，这种称为宽松模式，比 Strict 放宽了点限制：假如这个请求是这种请求（改变了当前页面或者打开了新页面）且同时是个 GET 请求，则这个 Cookie 可以作为第三方 Cookie。（默认）

- None 任何情况下都会携带；

## 点击劫持（ClickJacking）

攻击者将受害者网站伪装成 iframe 透明 当到按钮上面

### 防范

- 在 HTTP 投中加入 X-FRAME-OPTIONS 属性，此属性控制页面是否可被嵌入 iframe 中

  - DENY：不能被所有网站嵌套或加载；
  - SAMEORIGIN：只能被同域网站嵌套或加载；
  - ALLOW-FROM URL：可以被指定网站嵌套或加载。

- 判断当前网页是否被 iframe 嵌套

```js
//方式一
if (self.frameElement && self.frameElement.tagName == "IFRAME") {
  alert("在iframe中");
}
//方式二
if (window.frames.length != parent.frames.length) {
  alert("在iframe中");
}
//方式三
if (self != top) {
  alert("在iframe中");
}
```

## HTTP 严格传输安全 （HSTS）

服务器告诉浏览器只用 https 通讯

- 访问 http 的时候转换 https
- 防止中间人攻击
- 不允许覆盖无效证书信息
- cookie 劫持

**如果之前没有使用 HTTPS 协议访问过该站点，那么 HSTS 是不奏效的** ，建立过一次 https 链接才行

### 开启 HSTS

服务端开启

## CDN 劫持

### 原理

CDN——Content Delivery Network，内容分发网络。将用户访问执行距离最近的缓存服务器。

### 防范

SRI 全称 Subresource Integrity - 子资源完整性，是指浏览器通过验证资源的完整性（通常从 CDN 获取）来判断其是否被篡改的安全特性。
通过给 link 标签或者 script 标签增加 integrity 属性即可开启 SRI 功能

```html
<script
  type="text/javascript"
  src="//s.url.cn/xxxx/aaa.js"
  integrity="sha256-xxx sha384-yyy"
  crossorigin="anonymous"
></script>
```

### 浏览器处理 SRI

script 开启 Integrity 后匹配哈希值 一致则返回

## 内容安全策略（CSP）

内容安全策略（Content Security Policy）简称 CSP，通过它可以明确的告诉客户端浏览器当前页面的哪些外部资源可以被加载执行，而哪些又是不可以的。

CSP 白名单机制，告诉客户端哪些资源可以加载执行，

### CSP 的分类

- Content-Security-Policy 配置好并启用后，不符合 CSP 的外部资源就会被阻止加载。
- Content-Security-Policy-Report-Only 表示不执行限制选项，只是记录违反限制的行为。它必须与 report-uri 选项配合使用。

### 使用

通过 HTTP 头配置 Content-Security-Policy，以下配置说明该页面只允许当前源和 https://apis.google.com 这 2 个源的脚本加载和执行：

```js
Content-Security-Policy: script-src 'self' https://apis.google.com
```

```js
<meta http-equiv="Content-Security-Policy" content="script-src 'self' https://apis.google.com">
```
