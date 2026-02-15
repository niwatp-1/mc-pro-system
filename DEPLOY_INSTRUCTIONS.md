# วิธีนำเว็บไซต์ขึ้น GitHub Pages

## 1. เชื่อมต่อกับ GitHub (ทำครั้งแรกครั้งเดียว)
เปิด **Terminal** (หรือ Command Prompt) แล้วรันคำสั่งทีละบรรทัด:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/niwatp-1/mc-pro-system.git
git push -u origin main
```

## 2. อัปโหลดขึ้นเว็บ (Deploy)
รันคำสั่งนี้เพื่อนำเว็บขึ้นออนไลน์:

```bash
npm run deploy
```

## 3. ดูผลลัพธ์
เมื่อรันเสร็จแล้ว รอประมาณ 1-2 นาที เว็บจะออนไลน์ที่:
👉 **https://niwatp-1.github.io/mc-pro-system/**

---
**หมายเหตุ:**
- ถ้ามีการแก้โค้ดครั้งต่อไป ให้รัน `npm run deploy` อีกครั้งเพื่ออัปเดตเว็บ
- ตรวจสอบว่าใน GitHub Repository ตั้งค่า Pages เป็น **gh-pages** branch แล้ว (ปกติจะตั้งให้อัตโนมัติ)
