-- ========================================
-- ส่วนที่ 1: ลบตารางเก่าและสร้างตารางใหม่
-- ========================================

-- ลบตารางเก่าทั้งหมด (ถ้ามี)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

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

-- สร้าง index
CREATE INDEX idx_bookings_room_date ON bookings(room_id, date);
CREATE INDEX idx_bookings_date ON bookings(date);
