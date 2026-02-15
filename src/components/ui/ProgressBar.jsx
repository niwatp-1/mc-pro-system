import React from 'react';

const ProgressBar = ({ current, total }) => {
    const percent = total === 0 ? 0 : Math.min((current / total) * 100, 100);
    return (
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-[#25F4EE] transition-all duration-500 ease-out" style={{ width: `${percent}%` }} />
        </div>
    );
};

export default ProgressBar;
