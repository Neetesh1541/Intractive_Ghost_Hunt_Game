import React, { useEffect, useRef } from 'react';
import { Ghost as GhostType } from '../types/game';

interface GhostProps {
  ghost: GhostType;
  onCatch: (ghost: GhostType) => void;
  cursorX: number;
  cursorY: number;
}

const Ghost: React.FC<GhostProps> = ({ ghost, onCatch, cursorX, cursorY }) => {
  const ghostRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!ghost.captured) {
      onCatch(ghost);
    }
  };

  // Calculate eye positions based on cursor with faster tracking
  const eyeOffset = () => {
    const ghostCenterX = ghost.x + ghost.size / 2;
    const ghostCenterY = ghost.y + ghost.size / 2;
    const angle = Math.atan2(cursorY - ghostCenterY, cursorX - ghostCenterX);
    const distance = Math.min(4, Math.sqrt(Math.pow(cursorX - ghostCenterX, 2) + Math.pow(cursorY - ghostCenterY, 2)) / 40);
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
  };

  const eyePos = eyeOffset();

  // Enhanced floating animation for fast movement
  const floatOffset = Math.sin(Date.now() * 0.008 + ghost.id.charCodeAt(0)) * 4;

  return (
    <div
      ref={ghostRef}
      className={`absolute cursor-pointer select-none transition-all duration-100 ${
        ghost.captured ? 'pointer-events-none' : 'hover:scale-125'
      }`}
      style={{
        left: `${ghost.x}px`,
        top: `${ghost.y}px`,
        width: `${ghost.size}px`,
        height: `${ghost.size}px`,
        opacity: ghost.opacity,
        transform: `scale(${ghost.captured ? 0 : 1}) translateY(${floatOffset}px) rotate(${Math.sin(Date.now() * 0.01) * 3}deg)`,
        zIndex: 10,
        filter: ghost.fadeDirection === 'out' ? 'blur(2px) brightness(1.2)' : 'none'
      }}
      onClick={handleClick}
    >
      {/* Ghost body */}
      <div className="relative w-full h-full">
        {/* Main ghost shape with intense glow for fast movement */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/98 to-white/85 rounded-t-full shadow-xl"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 75%, 85% 100%, 70% 85%, 50% 100%, 30% 85%, 15% 100%, 0 75%)',
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.5), inset 0 0 25px rgba(255, 255, 255, 0.2)'
          }}
        />
        
        {/* Intense ghost glow effect for fast movement */}
        <div className="absolute inset-0 bg-blue-300/60 rounded-t-full blur-lg animate-pulse" 
             style={{ animationDuration: '1s' }} />
        
        {/* Speed trail effect */}
        <div className="absolute inset-0 bg-cyan-400/40 rounded-t-full blur-xl animate-pulse" 
             style={{ animationDuration: '0.8s', animationDelay: '0.4s' }} />
        
        {/* Movement streak effect */}
        <div 
          className="absolute inset-0 bg-white/20 rounded-t-full blur-md"
          style={{
            transform: `translateX(${-ghost.moveDirection.x * 8}px) translateY(${-ghost.moveDirection.y * 8}px)`,
            opacity: ghost.speed > 150 ? 0.6 : 0.3
          }}
        />
        
        {/* Eyes with faster tracking for high-speed movement */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-black rounded-full shadow-inner">
          <div 
            className="absolute w-1.5 h-1.5 bg-white rounded-full transition-transform duration-75"
            style={{
              transform: `translate(${eyePos.x}px, ${eyePos.y}px)`,
              left: '50%',
              top: '50%',
              marginLeft: '-3px',
              marginTop: '-3px'
            }}
          />
        </div>
        <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-black rounded-full shadow-inner">
          <div 
            className="absolute w-1.5 h-1.5 bg-white rounded-full transition-transform duration-75"
            style={{
              transform: `translate(${eyePos.x}px, ${eyePos.y}px)`,
              left: '50%',
              top: '50%',
              marginLeft: '-3px',
              marginTop: '-3px'
            }}
          />
        </div>
        
        {/* Mouth with panic expression for fast disappearing */}
        <div className={`absolute top-1/2 left-1/2 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
          ghost.fadeDirection === 'out' ? 'w-3 h-4 scale-125' : 'w-2 h-2'
        }`} />
        
        {/* High-speed particle trail */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-full blur-sm"
          style={{
            transform: `translateX(${-ghost.moveDirection.x * 12}px) translateY(${-ghost.moveDirection.y * 12}px) scaleX(${ghost.speed / 100})`,
            opacity: ghost.speed > 200 ? 0.4 : 0.2
          }}
        />
      </div>
    </div>
  );
};

export default Ghost;