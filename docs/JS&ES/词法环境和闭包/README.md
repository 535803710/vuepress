

# 词法环境和闭包
## 词法环境

每个代码块{...}，脚本，函数，都有一个词法环境的内部关联对象

这个词法环境对象的内部有两个东西 

- 环境记录 ：存储了全部的局部变量（包括一些其他信息 this的值）的对象

- 外部环境的引用


### 1.变量
变量是 环境记录 的一个属性。获取或者修改变量相当于 获取或者修改了词法环境对象 的一个属性

举例

![image.png](./2ecc92d59da449bca013bf291ea7df00~tplv-k3u1fbpfcp-watermark.image.png)

上面的例子只有一个词法环境，
**框内表示环境记录对象**，**箭头表示外部引用**（由于没有外部引用，全局词法环境没有外部引用所以是null）

这跟原型链很像是不是！Object的原型指向null

**下面继续**


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87119650b39547b18d43e8b23773b0c4~tplv-k3u1fbpfcp-watermark.image?)

先申明一个变量 
右边的词法环境变化
1. 脚本开始 词法环境预先填充所有声明的变量
   -  最初他们处于未初始化状态（Uninitialized）是一种特殊的内部状态，引擎知道存在，但是在let声明之前不能引用，就像变量不存在一样。
2. let phrase定义出现，这时候未被赋值，
3. 赋值为Hello
4. 值被修改

现在来说
- 变量是词法环境的一个属性，与当前执行的函数，代码块，脚本有关系
- 操作变量是操作对象的属性


> “词法环境”是一个规范对象（specification object）：它仅仅是存在于 [编程语言规范](https://tc39.es/ecma262/#sec-lexical-environments) 中的“理论上”存在的，用于描述事物如何运作的对象。我们无法在代码中获取该对象并直接对其进行操作。
> 
> 但 JavaScript 引擎同样可以优化它，比如清除未被使用的变量以节省内存和执行其他内部技巧等，但显性行为应该是和上述的无差。
 
 ### 2.函数声明
 
 一个函数也是一个值，就像变量一样。
 
 **不同的是函数在声明后立刻完成初始化**
 
 当创建一个词法环境的时候，函数声明会立即初始化完成，
而不是像变量一样要let声明后才能用，所以我们可以再函数声明前调用函数。

例如，这是添加一个函数时全局词法环境的初始状态：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b132bc19231e492e9babeda7dfd99048~tplv-k3u1fbpfcp-watermark.image?)
这种只适用于函数声明，不适用于将函数赋值给变量例如 `let say = function(name)...`

### 3.内部和外部的词法环境
函数在运行的时候，会自动创建一个新的词法环境，存储调用的局部变量和参数

例如，对于 `say("John")`，它看起来像这样（当前执行位置在箭头标记的那一行上）：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b866c845217a4721898a06c01237a496~tplv-k3u1fbpfcp-watermark.image?)

在函数运行的时候，我们得到两个词法环境： 一个是函数内部的词法环境，一个是全局词法环境

可以看到图中的竖线|分割开（左边是函数内部词法环境）（右边是外部全局词法环境）
 
 - 内部词法环境与`say`当前执行相对应，有一个局部变量`name`作为当前词法环境的一个属性，调用的是`say(John)`所以`name`的值是John
 - 外部词法环境是全局词法环境，包含了phrase变量和say函数
 
 内部词法环境引用了外部环境
 
 **当代码要访问一个变量时 —— 首先会搜索内部词法环境，然后搜索外部环境，然后搜索更外部的环境，以此类推，直到全局词法环境。**
 
 在任何地方都找不到的话，严格模式会报错。非严格模式会在全局创建一个变量
 上面例子搜索过程如下
 - `name`在内部词法环境查找，在`alert`试图访问`name`时可以找到
 - 在试图访问`phrase`时发现当前词法环境没有，顺着外部词法环境找到
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2052116650d04be1950074aaa35c1406~tplv-k3u1fbpfcp-watermark.image?)

### 4.返回函数
看到这个例子

```js
function makeCounter() { 
    let count = 0; 
    
    return function() { 
        return count++;、
    };
} 
let counter = makeCounter();
```

在调用`makeCounter()`开始，都会创建一个新的词法环境，存储`makeCounter`运行是的变量

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c023ec7437ed4e958f0df7030c3248d4~tplv-k3u1fbpfcp-watermark.image?)

不同的是在执行`makeCounter()`时只是创建了一个嵌套函数：`return count++`，这时没有运行，只是创建

所有函数在“出生”时都会记住创建他们的词法环境，不是什么魔法，每个函数都有`[[Enviroment]]`隐藏属性，保存了对创建该函数的词法环境的引用。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57516a88b870430eb075f17edf64f077~tplv-k3u1fbpfcp-watermark.image?)
所以 `cunter.[[Enviroment]]`有对`count:0`词法环境的引用。这就是函数记住他创建于何处的方式，与函数在哪调用无关。`[[Environment]]`引用在函数创建的时候就被永久保存了


等会在调用`counter()`时，会创构建一个新的词法环境，并且其外部词法环境引用于`counter().[[Environment]]`
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53e7ec3490de4f1f83bfa50253be3c4f~tplv-k3u1fbpfcp-watermark.image?)

现在，调用`counter()`时查找count变量，首先查找自己的词法环境，没有找到（因为没有局部变量），向上找外部的词法环境（`makeCounter()`的词法环境），找到然后修改。

**在变量所在的词法环境中更新变量。**

下面是执行后的状态
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c55e049a8d4849a7841e4e4c8a4e4405~tplv-k3u1fbpfcp-watermark.image?)

如果我们调用 `counter()` 多次，`count` 变量将在同一位置增加到 `2`，`3` 等。

> #### 闭包
> 开发者通常应该都知道“闭包”这个通用的编程术语。
> 
> [闭包](https://en.wikipedia.org/wiki/Closure_(computer_programming)) 是指内部函数总是可以访问其所在的外部函数中声明的变量和参数，即使在其外部函数被返回（寿命终结）了之后。在某些编程语言中，这是不可能的，或者应该以特殊的方式编写函数来实现。但是如上所述，在 JavaScript 中，所有函数都是天生闭包的（只有一个例外，将在 ["new Function" 语法](https://zh.javascript.info/new-function) 中讲到）。
> 
> 也就是说：JavaScript 中的函数会自动通过隐藏的 `[[Environment]]` 属性记住创建它们的位置，所以它们都可以访问外部变量。
> 
> 在面试时，前端开发者通常会被问到“什么是闭包？”，正确的回答应该是闭包的定义，并解释清楚为什么 JavaScript 中的所有函数都是闭包的，以及可能的关于 `[[Environment]]` 属性和词法环境原理的技术细节。


## 参考文献
https://zh.javascript.info/closure#ci-fa-huan-jing

