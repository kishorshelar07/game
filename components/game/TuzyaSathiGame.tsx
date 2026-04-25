'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { GameState, InputState, LevelData, Particle, Enemy, Collectible } from '@/lib/game/types';
import { LEVELS, BASE_WIDTH, BASE_HEIGHT, LEVEL_WIDTH, ENDING_TEXT } from '@/lib/game/levels';
import {
  createGameState,
  createPlayer,
  resetPlayerForLevel,
  updatePlayer,
  updateCamera,
  updateEnemies,
  updateCollectibles,
  updateParticles,
  spawnAmbientParticles,
  checkGoalReached,
  throwHeartAtBoss,
  getLevelData,
  saveHighScore,
  saveCompletedLevel,
  getHighScore,
} from '@/lib/game/engine';
import {
  drawBubbu,
  drawKishor,
  drawHeart,
  drawIceCream,
  drawButterfly,
  drawPuddle,
  drawRaindrop,
  drawStormCloud,
  drawLonelinessMonster,
  drawPhotoFrame,
  drawLoveToken,
  drawPlatform,
  drawSharedCone,
  drawSorryHeart,
  drawBadBadBubble,
  drawCoffeeCup,
  drawCoffeeSteam,
  drawGiftBox,
  drawShoppingBag,
  drawMovieTicket,
  drawPopcorn,
} from '@/lib/game/sprites';
import { COLORS } from '@/lib/game/types';

// Music URL - user can fill this in
const BACKGROUND_MUSIC_URL = "";

