# 基础回顾

先回顾一下 Promise 的基本使用方法及特点

promise 三个状态：进⾏中（pending）、已完成(fulfilled)、已拒绝（rejected）
处理 promise 异常的三种方式：

通过 promise 的 then 的第二个参数
通过.catch 处理
通过 try...catch 处理

promise 状态处理

处于等待态时，promise 需满⾜以下条件：可以变为「已完成」或「已拒绝」
处于已完成时，promise 需满⾜以下条件：不能迁移⾄其他任何状态；必须拥有⼀个不可变的值
处于已拒绝时，promise 需满⾜以下条件：不能迁移⾄其他任何状态；必须拥有⼀个不可变的原

## 一、声明 Promise 类，并进行初始化操作

首先定义一个 Promise 类，然后进行一些初始化操作。

- 接收一个回调函数 callback，回调函数包含两个参数，一个 resolve，一个 reject
- 初始化状态为 pending
- 初始化成功状态的值
- 初始化失败状态的值
- 定义 resolve 函数
- 定义 reject 函数

```js
class MyPromise {
  constructor(callback) {
    // 初始化状态为 pending
    this.status = "pending";
    // 初始化成功状态的值
    this.value = undefined;
    // 初始化失败状态的值
    this.reason = undefined;

    // 定义 resolve 函数
    const resolve = (value) => {
      if (this.status === "pending") {
        // 更新状态为 resolved
        this.status = "resolved";
        // 存储成功状态的值
        this.value = value;
      }
    };

    // 定义 reject 函数
    const reject = (reason) => {
      if (this.status === "pending") {
        // 更新状态为 rejected
        this.status = "rejected";
        // 存储失败状态的值
        this.reason = reason;
      }
    };

    // 调用回调函数，将 resolve 和 reject 传递给它
    callback(resolve, reject);
  }
}
```

## 二、then 方法

接下来定义 Promsie 类中 then 函数。

- 首先创建一个 Promise 对象，根据 Promise 的状态来执行不同的回调函数。then 函数接收两个参数，一个 onResolved（Promise 的状态为成功时候调用），一个 onRejected（Promise 的状态为失败时候调用）。
- then 函数返回一个新的 Promsie 对象，它的值取决于回调函数的返回值
- 如果当前状态是 pending，需要将 onResolved，onRejected 回调保存起来，等异步结束之后再执行

```js

class MyPromise {
 then(onResolved, onRejected) {
    // 创建一个新的 Promise 对象
    const newPromise = new MyPromise((resolve, reject) => {
      // 如果当前 Promise 的状态为 resolved
      if (this.status === 'resolved') {
        try {
          // 执行 onResolved 回调函数
          const x = onResolved(this.value);
          // 处理返回值
          resolve(x);
        } catch (error) {
          // 如果回调函数抛出异常，将异常作为失败状态的值
          reject(error);
        }
      }

      // 如果当前 Promise 的状态为 rejected
      if (this.status === 'rejected') {
        try {
          // 执行 onRejected 回调函数
          const x = onRejected(this.reason);
          // 处理返回值
          resolve(x);
        } catch (error) {
          // 如果回调函数抛出异常，将异常作为失败状态的值
          reject(error);
        }
      }

      // 如果当前 Promise 的状态为 pending
      if (this.status === 'pending') {
        // 将 onResolved 和 onRejected 保存起来
        // 等待异步操作完成后再执行
        this.onResolvedCallbacks.push(() => {
          try {
            const x = onResolved(this.value);
            resolve(x);
          } catch (error) {
            reject(error);
                });

    this.onRejectedCallbacks.push(() => {
      try {
        const x = onRejected(this.reason);
        resolve(x);
      } catch (error) {
        reject(error);
      }
    });
  }
});
// 返回新的 Promise 对象
return newPromise;
}

```

三、catch 方法
将 catch 方法转化为 then 方法的一个语法糖，就可以实现啦。到这里我们基本已经实现了一个 Promise

```js
class MyPromise {
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}
```

四、基础完整版代码

```js
class MyPromise {
  constructor(callback) {
    // 初始化状态为pending
    this.status = "pending";
    // 初始化值为空字符串
    this.value = "";
    // 初始化原因为空字符串
    this.reason = "";
    // 存储成功状态的回调函数数组
    this.onResolvedCallbacks = [];
    // 存储失败状态的回调函数数组
    this.onRejectedCallbacks = [];

    // 定义resolve函数，用于将状态从pending变为resolved
    const resolve = (value) => {
      if (this.status == "pending") {
        this.status = "resolved";
        this.value = value;
        // 执行所有成功状态的回调函数
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };
    // 定义reject函数，用于将状态从pending变为rejected
    const reject = (reason) => {
      if (this.status == "pending") {
        this.status = "rejected";
        this.reason = reason;
        // 执行所有失败状态的回调函数
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    try {
      // 调用传入的回调函数，并传入resolve和reject函数
      callback(resolve, reject);
    } catch (error) {
      // 如果回调函数抛出异常，则调用reject函数
      reject(error);
    }
  }

  then(onResolved, onRejected) {
    // 如果onResolved是函数，则直接使用，否则默认为返回值不变的函数
    onResolved =
      typeof onResolved === "function" ? onResolved : (value) => value;
    // 如果onRejected是函数，则直接使用，否则默认为抛出异常的函数
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    // 创建一个新的Promise对象
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status == "resolved") {
        try {
          // 如果当前状态为resolved，则调用onResolved函数处理值
          const x = onResolved(this.value);
          resolve(x);
        } catch (error) {
          // 如果onResolved函数抛出异常，则调用reject函数
          reject(error);
        }
      }
      if (this.status == "rejected") {
        try {
          // 如果当前状态为rejected，则调用onRejected函数处理原因
          const x = onRejected(this.reason);
          resolve(x);
        } catch (error) {
          // 如果onRejected函数抛出异常，则调用reject函数
          reject(error);
        }
      }
      if (this.status == "pending") {
        // 如果当前状态为pending，则将回调函数添加到对应的数组中
        this.onResolvedCallbacks.push(() => {
          if (this.status == "resolved") {
            try {
              // 如果当前状态变为resolved，则调用onResolved函数处理值
              const x = onResolved(this.value);
              resolve(x);
            } catch (error) {
              // 如果onResolved函数抛出异常，则调用reject函数
              reject(error);
            }
          }
        });
        this.onRejectedCallbacks.push(() => {
          if (this.status == "rejected") {
            try {
              // 如果当前状态变为rejected，则调用onRejected函数处理原因
              const x = onRejected(this.reason);
              resolve(x);
            } catch (error) {
              // 如果onRejected函数抛出异常，则调用reject函数
              reject(error);
            }
          }
        });
      } else {
        // 执行完所有回调函数之后，清空回调数组
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
      }
    });
    // 返回新的Promise对象
    return promise2;
  }
  catch(onRejected) {
    // 等同于then(null, onRejected)
    return this.then(null, onRejected);
  }
}
```
