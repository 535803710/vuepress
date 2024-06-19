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
      { text: "学习路线图", link: "https://roadmap.sh/" },
      { text: "我的其他文章", link: "https://juejin.cn/user/61995432544503" },
    ],
    sidebarDepth: 3,
    sidebar: [
      "/guide/",
      {
        title: "JS基础",
        path: "/JS基础/",
        children: [
          ["/JS基础/事件委托/", "JS事件"],
          "/JS基础/词法环境和闭包/",
          ["/JS基础/原型和原型链/", "原型和原型链"],
          ["/JS基础/JavaScript异步编程和事件循环详解/", "事件循环"],
          ["/JS基础/Promise/", "Promise 实现"],
          "/JS基础/Proxy/",
          "/JS基础/深入模块import和require/",
          "/JS基础/Mixin模式/",
          ["/JS基础/尾递归/", "递归,尾递归,执行上下文和堆栈"],
        ],
      },
      {
        title: "小程序", // 必要的
        path: "/小程序/", // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        // collapsable: false, // 可选的, 默认值是 true,
        // sidebarDepth: 2,    // 可选的, 默认值是 1
        children: [
          ["/小程序/小程序监听页面滚动/", "小程序监听页面滚动"],
          ["/小程序/小程序原理/", "小程序底层原理"],
        ],
      },
      {
        title: "浏览器", // 必要的
        path: "/浏览器/", // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        children: [
          ["/浏览器/浏览器渲染/", "浏览器渲染"],
          "/浏览器/V8引擎/",
          "/浏览器/屏幕录制/",
          ["/浏览器/阻止默认事件/", "阻止浏览器默认事件"],
          "/浏览器/CSS的color()/",
        ],
      },
      {
        title: "HTTP",
        path: "/HTTP/",
        // sidebarDepth: 3,    // 可选的, 默认值是 1
        children: [
          "/HTTP/http缓存/",
          ["/HTTP/计算机网络/", "计算机网络知识点"],
          "/HTTP/长轮询/",
        ],
      },
      {
        title: "Node",
        path: "/Node/拦截器/",
        children: ["/Node/拦截器/"],
      },
      {
        title: "Vue",
        path: "/Vue/vue",
        children: [
          ["/Vue/快速diff算法/", "快速diff算法"],
          ["/Vue/双端diff算法/", "双端diff算法"],
          ["/Vue/vue2.7注意事项/", "Vue2.7失去响应"],
          "/Vue/vue-router原理/",
          "/Vue/Pug语法/",
        ],
      },
      {
        title: "React",
        path: "/React/",
        children: [
          ["/React/JSX/", "JSX"],
          ["/React/React 基础/", "React 基础"],
          ["/React/React 架构/", "React 架构 （数据更新流程设计）"],
          ["/React/React 实践/", "React 实践 （自定义hooks）"],
          ["/React/React 原理/", "React 原理 （hooks 原理）"],
          ["/React/React 优化/", "React 优化 （渲染控制）"],
        ],
      },
      {
        title: "算法",
        path: "/算法/算法复杂度/",
        children: ["/算法/算法复杂度/"],
      },
      {
        title: "最佳实践",
        path: "/最佳实践/",
        children: [
          "/最佳实践/性能优化/",
          "/最佳实践/前端安全/",
          "/最佳实践/函数式编程/",
          "/最佳实践/防抖节流/",
          "/最佳实践/Feed流(交互式推荐)探索应用/",
          "/最佳实践/将轮询放入webworker中/",
          ["/最佳实践/webpack知识点/", "webpack知识点"],
          "/最佳实践/垃圾回收机制/",
          "/最佳实践/设计模式/",
          "/最佳实践/断点续传/",
          "/最佳实践/拖放/",
          "/最佳实践/状态机/",
          "/最佳实践/预请求策略/",
          "/最佳实践/手机开启摄像头识别后做出行为/",
          ["/最佳实践/动态创建WebWorker/", "WebWorker 和动态创建webworker"],
          "/最佳实践/纯CSS实现文字环绕/",
          "/最佳实践/实践-vue3项目降级vue2/",
          "/最佳实践/js生成文件/",
        ],
      },
      {
        title: "TypeScrpit",
        path: "/TS指南/",
        children: [
          "/TS指南/类型/",
          "/TS指南/类型工具/",
          "/TS指南/协变与逆变/",
          "/TS指南/装饰器/",
          "/TS指南/反射元数据/",
        ],
      },
      {
        title: "心得体会",
        path: "/心得/",
        children: [
          "/心得/避免过度设计/",
          "/心得/程序设计层次/",
          "/心得/前端框架/",
          "/心得/前端框架集合分享/",
          ["/心得/框架类型/", "框架类型（运行时，编译时，运行+编译）"],
        ],
      },
    ],
  },
  markdown: {
    anchor: { permalink: true, permalinkBefore: true, permalinkSymbol: "#" },
  },
};
