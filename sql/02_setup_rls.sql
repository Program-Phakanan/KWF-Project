-- ========================================
-- ส่วนที่ 2: ตั้งค่า Row Level Security (RLS)
-- ========================================

-- เปิดใช้งาน RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy สำหรับ departments
CREATE POLICY "Allow public read access" ON departments FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON departments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON departments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON departments FOR DELETE USING (true);

-- Policy สำหรับ buildings
CREATE POLICY "Allow public read access" ON buildings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON buildings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON buildings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON buildings FOR DELETE USING (true);

-- Policy สำหรับ equipment
CREATE POLICY "Allow public read access" ON equipment FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON equipment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON equipment FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON equipment FOR DELETE USING (true);

-- Policy สำหรับ rooms
CREATE POLICY "Allow public read access" ON rooms FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON rooms FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON rooms FOR DELETE USING (true);

-- Policy สำหรับ bookings
CREATE POLICY "Allow public read access" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON bookings FOR DELETE USING (true);
