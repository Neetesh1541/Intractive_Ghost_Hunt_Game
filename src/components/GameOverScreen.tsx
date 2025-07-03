import React from 'react';
import { Trophy, RotateCcw, Award, Heart } from 'lucide-react';
import { LeaderboardEntry } from '../types/game';

interface GameOverScreenProps {
  score: number;
  level: number;
  theme: 'dark' | 'light';
  leaderboard: LeaderboardEntry[];
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  level,
  theme,
  leaderboard,
  onRestart
}) => {
  const isNewRecord = leaderboard.length === 0 || score > leaderboard[0].score;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
      } rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl`}>
        <div className="text-center">
          <div className="mb-6">
            {isNewRecord ? (
              <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            ) : (
              <Trophy className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            )}
            <h2 className="text-3xl font-bold mb-2">
              {isNewRecord ? 'New Record!' : 'Game Over!'}
            </h2>
            <p className="text-lg opacity-80">
              {isNewRecord ? 'Congratulations on your new high score!' : 'Great job hunting those ghosts!'}
            </p>
          </div>
          
          <div className="mb-6 space-y-2">
            <div className="text-2xl font-bold text-yellow-400">
              Score: {score}
            </div>
            <div className="text-lg">
              Level Reached: {level}
            </div>
          </div>
          
          {leaderboard.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Top Scores</h3>
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <div key={index} className={`flex justify-between items-center p-2 rounded ${
                    index === 0 ? 'bg-yellow-400/20' : 'bg-black/10'
                  }`}>
                    <span className="font-medium">#{index + 1}</span>
                    <span>{entry.score} pts</span>
                    <span className="text-sm opacity-70">Lv. {entry.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Thank you message */}
          <div className={`mb-6 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="font-semibold">Thank You for Playing!</span>
              <Heart className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-sm opacity-80">
              Game developed by <span className="font-semibold text-purple-400">Neetesh Sharma</span>
            </p>
            <p className="text-xs opacity-70 mt-1">
              Hope you enjoyed this spooky ghost hunting adventure! 👻
            </p>
          </div>
          
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;