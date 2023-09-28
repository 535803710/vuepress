# storkbook 本地开启 https

## 省流（TL;DR

- 配置 package.json `"storybookhttps": "start-storybook --https --ssl-cert ./ssl/cert.crt --ssl-key ./ssl/cert.key",`
- 安装 mkcert
  `npm i -g mkcert `

  `mkcert create-ca `

  `mkcert create-cert --domain "0.0.0.0"`

- 生成的证书文件放入根目录新建的 ssl 文件夹
- 运行 `npm run storybookhttps`

## 背景

最近后端升级了网管，导致所有的开发环境的接口地址也使用了 https。

导致我们本地开发的时候所有的接口都在报跨域（服了。。。说改就改
![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/09/57945c0814379f3a8200dd21cfb6a4c7.png)

我们如果使用的是 vue 的话很简单，只需要在 vue.config.ts 中的 devServer 里面开启 https 即可

```js
devServer: {
    //   ...
    https: true,
},
```

然而，我们中台项目使用的是 storybook + vue2 来构建和开发，使用过的同学应该知道，storybook 的启动是使用 `npm run storybook `，而不是 `npm run dev(server)`

这就导致我们配置 vue 文件是没有办法开启本地 https 的。所以翻阅文档（吐槽一下，只有英文文档

## 解决方案

[这里直接给出链接地址](https://storybook.js.org/docs/6.4/vue/api/cli-options)

寻找一番，找到了 CLI 配置

发现我们可以在运行命令的时候加上 --https 来开启 （这不就是 webpack 的方式吗，恍然大雾，本来就是用 webpack 的 server 来运行

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/09/10c1cd7a47b33b5a4390690081931da6.png)

然后给 package.json 里面加上命令

`"storybookhttps": "start-storybook --https`

可以看到在报错

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/09/7b462b1226e5ce6447b75e82f9d8571f.png)

是因为和 webpack 一样 如果开启了 https 的话需要本地配置 ssl 证书

## 本地配置 ssl 证书

使用 mkcert

`npm i -g mkcert `

`mkcert create-ca `

`mkcert create-cert --domain "0.0.0.0"`

之后会生成 4 个文件

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/09/46babf150409864097957f703f2cf3ea.png)

我们把这些文件放进根目录下的 ssl 文件

然后修改 package.json

`"storybookhttps": "start-storybook --https --ssl-cert ./ssl/cert.crt --ssl-key ./ssl/cert.key",`

接着运行

`pnpm run storybookhttps`

等待很久...

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/09/e34f4478c3087f454a099fef9d6a4cff.png)

运行成功

## 总结

> Storybook 的核心是由 Webpack 和 Vite 等构建器提供支持。这些构建器启动一个开发环境，将您的代码（Javascript、CSS 和 MDX）编译为可执行包，并实时更新浏览器。

- 因为是 webpack 启动开发环境，所以命令也是使用的 webpack 的 CLI 命令
- 需要本地生成一个 ssl 证书以供本地服务器使用
- 修改 package 命令来快捷操作

最后吐槽一下 为啥我们项目的 storybook 开启的这么慢！
