import React, { useState, useEffect } from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { THEME } from '../../constants/theme';

const EventList = ({ events, onSelectEvent, onCreateEvent, onEditEvent, initialFilter = 'ALL', currentUser, users }) => {
    const [filter, setFilter] = useState(initialFilter);

    // Update filter when initialFilter prop changes (e.g. from Dashboard click)
    useEffect(() => {
        setFilter(initialFilter);
    }, [initialFilter]);

    // Enhanced filter logic to support 'PENDING'
    const filteredEvents = filter === 'ALL'
        ? events
        : filter === 'PENDING'
            ? events.filter(e => (e.price - e.paid) > 0 && e.status !== 'CANCELLED' && e.status !== 'LEAD' && e.status !== 'QUOTED')
            : events.filter(e => e.status === filter);

    const tabs = [
        { key: 'ALL', label: 'ทั้งหมด' },
        { key: 'PENDING', label: 'รอเก็บเงิน' }, // Added Pending Tab
        { key: 'LEAD', label: 'ลูกค้าใหม่' },
        { key: 'QUOTED', label: 'เสนอราคา' },
        { key: 'CONFIRMED', label: 'ยืนยัน/มัดจำแล้ว' },
        { key: 'PREPARING', label: 'กำลังเตรียมงาน' },
        { key: 'EVENT_DONE', label: 'จบงานแล้ว' },
        { key: 'CLOSED', label: 'ปิดจ็อบสมบูรณ์' },
        { key: 'CANCELLED', label: 'ยกเลิก' }
    ];

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold">งานทั้งหมด</h2>
                <Button onClick={onCreateEvent} variant="primary" className="text-xs sm:text-base"><Icon name="Plus" size={18} /> สร้างงานใหม่</Button>
            </div>
            <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setFilter(tab.key)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${filter === tab.key ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="space-y-3">
                {filteredEvents.length === 0 ? <div className="text-center py-10 text-zinc-500">ไม่พบงานในสถานะนี้</div> :
                    filteredEvents.map(event => {
                        const owner = users.find(u => u.id === event.owner_id);
                        return (
                            <div key={event.id} onClick={() => onSelectEvent(event)} className={`${THEME.card} ${THEME.cardHover} p-4 rounded-xl border ${THEME.border} cursor-pointer group relative`}>
                                <div className="absolute top-4 right-4 z-10">
                                    <Button variant="ghost" className="text-zinc-500 hover:text-[#25F4EE] p-1 h-auto" onClick={(e) => { e.stopPropagation(); onEditEvent(event); }}>
                                        <Icon name="Edit" size={16} />
                                    </Button>
                                </div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-[#25F4EE]/20 group-hover:text-[#25F4EE] transition-colors flex-shrink-0">
                                            <Icon name={event.type === 'Wedding' ? 'Users' : 'Mic2'} size={20} />
                                        </div>
                                        <div className="pr-8">
                                            <h3 className="font-bold text-white group-hover:text-[#25F4EE] transition-colors break-words">{event.title}</h3>
                                            <p className="text-sm text-zinc-400 truncate">{event.client}</p>
                                        </div>
                                    </div>
                                    <div className="text-right mt-12 hidden sm:block">
                                        <StatusBadge status={event.status} />
                                        <p className="text-xs text-zinc-500 mt-1">฿{event.price.toLocaleString()}</p>
                                    </div>
                                </div>
                                {/* Mobile Status and Price shown below */}
                                <div className="flex justify-between items-center sm:hidden mt-2 mb-3">
                                    <StatusBadge status={event.status} />
                                    <p className="text-sm font-bold text-[#25F4EE]">฿{event.price.toLocaleString()}</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 border-t border-zinc-800 pt-3 mt-2">
                                    <span className="flex items-center gap-1"><Icon name="Calendar" size={12} /> {event.date}</span>
                                    <span className="flex items-center gap-1"><Icon name="MapPin" size={12} /> {event.location || 'ไม่ระบุ'}</span>
                                </div>
                                {/* Created By Stamp for Admin */}
                                {currentUser.role === 'ADMIN' && owner && (
                                    <div className="absolute bottom-2 right-2 text-[10px] text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-700/50">
                                        ผู้สร้าง: {owner.name}
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default EventList;
