import React from 'react';
import { THEME } from '../../constants/theme';

const Button = ({ children, variant = "primary", className = "", onClick, ...props }) => {
    const baseStyle = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 touch-manipulation select-none";
    const variants = {
        primary: THEME.primary,
        secondary: THEME.secondary,
        outline: `bg-transparent border ${THEME.border} ${THEME.text} hover:bg-zinc-800`,
        ghost: "bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white",
        danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20"
    };
    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
