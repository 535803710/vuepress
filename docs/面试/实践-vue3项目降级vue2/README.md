# 把 vue3 项目降级到 vue2 ⬇️

> 原项目为 vue3 + vite + element-plus + pinia + vue-router + typescript 构建
>
> 降级后为 vue2.7 + vite + element-ui + pinia + vue-router + typescript

## 为什么要降级到 vue2 ？

1. 兼容性问题：公司基于 `element-ui` 开发了自己的一套 ui 组件，并且还有基于 vue2 开发的中台组件。由于现有的组件库都是基于 vue2 开发的，完全不兼容 Vue 3。
2. 学习成本：团队中的开发人员可能需要花费大量时间来学习 Vue 3 的新功能。📖
3. 项目需求：项目需求中需要 Vue 3 的新功能的部分我们可以使用 vue2.7 来替代。
4. vue3 无法兼容 IE10 浏览器（虽然觉得没必要考虑这个，但是种种原因...🤫

考虑到上面几点，我想了几个方法 🤔：

- [ ] ~~微前端：考虑过 qiankun 和 micro-app，但是由于 ui 组件使用的是 vue2 开发所以无法兼容~~
- [ ] ~~ui 组件库+中台组件库 升级到 vue3 版本：工程量太大被拒绝~~
- [x] 降级项目到 vue2.7：改动较小，逻辑基本无需改动。成本可控

## vue3 和 vue2 的依赖

vue3 所需依赖

```json
    ...  // other
    "vue": "^3.2.31",
    "vue-router": "^4.0.10",
    "pinia": "^2.0.13",
    "vite": "^2.9.1",
    "vue-tsc": "^0.33.9"
    "prettier": "^2.6.2",
    "element-plus": "^2.1.8",
```

vue2 所需依赖

```json
    ... //other
    "vue": "2.7.5",
    "vue-router": "^3.5.4"
    "pinia": "^2.0.14",
    "vite": "^2.9.9",
    "vue-tsc": "^0.39.5",
    "prettier": "^2.7.1",
    "element-ui": "x.x.x" // 因为公司有自己的ui库 这里用element-ui代替
```

想要把 vue3 的项目降级到 vue2，我们先看下上面的依赖，

1. vue 肯定是需要改动的
2. `vue-router` `也是需要改动：vue-router` 默认版本是@4 但是 vue-router@4 只能支持 vue3，以及为了避免更多的问题，所以我们需要改为 vue-router@3 版本。

## 对比 vue3 和 vu2 的区别

1. 响应式区别：vue3 使用 `proxy` 代理，vue2 使用 `Object.defineProperty()`
2. 选项式 API 和组合式 API
3. 生命周期不同

这里只简单说明，不做重点

## 实践步骤
1. vue 降级
2. vue-router降级
3. 组件库降级
4. pinia或者vuex
5. eslint等工程化

### vue 降级

```
npm i vue@2.7.5
```

将 vue3 的 createApp() 改为 vue.use()

```js
// vue3
import { createApp } from "vue";
const app = createApp(App);
app.use("xxx");
// vue2
import Vue from "vue";
vue.use("xxx");
new Vue({
  //...
}).$mount("#app");
```

### vue-router 降级

```
npm i vue-router@3.6.5
```

将vue-router@4.x.x 降级到 @3.x.x

```ts
// vue3 + vue-router4
import {
  createWebHashHistory,
  createRouter,
} from 'vue-router'

export const constantRoutes = [
    {
        path: 'xxx',
        component: xxx,
        name: 'xxx',
        meta: {
            hidden: true,
        },
        children: [
            {
                path: '/xxx',
                component: () => import('xxx'),
            },
        ],
    },
    ...
]
const router = createRouter({
  history: createWebHashHistory('/admin'),
  routes: constantRoutes,
})
```

``` ts
// vue2.7+ vue-router3

import VueRouter from "vue-router";

export const router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  mode: "hash",
  routes: constantRoutes,
});

export const constantRoutes = [
  {
    path: "/xxx",
    name: "xxx",
    component: () => import("xxx"),
    
  },
  ...
];
```

### element-ui
因为 `element-plus` 是使用vue3重写的组件，所以无法应用在vue2的项目中，所以需要重写安装 `element-ui`

```
npm i element-ui
```

值得庆幸的是，如果你使用的是 `element-ui` ，那么你的改动会很少，`element-plus`和`element-ui`的组件名保持了一致，并且大多数的方法名和属性也都保持了一致。

### pinia
官方说明
> Pinia 最初是在 2019 年 11 月左右重新设计使用 Composition API 。从那时起，最初的原则仍然相同，但 Pinia 对 Vue 2 和 Vue 3 都有效，并且不需要您使用组合 API。 除了安装和 SSR 之外，两者的 API 都是相同的，并且这些文档针对 Vue 3，并在必要时提供有关 Vue 2 的注释，以便 Vue 2 和 Vue 3 用户可以阅读！

同样 `pinia` 作为 `vuex` 的第五代版本，也是完全兼容vue2和vue3的，所以这部分你也基本不用改动。

### eslint + husky + prettier + typescript
值得注意的是 `elint` 在使用vue3的扩展和vue2是不同的，所以不能直接复制粘贴

其他的交验倒是没发现什么问题

## 问题/缺陷
- [ ] 使用vite 构建的话 `federationPlugin` 和 `plugin-legacy` 会有冲突，暂时无法解决

## 总结
总体来说，让vue3的项目降级到vue2是不需要重写的，我们可以尽量的控制修改的代价。

我们需要注意以下几个地方

- vue-router 的语法和版本 
- vue 的语法和版本
- ui组件库的兼容性和标签，属性，方法
- eslint的扩展问题

虽然vue3给我们的开发提供了高效，便利的一方面，但是我们在实践中还是要考虑到公司的开发环境和原有的公共库，做好调查。避免给其他开发人员带来不必要的麻烦。😅