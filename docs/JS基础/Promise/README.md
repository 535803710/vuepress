# 基础回顾
先回顾一下Promise的基本使用方法及特点

promise三个状态：进⾏中（pending）、已完成(fulfilled)、已拒绝（rejected）
处理promise异常的三种方式：

通过promise的then的第二个参数
通过.catch处理
通过try...catch处理


promise状态处理

处于等待态时，promise 需满⾜以下条件：可以变为「已完成」或「已拒绝」
处于已完成时，promise 需满⾜以下条件：不能迁移⾄其他任何状态；必须拥有⼀个不可变的值
处于已拒绝时，promise 需满⾜以下条件：不能迁移⾄其他任何状态；必须拥有⼀个不可变的原



## 一、声明Promise类，并进行初始化操作
首先定义一个Promise类，然后进行一些初始化操作。

- 接收一个回调函数callback，回调函数包含两个参数，一个resolve，一个reject
- 初始化状态为pending
- 初始化成功状态的值
- 初始化失败状态的值
- 定义resolve函数
- 定义reject函数

```js
class MyPromise {
  constructor(callback) {
    // 初始化状态为 pending
    this.status = 'pending';
    // 初始化成功状态的值
    this.value = undefined;
    // 初始化失败状态的值
    this.reason = undefined;

    // 定义 resolve 函数
    const resolve = value => {
      if (this.status === 'pending') {
        // 更新状态为 resolved
        this.status = 'resolved';
        // 存储成功状态的值
        this.value = value;
      }
    };

    // 定义 reject 函数
    const reject = reason => {
      if (this.status === 'pending') {
        // 更新状态为 rejected
        this.status = 'rejected';
        // 存储失败状态的值
        this.reason = reason;
      }
    };

    // 调用回调函数，将 resolve 和 reject 传递给它
    callback(resolve, reject);
  }
}

```

## 二、then方法
接下来定义Promsie类中then函数。

- 首先创建一个Promise对象，根据Promise的状态来执行不同的回调函数。then函数接收两个参数，一个onResolved（Promise 的状态为成功时候调用），一个onRejected（Promise 的状态为失败时候调用）。
- then函数返回一个新的Promsie对象，它的值取决于回调函数的返回值
- 如果当前状态是pending，需要将onResolved，onRejected回调保存起来，等异步结束之后再执行