export default function TuzyaSathiGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>(createGameState());
  const inputRef = useRef<InputState>({ left: false, right: false, jump: false, throw: false });
  const levelDataRef = useRef<LevelData | null>(null);
  const animationFrameRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isLandscape, setIsLandscape] = useState(true);
  const [gameScreen, setGameScreen] = useState<GameState['screen']>('start');
  const [isMuted, setIsMuted] = useState(false);
  const [currentCutscene, setCurrentCutscene] = useState('');
  const [endingProgress, setEndingProgress] = useState(0);
  const [showEndingText, setShowEndingText] = useState(false);
  const [displayedEndingText, setDisplayedEndingText] = useState('');
  const [highScore, setHighScore] = useState(0);
  
  // Load high score on client only
  useEffect(() => {
    setHighScore(getHighScore());
  }, []);
  
  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });
      setIsLandscape(width > height);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);
  
  // Initialize audio
  useEffect(() => {
    if (BACKGROUND_MUSIC_URL && typeof window !== 'undefined') {
      audioRef.current = new Audio(BACKGROUND_MUSIC_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
      
      // Create AudioContext for iOS compatibility
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      if (audioRef.current) {
        audioRef.current.muted = newMuted;
      }
      gameStateRef.current.isMuted = newMuted;
      return newMuted;
    });
  }, []);
  
  // Start music
  const startMusic = useCallback(async () => {
    if (audioRef.current && !gameStateRef.current.musicStarted) {
      try {
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        await audioRef.current.play();
        gameStateRef.current.musicStarted = true;
      } catch {
        console.log('[v0] Audio autoplay blocked');
      }
    }
  }, []);
  
  // Start game
  const startGame = useCallback(() => {
    startMusic();
    gameStateRef.current = createGameState();
    gameStateRef.current.screen = 'playing';
    gameStateRef.current.currentLevel = 0;
    gameStateRef.current.player = resetPlayerForLevel(createPlayer(), 0);
    levelDataRef.current = getLevelData(0);
    setGameScreen('playing');
  }, [startMusic]);
  
  // Handle cutscene completion
  const nextLevel = useCallback(() => {
    const gs = gameStateRef.current;
    const nextLevelIndex = gs.currentLevel + 1;
    
    if (nextLevelIndex >= LEVELS.length) {
      // Game complete - show ending
      gs.screen = 'ending';
      setGameScreen('ending');
      setEndingProgress(0);
      saveHighScore(gs.player.score);
      setHighScore(getHighScore());
    } else {
      gs.currentLevel = nextLevelIndex;
      gs.player = resetPlayerForLevel(gs.player, nextLevelIndex);
      levelDataRef.current = getLevelData(nextLevelIndex);
      gs.camera = { x: 0, y: 0 };
      gs.rainbowActive = false;
      gs.screen = 'playing';
      setGameScreen('playing');
    }
  }, []);
  
  // Handle game over
  const handleGameOver = useCallback(() => {
    gameStateRef.current.screen = 'gameover';
    setGameScreen('gameover');
    saveHighScore(gameStateRef.current.player.score);
    setHighScore(getHighScore());
  }, []);
  
  // Restart game
  const restartGame = useCallback(() => {
    startMusic();
    gameStateRef.current = createGameState();
    gameStateRef.current.screen = 'playing';
    gameStateRef.current.currentLevel = 0;
    gameStateRef.current.player = resetPlayerForLevel(createPlayer(), 0);
    levelDataRef.current = getLevelData(0);
    setGameScreen('playing');
  }, [startMusic]);
  
  // Toggle pause
  const togglePause = useCallback(() => {
    const gs = gameStateRef.current;
    if (gs.screen === 'playing') {
      gs.screen = 'paused';
      setGameScreen('paused');
    } else if (gs.screen === 'paused') {
      gs.screen = 'playing';
      setGameScreen('playing');
    }
  }, []);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          inputRef.current.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          inputRef.current.right = true;
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          e.preventDefault();
          inputRef.current.jump = true;
          break;
        case 'KeyX':
        case 'KeyZ':
          inputRef.current.throw = true;
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyP':
        case 'Escape':
          togglePause();
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          inputRef.current.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          inputRef.current.right = false;
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          inputRef.current.jump = false;
          break;
        case 'KeyX':
        case 'KeyZ':
          inputRef.current.throw = false;
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [toggleMute, togglePause]);
  
  // Touch button handlers
  const handleTouchStart = useCallback((button: string) => {
    startMusic();
    switch (button) {
      case 'left':
        inputRef.current.left = true;
        break;
      case 'right':
        inputRef.current.right = true;
        break;
      case 'jump':
        inputRef.current.jump = true;
        break;
      case 'throw':
        inputRef.current.throw = true;
        break;
    }
  }, [startMusic]);
  
  const handleTouchEnd = useCallback((button: string) => {
    switch (button) {
      case 'left':
        inputRef.current.left = false;
        break;
      case 'right':
        inputRef.current.right = false;
        break;
      case 'jump':
        inputRef.current.jump = false;
        break;
      case 'throw':
        inputRef.current.throw = false;
        break;
    }
  }, []);
  
  // Ending text animation
  useEffect(() => {
    if (gameScreen === 'ending' && showEndingText) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= ENDING_TEXT.length) {
          setDisplayedEndingText(ENDING_TEXT.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [gameScreen, showEndingText]);
  
  // Ending sequence
  useEffect(() => {
    if (gameScreen === 'ending') {
      const timer = setTimeout(() => {
        setEndingProgress(prev => {
          if (prev < 5) return prev + 1;
          return prev;
        });
      }, 2000);
      
      if (endingProgress === 4) {
        setShowEndingText(true);
      }
      
      return () => clearTimeout(timer);
    }
  }, [gameScreen, endingProgress]);
  
  // Main game loop
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let lastThrowTime = 0;
    
    const gameLoop = () => {
      const gs = gameStateRef.current;
      const level = levelDataRef.current;
      
      // Calculate scale
      const scaleX = screenSize.width / BASE_WIDTH;
      const scaleY = screenSize.height / BASE_HEIGHT;
      const scale = Math.min(scaleX, scaleY);
      
      // Set canvas size
      canvas.width = BASE_WIDTH;
      canvas.height = BASE_HEIGHT;
      canvas.style.width = `${screenSize.width}px`;
      canvas.style.height = `${screenSize.height}px`;
      
      // Clear canvas
      ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
      
      if (gs.screen === 'playing' && level) {
        // Draw background
        const gradient = ctx.createLinearGradient(0, 0, 0, BASE_HEIGHT);
        level.backgroundGradient.forEach((color, i) => {
          gradient.addColorStop(i / (level.backgroundGradient.length - 1), color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
        
        // Draw parallax clouds/stars
        ctx.save();
        ctx.translate(-gs.camera.x * 0.3, 0);
        drawParallaxLayer(ctx, level.id, gs.player.animationFrame);
        ctx.restore();
        
        // Draw "BUBBU" in clouds
        ctx.save();
        ctx.translate(-gs.camera.x * 0.5, 0);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '24px Arial';
        ctx.fillText('BUBBU', 200, 50);
        ctx.fillText('BUBBU', 800, 60);
        ctx.fillText('BUBBU', 1600, 45);
        ctx.restore();
        
        // Apply camera
        ctx.save();
        ctx.translate(-gs.camera.x, -gs.camera.y);
        
        // Draw platforms
        for (const platform of level.platforms) {
          drawPlatform(ctx, platform.x, platform.y, platform.width, platform.height, platform.type, gs.player.animationFrame);
        }
        
        // Draw collectibles
        for (const collectible of level.collectibles) {
          if (collectible.collected) continue;
          
          switch (collectible.type) {
            case 'heart':
              drawHeart(ctx, collectible.x, collectible.y, collectible.animationFrame);
              break;
            case 'icecream':
              drawIceCream(ctx, collectible.x, collectible.y, collectible.animationFrame);
              break;
            case 'shared-cone':
              drawSharedCone(ctx, collectible.x, collectible.y, collectible.animationFrame);
              break;
            case 'sorry-heart':
              drawSorryHeart(ctx, collectible.x, collectible.y, collectible.animationFrame);
              break;
            case 'photo-frame':
              drawPhotoFrame(ctx, collectible.x, collectible.y, collectible.animationFrame, collectible.frameIndex || 1);
              break;
            case 'bad-bad':
              drawBadBadBubble(ctx, collectible.x, collectible.y, collectible.animationFrame, collectible.text || '');
              break;
case 'love-token':
  drawLoveToken(ctx, collectible.x, collectible.y, collectible.animationFrame);
  break;
case 'coffee-cup':
  drawCoffeeCup(ctx, collectible.x, collectible.y, collectible.animationFrame);
  break;
case 'gift-box':
  drawGiftBox(ctx, collectible.x, collectible.y, collectible.animationFrame);
  break;
case 'movie-ticket':
  drawMovieTicket(ctx, collectible.x, collectible.y, collectible.animationFrame);
  break;
  }
  }
        
        // Draw enemies
        for (const enemy of level.enemies) {
          if (enemy.hp <= 0) continue;
          
          switch (enemy.type) {
            case 'butterfly':
              drawButterfly(ctx, enemy.x, enemy.y, enemy.animationFrame);
              break;
            case 'puddle':
              drawPuddle(ctx, enemy.x, enemy.y, enemy.animationFrame);
              break;
            case 'raindrop':
              drawRaindrop(ctx, enemy.x, enemy.y, enemy.animationFrame);
              break;
            case 'storm-cloud':
              drawStormCloud(ctx, enemy.x, enemy.y, enemy.animationFrame, enemy.hp);
              break;
case 'loneliness-monster':
  drawLonelinessMonster(ctx, enemy.x, enemy.y, enemy.animationFrame, enemy.hp, enemy.maxHp);
  break;
case 'coffee-steam':
  drawCoffeeSteam(ctx, enemy.x, enemy.y, enemy.animationFrame);
  break;
case 'shopping-bag':
  drawShoppingBag(ctx, enemy.x, enemy.y, enemy.animationFrame);
  break;
case 'popcorn':
  drawPopcorn(ctx, enemy.x, enemy.y, enemy.animationFrame);
  break;
  }
  }
        
        // Draw Kishor at goal
        if (!level.specialMechanic || level.specialMechanic !== 'boss' || gs.bossDefeated) {
          drawKishor(ctx, level.goalX, 210, gs.player.animationFrame);
        }
        
        // Draw player (Bubbu)
        const playerAlpha = gs.player.invincible && Math.floor(gs.player.invincibleTimer / 5) % 2 === 0 ? 0.5 : 1;
        ctx.globalAlpha = playerAlpha;
        drawBubbu(ctx, gs.player.x, gs.player.y, gs.player.animationFrame, gs.player.facingRight, gs.player.state);
        ctx.globalAlpha = 1;
        
        // Draw particles
        for (const particle of gs.particles) {
          ctx.globalAlpha = particle.life / particle.maxLife;
          ctx.fillStyle = particle.color;
          
          if (particle.type === 'heart') {
            drawHeart(ctx, particle.x, particle.y, particle.life, particle.size / 10, particle.color);
          } else {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
        
        // Rainbow effect for level 3
        if (gs.rainbowActive && level.id === 3) {
          const rainbowGradient = ctx.createLinearGradient(gs.camera.x, 0, gs.camera.x + BASE_WIDTH, 0);
          rainbowGradient.addColorStop(0, 'rgba(255, 107, 107, 0.3)');
          rainbowGradient.addColorStop(0.2, 'rgba(255, 217, 61, 0.3)');
          rainbowGradient.addColorStop(0.4, 'rgba(107, 203, 119, 0.3)');
          rainbowGradient.addColorStop(0.6, 'rgba(77, 150, 255, 0.3)');
          rainbowGradient.addColorStop(0.8, 'rgba(155, 89, 182, 0.3)');
          rainbowGradient.addColorStop(1, 'rgba(255, 107, 107, 0.3)');
          ctx.fillStyle = rainbowGradient;
          ctx.fillRect(gs.camera.x, 0, BASE_WIDTH, BASE_HEIGHT);
        }
        
        ctx.restore();
        
        // Update game state
        gs.player = updatePlayer(gs.player, inputRef.current, level.platforms, 1);
        gs.camera = updateCamera(gs.player, gs.camera);
        
        // Update enemies
        const enemyResult = updateEnemies(level.enemies, gs.player, level.id, gs.rainbowActive);
        level.enemies = enemyResult.enemies;
        
        if (enemyResult.playerHit && !gs.player.invincible) {
          gs.player.lives--;
          gs.player.invincible = true;
          gs.player.invincibleTimer = 120;
          
          if (gs.player.lives <= 0) {
            handleGameOver();
          }
        }
        
        // Update collectibles
        const collectibleResult = updateCollectibles(level.collectibles, gs.player, level.enemies);
        level.collectibles = collectibleResult.collectibles;
        gs.player.score += collectibleResult.scoreGained;
        
        if (collectibleResult.powerUp === 'double-jump') {
          gs.player.hasDoubleJump = true;
        }
        
        if (collectibleResult.sorryHeartCollected) {
          // Check for storm cloud
          const stormCloud = level.enemies.find(e => e.type === 'storm-cloud' && e.hp > 0);
          if (stormCloud) {
            stormCloud.hp = 0;
            gs.rainbowActive = true;
            gs.player.hasDoubleJump = true;
            // Spawn rainbow particles
            for (let i = 0; i < 20; i++) {
              gs.particles.push({
                x: stormCloud.x + Math.random() * 50,
                y: stormCloud.y + Math.random() * 40,
                velocityX: (Math.random() - 0.5) * 4,
                velocityY: -Math.random() * 3,
                life: 90,
                maxLife: 90,
                size: Math.random() * 6 + 2,
                color: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6'][Math.floor(Math.random() * 5)],
                type: 'rainbow',
              });
            }
          }
        }
        
        if (collectibleResult.frameCollected !== null) {
          if (!gs.collectedFrames.includes(collectibleResult.frameCollected)) {
            gs.collectedFrames.push(collectibleResult.frameCollected);
          }
        }
        
        // Handle boss attack
        if (level.specialMechanic === 'boss' && inputRef.current.throw) {
          const now = Date.now();
          if (now - lastThrowTime > 500) {
            lastThrowTime = now;
            const result = throwHeartAtBoss(gs.player, level.enemies);
            level.enemies = result.enemies;
            
            if (result.hit) {
              // Create heart explosion particles
              for (let i = 0; i < 10; i++) {
                gs.particles.push({
                  x: gs.player.x + (gs.player.facingRight ? 40 : -20),
                  y: gs.player.y + 15,
                  velocityX: (Math.random() - 0.5) * 6,
                  velocityY: -Math.random() * 4,
                  life: 60,
                  maxLife: 60,
                  size: Math.random() * 4 + 2,
                  color: COLORS.softPink,
                  type: 'heart',
                });
              }
            }
            
            // Check if boss defeated
            const boss = level.enemies.find(e => e.type === 'loneliness-monster');
            if (boss && boss.hp <= 0 && !gs.bossDefeated) {
              gs.bossDefeated = true;
              // Giant heart explosion
              for (let i = 0; i < 50; i++) {
                gs.particles.push({
                  x: boss.x + 40 + (Math.random() - 0.5) * 80,
                  y: boss.y + 40 + (Math.random() - 0.5) * 80,
                  velocityX: (Math.random() - 0.5) * 8,
                  velocityY: (Math.random() - 0.5) * 8 - 2,
                  life: 120,
                  maxLife: 120,
                  size: Math.random() * 8 + 4,
                  color: ['#FFB6C1', '#FF69B4', '#FF1493', '#FFD700'][Math.floor(Math.random() * 4)],
                  type: 'heart',
                });
              }
            }
          }
        }
        
        // Update particles
        gs.particles = updateParticles(gs.particles);
        gs.particles = spawnAmbientParticles(gs.particles, level.particleType, gs.camera.x, 25);
        
        // Check goal
        const canReachGoal = level.specialMechanic !== 'boss' || gs.bossDefeated;
        if (canReachGoal && checkGoalReached(gs.player, level.goalX)) {
          saveCompletedLevel(level.id);
          gs.screen = 'cutscene';
          setCurrentCutscene(level.cutsceneText);
          setGameScreen('cutscene');
        }
        
        // Draw HUD
        drawHUD(ctx, gs, level);
      }
      
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    
    if (gameScreen === 'playing') {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [screenSize, gameScreen, handleGameOver]);
  
  // Draw parallax background layer
  const drawParallaxLayer = (ctx: CanvasRenderingContext2D, levelId: number, frame: number) => {
    const float = Math.sin(frame * 0.02) * 5;
    
    if (levelId === 4 || levelId === 5) {
      // Stars for night levels
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 50; i++) {
        const x = (i * 97) % 2400;
        const y = (i * 37) % 100 + 20;
        const size = (i % 3) + 1;
        const twinkle = Math.sin(frame * 0.1 + i) * 0.5 + 0.5;
        ctx.globalAlpha = twinkle;
        ctx.fillRect(x, y + float * 0.5, size, size);
      }
      ctx.globalAlpha = 1;
    } else {
      // Clouds for day levels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < 8; i++) {
        const x = (i * 300) % 2400;
        const y = 30 + (i % 3) * 20 + float;
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.arc(x + 25, y - 5, 20, 0, Math.PI * 2);
        ctx.arc(x + 50, y, 25, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };
  
  // Draw HUD
  const drawHUD = (ctx: CanvasRenderingContext2D, gs: GameState, level: LevelData) => {
    // Lives (hearts)
    for (let i = 0; i < gs.player.lives; i++) {
      drawHeart(ctx, 10 + i * 25, 10, gs.player.animationFrame, 0.8, '#FF1493');
    }
    
    // Score
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${gs.player.score}`, BASE_WIDTH / 2, 20);
    
    // Level name
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText(`${level.emoji} ${level.name}`, BASE_WIDTH / 2, 35);
    
    // Love meter (if has collected hearts)
    if (gs.player.score > 0) {
      const meterWidth = 80;
      const meterX = BASE_WIDTH / 2 - meterWidth / 2;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(meterX, BASE_HEIGHT - 25, meterWidth, 8);
      
      const fill = Math.min((gs.player.score % 1000) / 1000, 1);
      ctx.fillStyle = COLORS.softPink;
      ctx.fillRect(meterX, BASE_HEIGHT - 25, meterWidth * fill, 8);
      
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.strokeRect(meterX, BASE_HEIGHT - 25, meterWidth, 8);
    }
    
    // Collected frames (Level 4)
    if (level.id === 4) {
      ctx.textAlign = 'left';
      ctx.font = '8px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`Frames: ${gs.collectedFrames.length}/4`, 10, 50);
    }
    
    // Boss HP (Level 5)
    if (level.id === 5 && !gs.bossDefeated) {
      const boss = level.enemies.find(e => e.type === 'loneliness-monster');
      if (boss && boss.hp > 0) {
        const bossBarWidth = 100;
        const bossBarX = BASE_WIDTH / 2 - bossBarWidth / 2;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(bossBarX - 2, 45, bossBarWidth + 4, 14);
        
        ctx.fillStyle = '#4A5568';
        ctx.fillRect(bossBarX, 48, bossBarWidth, 8);
        
        ctx.fillStyle = '#9B59B6';
        ctx.fillRect(bossBarX, 48, bossBarWidth * (boss.hp / boss.maxHp), 8);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '6px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LONELINESS', BASE_WIDTH / 2, 53);
      }
    }
  };
  
  // Portrait mode warning
  if (!isLandscape && screenSize.width > 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-pink-300 to-pink-400 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-6 animate-pulse">📱</div>
        <p className="font-pixel text-sm text-white mb-4" style={{ fontFamily: 'var(--font-pixel)' }}>
          Phone landscape mode madhe phirva better experience sathi!
        </p>
        <div className="text-4xl animate-spin" style={{ animationDuration: '2s' }}>🔄</div>
      </div>
    );
  }
  
  return (
    <div 
      className="fixed inset-0 overflow-hidden bg-black"
      style={{ touchAction: 'none' }}
    >
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          imageRendering: 'pixelated',
          touchAction: 'none',
        }}
      />
      
      {/* Start Screen */}
      {gameScreen === 'start' && (
        <div className="absolute inset-0 bg-gradient-to-b from-pink-200 via-pink-100 to-cream flex flex-col items-center justify-center">
          {/* Floating hearts background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-float"
                style={{
                  left: `${(i * 5) % 100}%`,
                  top: `${(i * 7) % 100}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${3 + (i % 3)}s`,
                }}
              >
                💕
              </div>
            ))}
          </div>
          
          <h1 
            className="text-3xl md:text-5xl text-pink-500 mb-2 animate-pulse text-center px-4"
            style={{ fontFamily: 'var(--font-pixel)', textShadow: '2px 2px 0 #FFD700' }}
          >
            Tuzya Sathi
          </h1>
          <p className="text-xl md:text-2xl text-pink-400 mb-8">💕</p>
          
          <div className="flex gap-8 mb-12">
            {/* Bubbu */}
            <div className="w-16 h-24 relative">
              <div className="absolute inset-0 bg-pink-200 rounded-full transform scale-y-50 translate-y-8" />
              <div className="text-5xl">👧</div>
            </div>
            {/* Gap with heart */}
            <div className="flex items-center text-3xl animate-pulse">💗</div>
            {/* Kishor */}
            <div className="w-16 h-24 relative">
              <div className="absolute inset-0 bg-blue-200 rounded-full transform scale-y-50 translate-y-8" />
              <div className="text-5xl">👦</div>
            </div>
          </div>
          
          <button
            onClick={startGame}
            onTouchStart={(e) => { e.preventDefault(); startGame(); }}
            className="px-8 py-4 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 text-white rounded-full text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg min-w-[200px]"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px' }}
          >
            Tap to Start ❤️
          </button>
          
          <p className="mt-8 text-pink-400 text-sm" style={{ fontFamily: 'var(--font-nunito)' }}>
            High Score: {highScore}
          </p>
        </div>
      )}
      
      {/* Touch Controls */}
      {gameScreen === 'playing' && (
        <>
          {/* Left side controls */}
          <div className="absolute bottom-5 left-5 flex gap-3">
            <button
              className="w-16 h-16 md:w-20 md:h-20 bg-white/50 active:bg-white/80 rounded-full flex items-center justify-center text-2xl font-bold select-none touch-manipulation"
              onTouchStart={(e) => { e.preventDefault(); handleTouchStart('left'); }}
              onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('left'); }}
              onMouseDown={() => handleTouchStart('left')}
              onMouseUp={() => handleTouchEnd('left')}
              onMouseLeave={() => handleTouchEnd('left')}
            >
              ◀
            </button>
            <button
              className="w-16 h-16 md:w-20 md:h-20 bg-white/50 active:bg-white/80 rounded-full flex items-center justify-center text-2xl font-bold select-none touch-manipulation"
              onTouchStart={(e) => { e.preventDefault(); handleTouchStart('right'); }}
              onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('right'); }}
              onMouseDown={() => handleTouchStart('right')}
              onMouseUp={() => handleTouchEnd('right')}
              onMouseLeave={() => handleTouchEnd('right')}
            >
              ▶
            </button>
          </div>
          
          {/* Right side controls */}
          <div className="absolute bottom-5 right-5 flex flex-col gap-3">
            {levelDataRef.current?.specialMechanic === 'boss' && (
              <button
                className="w-16 h-16 md:w-20 md:h-20 bg-pink-400/70 active:bg-pink-500 rounded-full flex items-center justify-center text-2xl select-none touch-manipulation"
                onTouchStart={(e) => { e.preventDefault(); handleTouchStart('throw'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('throw'); }}
                onMouseDown={() => handleTouchStart('throw')}
                onMouseUp={() => handleTouchEnd('throw')}
                onMouseLeave={() => handleTouchEnd('throw')}
              >
                ❤️
              </button>
            )}
            <button
              className="w-20 h-20 md:w-24 md:h-24 bg-yellow-400/70 active:bg-yellow-500 rounded-full flex items-center justify-center text-3xl font-bold select-none touch-manipulation"
              onTouchStart={(e) => { e.preventDefault(); handleTouchStart('jump'); }}
              onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('jump'); }}
              onMouseDown={() => handleTouchStart('jump')}
              onMouseUp={() => handleTouchEnd('jump')}
              onMouseLeave={() => handleTouchEnd('jump')}
            >
              🆙
            </button>
          </div>
          
          {/* Top controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={toggleMute}
              className="w-11 h-11 bg-white/50 active:bg-white/80 rounded-lg flex items-center justify-center text-xl touch-manipulation"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button
              onClick={togglePause}
              className="w-11 h-11 bg-white/50 active:bg-white/80 rounded-lg flex items-center justify-center text-xl touch-manipulation"
            >
              ⏸️
            </button>
          </div>
        </>
      )}
      
      {/* Pause Screen */}
      {gameScreen === 'paused' && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
            <p 
              className="text-pink-500 mb-6 text-sm"
              style={{ fontFamily: 'var(--font-nunito)' }}
            >
              Ek minute... Kishor vaat pahatiye 🥺
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={togglePause}
                className="w-full py-4 bg-pink-400 hover:bg-pink-500 text-white rounded-lg text-lg touch-manipulation"
              >
                Resume ▶️
              </button>
              <button
                onClick={restartGame}
                className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-lg touch-manipulation"
              >
                Restart 🔄
              </button>
              <button
                onClick={toggleMute}
                className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-lg touch-manipulation"
              >
                {isMuted ? 'Unmute 🔊' : 'Mute 🔇'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Game Over Screen */}
      {gameScreen === 'gameover' && (
        <div className="absolute inset-0 bg-gradient-to-b from-pink-200 to-pink-300 flex flex-col items-center justify-center p-4">
          <p 
            className="text-pink-600 text-xl md:text-2xl mb-6 text-center"
            style={{ fontFamily: 'var(--font-nunito)' }}
          >
            Bubbu... uth! Kishor vaat pahatiye! 💕
          </p>
          <p className="text-pink-500 mb-8">Score: {gameStateRef.current.player.score}</p>
          <button
            onClick={restartGame}
            className="px-8 py-4 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 text-white rounded-full text-lg transition-all min-w-[200px] touch-manipulation"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px' }}
          >
            Try Again ❤️
          </button>
        </div>
      )}
      
      {/* Cutscene Screen */}
      {gameScreen === 'cutscene' && (
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100 to-pink-200 flex flex-col items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white rounded-2xl p-6 shadow-xl">
            <p 
              className="text-pink-600 text-lg md:text-xl text-center leading-relaxed mb-8"
              style={{ fontFamily: 'var(--font-nunito)' }}
            >
              {currentCutscene}
            </p>
            <button
              onClick={nextLevel}
              className="w-full py-4 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 text-white rounded-lg text-lg transition-all touch-manipulation"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
            >
              Pudhe Chala →
            </button>
          </div>
        </div>
      )}
      
      {/* Ending Screen */}
      {gameScreen === 'ending' && (
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100 via-pink-200 to-pink-300 flex flex-col items-center justify-center p-4 overflow-hidden">
          {/* Sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          
          {/* Polaroid photos */}
          {endingProgress >= 1 && (
            <div className="flex gap-2 md:gap-4 mb-6 flex-wrap justify-center">
              {[1, 2, 3, 4].map((num, i) => (
                endingProgress >= i + 1 && (
                  <div 
                    key={num}
                    className="w-16 h-20 md:w-24 md:h-28 bg-white p-1 shadow-lg transform rotate-3 animate-slideIn"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    <div className="w-full h-14 md:h-20 bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center text-2xl">
                      {['🌸', '🍦', '🌈', '📸'][i]}
                    </div>
                    <p className="text-center text-xs mt-1 text-gray-500">Memory {num}</p>
                  </div>
                )
              ))}
            </div>
          )}
          
          {/* Ending text */}
          {showEndingText && (
            <div className="max-w-md w-full bg-white/90 rounded-2xl p-6 mb-6 shadow-xl">
              <p 
                className="text-pink-600 text-sm md:text-base whitespace-pre-line text-center leading-relaxed"
                style={{ fontFamily: 'var(--font-nunito)' }}
              >
                {displayedEndingText}
              </p>
            </div>
          )}
          
          {/* Fireworks */}
          {endingProgress >= 5 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-3xl animate-firework"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 40}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                >
                  💖
                </div>
              ))}
            </div>
          )}
          
          {/* Play Again button */}
          {displayedEndingText.length >= ENDING_TEXT.length && (
            <div className="text-center">
              <p 
                className="text-pink-500 text-sm mb-4"
                style={{ fontFamily: 'var(--font-nunito)' }}
              >
                Final Score: {gameStateRef.current.player.score}
              </p>
              <button
                onClick={restartGame}
                className="px-8 py-4 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 text-white rounded-full text-base transition-all touch-manipulation"
                style={{ fontFamily: 'var(--font-nunito)' }}
              >
                Ek da khel... karan mi hamesha tuzya sathi ahe 💕
              </button>
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px) rotate(0deg); }
          to { opacity: 1; transform: translateY(0) rotate(3deg); }
        }
        @keyframes firework {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(2); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
        .animate-firework { animation: firework 1.5s ease-out infinite; }
      `}</style>
    </div>
  );
}
