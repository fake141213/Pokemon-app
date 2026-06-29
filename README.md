# Pokémon Explorer

Pokémon Explorer เป็นเว็บแอปที่สร้างด้วย **Next.js** และ **MUI** เพื่อแสดงข้อมูล Pokémon จาก PokeAPI แบบแบ่งหน้า (pagination)

## รายละเอียดโปรเจค

- หน้าแรกโหลดข้อมูล Pokémon ทีละหน้า ไม่ดึงข้อมูลทั้งหมด 1,351 ตัวพร้อมกัน
- ใช้เทคนิคการดึงข้อมูลทีละหน้า เพื่อให้เว็บตอบสนองเร็วและไม่หนัก
- ผู้ใช้สามารถคลิกโปเกม่อนแต่ละตัวเพื่อดูหน้ารายละเอียด
- หน้ารายละเอียดมีข้อมูลครบทั้ง:
  - ชื่อโปเกม่อน
  - ภาพโปเกม่อน
  - สถานะ (stats)
  - ประเภทของโปเกม่อน
  - ข้อมูลวิวัฒนาการ
  - ปุ่มเล่นเสียงโปเกม่อน
- ใช้ **MUI Skeleton** ในขณะที่รอโหลดข้อมูลจาก API
- มีหน้า **About this project** ที่แสดงข้อมูลผู้พัฒนา รายวิชา หลักสูตร มหาวิทยาลัย และลิงก์ GitHub
- ออกแบบ UI ให้รองรับแบบ responsive และดูสะอาดตาในโทนสี Pokémon

## คุณสมบัติสำคัญ

- Pagination สำหรับ Pokémon list
- การ์ด Pokémon แบบ responsive
- Skeleton loading state ขณะดึงข้อมูล
- หน้ารายละเอียด Pokémon ที่มีข้อมูลครบถ้วน
- Navigation ระหว่างหน้า Home และ About

## เทคโนโลยีที่ใช้

- Next.js App Router
- React
- TypeScript
- Material UI (MUI)
- PokeAPI

## ผู้พัฒนา

- ชื่อ: Jakkraphong Samransit
- รหัสนักศึกษา: 673450032-2
- รายวิชา: Front-end Web Programming IN403101
- หลักสูตร: Computer and Information Science
- สถาบันการศึกษา: Khon Kaen University

## เริ่มใช้งาน

ติดตั้ง dependencies แล้วรันโปรเจคด้วยคำสั่ง:

```bash
npm install
npm run dev
```

เปิดเว็บที่:

```
http://localhost:3000
```
## Screenshots

### Home Page
![Uploading Screenshot 2026-06-29 223743.png…]()



### Pokemon Detail
![Detail](screenshots/detail.png)

### About Page
![About](screenshots/about.png)

## GitHub Source
https://github.com/fake141213/Pokemon-app.git

## หมายเหตุเกี่ยวกับรูปภาพ

โปรเจกต์นี้ดึงข้อมูลจาก **PokeAPI** และคลังรูปภาพอย่างเป็นทางการของ Pokémon

Pokémon บางตัว โดยเฉพาะ Alternate Forms, Battle Forms หรือ Special Forms ไม่มีไฟล์รูปภาพอยู่ในฐานข้อมูลของ PokeAPI จึงไม่สามารถแสดงรูปได้ แม้ว่าจะมีข้อมูลชื่อและรายละเอียดของ Pokémon ครบถ้วน

ระบบจึงแสดงรูปภาพสำรอง (`no-image.png`) แทน เพื่อให้หน้าเว็บยังสามารถใช้งานได้ตามปกติ

ข้อจำกัดนี้เป็นข้อจำกัดของข้อมูลจาก PokeAPI ไม่ใช่ข้อผิดพลาดของตัวโปรแกรม

