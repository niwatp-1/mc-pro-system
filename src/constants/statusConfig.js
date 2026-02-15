export const STATUS_CONFIG = {
    LEAD: { label: "สนใจ/ลูกค้าใหม่", color: "text-yellow-400 bg-yellow-400/10", next: "QUOTED" },
    QUOTED: { label: "เสนอราคาแล้ว", color: "text-blue-400 bg-blue-400/10", next: "CONFIRMED" },
    CONFIRMED: { label: "ยืนยัน/มัดจำแล้ว", color: "text-[#25F4EE] bg-[#25F4EE]/10", next: "PREPARING" },
    PREPARING: { label: "กำลังเตรียมงาน", color: "text-purple-400 bg-purple-400/10", next: "EVENT_DONE" },
    EVENT_DONE: { label: "จบงานแล้ว", color: "text-orange-400 bg-orange-400/10", next: "CLOSED" },
    CLOSED: { label: "ปิดจ็อบสมบูรณ์", color: "text-green-500 bg-green-500/10", next: null },
    CANCELLED: { label: "ยกเลิก", color: "text-red-500 bg-red-500/10", next: null },
};
