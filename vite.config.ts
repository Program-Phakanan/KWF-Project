import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // base: '/KWF-Project/', // เปิดบรรทัดนี้ถ้า Deploy ขึ้น GitHub Pages ที่ชื่อ repo นี้
  build: {
    outDir: 'dist',
    sourcemap: false,
    // minify: 'terser', // Comment ออกก่อนเพราะต้องลง terser เพิ่ม หรือใช้ 'esbuild' (default)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react'],
          utils: ['@supabase/supabase-js']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false,
  }
})