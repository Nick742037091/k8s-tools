export interface Message {
  command: string
  commandId: string
  params?: {
    [key: string]: any
  }
}
