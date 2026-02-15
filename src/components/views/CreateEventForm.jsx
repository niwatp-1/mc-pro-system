import React, { useState } from 'react';
import Button from '../ui/Button';
import { THEME } from '../../constants/theme';

const CreateEventForm = ({ clients, onCancel, onSave, initialData = null }) => {
    const [formData, setFormData] = useState(initialData || {
        title: '',
        client: '',
        date: '',
        price: '',
        type: 'Wedding',
        location: '',
        status: 'LEAD' // Default status
    });

    return (
        <div className="animate-fade-in pb-10">
            <h2 className="text-xl font-bold mb-6">{initialData ? 'แก้ไขงาน' : 'สร้างงานใหม่'}</h2>
            <div className="space-y-4">
                <div><label className="text-zinc-400 text-sm">ชื่องาน</label><input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={`w-full p-3 rounded-lg ${THEME.input}`} placeholder="เช่น งานแต่งคุณ A & คุณ B" /></div>

                {/* Responsive Grid for Form Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-zinc-400 text-sm">ลูกค้า</label>
                        <select value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} className={`w-full p-3 rounded-lg ${THEME.input}`}>
                            <option value="">-- เลือกลูกค้า --</option>
                            {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-zinc-400 text-sm">สถานะเริ่มต้น</label>
                        <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className={`w-full p-3 rounded-lg ${THEME.input} font-bold text-[#25F4EE]`}>
                            <option value="LEAD">สนใจ/ลูกค้าใหม่ (Lead)</option>
                            <option value="QUOTED">เสนอราคาแล้ว (Quoted)</option>
                            <option value="CONFIRMED">ยืนยัน/มัดจำแล้ว (Confirmed)</option>
                            <option value="PREPARING">กำลังเตรียมงาน (Preparing)</option>
                            <option value="EVENT_DONE">จบงานแล้ว (Event Done)</option>
                            <option value="CLOSED">ปิดจ็อบสมบูรณ์ (Closed)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="text-zinc-400 text-sm">วันที่</label><input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className={`w-full p-3 rounded-lg ${THEME.input}`} /></div>
                    <div>
                        <label className="text-zinc-400 text-sm">ประเภท</label>
                        <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className={`w-full p-3 rounded-lg ${THEME.input}`}>
                            <option value="Wedding">งานแต่งงาน</option>
                            <option value="Corporate">งานองค์กร</option>
                            <option value="Event">อีเวนต์ทั่วไป</option>
                        </select>
                    </div>
                </div>
                <div><label className="text-zinc-400 text-sm">สถานที่</label><input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className={`w-full p-3 rounded-lg ${THEME.input}`} placeholder="โรงแรม/สถานที่" /></div>
                <div><label className="text-zinc-400 text-sm">ค่าตัว (บาท)</label><input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className={`w-full p-3 rounded-lg ${THEME.input}`} placeholder="0.00" /></div>
                <div className="flex gap-3 pt-4"><Button variant="ghost" onClick={onCancel} className="flex-1">ยกเลิก</Button><Button onClick={() => onSave(formData)} className="flex-1">{initialData ? 'บันทึกการแก้ไข' : 'บันทึก Lead'}</Button></div>
            </div>
        </div>
    );
};

export default CreateEventForm;
