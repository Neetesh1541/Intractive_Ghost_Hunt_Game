// Enhanced Audio Manager with rich music and sound effects
class AudioManager {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.15;
  private backgroundMusicInterval: number | null = null;
  private ambientInterval: number | null = null;
  private musicLayers: OscillatorNode[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.log('Audio context not supported');
    }
  }

  public playStartSound(): void {
    if (this.isMuted || !this.audioContext) return;
    
    // Create an epic start sound with multiple layers
    const createTone = (freq: number, delay: number, duration: number) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      const filter = this.audioContext!.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.audioContext!.currentTime + delay);
      
      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime + delay);
      oscillator.frequency.exponentialRampToValueAtTime(freq * 2, this.audioContext!.currentTime + delay + duration);
      
      gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext!.currentTime + delay + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + delay + duration);
      
      oscillator.start(this.audioContext!.currentTime + delay);
      oscillator.stop(this.audioContext!.currentTime + delay + duration);
    };

    // Create layered start sound
    createTone(130, 0, 0.8);    // C3
    createTone(164, 0.2, 0.8);  // E3
    createTone(196, 0.4, 0.8);  // G3
    createTone(262, 0.6, 1.0);  // C4
  }

  public startBackgroundMusic(): void {
    if (this.isMuted || !this.audioContext || this.backgroundMusicInterval) return;

    // Create rich layered background music
    const createMusicLayer = (baseFreq: number, variation: number, duration: number) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      const filter = this.audioContext!.createBiquadFilter();
      const reverb = this.audioContext!.createConvolver();

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(baseFreq, this.audioContext!.currentTime);
      
      // Add subtle frequency modulation for spooky effect
      const lfo = this.audioContext!.createOscillator();
      const lfoGain = this.audioContext!.createGain();
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      
      lfo.frequency.setValueAtTime(0.1, this.audioContext!.currentTime);
      lfoGain.gain.setValueAtTime(variation, this.audioContext!.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, this.audioContext!.currentTime);
      filter.Q.setValueAtTime(1, this.audioContext!.currentTime);

      gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.musicVolume, this.audioContext!.currentTime + 2);
      gainNode.gain.linearRampToValueAtTime(this.musicVolume * 0.8, this.audioContext!.currentTime + duration - 2);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + duration);

      oscillator.start();
      lfo.start();
      oscillator.stop(this.audioContext!.currentTime + duration);
      lfo.stop(this.audioContext!.currentTime + duration);

      return oscillator;
    };

    const playMusicCycle = () => {
      if (this.isMuted || !this.audioContext) return;

      // Clear previous layers
      this.musicLayers.forEach(layer => {
        try { layer.stop(); } catch (e) {}
      });
      this.musicLayers = [];

      // Create multiple harmonic layers for rich sound
      this.musicLayers.push(createMusicLayer(55, 2, 12));    // A1 - Deep bass
      this.musicLayers.push(createMusicLayer(82.4, 3, 12));  // E2 - Low harmony
      this.musicLayers.push(createMusicLayer(110, 4, 12));   // A2 - Mid bass
      this.musicLayers.push(createMusicLayer(164.8, 2, 12)); // E3 - Mid tone
    };

    // Start the music cycle
    playMusicCycle();
    this.backgroundMusicInterval = window.setInterval(() => {
      if (!this.isMuted) {
        playMusicCycle();
      }
    }, 10000);

    // Add ambient spooky effects
    this.startAmbientEffects();
  }

  private startAmbientEffects(): void {
    if (this.isMuted || !this.audioContext || this.ambientInterval) return;

    const createAmbientEffect = () => {
      if (this.isMuted || !this.audioContext) return;

      const effects = [
        () => this.createWindEffect(),
        () => this.createEchoEffect(),
        () => this.createDistantBell()
      ];

      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      randomEffect();
    };

    this.ambientInterval = window.setInterval(() => {
      if (!this.isMuted && Math.random() > 0.3) {
        createAmbientEffect();
      }
    }, 3000);
  }

  private createWindEffect(): void {
    if (!this.audioContext) return;

    const noise = this.audioContext.createBufferSource();
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }

    noise.buffer = buffer;
    const filter = this.audioContext.createBiquadFilter();
    const gain = this.audioContext.createGain();

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioContext.destination);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, this.audioContext.currentTime);

    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.5);
    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 2);

    noise.start();
    noise.stop(this.audioContext.currentTime + 2);
  }

  private createEchoEffect(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const delay = this.audioContext.createDelay();

    oscillator.connect(gain);
    gain.connect(delay);
    delay.connect(this.audioContext.destination);
    gain.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
    delay.delayTime.setValueAtTime(0.3, this.audioContext.currentTime);

    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 1);
  }

  private createDistantBell(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, this.audioContext.currentTime + 2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);

    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 3);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 3);
  }

  public stopBackgroundMusic(): void {
    if (this.backgroundMusicInterval) {
      clearInterval(this.backgroundMusicInterval);
      this.backgroundMusicInterval = null;
    }
    
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }

    // Stop all music layers
    this.musicLayers.forEach(layer => {
      try { layer.stop(); } catch (e) {}
    });
    this.musicLayers = [];
  }

  public playGhostCatch(): void {
    if (this.isMuted || !this.audioContext) return;
    
    // Create a satisfying multi-layered "boo" sound
    const createCatchTone = (freq: number, delay: number) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      const filter = this.audioContext!.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime + delay);
      oscillator.frequency.exponentialRampToValueAtTime(freq * 0.5, this.audioContext!.currentTime + delay + 0.2);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.audioContext!.currentTime + delay);
      
      gainNode.gain.setValueAtTime(0.4, this.audioContext!.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + delay + 0.3);
      
      oscillator.start(this.audioContext!.currentTime + delay);
      oscillator.stop(this.audioContext!.currentTime + delay + 0.3);
    };

    // Create layered catch sound
    createCatchTone(300, 0);
    createCatchTone(200, 0.05);
    createCatchTone(150, 0.1);
  }

  public playGameOver(): void {
    if (this.isMuted || !this.audioContext) return;
    
    this.stopBackgroundMusic();
    
    // Create a dramatic, cinematic game over sound
    const createGameOverTone = (freq: number, delay: number, duration: number) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      const filter = this.audioContext!.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime + delay);
      oscillator.frequency.exponentialRampToValueAtTime(freq * 0.3, this.audioContext!.currentTime + delay + duration);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.audioContext!.currentTime + delay);
      filter.frequency.linearRampToValueAtTime(100, this.audioContext!.currentTime + delay + duration);
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext!.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext!.currentTime + delay + duration * 0.5);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + delay + duration);
      
      oscillator.start(this.audioContext!.currentTime + delay);
      oscillator.stop(this.audioContext!.currentTime + delay + duration);
    };

    // Create dramatic descending chord progression
    createGameOverTone(440, 0, 1.5);    // A4
    createGameOverTone(349, 0.3, 1.5);  // F4
    createGameOverTone(293, 0.6, 1.5);  // D4
    createGameOverTone(220, 0.9, 2.0);  // A3
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.stopBackgroundMusic();
    }
    
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const audioManager = new AudioManager();