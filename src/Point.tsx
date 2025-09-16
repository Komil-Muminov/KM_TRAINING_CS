// import React from 'react';

// // 🎯 Компонент прицела
// export const CSCrosshair: React.FC<{ style: string; isVisible: boolean }> = ({ style, isVisible }) => {
//     if (!isVisible) return null;

//     const crosshairs = {
//         default: (
//             <>
//                 <div className="absolute w-3 h-px bg-lime-400" style={{ left: '-6px', top: '0px' }}></div>
//                 <div className="absolute w-3 h-px bg-lime-400" style={{ left: '3px', top: '0px' }}></div>
//                 <div className="absolute h-3 w-px bg-lime-400" style={{ top: '-6px', left: '0px' }}></div>
//                 <div className="absolute h-3 w-px bg-lime-400" style={{ top: '3px', left: '0px' }}></div>
//             </>
//         ),
//         small: (
//             <>
//                 <div className="absolute w-2 h-px bg-lime-400" style={{ left: '-4px', top: '0px' }}></div>
//                 <div className="absolute w-2 h-px bg-lime-400" style={{ left: '2px', top: '0px' }}></div>
//                 <div className="absolute h-2 w-px bg-lime-400" style={{ top: '-4px', left: '0px' }}></div>
//                 <div className="absolute h-2 w-px bg-lime-400" style={{ top: '2px', left: '0px' }}></div>
//             </>
//         ),
//         dot: <div className="absolute w-1 h-1 bg-lime-400 rounded-full" style={{ left: '-2px', top: '-2px' }}></div>,
//         cross: (
//             <>
//                 <div className="absolute w-4 h-px bg-lime-400" style={{ left: '-8px', top: '0px' }}></div>
//                 <div className="absolute w-4 h-px bg-lime-400" style={{ left: '4px', top: '0px' }}></div>
//                 <div className="absolute h-4 w-px bg-lime-400" style={{ top: '-8px', left: '0px' }}></div>
//                 <div className="absolute h-4 w-px bg-lime-400" style={{ top: '4px', left: '0px' }}></div>
//             </>
//         ),
//     };

//     return (
//         <div
//             className="pointer-events-none fixed z-50"
//             style={{
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//             }}
//         >
//             {crosshairs[style as keyof typeof crosshairs] || crosshairs.default}
//         </div>
//     );
// };
