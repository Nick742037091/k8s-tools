import { nanoid } from 'nanoid'
import { Message } from 'k8s-tools/src/utils/message'

export interface NativeCommandOptions {
  command: string
  params?: {
    [key: string]: any
  }
}

// 用于存储每个commandId的promise
const commandPromises: Record<string, (data: any) => void> = {}

const listener = (event: { data: Message }) => {
  const { command, commandId, params } = event.data
  // 过滤费非nativeCommond的message
  if (command !== 'nativeCallbackResult') return
  if (commandPromises[commandId]) {
    commandPromises[commandId](params)
    delete commandPromises[commandId]
  }
}
window.addEventListener('message', listener)

export const nativeCommond = <T>(options: NativeCommandOptions): Promise<T> => {
  return new Promise((resolve) => {
    const commandId = nanoid()
    window.vscode?.postMessage({
      command: options.command,
      commandId,
      params: options.params
    })
    commandPromises[commandId] = resolve
  })
}
