# pug 语法

由于现在公司的项目使用了 pug 语法 ，无奈 又要开始学一种新的东西了 好在 只是使用不深入研究还不是很困难。

硬说这个语法解决了什么的话，可能就下面两点吧

- HTML 标签必须进行闭合
- HTML 没有模板机制

我觉得其实 JSX 或者 TSX 写的更舒服，但是谁让公司不用呢

下面记录一下常用的 pug 语法

## 安装

在 vue 中使用 pug

```t
npm i -D pug pug-plain-loader
```

## 入门

<!--pug-->
<template lang="pug">
    div.box
        div.box1
            div.box2
</template>

<!--解析成HTML后-->
<template>
    <div class="box">
        <div class="box1">
            <div class="box2"></div>
        </div>
    </div>
</template>

## 语法

### 属性

标签属性和 HTML 语法非常相似，但它们的值就是普通的 JavaScript 表达式。您可以用逗号作为属性分隔符，不过不加逗号也是允许的。

```pug
a(class='button' href='baidu.com') 百度
//- 转换后
<a class="button" href="baidu.com">百度</a>
```

#### 用引号括起来的属性

如果您的属性名称中含有某些奇怪的字符，并且可能会与 JavaScript 语法产生冲突的话，请您将它们使用 "" 或者 '' 括起来。

```pug

div(class='div-class' '(click)'='play()')

//- 转换
<div class="div-class" (click)="play()"></div>
```

#### 类属性

class（类）属性可以是一个字符串（就像其他普通的属性一样）还可以是一个包含多个类名的数组，这在类是由 JavaScript 生成的情况下非常方便。

```pug
- var classes = ['foo', 'bar', 'baz']
a(class=classes)

//- 等于
<a class="foo bar baz"></a>
```

#### 类的字面值

类可以使用 .classname 语法来定义：

```pug
a.button
//- 转化
<a class="button"></a>
```

考虑到使用 div 作为标签名这种行为实在是太常见了，所以如果您省略掉标签名称的话，它就是默认值：

```pug
.content
//- 转化
<div class="content"></div>
```

#### ID 的字面值

ID 可以使用 #idname 语法来定义：

```pug
a#main-link
//- 转化
<a id="main-link"></a>
```

### 分支条件 Case

case 是 JavaScript 的 switch 指令的缩写，并且它接受如下的形式：

```pug
- var friends = 10
case friends
  when 0
    p 您没有朋友
  when 1
    p 您有一个朋友
  default
    p 您有 #{friends} 个朋友

//- 转化
<p>您有 10 个朋友</p>
```

在某些情况下，如果您不想输出任何东西的话，您可以明确地加上一个原生的 break，就和 switch 的用法一样

### 代码 Code

Pug 为您在模板中嵌入 JavaScript 提供了可能。这里有三种类型的代码。

#### 不输出的代码

```pug
- for (var x = 0; x < 3; x++)
  li item

//-   转化
<li>item</li>
<li>item</li>
<li>item</li>
```

#### 带输出的代码

用 `=` 开始一段带有输出的代码，它应该是可以被求值的一个 JavaScript 表达式。为安全起见，它将被 HTML 转义：

```pug
p= '这个代码被 <转义> 了！'

//- 转化
<p>这个代码被 &lt;转义&gt; 了！</p>
```

#### 不转义的、带输出的代码

```pug
p!= '这段文字' + ' <strong>没有</strong> 被转义！'

//- 转化
<p>这段文字 <strong>没有</strong> 被转义！</p>
```

⚠️ 危险
不转义的输出可能是危险的，您必须确保任何来自用户的输入都是安全可靠的，以防止发生跨站脚本攻击（XSS）。

### 条件 Conditional

Pug 的条件判断的一般形式的括号是可选的，所以您可以省略掉开头的 -，效果是完全相同的。类似一个常规的 JavaScript 语法形式。

```pug

- var user = { description: 'foo bar baz' }
- var authorised = false
#user
  if user.description
    h2.green 描述
    p.description= user.description
  else if authorised
    h2.blue 描述
    p.description.
      用户没有添加描述。
      不写点什么吗……
  else
    h2.red 描述
    p.description 用户没有描述

//- 转化

<div id="user">
  <h2 class="green">描述</h2>
  <p class="description">foo bar baz</p>
</div>

```

### 包含 Include

包含（include）功能允许您把另外的文件内容插入进来。

```pug
//- index.pug
doctype html
html
  include includes/head.pug
  body
    h1 我的网站
    p 欢迎来到我这简陋得不能再简陋的网站。
    include includes/foot.pug
```

```pug
//- includes/head.pug
head
  title 我的网站
  script(src='/javascripts/jquery.js')
  script(src='/javascripts/app.js')
```

```pug
//- includes/foot.pug
footer#footer
  p Copyright (c) foobar
```

组合后

```html
<!DOCTYPE html>
<html>
  <head>
    <title>我的网站</title>
    <script src="/javascripts/jquery.js"></script>
    <script src="/javascripts/app.js"></script>
  </head>

  <body>
    <h1>我的网站</h1>
    <p>欢迎来到我这简陋得不能再简陋的网站。</p>
    <footer id="footer">
      <p>Copyright (c) foobar</p>
    </footer>
  </body>
</html>
```

#### 包含纯文本

被包含的如果不是 Pug 文件，那么就只会当作文本内容来引入。

### 嵌入 Interpolation

#### 字符串嵌入，转义

- 直接用 `=` 赋值
- 使用 `#{ }` 里面的代码也会被求值，转义，并最终嵌入到模板的渲染输出中。

#### 字符串嵌入，不转义

当然也 并不是必须 要用安全的转义来构造内容。您可以嵌入没有转义的文本进入模板中。

