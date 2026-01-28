import { createClient } from '@supabase/supabase-js';

// ดึงค่า environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ตรวจสอบว่ามีค่า environment variables หรือไม่
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Missing Supabase environment variables!');
  console.error('Please check your .env file contains:');
  console.error('  VITE_SUPABASE_URL=your_supabase_url');
  console.error('  VITE_SUPABASE_ANON_KEY=your_anon_key');
}

// สร้าง Supabase client
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Export types สำหรับ TypeScript (ถ้าใช้)

