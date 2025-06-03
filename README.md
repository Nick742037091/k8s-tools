# k8s-tools

> 项目为 monorepo 架构，所有命令在根目录执行

## 安装依赖

`pnpm install`

## 插件本地开发

`pnpm dev`

> 启动后插件和插件内页面都会进入 watch 模式，修改插件代码需要重新打开插件，修改页面代码会自动触发热更新。

开发调试:

1. 在 vscode 中输入快捷键 F5
2. 在 打开的项目中启用插件

## 生产构建

`pnpm build`

会构建出插件和依赖的静态文件，用于插件发布

## 发布插件

`pnpm publish:extension`

## 插件包构建

`pnpm package:extension`

插件包仅用于测试安装，发布插件不依赖插件包
