import React from 'react';
// import { Button, Card, Slider, Select, Switch } from 'antd';

// 🎯 Компонент прицела
export const CSCrosshair: React.FC<{ style: string; isVisible: boolean }> = ({ style, isVisible }) => {
    if (!isVisible) return null;

    const crosshairs = {
        default: (
            <>
                <div className="absolute w-3 h-[1px] bg-lime-400 left-[-12px] top-1/2 -translate-y-1/2"></div>
                <div className="absolute w-3 h-[1px] bg-lime-400 left-[9px] top-1/2 -translate-y-1/2"></div>
                <div className="absolute h-3 w-[1px] bg-lime-400 top-[-12px] left-1/2 -translate-x-1/2"></div>
                <div className="absolute h-3 w-[1px] bg-lime-400 top-[9px] left-1/2 -translate-x-1/2"></div>
                <div className="absolute w-[1px] h-[1px] bg-lime-400 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </>
        ),
        small: (
            <>
                <div className="absolute w-2 h-[1px] bg-lime-400 left-[-8px] top-1/2 -translate-y-1/2"></div>
                <div className="absolute w-2 h-[1px] bg-lime-400 left-[6px] top-1/2 -translate-y-1/2"></div>
                <div className="absolute h-2 w-[1px] bg-lime-400 top-[-8px] left-1/2 -translate-x-1/2"></div>
                <div className="absolute h-2 w-[1px] bg-lime-400 top-[6px] left-1/2 -translate-x-1/2"></div>
            </>
        ),
        dot: (
            <div className="absolute w-1 h-1 bg-lime-400 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
        ),
        cross: (
            <>
                <div className="absolute w-4 h-[1px] bg-lime-400 left-[-16px] top-1/2 -translate-y-1/2"></div>
                <div className="absolute w-4 h-[1px] bg-lime-400 left-[12px] top-1/2 -translate-y-1/2"></div>
                <div className="absolute h-4 w-[1px] bg-lime-400 top-[-16px] left-1/2 -translate-x-1/2"></div>
                <div className="absolute h-4 w-[1px] bg-lime-400 top-[12px] left-1/2 -translate-x-1/2"></div>
            </>
        ),
    };

    return (
        <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            {crosshairs[style as keyof typeof crosshairs] || crosshairs.default}
        </div>
    );
};
