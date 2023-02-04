# vue2.7 数组索引赋值失败问题

## 问题

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/572fa6ddbc6041bb86b2b71c5283a9a4~tplv-k3u1fbpfcp-watermark.image?)

```ts
const arr = ref([{ name: "a" }, { name: "b" }, { name: "c" }, { name: "d" }]);
const fn = (index: number) => {
  arr.value[index] = arr.value[index + 1];
  console.log("///", arr.value);
};

// 如果使用了ts的话 age 找不到会报错
const obj1 = ref<Record<string, any>>({
  name: "1",
});
const fn2 = () => {
  obj1.value.age = 123;
  console.log("\\\\", obj1.value);
};
```

当在 `Vue2.7` 使用数组的索引值(下标)来修改数组的值时，会发现：console 的打印值是正确的，而页面上绑定的内容却没有更新。

## 原因

归根结底是因为 `Vue2.7` 还 是 `Vue 2` 最新的次级版本。只是其提供了内置的组合式 API 支持。

在 `Vue 2.7` 中，从 `Vue 3` 移植回了最重要的一些特性，使得 `Vue 2` 用户也可以享有这些便利。但是关于一些底层的逻辑还是没有办法改变，其中重要的就是 `Vue2` 和 `Vue3` 使用了
不同的响应式原理

- `Vue2` 中 使用的是 `Object.defineProperty()` 来监听对象的 `set` 、`get` ，配合观察者模式来实现响应式
- `Vue3` 中 使用的是 ES6 中的 `Proxy` 语法来代理对象或者数组，从而实现对数据的响应式

vue2 中的数组监听是重写了数组的方法 所以使用索引(下标)修改后并不会触发 `setter`

## 解决

既然知道了是 `Vue2` 中的问题
那个解决方法就简单了

```ts
import { ref, set } from "vue";
//...
const arr = ref([{ name: "a" }, { name: "b" }, { name: "c" }, { name: "d" }]);
const fn = (index: number) => {
  // arr.value[index] = arr.value[index + 1];
  set(arr.value, index, arr.value[index + 1]);
  console.log("///", arr.value);
};

const obj1 = ref<Record<string, any>>({
  name: "1",
});
const fn2 = () => {
  // obj1.value.age = 123;
  set(obj1.value, "age", 123);
  console.log("\\\\", obj1.value);
};
```

从 vue 中导出 `set` 函数， 使用 `set() `来重写修改数组或者对象的值。

## Vue2.7 中移植回来的特性

- 组合式 API
- 单文件组件内的 `<script setup>`
- 单文件组件内的 CSS v-bind

此外我们还支持了以下 API：

- `defineComponent()` 以改善类型推断 (较之于 `Vue.extend`)
- `h()`、`useSlot()`、`useAttrs()`、`useCssModules()`
- `set()`、`del()` 和 `nextTick()` 也在 ESM 构建版本中被导出为具名 API。
- 支持 emits 选项，但仅以类型检查为目的 (并不会影响运行时的行为)

  2.7 也在模板表达式中支持了 ESNext 语法。当配合构建系统使用时，编译后的模板渲染函数将会经过和处理普通 `JavaScript` 相同配置的 `loader` / 插件。这意味着如果你为 .js 文件配置了 Babel，这些配置也会应用在单文件组件的模板表达式中。

## 与 Vue 3 的行为差异

**组合式 API 使用了 Vue 2 中基于 getter/setter 的响应式系统，以确保浏览器的兼容性。这意味着其行为和 Vue 3 中基于代理的系统相比有一些重要的区别：**

- 所有 Vue 2 检测变化的注意事项依然存在。
- `reactive()`、`ref()` 和 `shallowReactive()` 会直接转换原始的对象而不是创建代理。这意味着：

```js
// 2.7 中为 true，3.x 中为 false
reactive(foo) === foo;
```

- `readonly()` 会创建一个独立的对象，但是其不会追踪新添加的属性，也不会对数组生效。
- 避免将数组作为 `reactive()` 的根值。因为无法访问属性，数组的变更不会被追踪到 (这样做会产生一则警告)。
- 响应式 API 会忽略以 `symbol` 作为 key 的属性。

此外，并没有移植回以下特性：

- ❌ `createApp()` (Vue 2 不支持相互隔离的应用 scope)
- ❌ `<script setup>` 中的顶层 `await` (Vue 2 不支持异步组件初始化)
- ❌ 模板表达式中的 `TypeScript` 语法 (与 Vue 2 parser 不兼容)
- ❌ 响应性语法糖 (仍处于试验阶段)
- ❌ 选项式组件不支持 expose (但是在 `<script setup>` 中支持 `defineExpose()`)。
