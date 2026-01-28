# 🚨 แก้ปัญหา: Refresh แล้วข้อมูลหาย

## 🔍 สาเหตุที่แท้จริง

จากภาพที่คุณส่งมา มี 2 ปัญหาหลัก:

### ปัญหาที่ 1: ใช้ Fallback Authentication
```
⚠️ Using fallback authentication (hardcoded)
```
- ระบบใช้ login แบบ hardcoded (admin/admin)
- **แต่นี่ไม่ใช่ปัญหาหลัก!** เพราะเราตั้งค่า RLS ให้ public access แล้ว

### ปัญหาที่ 2: ยังไม่ได้รัน SQL Script
- **ตารางยังไม่ถูกสร้าง** หรือ **ไม่มีข้อมูลเริ่มต้น**
- ดังนั้นข้อมูลที่เพิ่มจึงไม่ถูกบันทึก

---

## ✅ วิธีแก้ปัญหา (ทำทีละขั้นตอน)

### ขั้นตอนที่ 1: เข้า Supabase Dashboard

1. เปิดเบราว์เซอร์ไปที่: **https://supabase.com**
2. คลิก **Sign in**
3. Login ด้วย account ของคุณ
4. เลือกโปรเจค **meeting-room-booking** (หรือชื่อที่คุณตั้ง)

### ขั้นตอนที่ 2: ตรวจสอบว่ามีตารางหรือยัง

1. คลิกเมนู **Table Editor** (ด้านซ้าย)
2. ดูว่ามีตารางเหล่านี้หรือไม่:
   - `departments`
   - `buildings`
   - `equipment`
   - `rooms`
   - `bookings`

**ถ้ายังไม่มี** → ต้องรันไฟล์ `01_create_tables.sql`

**ถ้ามีแล้ว แต่ไม่มีข้อมูล** → ข้ามไปรันไฟล์ `03_insert_data.sql`

### ขั้นตอนที่ 3: รัน SQL Script

#### 3.1 สร้างตาราง (ถ้ายังไม่มี)

1. คลิกเมนู **SQL Editor** (ด้านซ้าย)
2. คลิกปุ่ม **+ New query**
3. เปิดไฟล์ `sql/01_create_tables.sql` ในโปรเจค
4. **คัดลอกโค้ดทั้งหมด** (Ctrl+A, Ctrl+C)
5. **วางใน SQL Editor** (Ctrl+V)
6. คลิกปุ่ม **Run** (หรือกด Ctrl+Enter)
7. รอจนเห็นข้อความ **Success** สีเขียว

#### 3.2 ตั้งค่า RLS Policies

1. คลิกปุ่ม **+ New query** (สร้าง query ใหม่)
2. เปิดไฟล์ `sql/02_setup_rls.sql`
3. **คัดลอกโค้ดทั้งหมด**
4. **วางใน SQL Editor**
5. คลิกปุ่ม **Run**
6. รอจนเห็น **Success**

#### 3.3 เพิ่มข้อมูลตัวอย่าง

1. คลิกปุ่ม **+ New query** (สร้าง query ใหม่)
2. เปิดไฟล์ `sql/03_insert_data.sql`
3. **คัดลอกโค้ดทั้งหมด**
4. **วางใน SQL Editor**
5. คลิกปุ่ม **Run**
6. รอจนเห็น **Success**

### ขั้นตอนที่ 4: ตรวจสอบข้อมูล

1. กลับไปที่ **Table Editor**
2. คลิกที่ตาราง `rooms`
   - ✅ ควรเห็น **5 ห้องประชุม**
3. คลิกที่ตาราง `equipment`
   - ✅ ควรเห็น **6 อุปกรณ์**
4. คลิกที่ตาราง `departments`
   - ✅ ควรเห็น **5 แผนก**

### ขั้นตอนที่ 5: ทดสอบระบบ

1. กลับมาที่เว็บไซต์ `http://localhost:5173`
2. **Refresh หน้า (F5)**
3. ✅ ตอนนี้ควรเห็นห้องประชุม 5 ห้องแล้ว!
4. Login ด้วย `admin` / `admin`
5. ไปที่เมนู **จัดการอุปกรณ์**
6. คลิก **เพิ่มอุปกรณ์**
7. กรอกข้อมูล:
   - ชื่อ: `ทดสอบ`
   - หมวดหมู่: `อื่นๆ`
   - จำนวน: `1`
   - สถานะ: `พร้อมใช้งาน`
8. คลิก **บันทึก**
9. ✅ ควรเห็นข้อความ "เพิ่มอุปกรณ์เรียบร้อยแล้ว"
10. **Refresh หน้า (F5)**
11. ✅ อุปกรณ์ "ทดสอบ" ควรยังอยู่!

---

