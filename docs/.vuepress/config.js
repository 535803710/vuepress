module.exports = {
  title: '前端小蜗',
  base:"/vuepress/",
  description: 'Just playing around',
  head: [
    ['link', { rel: 'icon', href: ('../img/home.jpeg') }]
  ],
  themeConfig: {
    logo: '../img/home.jpeg',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: '前端学习路径', link: 'https://f2e.tech/' },
    ],
    sidebar: [
      '/guide/',
      {
        title:"JS相关",
        path:"/JS&ES/词法环境和闭包/",
        collapsable:false,
        children:[
          '/JS&ES/词法环境和闭包/'
        ]
      },
      {
        title: '小程序相关2',   // 必要的
        path: '/微信/skill/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1,    // 可选的, 默认值是 1
        children: [
          ['/微信/skill/',"小程序技巧"],
          '/微信/小程序原理/'
        ]
      },
      {
        title:"计算机网络",
        path:"/HTTP/",
      },
      {
        title:"Vue",
        path:"/Vue/vue.md",
      },{
        title:"算法",
        path:"/算法/"
      },{
        title:"面试",
        path:"/面试/"
      }
    ]
  }
}