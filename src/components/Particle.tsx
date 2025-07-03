import React from 'react';
import { Particle as ParticleType } from '../types/game';

interface ParticleProps {
  particle: ParticleType;
}

const Particle: React.FC<ParticleProps> = ({ particle }) => {
  return (
    <div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{
        left: `${particle.x}px`,
        top: `${particle.y}px`,
        backgroundColor: particle.color,
        opacity: particle.life,
        transform: `scale(${particle.life})`,
        zIndex: 20
      }}
    />
  );
};

export default Particle;