import {
  workspace,
  WebviewPanel,
  ExtensionContext,
  env as vscodeEnv,
  Uri
} from 'vscode'
import * as fs from 'fs'
import { nativeCommandCallback } from '../utils/bridge'
import { Message } from '@/utils/message'
import { window } from 'vscode'
import path from 'path'
import { execSync } from 'child_process'
import { createK8S } from './k8s'

export const closeWebview = async (
  message: Message,
  panel: WebviewPanel,
  context: ExtensionContext
) => {
  panel.dispose()
}

export const getProjectName = async (
  message: Message,
  panel: WebviewPanel,
  context: ExtensionContext
) => {
  let projectName = ''
  const workspaceFolders = workspace.workspaceFolders
  if (workspaceFolders) {
    const rootPath = workspaceFolders[0].uri.fsPath
    const packageJsonPath = path.join(rootPath, 'package.json')
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(packageJsonContent)
    projectName = packageJson.name || ''
  }

  nativeCommandCallback({
    webview: panel.webview,
    commandId: message.commandId,
    params: {
      data: projectName
    }
  })
}

export const getGitUrl = async (
  message: Message,
  panel: WebviewPanel,
  context: ExtensionContext
) => {
  let gitUrl = ''
  try {
    // 获取当前所在目录的package.json，提取name字段
    const workspaceFolders = workspace.workspaceFolders
    if (!workspaceFolders) {
      window.showErrorMessage('没有打开的工作区')
      return
    }

    const rootPath = workspaceFolders[0].uri.fsPath
    gitUrl = execSync('git config --get remote.origin.url', {
      cwd: rootPath
    })
      .toString()
      .trim()
  } catch (error) {
    gitUrl = ''
  }
  nativeCommandCallback({
    webview: panel.webview,
    commandId: message.commandId,
    params: {
      data: gitUrl
    }
  })
}

export const createK8SConfig = async (
  message: Message,
  panel: WebviewPanel,
  context: ExtensionContext
) => {
  const { token, env, projectName, gitUrl, gitBranch } = message.params || {}
  const result = await createK8S(token, env, projectName, gitUrl, gitBranch)
  nativeCommandCallback({
    webview: panel.webview,
    commandId: message.commandId,
    params: {
      data: result
    }
  })
}

// vscode 访问外部链接
export const openUrl = (
  message: Message,
  panel: WebviewPanel,
  context: ExtensionContext
) => {
  const { url } = message.params || {}
  if (!url) {
    return
  }
  vscodeEnv.openExternal(Uri.parse(url))
}
