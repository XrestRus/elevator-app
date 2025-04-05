import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const base = mode === 'production' ? '/elevator-app/' : '/';
  
  return {
    plugins: [react()],
    base: base,
  }
})
