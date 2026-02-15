import React, { useState } from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { THEME } from '../../constants/theme';

const UsersPage = ({ users, onAddUser, onDeleteUser }) => {
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'USER' });

    const handleSubmit = () => {
        if (!newUser.username || !newUser.password || !newUser.name) return alert("กรุณากรอกข้อมูลให้ครบ");
        onAddUser(newUser);
        setNewUser({ name: '', username: '', password: '', role: 'USER' });
        setShowForm(false);
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold">จัดการผู้ใช้</h2>
                <Button onClick={() => setShowForm(true)} className="text-xs sm:text-base"><Icon name="UserPlus" size={18} /> เพิ่มผู้ใช้</Button>
            </div>

            {showForm && (
                <Card className="mb-4 bg-zinc-900 border-[#25F4EE]">
                    <h3 className="font-bold mb-3">เพิ่มผู้ใช้ใหม่</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <input placeholder="ชื่อ-นามสกุล" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className={`w-full p-2 rounded ${THEME.input}`} />
                        <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className={`w-full p-2 rounded ${THEME.input}`}>
                            <option value="USER">User (ทั่วไป)</option>
                            <option value="ADMIN">Admin (ผู้ดูแลระบบ)</option>
                        </select>
                        <input placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} className={`w-full p-2 rounded ${THEME.input}`} />
                        <input placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className={`w-full p-2 rounded ${THEME.input}`} />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button variant="ghost" onClick={() => setShowForm(false)}>ยกเลิก</Button>
                        <Button onClick={handleSubmit}>บันทึก</Button>
                    </div>
                </Card>
            )}

            <div className="grid gap-3">
                {users.map(user => (
                    <div key={user.id} className={`${THEME.card} p-4 rounded-xl border ${THEME.border} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${user.role === 'ADMIN' ? 'bg-[#25F4EE] text-black' : 'bg-zinc-800 text-white'}`}>
                                {user.role === 'ADMIN' ? <Icon name="Shield" size={18} /> : <Icon name="Users" size={18} />}
                            </div>
                            <div>
                                <h3 className="font-bold">{user.name}</h3>
                                <p className="text-xs text-zinc-400 break-all">@{user.username} • {user.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            {user.username !== 'admin' && (
                                <Button variant="ghost" className="text-red-500 hover:bg-red-500/10" onClick={() => onDeleteUser(user.id)}>
                                    <Icon name="Trash" size={16} /> ลบ
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersPage;
