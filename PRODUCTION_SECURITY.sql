-- 🔒 Production Security Setup for Meeting Room Booking System

-- 1. Enable Row Level Security (RLS) ตารางทั้งหมด (บังคับใช้ Security Policies)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- 2. สร้าง Policies (กฎการเข้าถึงข้อมูล)

-- 🏠 ตาราง Rooms, Departments, Buildings, Equipment
-- Public: อ่านได้อย่างเดียว (SELECT)
-- Admin: ทำได้ทุกอย่าง (ALL)

CREATE POLICY "Public Read Access" ON rooms FOR SELECT USING (true);
CREATE POLICY "Admin Full Access" ON rooms FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public Read Access" ON departments FOR SELECT USING (true);
CREATE POLICY "Admin Full Access" ON departments FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public Read Access" ON buildings FOR SELECT USING (true);
CREATE POLICY "Admin Full Access" ON buildings FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public Read Access" ON equipment FOR SELECT USING (true);
CREATE POLICY "Admin Full Access" ON equipment FOR ALL USING (auth.role() = 'authenticated');

-- 📅 ตาราง Bookings (ซับซ้อนกว่า)
-- Public: 
--   1. อ่านข้อมูลได้ (เพื่อดูตารางว่าง)
--   2. จองห้องได้ (INSERT)
--   3. *ห้าม* แก้ไขหรือลบ (UPDATE/DELETE)
-- Admin: ทำได้ทุกอย่าง

CREATE POLICY "Public Read Bookings" ON bookings FOR SELECT USING (true);

CREATE POLICY "Public Insert Bookings" ON bookings FOR INSERT WITH CHECK (
    -- อนุญาตให้เพิ่มข้อมูลได้ แต่ต้องผ่าน Check Constraints ใน Database
    true
);

CREATE POLICY "Admin Full Access Bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');


-- 3. Data Integrity & Validation (ป้องกันข้อมูลขยะระดับ Database)

-- ป้องกันจองเวลาสิ้นสุดน้อยกว่าเวลาเริ่ม
ALTER TABLE bookings ADD CONSTRAINT check_time_range CHECK (end_time > start_time);

-- ป้องกันการจองซ้ำ (Overlapping Bookings) *** สำคัญมากสำหรับ Production ***
-- หมายเหตุ: ต้องติดตั้ง extension btree_gist ก่อน (Extensions > btree_gist ใน Supabase)
-- CREATE EXTENSION IF NOT EXISTS btree_gist; 
-- ALTER TABLE bookings ADD CONSTRAINT n_overlapping_bookings EXCLUDE USING GIST (
--   room_id WITH =,
--   date WITH =,
--   tsrange(start_time, end_time) WITH &&
-- );

-- 4. Input Validation Constraints
ALTER TABLE bookings ADD CONSTRAINT title_length_check CHECK (char_length(purpose) >= 3);
ALTER TABLE bookings ADD CONSTRAINT contact_check CHECK (char_length(contact) >= 9);

-- 5. Performance Indexes (เพื่อความรวดเร็วในการ Query)
CREATE INDEX IF NOT EXISTS idx_bookings_date_room ON bookings(date, room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(room_id) WHERE start_time > CURRENT_TIME;
