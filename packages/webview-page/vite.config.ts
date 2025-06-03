import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import UnoCSS from 'unocss/vite'
import { join } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    cors: true, // 允许跨域
    headers: {
      'Access-Control-Allow-Origin': '*' // 允许所有来源
    }
  },
  plugins: [
    react({
      // 使用 emotion css prop
      jsxImportSource: '@emotion/react'
    }),
    UnoCSS()
  ],
  build: {
    rollupOptions: {
      output: {
        dir: '../extension/out/webview-page', // 输出目录
        entryFileNames: '[name].js', // 入口文件名
        assetFileNames: '[name].[ext]', // 资源文件名
        chunkFileNames: '[name]-chunk.js' // chunk文件名模板
      }
    }
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src')
    }
  }
})
