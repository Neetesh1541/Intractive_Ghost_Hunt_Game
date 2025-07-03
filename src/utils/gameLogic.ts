import { Ghost, GameSettings, Particle } from '../types/game';

export const generateGhostId = (): string => {
  return `ghost-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateParticleId = (): string => {
  return `particle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createGhost = (settings: GameSettings): Ghost => {
  const margin = 50;
  const maxX = window.innerWidth - settings.ghostSize - margin;
  const maxY = window.innerHeight - settings.ghostSize - margin;
  
  // Generate random movement direction with much higher speed variation
  const angle = Math.random() * Math.PI * 2;
  const speed = settings.ghostSpeed * (1.2 + Math.random() * 0.8); // Vary speed by +20% to +100%
  
  return {
    id: generateGhostId(),
    x: Math.random() * Math.max(maxX, 100) + margin,
    y: Math.random() * Math.max(maxY, 100) + margin,
    size: settings.ghostSize,
    speed: speed,
    opacity: 0,
    captured: false,
    fadeDirection: 'in',
    moveDirection: {
      x: Math.cos(angle),
      y: Math.sin(angle)
    },
    createdAt: Date.now()
  };
};

export const createParticles = (x: number, y: number): Particle[] => {
  const particles: Particle[] = [];
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c'];
  
  for (let i = 0; i < 15; i++) {
    particles.push({
      id: generateParticleId(),
      x,
      y,
      vx: (Math.random() - 0.5) * 300,
      vy: (Math.random() - 0.5) * 300,
      life: 1,
      maxLife: 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  
  return particles;
};

export const updateGhost = (ghost: Ghost, deltaTime: number): Ghost => {
  const newGhost = { ...ghost };
  
  // Much faster continuous movement
  newGhost.x += newGhost.moveDirection.x * newGhost.speed * deltaTime;
  newGhost.y += newGhost.moveDirection.y * newGhost.speed * deltaTime;
  
  // Bounce off walls with more dramatic angle changes for faster, more erratic movement
  if (newGhost.x <= 0 || newGhost.x >= window.innerWidth - newGhost.size) {
    newGhost.moveDirection.x *= -1;
    // Add larger random angle change on bounce for more chaotic movement
    newGhost.moveDirection.y += (Math.random() - 0.5) * 0.6;
    // Normalize direction vector
    const magnitude = Math.sqrt(newGhost.moveDirection.x ** 2 + newGhost.moveDirection.y ** 2);
    newGhost.moveDirection.x /= magnitude;
    newGhost.moveDirection.y /= magnitude;
  }
  
  if (newGhost.y <= 0 || newGhost.y >= window.innerHeight - newGhost.size) {
    newGhost.moveDirection.y *= -1;
    // Add larger random angle change on bounce for more chaotic movement
    newGhost.moveDirection.x += (Math.random() - 0.5) * 0.6;
    // Normalize direction vector
    const magnitude = Math.sqrt(newGhost.moveDirection.x ** 2 + newGhost.moveDirection.y ** 2);
    newGhost.moveDirection.x /= magnitude;
    newGhost.moveDirection.y /= magnitude;
  }
  
  // More frequent direction changes for erratic movement
  if (Math.random() < 0.008) { // 0.8% chance per frame (4x more frequent)
    const randomAngle = (Math.random() - 0.5) * 1.2; // Larger random angle changes
    const currentAngle = Math.atan2(newGhost.moveDirection.y, newGhost.moveDirection.x);
    const newAngle = currentAngle + randomAngle;
    newGhost.moveDirection.x = Math.cos(newAngle);
    newGhost.moveDirection.y = Math.sin(newAngle);
  }
  
  // Much faster disappearance - ghosts have very short lifespan
  const age = Date.now() - newGhost.createdAt;
  const fadeInTime = 150;   // Very quick fade in (0.15 seconds)
  const lifespan = 2000;    // Much shorter total lifespan (2 seconds)
  const fadeOutTime = 400;  // Quick fade out duration (0.4 seconds)
  
  if (age < fadeInTime) {
    // Fade in phase
    newGhost.opacity = age / fadeInTime;
    newGhost.fadeDirection = 'in';
  } else if (age > lifespan - fadeOutTime) {
    // Fade out phase
    const fadeProgress = (age - (lifespan - fadeOutTime)) / fadeOutTime;
    newGhost.opacity = Math.max(0, 1 - fadeProgress);
    newGhost.fadeDirection = 'out';
  } else {
    // Fully visible phase
    newGhost.opacity = 1;
  }
  
  return newGhost;
};

export const updateParticle = (particle: Particle, deltaTime: number): Particle => {
  return {
    ...particle,
    x: particle.x + particle.vx * deltaTime,
    y: particle.y + particle.vy * deltaTime,
    life: Math.max(0, particle.life - deltaTime * 2)
  };
};

export const getGameSettings = (level: number): GameSettings => {
  const baseSettings: GameSettings = {
    ghostLifespan: 2000, // Much shorter base lifespan (2 seconds)
    maxGhosts: 8, // Start with more ghosts for immediate intensity
    spawnRate: 600, // Faster initial spawning
    ghostSize: 70, // Slightly smaller for faster gameplay
    ghostSpeed: 150 // Much higher base speed
  };
  
  // Aggressive difficulty scaling for fast-paced gameplay
  return {
    ...baseSettings,
    maxGhosts: Math.min(20, baseSettings.maxGhosts + Math.floor(level / 1.5)), // Up to 20 ghosts, faster scaling
    spawnRate: Math.max(200, baseSettings.spawnRate - (level * 80)), // Much faster spawning reduction
    ghostSize: Math.max(30, baseSettings.ghostSize - (level * 3)), // Smaller ghosts faster
    ghostSpeed: baseSettings.ghostSpeed + (level * 25), // Much faster speed increase per level
    ghostLifespan: Math.max(1200, baseSettings.ghostLifespan - (level * 80)) // Much shorter lifespan scaling
  };
};

// Level increases every 30 points
export const calculateLevel = (score: number): number => {
  return Math.floor(score / 30) + 1;
};

// Consistent 10 points per ghost
export const calculateScore = (level: number): number => {
  return 10;
};