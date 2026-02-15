import React, { useState } from 'react';
import { THEME } from '../../constants/theme';
import Logo from '../ui/Logo';

const LoginPage = ({ onLogin }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(formData.username, formData.password, (err) => setError(err));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden p-4">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#25F4EE]/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FE2C55]/10 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-md p-6 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-10 animate-fade-in">
                <div className="text-center mb-8 flex flex-col items-center">
                    <Logo className="w-24 h-24 mb-2" showText={false} />
                    <h1 className="text-3xl font-bold tracking-tight mt-2">
                        MC <span className="text-[#25F4EE]">PRO</span>
                    </h1>
                    <p className="text-zinc-500 text-sm tracking-widest uppercase">System Login</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-zinc-400 text-sm mb-1">ชื่อผู้ใช้งาน</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className={`w-full p-3 rounded-lg ${THEME.input}`}
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-400 text-sm mb-1">รหัสผ่าน</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={`w-full p-3 rounded-lg ${THEME.input}`}
                            placeholder="••••"
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</div>}

                    <button type="submit" className={`w-full py-3 rounded-lg font-bold text-black bg-gradient-to-r from-[#25F4EE] to-[#1FDbd6] hover:opacity-90 transition-opacity mt-2 shadow-[0_0_15px_rgba(37,244,238,0.3)]`}>
                        เข้าสู่ระบบ
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-zinc-600">
                    <p>© 2025 /บริษัท คนทำเว็บ จำกัด All Rights Reserved</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
