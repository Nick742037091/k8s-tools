import { createHashRouter } from 'react-router-dom'
import HomePage from '@/pages/home/index'

export const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />
  }
])
