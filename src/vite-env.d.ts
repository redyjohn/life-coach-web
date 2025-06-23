// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // ✅ 將 @ 指向 src 目錄
    }
  },
  server: {
    port: 3000, // 🚪 可以自訂開發伺服器的 port（可選）
    open: true  // 🧭 啟動時自動開啟瀏覽器（可選）
  }
})