## 🔍 วิธีตรวจสอบว่าบันทึกจริงหรือไม่

### วิธีที่ 1: ตรวจสอบใน Supabase Dashboard

1. เข้า Supabase Dashboard
2. ไปที่ **Table Editor** → เลือกตาราง `equipment`
3. ✅ ควรเห็นอุปกรณ์ "ทดสอบ" ที่เพิ่ม

### วิธีที่ 2: ตรวจสอบใน Browser Console

1. เปิด Developer Tools (F12)
2. ไปที่แท็บ **Console**
3. เพิ่มอุปกรณ์ใหม่
4. ดูข้อความ:
   - ✅ `Save equipment error:` = มี error
   - ✅ ไม่มี error = บันทึกสำเร็จ

### วิธีที่ 3: ตรวจสอบใน Network Tab

1. เปิด Developer Tools (F12)
2. ไปที่แท็บ **Network**
3. เพิ่มอุปกรณ์ใหม่
4. ดูคำขอ (requests) ไปยัง Supabase:
   - ✅ เห็น POST request ไปที่ `supabase.co` = กำลังบันทึก
   - ✅ Status 201 = บันทึกสำเร็จ
   - ❌ Status 400/401/403 = มีปัญหา

---

## 🚨 ถ้ายังมีปัญหา

### ปัญหา: "Failed to fetch" หรือ "Network error"

**สาเหตุ:** ไม่สามารถเชื่อมต่อ Supabase ได้

**วิธีแก้:**
1. ตรวจสอบไฟล์ `.env`:
   ```
   VITE_SUPABASE_URL=https://yjecazypmkxvfuqiltbk.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```
2. ตรวจสอบว่า URL และ Key ถูกต้อง
3. **Restart dev server:**
   ```bash
   # กด Ctrl+C เพื่อหยุด
   npm run dev
   ```

### ปัญหา: "Row Level Security policy violation"

**สาเหตุ:** RLS Policy ยังไม่ถูกตั้งค่า

**วิธีแก้:**
1. รันไฟล์ `sql/02_setup_rls.sql` อีกครั้ง
2. ตรวจสอบว่า Policy ถูกสร้างแล้ว:
   - ไปที่ **Authentication** → **Policies**
   - ควรเห็น Policy "Allow public read access", "Allow public insert", etc.

### ปัญหา: "relation does not exist"

**สาเหตุ:** ตารางยังไม่ถูกสร้าง

**วิธีแก้:**
1. รันไฟล์ `sql/01_create_tables.sql` อีกครั้ง
2. ตรวจสอบว่าตารางถูกสร้างแล้ว:
   - ไปที่ **Table Editor**
   - ควรเห็นตาราง `rooms`, `equipment`, `departments`, etc.

---

## 📌 สรุป

**ทำไมข้อมูลถึงหาย?**
- ยังไม่ได้รัน SQL script ใน Supabase
- ตารางยังไม่ถูกสร้าง หรือไม่มีข้อมูล
- ข้อมูลถูกเก็บแค่ใน memory (state) ไม่ได้บันทึกลง Database

**วิธีแก้:**
1. ✅ รัน `sql/01_create_tables.sql` → สร้างตาราง
2. ✅ รัน `sql/02_setup_rls.sql` → ตั้งค่า RLS
3. ✅ รัน `sql/03_insert_data.sql` → เพิ่มข้อมูล
4. ✅ Refresh หน้า → ข้อมูลจะไม่หาย!

**ผลลัพธ์:**
- ✅ ข้อมูลถูกบันทึกลง Supabase Database
- ✅ Refresh หน้าแล้วข้อมูลยังอยู่
- ✅ ระบบทำงานปกติ

---

## 📸 ภาพประกอบ (ตัวอย่าง)

### 1. Supabase SQL Editor
```
┌─────────────────────────────────────┐
│ SQL Editor                          │
├─────────────────────────────────────┤
│ + New query                         │
│                                     │
│ [วางโค้ด SQL ที่นี่]               │
│                                     │
│                    [Run] [Format]   │
└─────────────────────────────────────┘
```

### 2. Table Editor
```
┌─────────────────────────────────────┐
│ Table Editor                        │
├─────────────────────────────────────┤
│ Tables:                             │
│ ✅ departments (5 rows)             │
│ ✅ buildings (3 rows)               │
│ ✅ equipment (6 rows)               │
│ ✅ rooms (5 rows)                   │
│ ✅ bookings (3 rows)                │
└─────────────────────────────────────┘
```

---

**หมายเหตุ:** คุณ**ต้องรัน SQL script ใน Supabase Dashboard** ก่อน ระบบถึงจะทำงานได้! ไม่สามารถรันจาก VS Code หรือ Terminal ได้ครับ 🚀
