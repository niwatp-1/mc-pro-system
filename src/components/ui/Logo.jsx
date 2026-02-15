import React from 'react';

const Logo = ({ className = "w-12 h-12", showText = true, textSize = "text-xl" }) => {
    return (
        <div className="flex items-center gap-3 select-none">
            {/* Logo Icon */}
            <div className={`${className} relative flex-shrink-0`}>
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_10px_rgba(37,244,238,0.5)]">
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#25F4EE" /> {/* Cyan */}
                            <stop offset="100%" stopColor="#FE2C55" /> {/* Red */}
                        </linearGradient>
                    </defs>

                    {/* Background Shape (Hexagon-ish) */}
                    <path d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 Z" fill="url(#logoGradient)" opacity="0.1" />

                    {/* Stylized 'M' */}
                    <path d="M25 35 V75 L50 55 L75 75 V35" stroke="url(#logoGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                    {/* Microphone Head (Circle on top) */}
                    <circle cx="50" cy="25" r="8" fill="#FE2C55" />

                    {/* Checkmark Accent */}
                    <path d="M65 25 L75 35 L90 15" stroke="#25F4EE" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Logo Text */}
            {showText && (
                <div>
                    <h1 className={`font-bold tracking-wider ${textSize} bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400`}>
                        MC <span className="text-[#25F4EE]">PRO</span>
                    </h1>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium">SYSTEM</p>
                </div>
            )}
        </div>
    );
};

export default Logo;
