/// <reference types="vite/client" />
/// <reference types="@emotion/react/types/css-prop" />

interface Window {
  vscode: Webview
  injectParams: {
    command: string
    openFilePath?: string
    position: {
      line: number
      character: number
    }
  }
}
