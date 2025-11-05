import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/KWF-Meet/',  // ⬅️ เปลี่ยนให้ตรงกับชื่อ repo
  server: {
    port: 3000,
    host: true
  }
})