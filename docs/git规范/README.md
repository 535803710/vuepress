# Git 规范

## Git Commit 规范的作用

提供更多的历史信息，方便快速浏览
可以过滤某些 commit（比如文档改动），方便快速查找信息

```perl
  # 过滤日志信息
  git log HEAD --pretty=format:%s --grep 关键字
```

## 规范

业界广泛认可的 Angular 规范

```xml
<type>(<scope>):<subject>
<!-- 空行 -->
<BLANK LINE>
<body>
<!-- 空行 -->
<BLANK LINE>
<footer>
```

- 标题行：必填，描述主要修改类型和内容
- 主要内容：描述为什么修改，做什么样的修改，以及开发的思路等等
- 页脚注释：放 Breaking Changes 或 Closed Issuses

- type: 类型
- subject: commit 的概述
- scope: 可选，影响范围 比如：route、component、utils、build.....
- body：commit 具体修改内容，可以分为多行，建议符合 50/72 formatting
- footer：一些备注，通常是 BREAKING CHANGE 或 修改的 bug 链接

我们可以简单的写为

```xml
<!-- <类型>: <描述> -->
<type>(scope):<subject>
```

## type | commit 类型

| 类型     | 介绍                            |
| -------- | ------------------------------- |
| feat     | 新功能、新特性                  |
| fix      | bugfix，修改问题                |
| refactor | 代码重构                        |
| docs     | 文档修改                        |
| style    | 代码格式修改，注意不是 css 修改 |
| test     | 测试用例修改                    |
| chore    | 其他修改，比如构建，依赖管理    |