javascript复制代码class MyPromise {
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

三、catch方法
将 catch 方法转化为 then 方法的一个语法糖，就可以实现啦。到这里我们基本已经实现了一个Promise
javascript复制代码class MyPromise {
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

四、基础完整版代码
javascript复制代码class MyPromise {
  constructor(callback) {
    // 初始化状态为 pending
    this.status = 'pending';
    // 初始化成功状态的值
    this.value = undefined;
    // 初始化失败状态的值
    this.reason = undefined;
    // 存储成功状态的回调函数
    this.onResolvedCallbacks = [];
    // 存储失败状态的回调函数
    this.onRejectedCallbacks = [];

    // 定义 resolve 函数
    const resolve = value => {
      if (this.status === 'pending') {
        // 更新状态为 resolved
        this.status = 'resolved';
        // 存储成功状态的值
        this.value = value;
        // 执行所有成功状态的回调函数
        this.onResolvedCallbacks.forEach(cb => cb());
      }
    };

    // 定义 reject 函数
    const reject = reason => {
      if (this.status === 'pending') {
        // 更新状态为 rejected
        this.status = 'rejected';
        // 存储失败状态的值
        this.reason = reason;
        // 执行所有失败状态的回调函数
        this.onRejectedCallbacks.forEach(cb => cb());
      }
    };

    // 调用回调函数，将 resolve 和 reject 传递给它
    callback(resolve, reject);
  }

    // 创建一个新的 Promise 对象
    const promise2 = new MyPromise((resolve, reject) => {
      // 如果当前 Promise 的状态为 resolved
      if (this.status === 'resolved') {
        try {
          // 执行 onResolved 回调函数
          const x = onResolved(this.value);
          // 处理返回值
          resolve(x);
        } catch
      (error) {
        // 如果回调函数抛出异常，则将异常作为新 Promise 的失败状态的值
        reject(error);
      }
    });
  }

  // 如果当前 Promise 的状态为 rejected
  if (this.status === 'rejected') {
    try {
      // 执行 onRejected 回调函数
      const x = onRejected(this.reason);
      // 处理返回值
      resolve(x);
    } catch (error) {
      // 如果回调函数抛出异常，则将异常作为新 Promise 的失败状态的值
      reject(error);
    }
  }

  // 如果当前 Promise 的状态为 pending
  if (this.status === 'pending') {
    // 将 onResolved 和 onRejected 回调函数保存起来，等待异步操作完成后再执行
    this.onResolvedCallbacks.push(() => {
      try {
        const x = onResolved(this.value);
        resolve(x);
      } catch (error) {
        reject(error);
      }
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
  return promise2;
}
catch(onRejected) {
   return this.then(null, onRejected);
   }
}

五、案例测试
生成一个myPromsie对象，然后用then方法进行链式调用。
javascript复制代码		const promise = new MyPromise((resolve, reject) => {
			setTimeout(() => {
				console.log('1')
				resolve('成功')
			}, 1000)
		})
		promise.then(value => {
			console.log('2')
			return "第一次"
		}).then(value => {
			console.log('3')
			return new MyPromise((resolve, reject) => {
				setTimeout(() => {
					resolve('第二次处理结果');
				}, 1000);
			});
		}).then(value => {
			console.log(value);
			throw new Error('抛出异常');
		}).catch(error => {
			console.log(error);
		});


六、问题
1. 为什么then函数中需要考虑Promise状态为pending的情况？
当 then 方法被调用时，我们首先需要判断原始 Promise 对象的状态。

如果原始 Promise 对象的状态为 fulfilled，那么我们就可以直接执行成功回调函数，并将成功状态的值作为参数传递给它。
如果原始 Promise 对象的状态为 rejected，那么我们就可以直接执行失败回调函数，并将失败原因作为参数传递给它。
但是，如果原始 Promise 对象的状态为 pending，那么我们就需要等待原始 Promise 对象的状态发生变化，再执行相应的操作。

2. 当then函数传的参数不是函数怎么办？
为了避免then函数传的参数不是函数，需要对上面代码稍微优化一下
javascript复制代码  then(onResolved, onRejected) {
      	onResolved = typeof onResolved === "function" ? onResolved : (value) => value;
		onRejected = typeof onRejected === "function" ? onRejected : (reason) => { throw reason };
		//其他逻辑
  }

3. onResolvedCallbacks 和  onRejectedCallbacks 什么时候清空？
在调用then函数中，当Promise的状态为pending时候，会把onResolved和onRejected回调放到各自回调函数队列中，等状态改变（即在执行resolve函数/reject函数）时候，将 onResolvedCallbacks ，this.onRejectedCallbacks 循环调用。当Promise状态pending时候，就将 onResolvedCallbacks 和  onRejectedCallbacks 置空。所以优化上面代码如下：
javascript复制代码then(onResolved,onRejected){
       if (this.status == "pending") {
						this.onResolvedCallbacks.push(() => {
							if (this.status == "resolved") {
								try {
									const x = onResolved(this.value)
									resolve(x)
								} catch (error) {
									reject(error)
								}
							}
						})
						this.onRejectedCallbacks.push(() => {
							if (this.status == "rejected") {
								try {
									const x = onRejected(this.reason)
									resolve(x)
								} catch (error) {
									reject(error)
								}
							}
						})
					} else {
						// 执行完所有回调函数之后，清空回调数组
						this.onResolvedCallbacks = [];
						this.onRejectedCallbacks = [];
					}
}

七、优化后完整代码
javascript复制代码	<script>

		class MyPromise {
			constructor(callback) {
				this.status = "pending";
				this.value = "";
				this.reason = "";
				// 存储成功状态的回调函数
				this.onResolvedCallbacks = [];
				// 存储失败状态的回调函数
				this.onRejectedCallbacks = [];
				const resolve = (value) => {
					if (this.status == "pending") {
						this.status = "resolved"
						this.value = value;
						this.onResolvedCallbacks.forEach((fn) => fn());
					}
				}
				const reject = (reason) => {
					if (this.status == "pending") {
						this.status = "rejected"
						this.reason = reason;
						this.onRejectedCallbacks.forEach((fn) => fn());
					}
				}
				try {
					callback(resolve, reject);
				} catch (error) {
					reject(error);
				}

			}

			then(onResolved, onRejected) {
				onResolved = typeof onResolved === "function" ? onResolved : (value) => value;
				onRejected = typeof onRejected === "function" ? onRejected : (reason) => { throw reason };
				const promise2 = new MyPromise((resolve, reject) => {
					if (this.status == "resolved") {
						console.log('1111111111')
						try {
							const x = onResolved(this.value)
							resolve(x)
						} catch (error) {
							reject(error)
						}
					}
					if (this.status == "rejected") {
						console.log('2222222')
						try {
							const x = onRejected(this.reason)
							resolve(x)
						} catch (error) {
							reject(error)
						}
					}
					if (this.status == "pending") {
						console.log('333333333333')
						this.onResolvedCallbacks.push(() => {
							if (this.status == "resolved") {
								try {
									const x = onResolved(this.value)
									resolve(x)
								} catch (error) {
									reject(error)
								}
							}
						})
						this.onRejectedCallbacks.push(() => {
							if (this.status == "rejected") {
								try {
									const x = onRejected(this.reason)
									resolve(x)
								} catch (error) {
									reject(error)
								}
							}
						})
					} else {
						// 执行完所有回调函数之后，清空回调数组
						this.onResolvedCallbacks = [];
						this.onRejectedCallbacks = [];
					}
				})
				return promise2
			}
			catch(onRejected) {
				return this.then(null, onRejected)
			}
		}

		const promise = new MyPromise((resolve, reject) => {
			// setTimeout(() => {
			// 	console.log('1')
				resolve('成功')
			// }, 1000)
		})
		promise.then(1).
		then(value => {
			// console.log('2')
			// return "第一次"
			// setTimeout(() => {
				console.log('1')
					// return "第一次"
			// },1000)
		}).then(value => {
			console.log('3')
			return new MyPromise((resolve, reject) => {
				setTimeout(() => {
					resolve('第二次处理结果');
				}, 1000);
			});
		}).then(value => {
			console.log(value);
			throw new Error('抛出异常');
		}).catch(error => {
			console.log(error);
		});
	</script>

附
1. 处理promsie异常的三种方式
javascript复制代码```javascript
function promise3() {
 return new Promise(function(resolve, reject) {
 var random = Math.random() * 10; // 随机⼀个 1 - 10 的数字
 setTimeout(function() {
      if (random >= 5) {
          resolve(random);
      } else {
          reject(random);
      } 
    }, 1000);
 });
}
var onResolve = function(val) {
 console.log('已完成：输出的数字是', val);
};
var onReject = function(val) {
 console.log('已拒绝：输出的数字是', val);
}
// promise 的 then 接收两个函数，第⼀个参数为 resolve 后执⾏，第⼆个函数为 reject 后执⾏
promise().then(onResolve, onReject);
// 也可以通过 .catch ⽅法拦截状态变为已拒绝时的 promise
promise().catch(onReject).then(onResolve);
// 也可以通过 try catch 进⾏拦截状态变为已拒绝的 promise
try {
 promise().then(onResolve);
} catch (e) {
 onReject(e);
}

