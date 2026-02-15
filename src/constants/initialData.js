export const INITIAL_USERS = [
    { id: 1, username: 'admin', password: '1234', name: 'Admin MC', role: 'ADMIN' },
    { id: 2, username: 'user1', password: '1234', name: 'MC User 1', role: 'USER' }
];

export const INITIAL_CLIENTS = [
    { id: 1, name: "คุณสมศรี (K.Somsri)", phone: "081-234-5678", company: "Private Wedding", totalSpent: 45000, ownerId: 1 },
    { id: 2, name: "บริษัท เทคคอร์ป จํากัด", phone: "02-111-2222", company: "Tech Corp", totalSpent: 120000, ownerId: 1 },
];

export const INITIAL_EVENTS = [
    {
        id: 101,
        ownerId: 1,
        title: "งานแต่งคุณพลอย & คุณนัท",
        client: "คุณสมศรี (K.Somsri)",
        date: "2024-03-15",
        time: "18:00",
        location: "Grand Hyatt Erawan",
        type: "Wedding",
        status: "CONFIRMED",
        price: 15000,
        paid: 5000,
        checklist: [
            { id: 1, task: "ประชุมลำดับพิธีการ", done: true },
            { id: 2, task: "สรุปสคริปต์", done: false },
            { id: 3, task: "เลือกเพลงเปิดตัว", done: false },
        ],
        payments: [
            { id: 1, title: "มัดจำ 30%", amount: 5000, status: "PAID", date: "2024-01-10" },
            { id: 2, title: "งวดสุดท้าย", amount: 10000, status: "PENDING", date: "2024-03-15" },
        ],
        files: []
    }
];

export const INITIAL_SCRIPTS = [
    { id: 1, name: "MC_Script_Wedding_Formal.pdf", date: "2024-01-15", type: "PDF", content: null },
    { id: 2, name: "Game_Activity_Fun.docx", date: "2024-02-10", type: "DOCX", content: null }
];
