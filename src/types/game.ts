export interface Ghost {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  captured: boolean;
  fadeDirection: 'in' | 'out';
  moveDirection: { x: number; y: number };
  createdAt: number;
}

export interface GameState {
  score: number;
  timeLeft: number;
  gameRunning: boolean;
  gameOver: boolean;
  level: number;
  ghosts: Ghost[];
  particles: Particle[];
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface GameSettings {
  ghostLifespan: number;
  maxGhosts: number;
  spawnRate: number;
  ghostSize: number;
  ghostSpeed: number;
}

export interface LeaderboardEntry {
  score: number;
  level: number;
  date: string;
}

export type Theme = 'dark' | 'light';
export type Difficulty = 'easy' | 'medium' | 'hard';