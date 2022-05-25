# vue-router 原理

单页面的话都是监听URL改变UI
两种方式 hash 和 history

VueRouter核心是，通过Vue.use注册插件，在插件的install方法中获取用户配置的router对象。当浏览器地址发生变化的时候，根据router对象匹配相应路由，获取组件，并将组件渲染到视图上。

1. url改变
2. 触发事件监听
3. 改变vue-router中的current变量
4. 监视current变量的监视者
5. 获取新的组件
6. render