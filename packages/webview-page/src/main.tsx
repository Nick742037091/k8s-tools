import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './index.css'
import 'virtual:uno.css'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

console.log('injectParams', window.injectParams)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} componentSize="middle">
      <App />
    </ConfigProvider>
  </React.StrictMode>
)
