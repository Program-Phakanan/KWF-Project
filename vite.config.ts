import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/KWF-Meeting/',
  server: {
    port: 3000,  // เปลี่ยนเป็น port ที่ต้องการ
    host: true   // เพิ่มถ้าต้องการเข้าถึงจากเครื่องอื่น
  }
})