- 使用 `!{ }`可以不转义

#### 标签嵌入

嵌入功能不仅可以嵌入 JavaScript 表达式的值，也可以嵌入用 Pug 书写的标签。它看起来应该像这样：

```
 #[ ]
```

#### 空格的调整

标签嵌入功能，在需要嵌入的位置上前后的空格非常关键的时候，就变得非常有用了。因为 Pug 默认会去除一个标签前后的所有空格。

### 迭代 Iteration 循环

Pug 目前支持两种主要的迭代方式： each 和 while。

#### each

```pug
ul
  each val,index in [1, 2, 3, 4, 5]
    li= val

//- 转化
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
</ul>

```

也可以使用 for 作为 each 的别称。

#### while

效果一样

````pug
- var n = 0;
ul
  while n < 4
    li= n++
    ```
````

### 混入 Mixin

```pug
mixin pet(name)
  li.pet= name
ul
  +pet('猫')
  +pet('狗')
  +pet('猪')

//-   转化

<ul>
  <li class="pet">猫</li>
  <li class="pet">狗</li>
  <li class="pet">猪</li>
</ul>
```

#### 混入的块

混入也可以把一整个代码块像内容一样传递进来：

```pug
mixin article(title)
  .article
    .article-wrapper
      h1= title
      if block
        block
      else
        p 没有提供任何内容。

+article('Hello world')

+article('Hello world')
  p 这是我
  p 随便写的文章

//- 转化
<div class="article">
  <div class="article-wrapper">
    <h1>Hello world</h1>
    <p>没有提供任何内容。</p>
  </div>
</div>
<div class="article">
  <div class="article-wrapper">
    <h1>Hello world</h1>
    <p>这是我</p>
    <p>随便写的文章</p>
  </div>
</div>
```

#### 混入的属性

混入也可以隐式地，从“标签属性”得到一个参数 attributes：

```pug
mixin link(href, name)
  a(href=href)&attributes(attributes)= name

+link('/foo', 'foo')(class="btn")

//- 转化
<a class="btn" href="/foo">foo</a>
```
提示
+link(class="btn") 这种写法也是允许的，且等价于 +link()(class="btn")，因为 Pug 会判断括号内的内容是属性还是参数。但我们鼓励您使用后者的写法，明确地传递空的参数，确保第一对括号内始终都是参数列表。

#### 剩余参数
您可以用剩余参数（rest arguments）语法来表示参数列表最后传入若干个长度不定的参数

```pug
mixin list(id, ...items)
  ul(id=id)
    each item in items
      li= item

+list('my-list', 1, 2, 3, 4)
```

### 纯文本和空格
#### 标签中的纯文本
要添加一段行内的纯文本，这是最简单的方法。这行内容的第一项就是标签本身。标签与一个空格后面接着的任何东西，都是这个标签的文本内容。
```pug
p 这是一段纯洁的<em>文本</em>内容.
```

#### 原始 HTML
```pug
body
  p 缩进 body 标签没有意义，
  p 因为 HTML 本身对空格不敏感。

```

#### 管道文本
另外一种向模板添加纯文本的方法就是在一行前面加一个管道符号（|），这个字符在类 Unix 系统下常用作“管道”功能，因此得名。
```pug
<p>管道符号总是在最开头，
  不算前面的缩进。</p>
```

#### 空格控制


控制输出 HTML 中的空格，可能是学习 Pug 的过程中最为艰难的部分之一，但别担心，您很快就能掌握它。

关于空格，只需记住两个要点。当编译渲染 HTML 的时候：

1. Pug 删掉缩进，以及所有元素间的空格。
    - 因此，一个闭标签会紧挨着下一个开标签。这对于块级元素，比如段落，通常不是个问题，因为它们被浏览器分别作为一个一个段落在页面上渲染（除非您改变了它们的 CSS display 属性）。而当您需要在两个元素间插入空格时，请看下面的方法。
2. Pug 保留符合以下条件的元素内的空格：
   - 一行文本之中所有中间的空格；
   - 在块的缩进后的开头的空格；
   - 一行末尾的空格；
   - 纯文本块、或者连续的管道文本行之间的换行。
因此，Pug 会丢掉标签之间的空格，但保留内部的空格。这将有助于完全掌握应该如何操作标签和纯文本，甚至可以让您在一个单词中间插入一个标签。


#### 推荐方案
您可以添加一个甚至更多的管道文本行——只有空格或者什么都没有的管道文本。这将会在渲染出来的 HTML 中插入空格。

```pug
| 千万别
|
button#self-destruct 按
|
| 我！
```
或者插入的标签并不需要太多的属性，可以在纯文本块内使用更简单的标签嵌入或者原始 HTML。
``` pug
p.
  使用常规的标签可以让您的代码行短小精悍，
  但使用嵌入标签会使代码变得更 #[em 清晰易读]。
  ——如果您的标签和文本之间是用空格隔开的。
```


### 标签 Tag
在默认情况下，在每行文本的开头（或者紧跟白字符的部分）书写这个 HTML 标签的名称。使用缩进来表示标签间的嵌套关系，这样可以构建一个 HTML 代码的树状结构。

#### 块展开
为了节省空间， Pug 为嵌套标签提供了一种内联式语法。

``` pug
a: img
//- 转化
<a><img /></a>
```

#### 自闭合标签
也可以通过在标签后加上 / 来明确声明此标签是自闭合的，但请您仅在明确清楚这是在做什么的情况下使用。
``` pug
foo/
foo(bar='baz')/

//- 转化
<foo />
<foo bar="baz" />
```



#### 组件
组件的话使用 `+` 在自定义组件前

## 总结
了解一下pug就可以了，如果不是公司奇葩项目，我一辈子都不会看。




