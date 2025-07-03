import React from 'react';
import { Clock, Trophy, Target, Volume2, VolumeX, Sun, Moon } from 'lucide-react';

interface GameHUDProps {
  score: number;
  timeLeft: number;
  level: number;
  theme: 'dark' | 'light';
  isMuted: boolean;
  onToggleTheme: () => void;
  onToggleMute: () => void;
}

const GameHUD: React.FC<GameHUDProps> = ({
  score,
  timeLeft,
  level,
  theme,
  isMuted,
  onToggleTheme,
  onToggleMute
}) => {
  return (
    <div className={`fixed top-4 left-4 right-4 z-30 ${
      theme === 'dark' ? 'text-white' : 'text-gray-800'
    }`}>
      <div className="flex justify-between items-center">
        {/* Left side - Game stats */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-lg">{score}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-lg">{timeLeft}s</span>
          </div>
          
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
            <Target className="w-5 h-5 text-green-400" />
            <span className="font-bold text-lg">Level {level}</span>
          </div>
        </div>
        
        {/* Right side - Controls */}
        <div className="flex gap-2">
          <button
            onClick={onToggleMute}
            className="bg-black/20 backdrop-blur-sm rounded-lg p-2 hover:bg-black/30 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          
          <button
            onClick={onToggleTheme}
            className="bg-black/20 backdrop-blur-sm rounded-lg p-2 hover:bg-black/30 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;