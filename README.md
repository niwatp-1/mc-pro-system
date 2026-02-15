# React + Vite

เทมเพลตนี้มีการตั้งค่าเบื้องต้นเพื่อให้ React ทำงานร่วมกับ Vite ได้อย่างราบรื่น พร้อมรองรับ HMR (Hot Module Replacement) และกฎ ESLint บางส่วน

ปัจจุบันมีปลั๊กอินที่เป็นทางการให้เลือกใช้ 2 ตัว:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) ใช้ [Babel](https://babeljs.io/) (หรือ [oxc](https://oxc.rs) เมื่อใช้ใน [rolldown-vite](https://vite.dev/guide/rolldown)) สำหรับ Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) ใช้ [SWC](https://swc.rs/) สำหรับ Fast Refresh

## React Compiler

เทมเพลตนี้ไม่ได้เปิดใช้งาน React Compiler ไว้เป็นค่าเริ่มต้น เนื่องจากอาจส่งผลต่อประสิทธิภาพในการพัฒนา (dev) และการ build หากต้องการเพิ่มสามารถดูได้ที่ [เอกสารนี้](https://react.dev/learn/react-compiler/installation)

## การขยายการตั้งค่า ESLint

หากคุณกำลังพัฒนาแอปพลิเคชันสำหรับใช้งานจริง (Production) เราขอแนะนำให้ใช้ TypeScript พร้อมเปิดใช้งานกฎ lint แบบ type-aware ลองดูที่ [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) เพื่อดูวิธีการกำหนดค่า TypeScript และ [`typescript-eslint`](https://typescript-eslint.io) ในโปรเจกต์ของคุณ
