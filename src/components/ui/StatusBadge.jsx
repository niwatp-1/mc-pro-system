import React from 'react';
import { STATUS_CONFIG } from '../../constants/statusConfig';

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.LEAD;
    return (
        <span className={`px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold tracking-wider ${config.color} border border-white/5 whitespace-nowrap`}>
            {config.label}
        </span>
    );
};

export default StatusBadge;
