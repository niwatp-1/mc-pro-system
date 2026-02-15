import React from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import { THEME } from '../../constants/theme';

const Sidebar = ({ view, onChangeView, isMobileMenuOpen, onToggleMobileMenu, onLogout, currentUser }) => {
    const menuItems = [
        { id: 'dashboard', label: 'ภาพรวม', icon: 'LayoutDashboard' },
        { id: 'events', label: 'งานทั้งหมด', icon: 'Mic2' },
        { id: 'calendar', label: 'ปฏิทิน', icon: 'Calendar' },
        { id: 'clients', label: 'ลูกค้า', icon: 'Users' },
        { id: 'scripts', label: 'คลังสคริปต์', icon: 'FileText' },
        { id: 'users', label: 'จัดการผู้ใช้', icon: 'UserPlus', adminOnly: true },
        { id: 'settings', label: 'ตั้งค่า', icon: 'Settings' }
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 pt-20 md:pt-6 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="px-6 mb-8 hidden md:block">
                <Logo className="w-12 h-12" textSize="text-lg" />
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
                <p className="text-xs text-zinc-500 font-bold px-4 mb-2 uppercase tracking-wider">Menu</p>
                {menuItems.map(item => {
                    if (item.adminOnly && currentUser.role !== 'ADMIN') return null;
                    const isActive = view === item.id || (view === 'event-detail' && item.id === 'events') || (view === 'create-event' && item.id === 'events');
                    return (
                        <button
                            key={item.id}
                            onClick={() => { onChangeView(item.id); if (window.innerWidth < 768) onToggleMobileMenu(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-[#25F4EE] text-black font-bold shadow-[0_0_15px_rgba(37,244,238,0.3)]' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
                        >
                            <Icon name={item.icon} size={20} className={isActive ? 'text-black' : 'text-zinc-500 group-hover:text-[#25F4EE]'} />
                            <span>{item.label}</span>
                            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black"></div>}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 overflow-hidden">
                        {currentUser.avatar_url ? (
                            <img src={currentUser.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <Icon name="User" size={20} className="text-[#25F4EE]" />
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold text-sm truncate">{currentUser.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{currentUser.role === 'ADMIN' ? 'Administrator' : 'User'}</p>
                    </div>
                </div>
                <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500">
                    <Icon name="LogOut" size={18} /> ออกจากระบบ
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;
