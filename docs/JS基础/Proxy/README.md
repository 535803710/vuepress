# Proxy 与 Reflect

## Proxy

理解就是对目标的透明包装器，改变代理 目标也会改变

| 内部方法 | Handler 方法 | 何时触发 |
| :------- | :------- | :------- |
| [[Get]]  |     get      | 读取属性 |
| [[Set]] | set | 写入属性 |
|[[HasProperty]] |has in| 操作符|
|[[Delete]] | deleteProperty | delete 操作符|
|[[Call]] | apply | 函数调用|
|[[Construct]] | construct | new 操作符|
|[[GetPrototypeOf]] | getPrototypeOf | Object.getPrototypeOf
|[[SetPrototypeOf]] | setPrototypeOf | Object.setPrototypeOf
|[[IsExtensible]] | isExtensible|  Object.|isExtensible |
|[[PreventExtensions]] | preventExtensions |Object.preventExtensions|
|[[DefineOwnProperty]] | defineProperty |Object.defineProperty, Object.|defineProperties| 
|[[GetOwnProperty]] | getOwnPropertyDescriptor | Object.getOwnPropertyDescriptor, for..in, Object.keys/values/entries|
|[[OwnPropertyKeys]] | ownKeys | Object.getOwnPropertyNames, Object.getOwnPropertySymbols, for..in, Object.keys/values/entries|

> 注意⚠️ 很多方法需要返回 `true` 或者 `false` 比如 `set` `delete`

## Reflect
是对目标的反射 包含了目标的所有内部方法，Reflect能够调用这些内部方法。

**为什么 `Relect` 更好？** 

``` js
let user = {
  _name : "xiaowo",
  get name (){
    return this._name
  }
}

const userProxy = new Proxy(user,{
  get(t,p,r){
    return t[p]  // *
  }
})

const admin = {
  __proto__:userProxy,
  _name:"jack"
}

console.log(admin.name) //xiaowo ???
```
问题出在 * 这一行

当读取admin.name 的时候 会触发代理的 get 而这时的 get 捕获器中的 target 是 user ，因为 prop 是一个getter的话将在原始对象 this=target 的上下文中执行，所以需要reflect 去拿到当前的对象。

改写后
``` js
let user = {
  _name : "xiaowo",
  get name (){
    return this._name
  }
}

const userProxy = new Proxy(user,{
  get(t,p,r){
    return Reflect.get(t,p,r)  // * r = admin
  }
})

const admin = {
  __proto__:userProxy,
  _name:"jack"
}

console.log(admin.name) //jack 
```

## Proxy 的局限性

### 内部插槽（internal slot）
像是 Map Set Date Promise 都有内部插槽，类似于属性 可以由内部方法去访问，而不是通过 [[Get]]/[[Set]] 去操作，所以Proxy 无法代理到他们。

比如 Map 会将 item 放到 [[MapData]] 中，内建方法

但是可以通过 bind 绑定到原 Map 上 Vue3中有介绍

```js
let map = new Map();

let proxy = new Proxy(map,{
  get(target,prop,receiver){
    let value = Reflect.get(...arguments)
    console.log(value)
    return typeof value === 'function' ? value.bind(target):value
  }
})

proxy.set('test', 1);
alert(proxy.get('test')); // 1（工作了！）

```

### Proxy != target
对象是无法严格相等的，一个对象严格等于只有自己

## 总结
Proxy 是对象的包装器，将代理上的操作转发到对象，并可以选择捕获其中一些操作。

Proxy 可以代理任何对象类型的属性，包括类，函数

Proxy有13种操作方法，包括get ，set， new的construct，函数的apply

Reflect是为了补充Proxy 对于Proxy的操作方法都有一个Reflect的调用，将调用转发给目标对象

Proxy 无法代理 内部插槽（属性），需要bind到代理前的对象（目标对象）

Proxy和目标对象不相等，对象只严格相等于自己。
