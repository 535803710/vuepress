# 纯 CSS 实现文字换行环绕效果

⌛ 三年前。。。

🧔‍♂️ 一同事问我：“你说用 css 能不能直接实现这个效果，不想用 js 写，好麻烦啊”

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2024/01/f3379e58bcc4f786453a7018d8da8671.png)

我回答道：“应该不行吧，好像没什么好用的方法。。。”

✅ 现在，三年之约已到，我终于找到了纯 css 实现的方法

## 省流，实现代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      p {
        margin: 0;
        padding: 0;
      }
      .text-wrap {
        float: right;
        width: 15px;
        height: 15px;
        shape-outside: content-box;
        background-color: rebeccapurple;
        border: 2px solid black;
        border-radius: 2px;
        margin-top: 20px;
        padding-left: 5px;
        /* padding: 20px; */
      }
      .ellipsis {
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 显示的行数 */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 20px;
      }

      .box {
        width: 400px;
      }
    </style>
  </head>
  <body>
    <div class="box ellipsis">
      <div class="text-wrap"></div>
      <p>
        这是要环绕的文本内容。这是要环绕的文本内容。这是要环绕的文本内容。这是要环绕的文本内容。这是要环绕的文本内容。这是要环绕的文本内容。这是要环绕的文本内容。
      </p>
    </div>
  </body>
</html>
```

## 起源

前几天在翻 chrome 的博客时偶然看到了这么一个东西 `Initial-letter`

Chrome 110 年初登陆，`initial-letter`属性是一个小而强大的 CSS 功能，它为首字母的位置设置样式。您可以将字母放置在下降或上升状态。该属性接受两个参数:

第一个参数用于将字母放入相应段落的深度，

第二个参数用于将字母从段落上方抬高多少。

```css
/* Keyword values */
initial-letter: normal;

/* Numeric values */
initial-letter: 1.5; /* Initial letter occupies 1.5 lines */
initial-letter: 3; /* Initial letter occupies 3 lines */
initial-letter: 3 2; /* Initial letter occupies 3 lines and
                           sinks 2 lines */

/* Global values */
initial-letter: inherit;
initial-letter: initial;
initial-letter: revert;
initial-letter: revert-layer;
initial-letter: unset;
```

您甚至可以将两者结合使用，如下面的演示所示。

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2024/01/d1d71c012d9ca2c890d0741289a8743f.png)

于是，回想起了 3 年前的那个问题。能不能用这个属性 + `:before` + `iconfont` 来实现呢？ 

但是，这个属性只能使用于首字母，

于是翻了很多文档，问了下 AI 最终得到了`shape-outside`这个终极解决方案

## 要点

### [shape-outside](https://developer.mozilla.org/zh-CN/docs/Web/CSS/shape-outside)

shape-outside 的 CSS 属性定义了一个可以是非矩形的形状，相邻的内联内容应围绕该形状进行包装。默认情况下，内联内容包围其边距框; shape-outside 提供了一种自定义此包装的方法，可以将文本包装在复杂对象周围而不是简单的框中。

值：content-box

> 定义一个由内容区域的外边缘封闭形成的形状（译者：表述的不太好，就是被 padding 包裹的区域，在 chrome 控制台中的盒子模型图中的蓝色区域。）。每一个角的弧度取 0 或 border-radius - border-width - padding 中的较大值。

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2024/01/65ffc48811e16c3def7436fd7b7fb374.png)

其它的值：circle、ellipse、inset、polygon、url、auto 我们这次用不到。

但是使用 `url` 属性也应该是可以做到的，因为会识别到 `alpha` 通道。

## 兼容性

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2024/01/ad00cf98b7b5b2b8b73fa4dd1121bcfe.png)

可以看到兼容性还不错

## 总结

1. shape-outside 是一个非常实用的属性，可以实现一些比较复杂的文本环绕效果。
2. shape-outside 的兼容性比较好，不是特殊情况应该完全适用。
