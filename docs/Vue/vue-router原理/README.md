# vue-router 原理

单页面的话都是监听URL改变UI
两种方式 hash 和 history

VueRouter核心是，通过Vue.use注册插件，在插件的install方法中获取用户配置的router对象。当浏览器地址发生变化的时候，根据router对象匹配相应路由，获取组件，并将组件渲染到视图上。

1. url改变
2. 触发事件监听（hash 和 history 的监听不同）
3. 改变vue-router中的current变量
4. 监视current变量的监视者
5. 获取新的组件
6. render

`vue-router` 是 Vue.js 的官方路由管理器，用于在单页面应用（SPA）中实现客户端路由。它的核心原理包括以下几个方面：

1. **Vue组件与路由的映射**：
    - `vue-router` 通过配置文件将路径映射到 Vue 组件。每当 URL 发生变化时，`vue-router` 会根据当前路径动态渲染相应的组件。

2. **路由表配置**：
    - 路由表是一个对象数组，每个对象描述了路径和对应的组件。
    - 例如：
      ```javascript
      const routes = [
          { path: '/', component: Home },
          { path: '/about', component: About }
      ];
      const router = new VueRouter({
          routes
      });
      ```

3. **路由模式**：
    - `vue-router` 支持两种路由模式：`hash` 和 `history`。
        - `hash` 模式：使用 URL 的 hash (`#`) 部分来模拟完整的 URL，当 URL 的 hash 部分发生变化时，页面不会重新加载。
        - `history` 模式：利用 HTML5 History API 使 URL 看起来更“干净”（没有 `#` 号），但需要服务器配置支持，因为刷新页面时会向服务器发出请求。

4. **导航守卫（Navigation Guards）**：
    - `vue-router` 提供了多种导航守卫，用于在导航触发时执行特定逻辑。
        - 全局守卫：`router.beforeEach`、`router.afterEach`。
        - 路由独享守卫：在路由配置中使用 `beforeEnter`。
        - 组件内守卫：在组件内使用 `beforeRouteEnter`、`beforeRouteUpdate`、`beforeRouteLeave`。

5. **动态路由匹配**：
    - `vue-router` 支持动态路由匹配，可以在路径中使用参数。
    - 例如：`/user/:id`，其中 `:id` 是一个动态参数，可以通过 `this.$route.params.id` 访问。

6. **路由懒加载**：
    - 为了优化性能，`vue-router` 支持懒加载组件。即在需要时才加载对应的组件。
    - 例如：
      ```javascript
      const routes = [
          {
              path: '/about',
              component: () => import('./components/About.vue')
          }
      ];
      ```

### Vue Router 工作流程

1. **初始化**：
    - 创建 `VueRouter` 实例并传入路由配置。
    - 在 Vue 实例中通过 `Vue.use(VueRouter)` 安装路由插件。
    - 挂载到 Vue 实例上：
      ```javascript
      new Vue({
          router,
          render: h => h(App)
      }).$mount('#app');
      ```

2. **路径变化监听**：
    - 根据选择的路由模式（`hash` 或 `history`），`vue-router` 会监听 URL 的变化。
    - 在 `hash` 模式下，监听 `hashchange` 事件。
    - 在 `history` 模式下，监听 `popstate` 事件。

3. **路由匹配**：
    - 当路径变化时，`vue-router` 会遍历路由表，找到匹配的路由规则。
    - 如果找到匹配的路由，会加载对应的组件并进行渲染。

4. **导航守卫执行**：
    - 在路径变化后，`vue-router` 会依次执行导航守卫，从而允许或阻止导航。

5. **组件渲染**：
    - 最终，`vue-router` 将匹配到的组件渲染到 `<router-view>` 中。

### 简化实现

以下是一个简化版的 `vue-router` 实现示例：

```javascript
class VueRouter {
    constructor(options) {
        this.routes = options.routes;
        this.mode = options.mode || 'hash';
        this.current = '/';
        this.init();
    }

    init() {
        if (this.mode === 'hash') {
            window.addEventListener('hashchange', () => {
                this.current = window.location.hash.slice(1) || '/';
            });
        } else {
            window.addEventListener('popstate', () => {
                this.current = window.location.pathname || '/';
            });
        }
    }

    match(path) {
        return this.routes.find(route => route.path === path);
    }
}

// 使用示例
const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About }
];

const router = new VueRouter({ routes });

new Vue({
    data: {
        currentRoute: window.location.pathname
    },
    computed: {
        ViewComponent() {
            const match = router.match(this.currentRoute);
            return match ? match.component : NotFound;
        }
    },
    render(h) {
        return h(this.ViewComponent);
    }
}).$mount('#app');
```

这个示例展示了 `vue-router` 的基本原理，简化了实际实现中的许多细节，比如导航守卫、动态路由等。完整的 `vue-router` 功能更多，代码更加复杂，但核心思想一致。