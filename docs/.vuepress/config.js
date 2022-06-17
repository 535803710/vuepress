module.exports = {
  title: "前端小蜗",
  base: "/vuepress/",
  description: "Just playing around",
  head: [["link", { rel: "icon", href: "/img/home.jpeg" }]],
  themeConfig: {
    logo: "/img/home.jpeg",
    nav: [
      { text: "首页", link: "/" },
      { text: "指南", link: "/guide/" },
      { text: "前端学习路径", link: "https://f2e.tech/" },
    ],
    sidebarDepth: 3,
    sidebar: [
      "/guide/",
      {
        title: "JS相关",
        path: "/JS&ES/词法环境和闭包/",
        // collapsable:false,
        children: [
          "/JS&ES/词法环境和闭包/",
          ["/JS&ES/事件委托/", "事件委托"],
          ["/JS&ES/尾递归/", "递归，尾递归，执行上下文和堆栈"],
          ["/JS&ES/框架类型/", "框架类型（运行时，编译时，运行+编译）"],
          ["/JS&ES/js生成文件/", "JS生成并下载文件"],
          "/JS&ES/原型和原型链/",
          "/JS&ES/浏览器渲染/",
          "/JS&ES/Proxy/",
          '/JS&ES/深入模块import 和require/',
          "/JS&ES/Mixin模式/"
        ],
      },
      {
        title: "小程序", // 必要的
        path: "/微信/", // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        // collapsable: false, // 可选的, 默认值是 true,
        // sidebarDepth: 2,    // 可选的, 默认值是 1
        children: [
          ["/微信/小程序监听页面滚动/", "小程序监听页面滚动"],
          ["/微信/小程序原理/", "小程序底层原理"],
        ],
      },
      {
        title: "HTTP",
        path: "/HTTP/",
        // sidebarDepth: 3,    // 可选的, 默认值是 1
        children: [
          "/HTTP/http缓存/",
          ["/HTTP/计算机网络/", "计算机网络知识点"],
          "/HTTP/长轮询/"
        ],
      },
      {
        title: "Vue",
        path: "/Vue/vue",
        children: [
          ["/Vue/快速diff算法/", "快速diff算法"],
          ["/Vue/双端diff算法/", "双端diff算法"],
          "/Vue/vue-router原理/"
        ],
      },
      {
        title: "算法",
        path: "/算法/",
      },
      {
        title: "面试",
        path: "/面试/",
        children: [
          "/面试/性能优化/",
          ["/面试/webpack知识点/", "webpack知识点"],
          "/面试/垃圾回收机制/",
          "/面试/设计模式/",
          "/面试/防抖节流/",
          "/面试/前端安全/",
          "/面试/断点续传/"
        ],
      },
    ],
  },
  markdown: {
    anchor: { permalink: true, permalinkBefore: true, permalinkSymbol: "#" },
  },
};
