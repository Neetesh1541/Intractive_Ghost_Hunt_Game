import React from 'react';

interface BackgroundProps {
  theme: 'dark' | 'light';
}

const Background: React.FC<BackgroundProps> = ({ theme }) => {
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200'
    }`}>
      
      {/* Animated Wave Layers */}
      <div className="absolute inset-0">
        {/* Wave 1 - Bottom layer */}
        <div 
          className={`absolute bottom-0 left-0 w-full h-64 opacity-20 ${
            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
          }`}
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='currentColor'%3E%3C/path%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='currentColor'%3E%3C/path%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='currentColor'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: '1200px 120px',
            backgroundRepeat: 'repeat-x',
            animation: 'wave 15s ease-in-out infinite'
          }}
        />
        
        {/* Wave 2 - Middle layer */}
        <div 
          className={`absolute bottom-0 left-0 w-full h-48 opacity-30 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
          }`}
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z' fill='currentColor'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: '1200px 120px',
            backgroundRepeat: 'repeat-x',
            animation: 'wave 10s ease-in-out infinite reverse'
          }}
        />
        
        {/* Wave 3 - Top layer */}
        <div 
          className={`absolute bottom-0 left-0 w-full h-32 opacity-40 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-500'
          }`}
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='currentColor'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: '1200px 120px',
            backgroundRepeat: 'repeat-x',
            animation: 'wave 8s ease-in-out infinite'
          }}
        />
      </div>

      {/* Enhanced Floating Spooky Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs with Glow */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className={`absolute rounded-full ${
              theme === 'dark' ? 'bg-purple-400/30' : 'bg-purple-600/40'
            } animate-pulse shadow-lg`}
            style={{
              left: `${5 + (i * 12)}%`,
              top: `${15 + Math.sin(i) * 35}%`,
              width: `${15 + Math.random() * 25}px`,
              height: `${15 + Math.random() * 25}px`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${2.5 + Math.random() * 2}s`,
              transform: `translateY(${Math.sin(Date.now() * 0.001 + i) * 25}px)`,
              boxShadow: theme === 'dark' 
                ? '0 0 20px rgba(168, 85, 247, 0.4)' 
                : '0 0 15px rgba(147, 51, 234, 0.3)'
            }}
          />
        ))}
        
        {/* Floating Mist Clouds */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`mist-${i}`}
            className={`absolute rounded-full blur-xl ${
              theme === 'dark' ? 'bg-white/8' : 'bg-gray-600/15'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${80 + Math.random() * 150}px`,
              height: `${40 + Math.random() * 80}px`,
              animation: `float ${6 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${i * 1.5}s`
            }}
          />
        ))}
        
        {/* Twinkling Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`star-${i}`}
            className={`absolute w-1 h-1 ${
              theme === 'dark' ? 'bg-white' : 'bg-yellow-400'
            } rounded-full animate-ping`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`
            }}
          />
        ))}

        {/* Ghostly Wisps */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`wisp-${i}`}
            className={`absolute ${
              theme === 'dark' ? 'bg-cyan-400/20' : 'bg-cyan-600/30'
            } rounded-full blur-md`}
            style={{
              left: `${20 + (i * 20)}%`,
              top: `${30 + Math.sin(i * 2) * 20}%`,
              width: `${30 + Math.random() * 40}px`,
              height: `${8 + Math.random() * 15}px`,
              animation: `wisp ${8 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {/* Enhanced Animated Gradient Overlay */}
      <div 
        className={`absolute inset-0 opacity-40 ${
          theme === 'dark' 
            ? 'bg-gradient-to-t from-purple-900/60 via-transparent to-blue-900/40' 
            : 'bg-gradient-to-t from-purple-300/60 via-transparent to-blue-300/40'
        }`}
        style={{
          animation: 'gradientShift 25s ease-in-out infinite'
        }}
      />

      {/* Spooky Particle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className={`absolute w-0.5 h-0.5 ${
              theme === 'dark' ? 'bg-purple-300' : 'bg-purple-500'
            } rounded-full opacity-60`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle ${10 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(-25px) translateY(-10px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(8deg); }
        }
        
        @keyframes wisp {
          0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); opacity: 0.3; }
          25% { transform: translateX(20px) translateY(-15px) rotate(90deg); opacity: 0.6; }
          50% { transform: translateX(-10px) translateY(-25px) rotate(180deg); opacity: 0.4; }
          75% { transform: translateX(-25px) translateY(-10px) rotate(270deg); opacity: 0.7; }
        }
        
        @keyframes gradientShift {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
        
        @keyframes particle {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) translateX(50px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Background;