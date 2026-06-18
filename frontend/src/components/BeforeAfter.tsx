"use client";

import React, { useState } from "react";

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
}) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] rounded-lg overflow-hidden border border-silver/10 select-none bg-deep-charcoal">
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt="After design"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute top-4 right-4 bg-ink-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] tracking-widest text-gold font-semibold uppercase">
        {afterLabel}
      </div>

      {/* Before Image (Foreground overlay with clipped width) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
      >
        <img
          src={beforeImage}
          alt="Before design"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-ink-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] tracking-widest text-silver font-semibold uppercase">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Split Line */}
      <div
        className="absolute inset-y-0 w-[2px] bg-gold cursor-ew-resize z-20 pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        {/* Slider Handle Knob */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gold border border-ink-black text-ink-black flex items-center justify-between px-1.5 shadow-lg">
          <span className="text-[10px] font-bold">‹</span>
          <span className="text-[10px] font-bold">›</span>
        </div>
      </div>

      {/* Interactive Range Input Overlay */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPos}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        aria-label="Before/after image slider"
      />
    </div>
  );
};
