# 🚀 Quick Start Guide - Upload to GitHub

## ⚡ ขั้นตอนย่อ (สำหรับผู้ที่ติดตั้ง Git แล้ว)

### 1. ตั้งค่า Git (ครั้งแรกเท่านั้น)
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. Upload โปรเจค
```powershell
cd c:\Users\LENOVO\Desktop\Meeting-room
git init
git add .
git commit -m "Initial commit: Meeting Room Booking System with Supabase"
git branch -M main
git remote add origin https://github.com/Program-Phakanan/KWF-Project.git
git push -u origin main
```

### 3. ถ้า Repository มีข้อมูลอยู่แล้ว
```powershell
git push -u origin main --force
```

---

## 📥 ยังไม่ได้ติดตั้ง Git?

### ดาวน์โหลด Git:
👉 **https://git-scm.com/download/win**

### หลังติดตั้ง:
1. ✅ **รีสตาร์ท PowerShell** (สำคัญมาก!)
2. ✅ ตรวจสอบ: `git --version`
3. ✅ ทำตามขั้นตอนด้านบน

---

## 📚 เอกสารเพิ่มเติม

- **คู่มือละเอียด:** [GITHUB_UPLOAD_GUIDE.md](./GITHUB_UPLOAD_GUIDE.md)
- **สรุปการแก้ไข:** [SOLUTION_SUMMARY.md](./SOLUTION_SUMMARY.md)
- **README:** [README.md](./README.md)

---

## ✅ Checklist

- [ ] ติดตั้ง Git แล้ว
- [ ] รีสตาร์ท PowerShell แล้ว
- [ ] ตั้งค่า user.name และ user.email แล้ว
- [ ] ตรวจสอบ `.gitignore` มี `.env` และ `node_modules`
- [ ] พร้อม Upload!

---

**หมายเหตุ:** ถ้ามีปัญหา ดูที่ [GITHUB_UPLOAD_GUIDE.md](./GITHUB_UPLOAD_GUIDE.md) มีวิธีแก้ปัญหาครบ!
