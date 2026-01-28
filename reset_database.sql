-- ========================================
-- สคริปต์สำหรับลบและสร้างฐานข้อมูลใหม่
-- ⚠️ คำเตือน: จะลบข้อมูลทั้งหมด!
-- ========================================

-- ลบตารางเก่าทั้งหมด (ถ้ามี)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- ========================================
-- สร้างตารางใหม่
-- ========================================

-- ตาราง departments (แผนก)
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  organization VARCHAR(255),
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
  quantity INTEGER DEFAULT 0,
  category VARCHAR(255),
  status VARCHAR(255) DEFAULT 'พร้อมใช้งาน',
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
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- สร้าง index สำหรับการค้นหาที่เร็วขึ้น
CREATE INDEX idx_bookings_room_date ON bookings(room_id, date);
CREATE INDEX idx_bookings_date ON bookings(date);


-- ========================================
-- ตั้งค่า Row Level Security (RLS)
-- ========================================

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


-- ========================================
-- เพิ่มข้อมูลตัวอย่าง
-- ========================================

-- เพิ่มแผนก
INSERT INTO departments (name, organization) VALUES 
  ('ฝ่ายบริหาร', 'บริษัท ABC จำกัด'),
  ('ฝ่ายการเงิน', 'บริษัท ABC จำกัด'),
  ('ฝ่ายทรัพยากรบุคคล', 'บริษัท ABC จำกัด'),
  ('ฝ่ายไอที', 'บริษัท ABC จำกัด'),
  ('ฝ่ายการตลาด', 'บริษัท ABC จำกัด');

-- เพิ่มอาคาร
INSERT INTO buildings (name) VALUES 
  ('อาคาร A'),
  ('อาคาร B'),
  ('อาคาร C');

-- เพิ่มอุปกรณ์
INSERT INTO equipment (name, quantity, category, status) VALUES 
  ('โปรเจคเตอร์', 5, 'เครื่องฉาย', 'พร้อมใช้งาน'),
  ('ไวท์บอร์ด', 10, 'เครื่องเขียน', 'พร้อมใช้งาน'),
  ('ทีวี', 3, 'อิเล็กทรอนิกส์', 'พร้อมใช้งาน'),
  ('ระบบเสียง', 4, 'เครื่องเสียง', 'พร้อมใช้งาน'),
  ('กล้องวิดีโอคอนเฟอเรนซ์', 2, 'อิเล็กทรอนิกส์', 'พร้อมใช้งาน'),
  ('ไมโครโฟน', 8, 'เครื่องเสียง', 'พร้อมใช้งาน');

-- เพิ่มห้องประชุม
INSERT INTO rooms (name, capacity, building, floor, equipment, image_url) VALUES 
  ('ห้องประชุมใหญ่', 50, 'อาคาร A', 3, ARRAY['โปรเจคเตอร์', 'ระบบเสียง', 'ไมโครโฟน'], '/img/room1.jpg'),
  ('ห้องประชุมกลาง', 20, 'อาคาร A', 2, ARRAY['โปรเจคเตอร์', 'ไวท์บอร์ด'], '/img/room2.jpg'),
  ('ห้องประชุมเล็ก', 10, 'อาคาร B', 1, ARRAY['ทีวี', 'ไวท์บอร์ด'], '/img/room3.jpg'),
  ('ห้องบอร์ด', 15, 'อาคาร A', 5, ARRAY['โปรเจคเตอร์', 'ทีวี', 'ระบบเสียง'], '/img/room4.jpg'),
  ('ห้องสัมมนา', 30, 'อาคาร C', 2, ARRAY['โปรเจคเตอร์', 'ระบบเสียง', 'ไมโครโฟน', 'กล้องวิดีโอคอนเฟอเรนซ์'], '/img/room5.jpg');

-- เพิ่มการจองตัวอย่าง (ถ้าต้องการ)
INSERT INTO bookings (room_id, date, start_time, end_time, purpose, department, booked_by, contact, attendees, status) VALUES 
  (1, CURRENT_DATE, '09:00', '11:00', 'ประชุมคณะกรรมการ', 'ฝ่ายบริหาร', 'สมชาย ใจดี', '081-234-5678', 20, 'confirmed'),
  (2, CURRENT_DATE, '13:00', '15:00', 'อบรมพนักงานใหม่', 'ฝ่ายทรัพยากรบุคคล', 'สมหญิง รักดี', '082-345-6789', 15, 'confirmed'),
  (3, CURRENT_DATE + 1, '10:00', '12:00', 'วางแผนการตลาด', 'ฝ่ายการตลาด', 'สมศักดิ์ มั่นคง', '083-456-7890', 8, 'pending');

-- เสร็จสิ้น! ✅
-- ระบบพร้อมใช้งาน
