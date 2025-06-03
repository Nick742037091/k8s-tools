# k8s-tools

> 项目为 monorepo 架构，所有命令在根目录执行

## 安装依赖

`pnpm install`

## 插件本地开发

`pnpm dev`

> 启动后插件和插件内页面都会进入 watch 模式，修改插件代码需要重新打开插件，修改页面代码会自动触发热更新。

开发调试:

1. 在 vscode 中输入快捷键 F5
2. [插件入口](https://www.nick-h.cn/k8s-tools/quick-start.html#%E6%8F%92%E4%BB%B6%E5%85%A5%E5%8F%A3)
3. 执行命令后会启动 react-devtools 应用，打开插件后会自动连接上
   ![alt text](/imgs/devtool.png)

## 生产构建

`pnpm build`

会构建出插件和依赖的静态文件，用于插件发布

## 发布插件

`pnpm publish:extension`

## 插件包构建

`pnpm package:extension`

插件包仅用于测试安装，发布插件不依赖插件包
