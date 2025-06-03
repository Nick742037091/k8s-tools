import * as vscode from 'vscode'

export interface CallbackOptions {
  webview: vscode.Webview
  commandId: string
  params?: {
    [key: string]: any
  } | null
}

export const NATIVE_CALLBACK_NAME = 'nativeCallbackResult'
export const nativeCommandCallback = (options: CallbackOptions) => {
  options.webview?.postMessage({
    command: NATIVE_CALLBACK_NAME,
    commandId: options.commandId,
    params: options.params
  })
}
