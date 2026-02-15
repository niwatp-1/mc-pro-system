import React from 'react';
import { THEME } from '../../constants/theme';

const Card = ({ children, className = "", onClick }) => (
    <div
        onClick={onClick}
        className={`${THEME.card} rounded-xl p-4 border ${THEME.border} shadow-lg ${onClick ? 'cursor-pointer hover:border-[#25F4EE] transition-colors active:scale-95' : ''} ${className}`}
    >
        {children}
    </div>
);

export default Card;
