import React, { useState } from 'react';
import { Play, Info, Trophy, Github, Mail, Phone } from 'lucide-react';
import { LeaderboardEntry } from '../types/game';

interface StartScreenProps {
  theme: 'dark' | 'light';
  leaderboard: LeaderboardEntry[];
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ theme, leaderboard, onStart }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDeveloper, setShowDeveloper] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className={`${
        theme === 'dark' ? 'bg-gray-900/95 text-white' : 'bg-white/95 text-gray-800'
      } rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl backdrop-blur-sm`}>
        
        {/* Main Menu */}
        {!showHelp && !showLeaderboard && !showDeveloper && (
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                👻 Ghost Hunt
              </h1>
              <p className="text-xl opacity-80">
                Catch as many ghosts as you can in 30 seconds!
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={onStart}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg"
              >
                <Play className="w-6 h-6" />
                Start Game
              </button>
              
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setShowHelp(true)}
                  className="bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-lg p-3 transition-colors flex items-center justify-center gap-2"
                >
                  <Info className="w-5 h-5" />
                  Help
                </button>
                
                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-lg p-3 transition-colors flex items-center justify-center gap-2"
                >
                  <Trophy className="w-5 h-5" />
                  Scores
                </button>
                
                <button
                  onClick={() => setShowDeveloper(true)}
                  className="bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-lg p-3 transition-colors flex items-center justify-center gap-2"
                >
                  <Github className="w-5 h-5" />
                  Dev
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Help Section */}
        {showHelp && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">How to Play</h2>
            <div className="space-y-4 text-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👻</span>
                <p>Click on ghosts before they vanish to catch them</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <p>Each ghost gives you points - higher levels = more points</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏆</span>
                <p>Higher levels make ghosts faster and smaller</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⏰</span>
                <p>You have 30 seconds to get the highest score possible</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">👀</span>
                <p>Watch the ghost eyes - they follow your cursor!</p>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Back to Menu
            </button>
          </div>
        )}
        
        {/* Leaderboard Section */}
        {showLeaderboard && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">Leaderboard</h2>
            {leaderboard.length === 0 ? (
              <p className="text-center text-lg opacity-80">No scores yet. Be the first!</p>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-4 rounded-lg ${
                      index === 0 ? 'bg-yellow-400/20 border-2 border-yellow-400/30' : 'bg-black/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">#{index + 1}</span>
                      {index === 0 && <Trophy className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{entry.score} pts</div>
                      <div className="text-sm opacity-70">Level {entry.level}</div>
                    </div>
                    <div className="text-sm opacity-70">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowLeaderboard(false)}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Back to Menu
            </button>
          </div>
        )}
        
        {/* Developer Section */}
        {showDeveloper && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">Developer Info</h2>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">Neetesh Sharma</div>
                <p className="text-lg opacity-80">Full Stack Developer</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-black/10 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <a href="mailto:neeteshk1104@gmail.com" className="hover:underline">
                    neeteshk1104@gmail.com
                  </a>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-black/10 rounded-lg">
                  <Phone className="w-5 h-5 text-green-400" />
                  <span>+91 8218828273</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-black/10 rounded-lg">
                  <Github className="w-5 h-5 text-gray-400" />
                  <a 
                    href="https://github.com/neetesh1541" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    github.com/neetesh1541
                  </a>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowDeveloper(false)}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Back to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartScreen;