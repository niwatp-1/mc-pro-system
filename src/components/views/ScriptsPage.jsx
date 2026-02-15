import React, { useState, useRef, useEffect } from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { THEME } from '../../constants/theme';
import { b64EncodeUnicode } from '../../utils/helpers';

const ScriptsPage = ({ scripts, onUploadScript, onViewScript, onDeleteScript }) => {
    const fileInputRef = useRef(null);
    const [openMenuId, setOpenMenuId] = useState(null); // Track open menu
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newScriptData, setNewScriptData] = useState({ name: '', content: '' });

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const newScript = {
                id: Date.now(),
                name: file.name,
                date: new Date().toISOString().split('T')[0],
                type: file.type,
                content: content
            };
            onUploadScript(newScript);
        };
        reader.readAsDataURL(file);
        // Reset input
        e.target.value = null;
    };

    const handleMenuClick = (e, id) => {
        e.stopPropagation(); // Prevent document click from closing immediately
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleDownload = (e, script) => {
        e.stopPropagation();
        if (!script.content) {
            alert("ไม่สามารถดาวน์โหลดไฟล์ตัวอย่างได้ (No Data)");
            return;
        }
        const link = document.createElement("a");
        link.href = script.content;
        link.download = script.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setOpenMenuId(null);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (confirm("ยืนยันการลบไฟล์นี้?")) {
            onDeleteScript(id);
        }
        setOpenMenuId(null);
    }

    const handleCreateScript = () => {
        if (!newScriptData.name || !newScriptData.content) {
            alert("กรุณากรอกชื่อไฟล์และเนื้อหา");
            return;
        }

        // Encode content to Base64 (supporting Unicode/Thai)
        const base64Content = b64EncodeUnicode(newScriptData.content);
        const dataUri = `data:text/plain;base64,${base64Content}`;

        const fileName = newScriptData.name.endsWith('.txt') ? newScriptData.name : `${newScriptData.name}.txt`;

        const newScript = {
            id: Date.now(),
            name: fileName,
            date: new Date().toISOString().split('T')[0],
            type: 'text/plain',
            content: dataUri
        };

        onUploadScript(newScript);
        setShowCreateModal(false);
        setNewScriptData({ name: '', content: '' });
    };

    return (
        <div className="space-y-4 animate-fade-in relative">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">คลังสคริปต์</h2>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="application/pdf,image/*,text/*"
                    className="hidden"
                />
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowCreateModal(true)}><Icon name="Edit" size={18} /> สร้างไฟล์</Button>
                    <Button onClick={handleUploadClick}><Icon name="Upload" size={18} /> อัปโหลด</Button>
                </div>
            </div>

            <div className="grid gap-3 pb-20">
                {scripts.map(file => (
                    <div
                        key={file.id}
                        onClick={() => onViewScript(file)}
                        className={`${THEME.card} p-4 rounded-xl border ${THEME.border} flex justify-between items-center hover:border-[#25F4EE] transition-colors cursor-pointer group relative`}
                    >
                        <div className="flex items-center gap-3">
                            <Icon name={file.type?.includes('image') ? 'Users' : 'FileText'} className="text-[#FE2C55] group-hover:scale-110 transition-transform" size={24} />
                            <div>
                                <h3 className="font-bold group-hover:text-[#25F4EE] transition-colors">{file.name}</h3>
                                <p className="text-xs text-zinc-400">อัปโหลด: {file.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" className="text-zinc-500 hover:text-[#25F4EE]"><Icon name="Eye" /></Button>

                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    className="text-zinc-500 hover:text-white"
                                    onClick={(e) => handleMenuClick(e, file.id)}
                                >
                                    <Icon name="MoreHorizontal" />
                                </Button>

                                {openMenuId === file.id && (
                                    <div className="absolute right-0 top-full mt-2 w-40 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden">
                                        <button
                                            onClick={(e) => handleDownload(e, file)}
                                            className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-700 flex items-center gap-2 text-white"
                                        >
                                            <Icon name="Download" size={16} /> ดาวน์โหลด
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, file.id)}
                                            className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-700 text-red-400 flex items-center gap-2"
                                        >
                                            <Icon name="Trash" size={16} /> ลบไฟล์
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Script Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-zinc-900 w-full max-w-lg rounded-xl flex flex-col border border-zinc-700 shadow-2xl">
                        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
                            <h3 className="font-bold text-lg">สร้างไฟล์ใหม่</h3>
                            <Button variant="ghost" onClick={() => setShowCreateModal(false)}><Icon name="X" /></Button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">ชื่อไฟล์</label>
                                <input
                                    value={newScriptData.name}
                                    onChange={(e) => setNewScriptData({ ...newScriptData, name: e.target.value })}
                                    className={`w-full p-2 rounded ${THEME.input}`}
                                    placeholder="เช่น Draft_Script_01"
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

export default ScriptsPage;
