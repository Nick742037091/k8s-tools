import {
  defineConfig,
  presetIcons,
  presetMini,
  presetWind,
  presetAttributify
} from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import transformerDirectives from '@unocss/transformer-directives'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'

export default defineConfig({
  theme: {
    colors: {
      // 自定义主题色
      primary: '#1677FF',
      error: '#ff4d4f',
      dark: '#2B2C2D',
      grey: '#727F93'
    }
  },
  shortcuts: {
    'flex-center': 'items-center justify-center',
    'border-normal': 'border-1px border-solid border-slate-200'
  },
  presets: [
    // 内置样式
    presetMini(),
    presetWind(),
    // 支持iconify
    presetIcons({
      collections: {
        local: FileSystemIconLoader('./src/assets/icons', (svg) =>
          svg.replace(/fill="[^"]+"/g, 'fill="currentColor"')
        )
      }
    }),
    // 支持属性化
    presetAttributify()
  ],
  transformers: [
    // 支持css @apply @screen theme() 指令
    transformerDirectives(),
    transformerAttributifyJsx()
  ]
})
