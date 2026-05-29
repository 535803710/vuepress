# Style Examples

Use these as shape examples, not copy targets.

## Titles

### Strong hook

- Shape: `我不允许还有人不理解 + concept`
- Use when the article clears up a concept the author thinks should stop being fuzzy.

### Scene hook

- Shape: `为了处理一个具体生活/业务场景，写了一个 + implementation`
- Use when the implementation starts from a visible problem.

### Practical result

- Shape: `前端性能优化：使用 + technique + 实现 + result`
- Use when clarity matters more than playfulness.

### Learning note

- Shape: `从0开始的 + concept + 学习`
- Use when the article is a guided entry into a concept.

### Stance title

- Shape: `转生到 + context + ，我不再相信 + naive promise`
- Use when the article is an experience piece with a clear opinion and a process to defend it.

## Openings

### Problem-first opening

```markdown
轮询本身不复杂，麻烦的是它会和页面上的其他事情抢主线程。
如果页面本来就不轻，问题会更明显。那我们能不能把这件事挪开一点？
```

### Scene-first opening

```markdown
这次先不从 API 开始。
先看一个很具体的需求：页面要拿到另一个页面里的结果，而且两个页面还不是同源。
```

### Concept-first opening with pressure

```markdown
状态机听起来有点高大上，但你大概率早就见过它。
先别急着背概念，我们从一个最容易看懂的状态切换开始。
```

### Stance-first opening

```markdown
先省流。
这件事不是不能用 AI 做，而是不能把需求、边界和测试都空着就让它开写。
```

### Unclosed aside opening

```markdown
最近后端升级了网管，导致所有的开发环境的接口地址也使用了 https。

导致我们本地开发的时候所有的接口都在报跨域（服了。。。说改就改
```

### Dialogue analogy opening

```markdown
常规轮训简单的实现了每隔几秒向服务器发起请求来查看状态是否改变，比如说：客户端使用 `setInterval` 每隔10m向服务端发起请求，

>客户端："服务端，我能吃饭了么？" ，服务端："还没做好呢。"
>
>10m后
>
>客户端："服务端，我能吃饭了么？" ，服务端："还没做好呢。"
```

## Explanation blocks

### Plain definition to steps

```markdown
断点续传解决的不是"怎么上传"，而是"上传断了以后怎么接着传"。

拆开看其实就三步：

1. 给文件一个能识别的 id。
2. 问服务器已经收到了哪里。
3. 从那个位置继续发剩下的内容。
```

### Wrong turn before the reason

```markdown
这里很容易先想到进度事件。
它能告诉我们发出去多少，但不能保证服务端真的收到了多少。
问题卡在这里，后面的恢复逻辑也就不能只靠它。
```

### Code lead-in

```markdown
思路有了，代码就不要一上来铺满。
先把最小的事件流跑通，再把参数和异常补进去。
```

### Implementation story outline

```markdown
## 背景
## 需求分析
## 技术要点
## 实现效果
## 总结
```

Use this when the article begins from a real scene and the implementation itself is the story.

### Official quote to plain language

```markdown
`IntersectionObserver` 接口提供了一种异步观察目标元素与其祖先元素或顶级文档视窗交叉状态的方法。

**简单来说，就是我们能不能看到想要观察的对象。**
```

## 选型展示

Use when the article needs to show rejected options before the chosen path:

```markdown
考虑到上面几点，我想了几个方法 🤔：

- [ ] ~~微前端：考虑过 qiankun 和 micro-app，但是由于 ui 组件使用的是 vue2 开发所以无法兼容~~
- [ ] ~~ui 组件库+中台组件库 升级到 vue3 版本：工程量太大被拒绝~~
- [x] 降级项目到 vue2.7：改动较小，逻辑基本无需改动。成本可控
```

## Transitions

Prefer direct turns:

- `先看最简单的例子。`
- `问题就在这里。`
- `到这一步，为什么不能直接这么做就比较清楚了。`
- `接下来把它落到代码里。`

Avoid defaulting to:

- `接下来我们将深入探讨`
- `通过以上分析我们可以得出`
- `综上所述`

## Endings

### Practical landing

```markdown
这个方案的重点不是把代码搬进一个新 API 里，而是把会抢主线程的事情放到更合适的位置。
页面一旦开始变重，这个区别就会越来越明显。
```

### Narrow takeaway

```markdown
所以这篇文章真正要记住的不是那几个方法名。
先搞清楚数据到底在哪里断了，后面的实现才不会一开始就走偏。
```

### Honest final turn

```markdown
功能跑起来了，效果也达到了。
但最后真正把问题解决掉的，可能还是一个更简单的现实办法。
```

## 签名收尾

### Real-world twist ending

```markdown
效果很好👍，用旧手机开启摄像头后，检测到狗就播放声音了。

但是，家里夫人直接做了一个围栏晚上给狗圈起来了🚫
```

### Complaint landing

```markdown
- 因为是 webpack 启动开发环境，所以命令也是使用的 webpack 的 CLI 命令
- 需要本地生成一个 ssl 证书以供本地服务器使用
- 修改 package 命令来快捷操作

最后吐槽一下 为啥我们项目的 storybook 开启的这么慢！
```

## Rewrite checks

Given an AI-shaped draft, prefer this direction:

- Neutral: `本文将详细介绍 Web Workers 的概念、优势以及使用方式。`
- Rewrite: `先说问题。页面忙起来以后，轮询这种小事也会跟着抢主线程。Web Worker 值得看的地方就在这里。`

- Neutral: `函数式编程具有许多优点，例如可维护性和可测试性。`
- Rewrite: `函数式编程先别讲太大，先守住两件事：数据别乱改，函数别到处留副作用。`

- AI summary: `该方案通过以下步骤实现了一个基于网页的实时物体检测系统，专门用于识别画面中的狗并播放特定音频以驱赶它离开沙发。具体实现过程包括以下几个核心部分：`
- Rewrite: `功能跑起来了，检测到狗就会播音频。最后真正把狗拦在沙发外的，可能还是一个更简单的现实办法。`
