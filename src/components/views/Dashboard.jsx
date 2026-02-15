import React, { useState, useMemo } from 'react';
import Icon from '../ui/Icon';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { THEME } from '../../constants/theme';

const Dashboard = ({ events, clients, onChangeView }) => {
    // Initial Date Range: Start of current month to End of current month
    const [dateRange, setDateRange] = useState(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        // First day of current month
        const firstDay = new Date(year, month, 1);
        // Last day of current month
        const lastDay = new Date(year, month + 1, 0);

        // Helper to format YYYY-MM-DD based on local time
        const toLocalISO = (dt) => {
            const offset = dt.getTimezoneOffset();
            const adjustedDate = new Date(dt.getTime() - (offset * 60 * 1000));
            return adjustedDate.toISOString().split('T')[0];
        }

        return {
            start: toLocalISO(firstDay),
            end: toLocalISO(lastDay)
        };
    });

    // Filter events based on date range
    const filteredEvents = useMemo(() => {
        return events.filter(e => e.date >= dateRange.start && e.date <= dateRange.end);
    }, [events, dateRange]);

    // Stats calculations based on filteredEvents
    const totalRevenue = filteredEvents.reduce((acc, curr) => acc + (curr.paid || 0), 0);
    const pendingRevenue = filteredEvents.reduce((acc, curr) => acc + (curr.price - (curr.paid || 0)), 0);
    const newLeads = filteredEvents.filter(e => e.status === 'LEAD').length;

    // Sort by date for the list
    const displayedEvents = [...filteredEvents].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Date Filter Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Icon name="LayoutDashboard" className="text-[#25F4EE]" />
                    ภาพรวม
                </h2>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto bg-zinc-900 p-2 rounded-lg border border-zinc-700 shadow-inner">
                    {/* Start Date */}
                    <div className="flex items-center gap-2 flex-1 sm:flex-initial bg-zinc-950 sm:bg-transparent p-2 sm:p-0 rounded border border-zinc-800 sm:border-none">
                        <span className="text-zinc-500 text-xs font-medium whitespace-nowrap w-8 sm:w-auto text-center sm:text-left">จาก</span>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="bg-transparent text-white text-sm outline-none w-full sm:w-32 cursor-pointer"
                        />
                    </div>

                    {/* Separator */}
                    <div className="hidden sm:flex text-zinc-600 px-1">
                        <span className="text-xs">➜</span>
                    </div>

                    {/* End Date */}
                    <div className="flex items-center gap-2 flex-1 sm:flex-initial bg-zinc-950 sm:bg-transparent p-2 sm:p-0 rounded border border-zinc-800 sm:border-none">
                        <span className="text-zinc-500 text-xs font-medium whitespace-nowrap w-8 sm:w-auto text-center sm:text-left">ถึง</span>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="bg-transparent text-white text-sm outline-none w-full sm:w-32 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Responsive Grid: 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card onClick={() => onChangeView('events', 'CLOSED')}>
                    <div className="text-zinc-400 text-xs mb-1">รายรับในช่วงนี้</div>
                    <div className="text-2xl font-bold text-[#25F4EE]">฿{totalRevenue.toLocaleString()}</div>
                </Card>
                <Card onClick={() => onChangeView('events', 'PENDING')}>
                    <div className="text-zinc-400 text-xs mb-1">รอเก็บเงินในช่วงนี้</div>
                    <div className="text-2xl font-bold text-[#FE2C55]">฿{pendingRevenue.toLocaleString()}</div>
                </Card>
                <Card onClick={() => onChangeView('events', 'ALL')}>
                    <div className="text-zinc-400 text-xs mb-1">งานทั้งหมดในช่วงนี้</div>
                    <div className="text-2xl font-bold text-white">{filteredEvents.length}</div>
                </Card>
                <Card onClick={() => onChangeView('events', 'LEAD')}>
                    <div className="text-zinc-400 text-xs mb-1">ลูกค้าใหม่ในช่วงนี้</div>
                    <div className="text-2xl font-bold text-yellow-400">{newLeads}</div>
                </Card>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">งานในช่วงเวลาที่เลือก</h2>
                    <Button variant="ghost" onClick={() => onChangeView('events')} className="text-xs">ดูทั้งหมด</Button>
                </div>
                <div className="space-y-3">
                    {displayedEvents.length === 0 ?
                        <div className="text-center py-10 text-zinc-500 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                            <Icon name="Calendar" size={32} className="mx-auto mb-2 opacity-50" />
                            <p>ไม่มีงานในช่วงเวลานี้</p>
                        </div>
                        :
                        displayedEvents.map(event => (
                            <div
                                key={event.id}
                                onClick={() => onChangeView('event-detail', event)}
                                className={`${THEME.card} p-4 rounded-xl border-l-4 border-l-[#25F4EE] border-y border-r border-zinc-800 hover:bg-zinc-800 cursor-pointer transition-colors`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{event.title}</h3>
                                        <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                                            <Icon name="Calendar" size={14} /> {event.date} • <Icon name="Clock" size={14} /> {event.time}
                                        </div>
                                    </div>
                                    <StatusBadge status={event.status} />
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
