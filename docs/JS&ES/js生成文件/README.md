# 通过原生 JS 完成 html 文件的生成

## 知识点

- [Bolb()](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/Blob)
  - 接收两个参数（array,options），返回一个 Blob 对象
  - `var aBlob:Blob = new Blob( array:[ArrayBuffer|ArrayBufferView|Blob|DOMString], options:{type:string,endings:string} );`
- [window.URL.createObjectURL()](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL)
  - 接收 Blob 或者 File 对象，返回一个[DOMString](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)包含了一个对象 URL，该 URL 可用于指定源 object 的内容。
- [window.URL.revokeObjectURL()](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/revokeObjectURL)
  - 静态方法用来释放一个之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象。
  - 接收一个 DOMString，通过 URL.createObjectURL()方法产生的 URL 对象
- [URL](https://developer.mozilla.org/zh-CN/docs/Learn/Common_questions/What_is_a_URL)
  - > URL 代表着是统一资源定位符（Uniform Resource Locator）。URL 无非就是一个给定的独特资源在 Web 上的地址。理论上说，每个有效的 URL 都指向一个唯一的资源。这个资源可以是一个 HTML 页面，一个 CSS 文档，一幅图像，等等。而在实际中，也有一些例外，最常见的情况就是一个 URL 指向了不存在的或是被移动过的资源。由于通过 URL 呈现的资源和 URL 本身由 Web 服务器处理，因此 web 服务器的拥有者需要认真地维护资源以及与它关联的 URL。
- [a.download](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a#attr-download)
  - > 尽管 HTTP URL 需要位于同一源中，但是可以使用 blob: URL 和 data: URL ，以方便用户下载使用 JavaScript 生成的内容（例如使用在线绘图 Web 应用程序创建的照片）。

## 代码实现

```js
export2Excel() {
    // 生成html字符串
    const html = gethtml("前端小蜗");
    // 创建一个a标签
    var a = document.createElement("a");
    // 创建一个包含blob对象的url
    var url = window.URL.createObjectURL(
        new Blob([html], {
            type: "",
        })
    );
    a.href = url;
    a.download = "file.html";
    a.click();
    window.URL.revokeObjectURL(url);
}
```

```js
export const gethtml = (title) => {
  let html = `<!DOCTYPE html>
  <html lang="en">
    ...${title}
  </html>
  `;
  return html;
};
```
