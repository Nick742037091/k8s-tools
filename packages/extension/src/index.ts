import * as vscode from 'vscode'
import { isDev } from './utils'
import * as bridges from './bridges/index'

const cmdPrex = 'k8s-tools.'
const cmdList = ['openInTitle']

export function activate(context: vscode.ExtensionContext) {
  cmdList.forEach((cmd) => {
    let disposable = vscode.commands.registerCommand(`${cmdPrex}${cmd}`, () =>
      createWebviewPanel(context, cmd)
    )
    context.subscriptions.push(disposable)
  })
}

function createWebviewPanel(context: vscode.ExtensionContext, command: string) {
  const panel = vscode.window.createWebviewPanel(
    'k8sToolsWebview',
    'k8s-tools',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true // 切换窗口时保持webview状态
    }
  )
  const injectParams: Record<string, any> = {
    command
  }

  panel.webview.html = getWebviewContent(context, panel.webview, injectParams)
  panel.webview.onDidReceiveMessage((message) => {
    const bridge = bridges[message.command as keyof typeof bridges]
    if (bridge) {
      bridge(message, panel, context)
    } else {
      console.error(`${message.command}桥接不存在`)
    }
  })
}

function getWebviewContent(
  context: vscode.ExtensionContext,
  webview: vscode.Webview,
  injectParams: Record<string, any> = {}
) {
  if (isDev) {
    // 本地开发需要使用本地连接，并处理好热更新
    return `<!doctype html>
        <html lang="en">
          <head>
            <script type="module">import { injectIntoGlobalHook } from "http://localhost:5173/@react-refresh";
              injectIntoGlobalHook(window);
              window.$RefreshReg$ = () => {};
              window.$RefreshSig$ = () => (type) => type;
            </script>

            <script type="module" src="http://localhost:5173/@vite/client"></script>
            <script>
              window.vscode = acquireVsCodeApi();
              window.injectParams = ${JSON.stringify(injectParams)}
            </script>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>k8s-tools</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="http://localhost:5173/src/main.tsx"></script>
          </body>
        </html>`
  } else {
    const scriptPathOnDisk = vscode.Uri.joinPath(
      context.extensionUri,
      'out',
      'webview-page',
      'index.js'
    )
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk)

    const stylePathOnDisk = vscode.Uri.joinPath(
      context.extensionUri,
      'out',
      'webview-page',
      'index.css'
    )
    const styleUri = webview.asWebviewUri(stylePathOnDisk)
    return `<!doctype html>
        <html lang="en">
          <head>
            <script>
              window.vscode = acquireVsCodeApi();
              window.injectParams = ${JSON.stringify(injectParams)}
            </script>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>k8s-tools</title>
          </head>
          <body>
          <div id="root"></div>
          <script type="module" src="${scriptUri}"></script>
          <link rel="stylesheet" href="${styleUri}">
          </body>
        </html>`
  }
}

export function deactivate() {}
