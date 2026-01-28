# 🏢 ระบบจองห้องประชุม KWF (Meeting Room Booking System)

ระบบจองห้องประชุมออนไลน์ที่ทันสมัย พัฒนาด้วย React + Vite + Supabase

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)

## ✨ คุณสมบัติหลัก

- 🔐 **ระบบ Authentication** - เข้าสู่ระบบด้วย Supabase Auth
- 📅 **จองห้องประชุม** - จองห้องตามวันและเวลาที่ต้องการ
- 🏢 **จัดการห้องประชุม** - เพิ่ม แก้ไข ลบห้องประชุม
- 📊 **แดชบอร์ดแอดมิน** - ดูสถิติและข้อมูลการจอง
- 🏛️ **จัดการอาคาร** - จัดการข้อมูลอาคารและชั้น
- 🏢 **จัดการแผนก** - จัดการข้อมูลแผนกต่างๆ
- ⚙️ **จัดการอุปกรณ์** - จัดการอุปกรณ์ในห้องประชุม
- 💾 **บันทึกข้อมูลอัตโนมัติ** - ข้อมูลทั้งหมดบันทึกลง Supabase Database
- 🔄 **ไม่มีปัญหาข้อมูลหาย** - รีเฟรชหน้าแล้วข้อมูลยังอยู่

## 🚀 เทคโนโลยีที่ใช้

- **Frontend:** React 18.3.1 + Vite
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Styling:** Vanilla CSS
- **Icons:** Lucide React
- **Deployment:** Vercel

## 📋 ข้อกำหนดเบื้องต้น

- Node.js 18+ 
- npm หรือ yarn
- บัญชี Supabase (ฟรี)

## 🛠️ การติดตั้ง

### 1. Clone โปรเจค

```bash
git clone https://github.com/Program-Phakanan/KWF-Project.git
cd KWF-Project
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**วิธีหา Supabase URL และ Key:**
1. เข้า [https://supabase.com](https://supabase.com)
2. สร้างโปรเจคใหม่ (ถ้ายังไม่มี)
3. ไปที่ Settings → API
4. คัดลอก `Project URL` และ `anon public` key

### 4. ตั้งค่า Database

1. เข้า Supabase Dashboard
2. ไปที่ **SQL Editor**
3. คัดลอกโค้ดจากไฟล์ `reset_database.sql`
4. วางและกด **Run**
5. รอจนเห็นข้อความ "Success"

### 5. ตั้งค่า Storage (สำหรับรูปภาพห้องประชุม)

1. เข้า Supabase Dashboard
2. ไปที่ **Storage**
3. คัดลอกโค้ดจากไฟล์ `sql/04_setup_storage.sql`
4. รันใน SQL Editor

### 6. สร้างผู้ใช้แอดมิน

1. ไปที่ **Authentication** → **Users**
2. คลิก **Add user** → **Create new user**
3. กรอก:
   - Email: `admin@example.com`
   - Password: `admin123456`
4. คลิก **Create user**

### 7. รันโปรเจค

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173`

## 📁 โครงสร้างโปรเจค

```
KWF-Project/
├── src/
│   ├── components/          # React Components
│   │   ├── Navigation.jsx   # เมนูนำทาง + Logout
│   │   ├── HomePage.jsx     # หน้าแรก
│   │   ├── LoginPage.jsx    # หน้า Login
│   │   ├── AdminDashboard.jsx
│   │   ├── RoomDetail.jsx
│   │   ├── ManageRooms.jsx
│   │   ├── ManageBookings.jsx
│   │   ├── ManageDepartments.jsx
│   │   ├── ManageBuildings.jsx
│   │   └── ManageEquipment.jsx
│   ├── utils/
│   │   ├── auth.js          # Supabase Authentication
│   │   └── database.js      # CRUD Functions
│   ├── lib/
│   │   └── supabaseClient.js # Supabase Configuration
│   ├── App.jsx              # Main App Component
│   └── main.jsx             # Entry Point
├── sql/                     # SQL Scripts
│   ├── 01_create_tables.sql
│   ├── 02_insert_data.sql
│   ├── 03_rls_policies.sql
│   └── 04_setup_storage.sql
├── public/
│   └── img/                 # รูปภาพ
├── .env                     # Environment Variables (ไม่ upload)
├── .env.example             # ตัวอย่าง Environment Variables
├── .gitignore
├── package.json
├── vite.config.ts
└── README.md
```

