# 原型和原型链

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/2/24/1691fc878b9beefa~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

## 原型

每个对象上岗都有一个隐式原型`[[prototype]]`，要么是 null，要么是对另一个对象的引用， `__proto__` 是原型的操作方法（set get）

现在可以使用 Object.getPrototypeOf/Object.setProtitypeOf

this 指向的是 点操作符前面的对象

for...in 会迭代整个原型链上的属性 可以用 hasOwnPropProperty(key)

## 设置和访问原型的现代方法

- Object.creat(proto,[])—— 利用给定的 proto 作为 [[Prototype]]（可以是 null）和可选的属性描述来创建一个空对象。
- Object.getPrototypeOf(obj)—— 返回对象 obj 的 [[Prototype]]（与 **proto** 的 getter 相同）。
- Object.setPrototypeOf()—— 将对象 obj 的 [[Prototype]] 设置为 proto（与 **proto** 的 setter 相同）。

> 当用户输入一个**proto**作为 key 的时候会发生错误 原型只能是 null 或对象，想要避免可以使用 map 对象，或者利用 Object.creat(null) 创建一个没有原型继承的对象，这个时候使用**proto**就没有问题啦

## 原型链

基本思想是利用原型继承引用类型的多个方法和属性，当我们读取一个缺失的属性时，会自动去原型上寻找。

## 原型继承

主要实现是通过 构造函数的 prototype 属性，这个属性指向的是[[prototype]] 隐式原型

> F.prototype 只在 new F 的时候有用，当 new 完了之后改变 prototype 新 new 的 F 会改变原型 已经 new 过的不会改变

- F.prototype 属性（不要把它与 [[Prototype]] 弄混了）在 new F 被调用时为新对象的 [[Prototype]] 赋值。
- 原型要么时 null 要么是一个对象，其他不起作用。
- F.prototype 只有一个属性 constructor 指向函数本身
- 当重写 prototype 时要避免覆盖 constructor

## 类

类长这样

```js
class MyClass {
  prop = value; // 属性

  constructor(...) { // 构造器
    // ...
  }

  method(...) {} // method

  get something(...) {} // getter 方法
  set something(...) {} // setter 方法

  [Symbol.iterator]() {} // 有计算名称（computed name）的方法（此处为 symbol）
  // ...
}
```

技术上来说，MyClass 是一个函数（我们提供作为 constructor 的那个），而 methods、getters 和 settors 都被写入了 MyClass.prototype。

### 不仅仅是语法糖

```js
function User(name){
  this.name = name
}
// User.prototype 属性上默认有 constructor 属性

// 在原型上设置一个函数
User.prototype.sayHi() = ()=>{
  console.log(this.name)
}
const user = new User('xiaowo')
user.sayHi() //xiaowo
```

这样实现了一个类
但是有一些差异

- 通过 class 创建的类内部特殊标记属性 [[IsClassConstructor]]:true 只能用 new 创建 和函数不一样。
- 类的方法不能枚举/不可迭代，这样很好因为我们在使用 for...in 的时候不希望方法出现
- 类会自动进入严格模式

## 类继承

extend 关键字

### 实现原理

是利用原型的继承，new 出来的子类的 [[prototype]] 指向子类的 prototype 属性，指向父类的 [[prototype]] 也就是父类的 prototype

如图
<img :src="$withBase('/img/类的继承.png')">

## 类的高阶

### 重写 constructor

**我们都知道子类继承父类的时候会调用 super() 来用父类的构造函数完成子类的创建。并且一定要在 this. 调用之前**

#### 原因

子类的构造函数和普通类的构造函数有区别。子类的构造器中有一个特殊的内部属性 `[[ConstructorKind]]:"derived"` 这会影响 new 的行为

- 当 new 一个常规函数的时候会创建一个空对象，把空对象赋值给 this
- 继承的 constructor 执行的时候不会执行该操作 会让其父类的 constructor 执行

因此，需要使用 super 来执行父类的构造函数，否则 this 指向的的那个对象不会被创建。

#### 注意点

```js
class Animal {
  name = "animal";

  constructor() {
    alert(this.name); // (*)
  }
}

class Rabbit extends Animal {
  name = "rabbit";
}

new Animal(); // animal
new Rabbit(); // animal
```

子类没有打印自己的 name

**父类构造器总是会使用它自己字段的值，而不是被重写的那一个。**

但是换一种方法再看一下

```js
class Animal {
  showName() {
    // 而不是 this.name = 'animal'
    alert("animal");
  }

  constructor() {
    this.showName(); // 而不是 alert(this.name);
  }
}

class Rabbit extends Animal {
  showName() {
    alert("rabbit");
  }
}

new Animal(); // animal
new Rabbit(); // rabbit
```

问题出在字段初始化的顺序上，是这样初始化的：

- 对于基类（还未继承任何东西的那种），在构造函数调用前初始化。
- 对于子类（派生类），在 super() 后立刻初始化。

### [[HomeObject]]和内部探究

关于 super 背后的原理
我们知道 super.method 可以调用父类上的方法，看起来很容只需要使用 this.**proto**.method ，但其实没有这个简单

例子如下

```js
let animal = {
  name: "Animal",
  eat() {
    alert(`${this.name} eats.`);
  },
};

let rabbit = {
  __proto__: animal,
  name: "Rabbit",
  eat() {
    // 这就是 super.eat() 可以大概工作的方式
    this.__proto__.eat.call(this); // (*)
  },
};

rabbit.eat(); // Rabbit eats.
```

这样是没有问题的 但是如果再增加一层继承

```js
let animal = {
  name: "Animal",
  eat() {
    alert(`${this.name} eats.`);
  },
};

let rabbit = {
  __proto__: animal,
  eat() {
    // ...bounce around rabbit-style and call parent (animal) method
    this.__proto__.eat.call(this); // (*)
  },
};

let longEar = {
  __proto__: rabbit,
  eat() {
    // ...do something with long ears and call parent (rabbit) method
    this.__proto__.eat.call(this); // (**)
  },
};

longEar.eat(); // Error: Maximum call stack size exceeded
```

这样就报错了

**原因是 `this` 始终指向的是 loneEar** 所以 就无法向上去查找方法了

解决方法 [[HomeObject]]

### [[HomeObject]]

当一个函数被定义为类或者对象方法时，它的 [[HomeObject]] 属性就成为了该对象。

然后super 通过它来解析 父原型上面的方法

```js
let animal = {
  name: "Animal",
  eat() {         // animal.eat.[[HomeObject]] == animal
    alert(`${this.name} eats.`);
  }
};

let rabbit = {
  __proto__: animal,
  name: "Rabbit",
  eat() {         // rabbit.eat.[[HomeObject]] == rabbit
    super.eat();
  }
};

let longEar = {
  __proto__: rabbit,
  name: "Long Ear",
  eat() {         // longEar.eat.[[HomeObject]] == longEar
    super.eat();
  }
};

// 正确执行
longEar.eat();  // Long Ear eats.
```

并没有用this 而是通过[[HomeObject]]的记录

只有在使用super的时候才会去使用 [[HomeObject]]，如果不使用super 还是可以被自由的调用

！！！ 注意在函数中使用的super 被其他地方调用时 this不会变成.前面的 而是 [[HomeObject]] 中保存的

！！！ 要使用函数 而不是属性 使用属性赋值为函数时 是没有 [[HomeObject]] 记录的
``` js
let animal = {
  eat: function() { // 这里是故意这样写的，而不是 eat() {...
    // ...
  }
};

let rabbit = {
  __proto__: animal,
  eat: function() {
    super.eat();
  }
};
```

