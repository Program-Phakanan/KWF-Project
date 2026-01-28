# 🔧 คู่มือการตั้งค่า Supabase สำหรับระบบจองห้องประชุม

## 📋 ขั้นตอนการตั้งค่า

### 1. สร้างโปรเจค Supabase

1. ไปที่ [https://supabase.com](https://supabase.com)
2. สมัครสมาชิกหรือเข้าสู่ระบบ
3. คลิก "New Project"
4. กรอกข้อมูล:
   - **Project Name**: meeting-room-booking
   - **Database Password**: (สร้างรหัสผ่านที่แข็งแรง)
   - **Region**: Southeast Asia (Singapore) - ใกล้ที่สุดกับประเทศไทย
5. คลิก "Create new project"

### 2. ดึง API Keys

1. ไปที่ **Settings** > **API**
2. คัดลอกค่าต่อไปนี้:
   - **Project URL** (จะมีรูปแบบ `https://xxxxx.supabase.co`)
   - **anon public** key (จะเป็น JWT token ยาวๆ ขึ้นต้นด้วย `eyJhbGciOi...`)

### 3. อัพเดทไฟล์ `.env`

แก้ไขไฟล์ `.env` ในโปรเจค:

```env
# ใส่ Supabase URL และ Key ของคุณที่นี่
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg4ODg4ODgsImV4cCI6MTk5NDQ2NDg4OH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **สำคัญ**: ต้องเป็น key จริงจาก Supabase ของคุณ ไม่ใช่ตัวอย่างข้างบน!

### 4. สร้างตารางในฐานข้อมูล

ไปที่ **SQL Editor** ใน Supabase Dashboard แล้วรันคำสั่ง SQL ต่อไปนี้:

```sql
-- ตาราง departments (แผนก)
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ตาราง buildings (อาคาร)
CREATE TABLE buildings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ตาราง equipment (อุปกรณ์)
CREATE TABLE equipment (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ตาราง rooms (ห้องประชุม)
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  capacity INTEGER NOT NULL,
  building VARCHAR(255),
  floor INTEGER,
  equipment TEXT[],
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ตาราง bookings (การจอง)
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  purpose TEXT,
  department VARCHAR(255),
  booked_by VARCHAR(255) NOT NULL,
  contact VARCHAR(255),
  attendees INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- สร้าง index สำหรับการค้นหาที่เร็วขึ้น
CREATE INDEX idx_bookings_room_date ON bookings(room_id, date);
CREATE INDEX idx_bookings_date ON bookings(date);
```

### 5. ตั้งค่า Row Level Security (RLS)

```sql
-- เปิดใช้งาน RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- สร้าง Policy สำหรับอนุญาตให้อ่านได้ทุกคน
CREATE POLICY "Allow public read access" ON departments FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON buildings FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON equipment FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON rooms FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON bookings FOR SELECT USING (true);

-- สร้าง Policy สำหรับอนุญาตให้เขียนได้ทุกคน (สำหรับทดสอบ)
-- ⚠️ ในระบบจริงควรจำกัดสิทธิ์ให้เฉพาะผู้ใช้ที่ login แล้ว
CREATE POLICY "Allow public insert" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON bookings FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON rooms FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON rooms FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON departments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON departments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON departments FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON buildings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON buildings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON buildings FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON equipment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON equipment FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON equipment FOR DELETE USING (true);
```

### 6. เพิ่มข้อมูลตัวอย่าง

```sql
-- เพิ่มแผนก
INSERT INTO departments (name) VALUES 
  ('ฝ่ายบริหาร'),
  ('ฝ่ายการเงิน'),
  ('ฝ่ายทรัพยากรบุคคล'),
  ('ฝ่ายไอที'),
  ('ฝ่ายการตลาด');

-- เพิ่มอาคาร
INSERT INTO buildings (name) VALUES 
  ('อาคาร A'),
  ('อาคาร B'),
  ('อาคาร C');

-- เพิ่มอุปกรณ์
INSERT INTO equipment (name) VALUES 
  ('โปรเจคเตอร์'),
  ('ไวท์บอร์ด'),
  ('ทีวี'),
  ('ระบบเสียง'),
  ('กล้องวิดีโอคอนเฟอเรนซ์'),
  ('ไมโครโฟน');

-- เพิ่มห้องประชุม
INSERT INTO rooms (name, capacity, building, floor, equipment) VALUES 
  ('ห้องประชุมใหญ่', 50, 'อาคาร A', 3, ARRAY['โปรเจคเตอร์', 'ระบบเสียง', 'ไมโครโฟน']),
  ('ห้องประชุมกลาง', 20, 'อาคาร A', 2, ARRAY['โปรเจคเตอร์', 'ไวท์บอร์ด']),
  ('ห้องประชุมเล็ก', 10, 'อาคาร B', 1, ARRAY['ทีวี', 'ไวท์บอร์ด']);
```

### 7. ตั้งค่า Authentication

1. ไปที่ **Authentication** > **Providers**
2. เปิดใช้งาน **Email** provider
3. ปิด **Confirm email** (สำหรับทดสอบ) หรือเปิดถ้าต้องการให้ยืนยันอีเมล

### 8. สร้างผู้ใช้ Admin

1. ไปที่ **Authentication** > **Users**
2. คลิก "Add user"
3. กรอก:
   - **Email**: admin@example.com
   - **Password**: admin123456
4. คลิก "Create user"

## 🧪 ทดสอบการเชื่อมต่อ

1. รีสตาร์ท dev server:
```bash
npm run dev
```

2. เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`
3. เปิด Console (F12) และดูว่ามี error หรือไม่
4. ถ้าเชื่อมต่อสำเร็จ จะเห็น:
   - ✅ ข้อมูลห้องประชุมโหลดขึ้นมา
   - ✅ ไม่มี error ใน console
   - ✅ สามารถ login ด้วย admin@example.com / admin123456

## ❌ แก้ไขปัญหาที่พบบ่อย

### ปัญหา: "Missing Supabase environment variables"
**วิธีแก้**: 
- ตรวจสอบว่าไฟล์ `.env` อยู่ที่ root ของโปรเจค
- รีสตาร์ท dev server หลังแก้ไข `.env`

### ปัญหา: "Invalid API key"
**วิธีแก้**: 
- ตรวจสอบว่า `VITE_SUPABASE_ANON_KEY` เป็น JWT token ที่ถูกต้อง (ขึ้นต้นด้วย `eyJhbGciOi...`)
- คัดลอก key ใหม่จาก Supabase Dashboard

### ปัญหา: "Failed to fetch"
**วิธีแก้**: 
- ตรวจสอบว่า URL ถูกต้อง
- ตรวจสอบว่าสร้างตารางในฐานข้อมูลแล้ว
- ตรวจสอบว่าเปิด RLS และสร้าง Policy แล้ว

### ปัญหา: Login ไม่ได้
**วิธีแก้**: 
- ตรวจสอบว่าสร้างผู้ใช้ใน Supabase Auth แล้ว
- ถ้ายังไม่มี ให้ใช้ fallback: username `admin` password `admin`

## 📚 เอกสารเพิ่มเติม

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
