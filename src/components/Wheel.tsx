import React from 'react';
import { motion } from 'motion/react';
import { Prize } from '../types';

interface WheelProps {
  prizes: Prize[];
  isSpinning: boolean;
  rotation: number;
  onSpin: () => void;
}

export const Wheel: React.FC<WheelProps> = ({ prizes, isSpinning, rotation, onSpin }) => {
  const numSlices = prizes.length;
  const sliceAngle = 360 / numSlices;
  const radius = 150;
  const center = 150;

  const getSlicePath = (index: number) => {
    const startAngle = (index * sliceAngle) - (sliceAngle / 2);
    const endAngle = startAngle + sliceAngle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="relative w-full max-w-[300px] sm:max-w-[340px] aspect-square mx-auto">
      {/* Pointer */}
      <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-slate-800 rotate-45 rounded-sm shadow-md" />
      </div>

      {/* Wheel Container */}
      <div className="relative w-full h-full rounded-full shadow-2xl bg-white p-2 sm:p-2.5">
        <motion.div
          className="w-full h-full rounded-full overflow-hidden relative border-4 border-slate-800"
          animate={{ rotate: rotation }}
          transition={{ duration: 7, ease: [0.1, 0.0, 0.1, 1.0] }}
        >
          <svg viewBox="0 0 300 300" className="w-full h-full transform -rotate-90">
            {prizes.map((prize, index) => {
              // Calculate text position
              const textAngle = index * sliceAngle;
              const textRad = (textAngle * Math.PI) / 180;
              const textRadius = radius * 0.65;
              const textX = center + textRadius * Math.cos(textRad);
              const textY = center + textRadius * Math.sin(textRad);

              return (
                <g key={prize.id}>
                  <path
                    d={getSlicePath(index)}
                    fill={prize.color}
                    stroke="#1f2937"
                    strokeWidth="1"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill={prize.textColor}
                    fontSize="14"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                    className="select-none"
                  >
                    {prize.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Center Button */}
        <button
          onClick={onSpin}
          disabled={isSpinning}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-800 text-white font-bold text-xl sm:text-2xl shadow-xl hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10 border-4 border-white flex items-center justify-center"
        >
          GO
        </button>
      </div>
    </div>
  );
};
