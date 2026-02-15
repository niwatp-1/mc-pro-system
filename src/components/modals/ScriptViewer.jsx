import React from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { b64DecodeUnicode } from '../../utils/helpers';

// Helper to decode Base64
const decodeContent = (script) => {
    if (!script.content) return "";
    try {
        const base64Part = script.content.split(',')[1];
        if (!base64Part) return script.content; // fallback
        return b64DecodeUnicode(base64Part);
    } catch (e) {
        return "Error decoding text file.";
    }
};

const ScriptViewer = ({ script, onClose }) => {
    if (!script) return null;

    const isPDF = script.type?.includes('pdf') || script.name.toLowerCase().endsWith('.pdf');
    const isImage = script.type?.includes('image') || /\.(jpg|jpeg|png|gif)$/i.test(script.name);
    const isText = script.type?.includes('text') || /\.(txt|md)$/i.test(script.name);

    let textContent = "";
    if (isText && script.content) {
        textContent = decodeContent(script);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-zinc-900 w-full max-w-4xl h-[85vh] max-h-[90vh] rounded-xl flex flex-col border border-zinc-700 shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-zinc-800">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <Icon name="FileText" className="text-[#25F4EE] flex-shrink-0" />
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-lg truncate">{script.name}</h3>
                            <p className="text-xs text-zinc-400">{script.date}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <Button variant="ghost" onClick={onClose}><Icon name="X" /></Button>
                    </div>
                </div>
                <div className="flex-1 bg-zinc-950 p-4 overflow-auto flex items-center justify-center relative">
                    {!script.content ? (
                        <div className="text-center text-zinc-500">
                            <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
                            <p>ไม่สามารถแสดงตัวอย่างไฟล์นี้ได้ (No Content Data)</p>
                            <p className="text-xs mt-2">นี่อาจเป็นไฟล์ตัวอย่างที่มากับระบบ</p>
                        </div>
                    ) : isPDF ? (
                        <iframe src={script.content} className="w-full h-full rounded border border-zinc-800" title="PDF Viewer"></iframe>
                    ) : isImage ? (
                        <img src={script.content} alt="Preview" className="max-w-full max-h-full rounded shadow-lg object-contain" />
                    ) : isText ? (
                        <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono bg-zinc-900 p-6 rounded-lg w-full h-full overflow-auto text-left">{textContent}</pre>
                    ) : (
                        <div className="text-center text-zinc-500">
                            <p>ไม่รองรับการแสดงผลไฟล์ประเภทนี้</p>
                            <a href={script.content} download={script.name} className="mt-4 inline-block text-[#25F4EE] underline">ดาวน์โหลดไฟล์</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScriptViewer;
