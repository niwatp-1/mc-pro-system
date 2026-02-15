import React, { useState } from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { THEME } from '../../constants/theme';
import { supabase } from '../../utils/supabaseClient';

const SettingsPage = ({ currentUser, onUpdateUser }) => {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handleFileUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `avatar_${currentUser.id}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            // Update User Profile
            onUpdateUser({ ...currentUser, avatar_url: data.publicUrl });
        } catch (error) {
            alert('Error uploading avatar: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwords.current !== currentUser.password) {
            setStatus({ type: 'error', msg: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
            return;
        }
        if (passwords.new !== passwords.confirm) {
            setStatus({ type: 'error', msg: 'รหัสผ่านใหม่ไม่ตรงกัน' });
            return;
        }
        if (passwords.new.length < 4) {
            setStatus({ type: 'error', msg: 'รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร' });
            return;
        }

        onUpdateUser({ ...currentUser, password: passwords.new });
        setStatus({ type: 'success', msg: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว' });
        setPasswords({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="space-y-4 animate-fade-in max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-[#25F4EE]/10 rounded-lg text-[#25F4EE]">
                    <Icon name="Settings" size={24} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">ตั้งค่า (Settings)</h2>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
                    <div className="relative group cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#25F4EE] to-[#FE2C55] flex items-center justify-center text-black font-bold text-2xl overflow-hidden">
                            {currentUser.avatar_url ? (
                                <img src={currentUser.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                currentUser.name.charAt(0)
                            )}
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Icon name="Upload" size={20} className="text-white" />
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                        </label>
                        {uploading && <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full"><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div></div>}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{currentUser.name}</h3>
                        <p className="text-zinc-400 text-sm">@{currentUser.username} • {currentUser.role}</p>
                        <p className="text-xs text-zinc-500 mt-1">แตะที่รูปเพื่อเปลี่ยนโปรไฟล์</p>
                    </div>
                </div>

                <h3 className="font-bold mb-4 text-lg">เปลี่ยนรหัสผ่าน</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-zinc-400 text-sm mb-1">รหัสผ่านปัจจุบัน</label>
                        <input type="password" name="current" value={passwords.current} onChange={handleChange} className={`w-full p-3 rounded-lg ${THEME.input}`} placeholder="••••" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-zinc-400 text-sm mb-1">รหัสผ่านใหม่</label>
                            <input type="password" name="new" value={passwords.new} onChange={handleChange} className={`w-full p-3 rounded-lg ${THEME.input}`} placeholder="••••" />
                        </div>
                        <div>
                            <label className="block text-zinc-400 text-sm mb-1">ยืนยันรหัสผ่านใหม่</label>
                            <input type="password" name="confirm" value={passwords.confirm} onChange={handleChange} className={`w-full p-3 rounded-lg ${THEME.input}`} placeholder="••••" />
                        </div>
                    </div>

                    {status.msg && (
                        <div className={`p-3 rounded-lg text-sm text-center ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                            {status.msg}
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <Button type="submit">บันทึกการเปลี่ยนแปลง</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default SettingsPage;
