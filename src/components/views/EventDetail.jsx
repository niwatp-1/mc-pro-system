import React, { useState, useRef } from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import ProgressBar from '../ui/ProgressBar';
import { STATUS_CONFIG } from '../../constants/statusConfig';
import { THEME } from '../../constants/theme';
import { b64EncodeUnicode } from '../../utils/helpers';
import ScriptViewer from '../modals/ScriptViewer';

// 3. Event Detail
const EventDetail = ({ event, onBack, onUpdateEvent, onViewScript }) => {
    const [activeTab, setActiveTab] = useState('INFO');

    // Local State for adding items
    const [newChecklist, setNewChecklist] = useState("");
    const [newPayment, setNewPayment] = useState({ title: "", amount: "" });
    const [showPayForm, setShowPayForm] = useState(false);
    const [showCheckForm, setShowCheckForm] = useState(false);

    // For File Handling in Event
    const fileInputRef = useRef(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newScriptData, setNewScriptData] = useState({ name: '', content: '' });

    const handleStatusChange = () => {
        const nextStatus = STATUS_CONFIG[event.status]?.next;
        if (nextStatus) onUpdateEvent({ ...event, status: nextStatus });
    };

    const toggleCheck = (id) => {
        const updated = event.checklist.map(c => c.id === id ? { ...c, done: !c.done } : c);
        onUpdateEvent({ ...event, checklist: updated });
    };

    const addChecklist = () => {
        if (!newChecklist) return;
        const newItem = { id: Date.now(), task: newChecklist, done: false };
        onUpdateEvent({ ...event, checklist: [...event.checklist, newItem] });
        setNewChecklist("");
        setShowCheckForm(false);
    };

    const addPayment = () => {
        if (!newPayment.title || !newPayment.amount) return;
        const newPay = {
            id: Date.now(),
            title: newPayment.title,
            amount: Number(newPayment.amount),
            status: "PENDING",
            date: new Date().toISOString().split('T')[0]
        };
        onUpdateEvent({ ...event, payments: [...event.payments, newPay] });
        setNewPayment({ title: "", amount: "" });
        setShowPayForm(false);
    };

    const togglePaymentStatus = (id) => {
        const updated = event.payments.map(p => {
            if (p.id === id) {
                const newStatus = p.status === 'PAID' ? 'PENDING' : 'PAID';
                return { ...p, status: newStatus };
            }
            return p;
        });
        // Recalculate total paid
        const totalPaid = updated.reduce((acc, curr) => curr.status === 'PAID' ? acc + curr.amount : acc, 0);
        onUpdateEvent({ ...event, payments: updated, paid: totalPaid });
    };

    // --- File Handlers for Event Detail ---
    const handleUploadClick = () => fileInputRef.current.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (eventResult) => {
            const content = eventResult.target.result;
            const newFile = {
                id: Date.now(),
                name: file.name,
                date: new Date().toISOString().split('T')[0],
                type: file.type,
                content: content
            };
            const updatedFiles = event.files ? [...event.files, newFile] : [newFile];
            onUpdateEvent({ ...event, files: updatedFiles });
        };
        reader.readAsDataURL(file);
        e.target.value = null;
    };

    const handleCreateScript = () => {
        if (!newScriptData.name || !newScriptData.content) {
            alert("กรุณากรอกชื่อไฟล์และเนื้อหา");
            return;
        }
        const base64Content = b64EncodeUnicode(newScriptData.content);
        const dataUri = `data:text/plain;base64,${base64Content}`;
        const fileName = newScriptData.name.endsWith('.txt') ? newScriptData.name : `${newScriptData.name}.txt`;

        const newFile = {
            id: Date.now(),
            name: fileName,
            date: new Date().toISOString().split('T')[0],
            type: 'text/plain',
            content: dataUri
        };

        const updatedFiles = event.files ? [...event.files, newFile] : [newFile];
        onUpdateEvent({ ...event, files: updatedFiles });
        setShowCreateModal(false);
        setNewScriptData({ name: '', content: '' });
    };

    const handleDeleteFile = (fileId) => {
        if (!confirm("ยืนยันการลบไฟล์นี้?")) return;
        const updatedFiles = event.files.filter(f => f.id !== fileId);
        onUpdateEvent({ ...event, files: updatedFiles });
    }

    const completedTasks = event.checklist.filter(t => t.done).length;
    const totalTasks = event.checklist.length;
    const files = event.files || [];

    return (
        <div className="h-full flex flex-col animate-slide-up relative">
            <div className="flex items-center gap-3 mb-6">
                <Button variant="ghost" onClick={onBack} className="px-2"><Icon name="ArrowRight" className="rotate-180" /></Button>
                <div className="flex-1 overflow-hidden">
                    <h2 className="text-lg sm:text-xl font-bold truncate">{event.title}</h2>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                        <span>{event.date}</span> <span className="mx-1">•</span> <StatusBadge status={event.status} />
                    </div>
                </div>
                {STATUS_CONFIG[event.status]?.next && (
                    <Button variant="primary" onClick={handleStatusChange} className="text-[10px] sm:text-xs px-2 sm:px-3 whitespace-nowrap">
                        → {STATUS_CONFIG[STATUS_CONFIG[event.status].next].label}
                    </Button>
                )}
            </div>

            <div className="flex border-b border-zinc-800 mb-4 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {['INFO', 'CHECKLIST', 'FINANCE', 'SCRIPT'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-[#25F4EE] text-[#25F4EE]' : 'border-transparent text-zinc-500 hover:text-white'}`}>
                        {tab === 'INFO' ? 'ข้อมูล' : tab === 'CHECKLIST' ? 'สิ่งที่ต้องทำ' : tab === 'FINANCE' ? 'การเงิน' : 'สคริปต์'}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
                {activeTab === 'INFO' && (
                    <div className="space-y-4">
                        <Card>
                            <h3 className="text-zinc-400 text-sm mb-3 font-bold uppercase">รายละเอียด</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Icon name="Users" className="text-[#25F4EE] mt-1" />
                                    <div><p className="text-white font-medium">{event.client}</p><p className="text-zinc-500 text-sm">ผู้ติดต่อ</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Icon name="MapPin" className="text-[#FE2C55] mt-1" />
                                    <div><p className="text-white font-medium">{event.location || '-'}</p><p className="text-zinc-500 text-sm">สถานที่</p></div>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex justify-between mb-2"><h3 className="text-zinc-400 text-sm font-bold uppercase">ความคืบหน้า</h3><span className="text-[#25F4EE] text-xs">{Math.round((completedTasks / totalTasks) * 100 || 0)}%</span></div>
                            <ProgressBar current={completedTasks} total={totalTasks} />
                        </Card>
                    </div>
                )}

                {activeTab === 'CHECKLIST' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">รายการสิ่งที่ต้องทำ</h3>
                            <Button variant="ghost" onClick={() => setShowCheckForm(!showCheckForm)} className="text-xs text-[#25F4EE]">+ เพิ่ม</Button>
                        </div>
                        {showCheckForm && (
                            <div className="flex gap-2 mb-2">
                                <input value={newChecklist} onChange={(e) => setNewChecklist(e.target.value)} className={`flex-1 p-2 rounded text-sm ${THEME.input}`} placeholder="ชื่องาน..." />
                                <Button onClick={addChecklist} className="py-1 px-3">Add</Button>
                            </div>
                        )}
                        {event.checklist.map(item => (
                            <div key={item.id} className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                                <button onClick={() => toggleCheck(item.id)} className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center ${item.done ? 'bg-[#25F4EE] border-[#25F4EE]' : 'border-zinc-600'}`}>
                                    {item.done && <Icon name="CheckCircle2" size={14} className="text-black" />}
                                </button>
                                <span className={`${item.done ? 'text-zinc-500 line-through' : 'text-white'} break-words flex-1`}>{item.task}</span>
                                <Button variant="ghost" onClick={() => {
                                    const updated = event.checklist.filter(c => c.id !== item.id);
                                    onUpdateEvent({ ...event, checklist: updated });
                                }} className="ml-auto text-zinc-600 hover:text-red-500"><Icon name="Trash" size={14} /></Button>
                            </div>
                        ))}
                        {event.checklist.length === 0 && <div className="text-center text-zinc-500 py-8">ว่างเปล่า</div>}
                    </div>
                )}

                {activeTab === 'FINANCE' && (
                    <div className="space-y-4">
                        <Card className="bg-gradient-to-r from-zinc-900 to-zinc-800">
                            <div className="flex justify-between items-end">
                                <div><p className="text-zinc-400 text-sm">ยอดรวม</p><p className="text-3xl font-bold">฿{event.price.toLocaleString()}</p></div>
                                <div className="text-right"><p className="text-zinc-400 text-xs">ชำระแล้ว</p><p className={`text-xl font-bold ${event.paid >= event.price ? 'text-green-500' : 'text-[#25F4EE]'}`}>฿{event.paid.toLocaleString()}</p></div>
                            </div>
                            <ProgressBar current={event.paid} total={event.price} />
                            <div className="flex justify-between text-xs text-zinc-500 mt-2">
                                <span>คงเหลือ: ฿{(event.price - event.paid).toLocaleString()}</span>
                            </div>
                        </Card>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center mt-4 mb-2">
                                <h3 className="font-bold">งวดการชำระ</h3>
                                <Button variant="outline" onClick={() => setShowPayForm(!showPayForm)} className="text-xs h-8">+ เพิ่ม</Button>
                            </div>
                            {showPayForm && (
                                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 space-y-2 mb-2">
                                    <input value={newPayment.title} onChange={e => setNewPayment({ ...newPayment, title: e.target.value })} className={`w-full p-2 rounded text-sm ${THEME.input}`} placeholder="ชื่อรายการ (เช่น มัดจำ)" />
                                    <div className="flex gap-2">
                                        <input type="number" value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })} className={`flex-1 p-2 rounded text-sm ${THEME.input}`} placeholder="จำนวนเงิน" />
                                        <Button onClick={addPayment} className="text-xs">บันทึก</Button>
                                    </div>
                                </div>
                            )}
                            {event.payments.map(pay => (
                                <div key={pay.id} className="flex justify-between items-center p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                                    <div onClick={() => togglePaymentStatus(pay.id)} className="flex items-center gap-3 cursor-pointer">
                                        <div className={`p-2 rounded-full flex-shrink-0 ${pay.status === 'PAID' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                            <Icon name="DollarSign" size={16} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm break-words">{pay.title}</p>
                                            <p className="text-xs text-zinc-500">{pay.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">฿{pay.amount.toLocaleString()}</p>
                                        <span onClick={() => togglePaymentStatus(pay.id)} className={`text-[10px] px-2 py-0.5 rounded cursor-pointer ${pay.status === 'PAID' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                            {pay.status === 'PAID' ? 'จ่ายแล้ว' : 'รอจ่าย'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'SCRIPT' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">เอกสารแนบ</h3>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf,image/*,text/*" className="hidden" />
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setShowCreateModal(true)} className="text-xs h-8"><Icon name="Edit" size={14} /> สร้างไฟล์</Button>
                                <Button onClick={handleUploadClick} className="text-xs h-8"><Icon name="Upload" size={14} /> อัปโหลด</Button>
                            </div>
                        </div>

                        {files.length === 0 ? (
                            <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center text-zinc-500 hover:border-[#25F4EE]/50 hover:bg-zinc-900 transition-all cursor-pointer" onClick={handleUploadClick}>
                                <Icon name="FileText" className="mx-auto mb-2" />
                                <p>ยังไม่มีเอกสารแนบ</p>
                                <p className="text-xs mt-1">คลิกเพื่ออัปโหลด หรือกดสร้างไฟล์</p>
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                {files.map(file => (
                                    <div key={file.id} onClick={() => onViewScript(file)} className="bg-zinc-900 p-3 rounded-lg flex justify-between items-center border border-zinc-800 hover:border-[#25F4EE] cursor-pointer group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <Icon name={file.type?.includes('image') ? 'Users' : 'FileText'} className="text-[#FE2C55] group-hover:text-[#25F4EE] flex-shrink-0" size={20} />
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium truncate">{file.name}</p>
                                                <p className="text-xs text-zinc-500">{file.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <Button variant="ghost" className="text-zinc-500 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id); }}><Icon name="Trash" size={14} /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Script Modal Inside Event Detail */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-zinc-900 w-full max-w-lg rounded-xl flex flex-col border border-zinc-700 shadow-2xl">
                        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
                            <h3 className="font-bold text-lg">สร้างไฟล์แนบใหม่</h3>
                            <Button variant="ghost" onClick={() => setShowCreateModal(false)}><Icon name="X" /></Button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">ชื่อไฟล์</label>
                                <input
                                    value={newScriptData.name}
                                    onChange={(e) => setNewScriptData({ ...newScriptData, name: e.target.value })}
                                    className={`w-full p-2 rounded ${THEME.input}`}
                                    placeholder="เช่น กำหนดการ_งานแต่ง"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">เนื้อหา</label>
                                <textarea
                                    value={newScriptData.content}
                                    onChange={(e) => setNewScriptData({ ...newScriptData, content: e.target.value })}
                                    className={`w-full p-2 rounded ${THEME.input} h-40 font-mono text-sm`}
                                    placeholder="พิมพ์ข้อความที่นี่..."
                                ></textarea>
                            </div>
                        </div>
                        <div className="p-4 border-t border-zinc-800 flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>ยกเลิก</Button>
                            <Button onClick={handleCreateScript}>บันทึกไฟล์</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetail;
