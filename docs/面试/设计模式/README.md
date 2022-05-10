# 策略模式

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/686f57c143284ecf9c00b48f3464b3b8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

- 先配置策略
```js
const type = {
  checkRole: (value) => {
    return value === "juejin";
  },
  checkLevel: (value) => {
    return value >= 1;
  },
  checkjob: (value) => {
    return value === "前端";
  },
};

let Validator = function () {
  this.caches = [];
  this.add = (method, value) => {
    this.caches.push(() => {
      return type[method](value);
    });
  };
  this.check = () => {
    let res = true;
    this.caches.forEach((el) => {
      res = el();
      if (!res) {
        return false;
      }
    });
    return res;
  };
};
```
- 验证
``` js
var compose1 = () => {
  var validator = new Validator();
  const data1 = {
    role: "juejin",
    level: 3,
  };
  validator.add("checkRole", data1.role);
  validator.add("checkLevel", data1.level);
  const result = validator.check();
  console.log(result);
  return result;
};
```

## 什么时候用策略模式？
- 各判断条件下的策略相互独立且可复用
- 策略内部逻辑相对复杂
- 策略需要灵活组合


# 发布订阅模式
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66f97bd23566468182554fbac39fd009~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)
``` js
const EventEmit = function() {
  this.events = {};
  this.on = function(name, cb) {
    if (this.events[name]) {
      this.events[name].push(cb);
    } else {
      this.events[name] = [cb];
    }
  };
  this.trigger = function(name, ...arg) {
    if (this.events[name]) {
      this.events[name].forEach(eventListener => {
        eventListener(...arg);
      });
    }
  };
};
```
vue 的话会加入proxy 来代理对象实现当对象get或set 时的触发更新

## 适用范围
各模块相互独立
存在一对多的依赖关系
依赖模块不稳定、依赖关系不稳定
各模块由不同的人员、团队开发

# 装饰器模式
不改变原有函数的功能
比如 高阶组件 HOC，一些插件的日志，一般会放在 func 的属性上

# 适配器模式
将不同的数据结构转换成统一的数据结构

# 代理模式
事件代理

``` js
// 本体
var domImage = (function() {
  var imgEle = document.createElement('img');
  document.body.appendChild(imgEle);
  return {
    setSrc: function(src) {
      imgEle.src = src;
    }
  };
})();

// 代理
var proxyImage = (function() {
  var img = new Image();
  img.onload = function() {
    domImage.setSrc(this.src); // 图片加载完设置真实图片src
  };
  return {
    setSrc: function(src) {
      domImage.setSrc('./loading.gif'); // 预先设置图片src为loading图
      img.src = src;
    }
  };
})();

// 外部调用
proxyImage.setSrc('./product.png');

```
## 适用范围
- 模块职责单一且可复用
- 两个模块间的交互需要一定限制关系


# 责任链模式
举例 .then().then()

## 适用范围
- 你负责的是一个完整流程，或你只负责流程中的某个环节
- 各环节可复用
- 各环节有一定的执行顺序
- 各环节可重组