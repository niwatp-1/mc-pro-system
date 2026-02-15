import React, { useState } from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { THEME } from '../../constants/theme';

const ClientsPage = ({ clients, onAddClient, currentUser, users }) => {
    const [showForm, setShowForm] = useState(false);
    const [newClient, setNewClient] = useState({ name: "", phone: "", company: "" });

    const handleSubmit = () => {
        if (!newClient.name) return;
        onAddClient({ ...newClient, id: Date.now(), total_spent: 0, owner_id: currentUser.id });
        setNewClient({ name: "", phone: "", company: "" });
        setShowForm(false);
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold">ลูกค้า (Clients)</h2>
                <Button onClick={() => setShowForm(true)} className="text-xs sm:text-base"><Icon name="Plus" size={18} /> เพิ่มลูกค้า</Button>
            </div>

            {showForm && (
                <Card className="mb-4 bg-zinc-900 border-[#25F4EE]">
                    <h3 className="font-bold mb-3">เพิ่มลูกค้าใหม่</h3>
                    <div className="space-y-3">
                        <input placeholder="ชื่อลูกค้า" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} className={`w-full p-2 rounded ${THEME.input}`} />
                        <input placeholder="เบอร์โทร" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} className={`w-full p-2 rounded ${THEME.input}`} />
                        <input placeholder="บริษัท/สังกัด" value={newClient.company} onChange={e => setNewClient({ ...newClient, company: e.target.value })} className={`w-full p-2 rounded ${THEME.input}`} />
                        <div className="flex gap-2 justify-end">
                            <Button variant="ghost" onClick={() => setShowForm(false)}>ยกเลิก</Button>
                            <Button onClick={handleSubmit}>บันทึก</Button>
                        </div>
                    </div>
                </Card>
            )}

            <div className="grid gap-3">
                {clients.map(client => {
                    const owner = users.find(u => u.id === client.owner_id);
                    return (
                        <div key={client.id} className={`${THEME.card} p-4 rounded-xl border ${THEME.border} flex justify-between items-center`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[#25F4EE] font-bold">
                                    {client.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold">{client.name}</h3>
                                    <p className="text-xs text-zinc-400">{client.company} • {client.phone}</p>
                                    {/* Creator Stamp for Admin */}
                                    {currentUser.role === 'ADMIN' && owner && (
                                        <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 mt-1 inline-block">
                                            ผู้สร้าง: {owner.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-zinc-500">ยอดรวม</p>
                                <p className="font-bold text-[#FE2C55]">฿{client.total_spent ? client.total_spent.toLocaleString() : '0'}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ClientsPage;
