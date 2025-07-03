import { LeaderboardEntry } from '../types/game';

const LEADERBOARD_KEY = 'ghost-hunt-leaderboard';
const THEME_KEY = 'ghost-hunt-theme';

export const saveScore = (score: number, level: number): void => {
  const entry: LeaderboardEntry = {
    score,
    level,
    date: new Date().toISOString()
  };
  
  const leaderboard = getLeaderboard();
  leaderboard.push(entry);
  
  // Sort by score descending and keep top 10
  leaderboard.sort((a, b) => b.score - a.score);
  const topScores = leaderboard.slice(0, 10);
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topScores));
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveTheme = (theme: string): void => {
  localStorage.setItem(THEME_KEY, theme);
};

export const getTheme = (): string => {
  return localStorage.getItem(THEME_KEY) || 'dark';
};