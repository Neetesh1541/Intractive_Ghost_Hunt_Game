import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Theme } from '../types/game';
import { 
  createGhost, 
  createParticles, 
  updateGhost, 
  updateParticle, 
  getGameSettings, 
  calculateLevel, 
  calculateScore 
} from '../utils/gameLogic';
import { saveScore, getLeaderboard } from '../utils/storage';
import { audioManager } from '../utils/audio';
import Background from './Background';
import Ghost from './Ghost';
import Particle from './Particle';
import GameHUD from './GameHUD';
import GameOverScreen from './GameOverScreen';
import StartScreen from './StartScreen';

const GAME_DURATION = 30;

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    timeLeft: GAME_DURATION,
    gameRunning: false,
    gameOver: false,
    level: 1,
    ghosts: [],
    particles: []
  });

  const [theme, setTheme] = useState<Theme>('dark');
  const [isMuted, setIsMuted] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());
  const [showStart, setShowStart] = useState(true);

  const gameLoopRef = useRef<number>();
  const ghostSpawnRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Track mouse movement for ghost eyes
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Game loop with enhanced ghost lifecycle management
  const gameLoop = useCallback((timestamp: number) => {
    const deltaTime = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    setGameState(prevState => {
      if (!prevState.gameRunning || prevState.gameOver) {
        return prevState;
      }

      const newTimeLeft = Math.max(0, prevState.timeLeft - deltaTime);
      const newLevel = calculateLevel(prevState.score);
      
      // Update ghosts - remove those that have faded out completely or been captured
      const updatedGhosts = prevState.ghosts
        .map(ghost => updateGhost(ghost, deltaTime))
        .filter(ghost => ghost.opacity > 0 && !ghost.captured);

      // Update particles
      const updatedParticles = prevState.particles
        .map(particle => updateParticle(particle, deltaTime))
        .filter(particle => particle.life > 0);

      // Check if game should end
      const gameOver = newTimeLeft <= 0;
      
      return {
        ...prevState,
        timeLeft: newTimeLeft,
        level: newLevel,
        ghosts: updatedGhosts,
        particles: updatedParticles,
        gameOver
      };
    });

    if (gameState.gameRunning && !gameState.gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameState.gameRunning, gameState.gameOver]);

  // Enhanced ghost spawning with better timing
  useEffect(() => {
    if (!gameState.gameRunning || gameState.gameOver) return;

    const settings = getGameSettings(gameState.level);
    
    const spawnGhost = () => {
      setGameState(prevState => {
        if (prevState.ghosts.length < settings.maxGhosts) {
          const newGhost = createGhost(settings);
          return {
            ...prevState,
            ghosts: [...prevState.ghosts, newGhost]
          };
        }
        return prevState;
      });
    };

    // Spawn initial ghosts immediately
    if (gameState.ghosts.length === 0) {
      for (let i = 0; i < Math.min(3, settings.maxGhosts); i++) {
        setTimeout(() => spawnGhost(), i * 200);
      }
    }

    ghostSpawnRef.current = window.setInterval(spawnGhost, settings.spawnRate);

    return () => {
      if (ghostSpawnRef.current) {
        clearInterval(ghostSpawnRef.current);
      }
    };
  }, [gameState.gameRunning, gameState.gameOver, gameState.level, gameState.ghosts.length]);

  // Start game loop
  useEffect(() => {
    if (gameState.gameRunning && !gameState.gameOver) {
      lastTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.gameRunning, gameState.gameOver, gameLoop]);

  // Handle game over
  useEffect(() => {
    if (gameState.gameOver && gameState.score > 0) {
      saveScore(gameState.score, gameState.level);
      setLeaderboard(getLeaderboard());
      audioManager.playGameOver();
    }
  }, [gameState.gameOver, gameState.score, gameState.level]);

  const startGame = () => {
    setGameState({
      score: 0,
      timeLeft: GAME_DURATION,
      gameRunning: true,
      gameOver: false,
      level: 1,
      ghosts: [],
      particles: []
    });
    setShowStart(false);
    
    // Play start sound and begin background music
    audioManager.playStartSound();
    setTimeout(() => {
      if (!isMuted) {
        audioManager.startBackgroundMusic();
      }
    }, 1000);
  };

  const restartGame = () => {
    setGameState({
      score: 0,
      timeLeft: GAME_DURATION,
      gameRunning: true,
      gameOver: false,
      level: 1,
      ghosts: [],
      particles: []
    });
    
    // Play start sound and begin background music
    audioManager.playStartSound();
    setTimeout(() => {
      if (!isMuted) {
        audioManager.startBackgroundMusic();
      }
    }, 1000);
  };

  const catchGhost = (ghost: any) => {
    audioManager.playGhostCatch();
    
    const newParticles = createParticles(
      ghost.x + ghost.size / 2,
      ghost.y + ghost.size / 2
    );

    setGameState(prevState => ({
      ...prevState,
      score: prevState.score + calculateScore(prevState.level),
      ghosts: prevState.ghosts.map(g => 
        g.id === ghost.id ? { ...g, captured: true } : g
      ),
      particles: [...prevState.particles, ...newParticles]
    }));
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const toggleMute = () => {
    const newMutedState = audioManager.toggleMute();
    setIsMuted(newMutedState);
    
    // Restart background music if unmuted during game
    if (!newMutedState && gameState.gameRunning && !gameState.gameOver) {
      audioManager.startBackgroundMusic();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none">
      <Background theme={theme} />
      
      {/* Game area */}
      <div className="relative w-full h-full">
        {/* Ghosts */}
        {gameState.ghosts.map(ghost => (
          <Ghost
            key={ghost.id}
            ghost={ghost}
            onCatch={catchGhost}
            cursorX={cursorPosition.x}
            cursorY={cursorPosition.y}
          />
        ))}
        
        {/* Particles */}
        {gameState.particles.map(particle => (
          <Particle key={particle.id} particle={particle} />
        ))}
      </div>

      {/* Game HUD */}
      {gameState.gameRunning && !gameState.gameOver && (
        <GameHUD
          score={gameState.score}
          timeLeft={Math.ceil(gameState.timeLeft)}
          level={gameState.level}
          theme={theme}
          isMuted={isMuted}
          onToggleTheme={toggleTheme}
          onToggleMute={toggleMute}
        />
      )}

      {/* Start Screen */}
      {showStart && (
        <StartScreen
          theme={theme}
          leaderboard={leaderboard}
          onStart={startGame}
        />
      )}

      {/* Game Over Screen */}
      {gameState.gameOver && (
        <GameOverScreen
          score={gameState.score}
          level={gameState.level}
          theme={theme}
          leaderboard={leaderboard}
          onRestart={restartGame}
        />
      )}
    </div>
  );
};

export default Game;