## 🔑 การใช้งาน

### สำหรับผู้ใช้ทั่วไป

1. เปิดเว็บไซต์
2. ดูห้องประชุมที่มีอยู่
3. เลือกห้องที่ต้องการ
4. เลือกวันและเวลา
5. กรอกข้อมูลการจอง
6. ยืนยันการจอง

### สำหรับแอดมิน

1. Login เข้าสู่ระบบ
2. เข้าถึงเมนู **จัดการข้อมูล**:
   - **จัดการห้องประชุม** - เพิ่ม/แก้ไข/ลบห้องประชุม
   - **จัดการการจอง** - ดู/อนุมัติ/ยกเลิกการจอง
   - **จัดการแผนก** - จัดการข้อมูลแผนก
   - **จัดการอาคาร** - จัดการข้อมูลอาคาร
   - **จัดการอุปกรณ์** - จัดการอุปกรณ์
3. ดูสถิติใน **แดชบอร์ดแอดมิน**

## 🔧 การแก้ปัญหา

### ปัญหา: ข้อมูลหายหลังรีเฟรช

**สาเหตุ:** Database ยังไม่มีข้อมูล  
**วิธีแก้:** รัน `reset_database.sql` ใน Supabase SQL Editor

### ปัญหา: Login ไม่ได้

**สาเหตุ:** ยังไม่ได้สร้างผู้ใช้  
**วิธีแก้:** สร้างผู้ใช้ใน Supabase Authentication → Users

### ปัญหา: รูปภาพไม่แสดง

**สาเหตุ:** ยังไม่ได้ตั้งค่า Storage  
**วิธีแก้:** รัน `sql/04_setup_storage.sql` ใน Supabase SQL Editor

### ปัญหา: "Failed to fetch"

**สาเหตุ:** ไฟล์ `.env` ไม่ถูกต้อง  
**วิธีแก้:** 
1. ตรวจสอบ `VITE_SUPABASE_URL` และ `VITE_SUPABASE_ANON_KEY`
2. Restart dev server (`Ctrl+C` แล้ว `npm run dev`)

## 📚 เอกสารเพิ่มเติม

- [SOLUTION_SUMMARY.md](./SOLUTION_SUMMARY.md) - สรุปการแก้ไขปัญหา
- [FIX_REFRESH_PROBLEM.md](./FIX_REFRESH_PROBLEM.md) - วิธีแก้ปัญหารีเฟรช
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - คู่มือตั้งค่า Supabase
- [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) - คู่มือ Deploy ขึ้น Vercel

## 🚀 การ Deploy

### Deploy ด้วย Vercel

1. Push โค้ดขึ้น GitHub
2. เข้า [https://vercel.com](https://vercel.com)
3. Import โปรเจคจาก GitHub
4. ตั้งค่า Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. คลิก **Deploy**

## 🤝 การมีส่วนร่วม

1. Fork โปรเจค
2. สร้าง Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง Branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

## 📝 License

โปรเจคนี้เป็น Open Source ภายใต้ MIT License

## 👨‍💻 ผู้พัฒนา

- **Phakanan** - [GitHub](https://github.com/Program-Phakanan)

## 🙏 ขอบคุณ

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/)
- [Lucide Icons](https://lucide.dev/)
- [Vercel](https://vercel.com/)

---

**หมายเหตุ:** โปรเจคนี้พัฒนาขึ้นเพื่อใช้ในการจัดการห้องประชุมภายในองค์กร ✨
