-- ========================================
-- สร้าง Storage Bucket สำหรับเก็บรูปภาพห้องประชุม
-- ========================================

-- สร้าง bucket ชื่อ 'room-images' (ถ้ายังไม่มี)
-- หมายเหตุ: ต้องรันคำสั่งนี้ใน Supabase Dashboard → Storage → Create bucket
-- หรือใช้ SQL Editor

-- ตั้งค่า Storage Policy สำหรับ public access
-- เพื่อให้สามารถอัพโหลดและดูรูปได้โดยไม่ต้อง login

-- Policy สำหรับอ่านรูปภาพ (ทุกคนดูได้)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'room-images' );

-- Policy สำหรับอัพโหลดรูปภาพ (ทุกคนอัพโหลดได้)
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'room-images' );

-- Policy สำหรับลบรูปภาพ (ทุกคนลบได้)
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'room-images' );

-- Policy สำหรับอัปเดตรูปภาพ (ทุกคนแก้ไขได้)
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'room-images' );
