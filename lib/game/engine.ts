// Game Engine - Physics, Collision, and Game Logic
import { 
  GameState, 
  Player, 
  Platform, 
  Enemy, 
  Collectible, 
  Particle,
  InputState,
  LevelData,
  COLORS 
} from './types';
import { LEVELS, BASE_WIDTH, BASE_HEIGHT, LEVEL_WIDTH, ENDING_TEXT } from './levels';

// Physics constants
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 4;
const MAX_FALL_SPEED = 15;
const FRICTION = 0.85;

// Create initial player
export function createPlayer(): Player {
  return {
    x: 50,
    y: 200,
    width: 16,
    height: 30,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
  isOnGround: false,
  facingRight: true,
  lives: 10,
  score: 0,
    hasDoubleJump: false,
    canDoubleJump: true,
    animationFrame: 0,
    animationTimer: 0,
    state: 'idle',
    invincible: false,
    invincibleTimer: 0,
  };
}

// Create initial game state
export function createGameState(): GameState {
  return {
    screen: 'start',
    currentLevel: 0,
    player: createPlayer(),
    camera: { x: 0, y: 0 },
    particles: [],
    loveMeter: 0,
    collectedFrames: [],
    bossDefeated: false,
    rainbowActive: false,
    musicStarted: false,
    isMuted: false,
  };
}

// Reset player for new level
export function resetPlayerForLevel(player: Player, level: number): Player {
  return {
    ...player,
    x: 50,
    y: 200,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    isOnGround: false,
    facingRight: true,
    state: 'idle',
    hasDoubleJump: level >= 2,
    canDoubleJump: true,
    invincible: false,
    invincibleTimer: 0,
  };
}

// Check collision between two rectangles
export function checkCollision(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Update player physics and movement
export function updatePlayer(
  player: Player,
  input: InputState,
  platforms: Platform[],
  deltaTime: number
): Player {
  let newPlayer = { ...player };
  
  // Update animation
  newPlayer.animationTimer++;
  if (newPlayer.animationTimer > 6) {
    newPlayer.animationTimer = 0;
    newPlayer.animationFrame++;
  }
  
  // Update invincibility
  if (newPlayer.invincible) {
    newPlayer.invincibleTimer--;
    if (newPlayer.invincibleTimer <= 0) {
      newPlayer.invincible = false;
    }
  }
  
  // Horizontal movement
  if (input.left) {
    newPlayer.velocityX = -MOVE_SPEED;
    newPlayer.facingRight = false;
    newPlayer.state = 'running';
  } else if (input.right) {
    newPlayer.velocityX = MOVE_SPEED;
    newPlayer.facingRight = true;
    newPlayer.state = 'running';
  } else {
    newPlayer.velocityX *= FRICTION;
    if (Math.abs(newPlayer.velocityX) < 0.1) {
      newPlayer.velocityX = 0;
      if (newPlayer.isOnGround) {
        newPlayer.state = 'idle';
      }
    }
  }
  
  // Throwing state (for boss level)
  if (input.throw) {
    newPlayer.state = 'throwing';
  }
  
  // Apply gravity
  newPlayer.velocityY += GRAVITY;
  if (newPlayer.velocityY > MAX_FALL_SPEED) {
    newPlayer.velocityY = MAX_FALL_SPEED;
  }
  
  // Jump logic
  if (input.jump) {
    if (newPlayer.isOnGround) {
      newPlayer.velocityY = JUMP_FORCE;
      newPlayer.isJumping = true;
      newPlayer.isOnGround = false;
      newPlayer.canDoubleJump = newPlayer.hasDoubleJump;
      newPlayer.state = 'jumping';
    } else if (newPlayer.canDoubleJump && newPlayer.hasDoubleJump) {
      newPlayer.velocityY = JUMP_FORCE * 0.85;
      newPlayer.canDoubleJump = false;
      newPlayer.state = 'jumping';
    }
  }
  
  if (!newPlayer.isOnGround) {
    newPlayer.state = 'jumping';
  }
  
  // Move horizontally and check collisions
  newPlayer.x += newPlayer.velocityX;
  
  // Keep player in bounds
  if (newPlayer.x < 0) newPlayer.x = 0;
  if (newPlayer.x > LEVEL_WIDTH - newPlayer.width) {
    newPlayer.x = LEVEL_WIDTH - newPlayer.width;
  }
  
  // Platform collision (horizontal)
  for (const platform of platforms) {
    if (checkCollision(newPlayer, platform)) {
      if (newPlayer.velocityX > 0) {
        newPlayer.x = platform.x - newPlayer.width;
      } else if (newPlayer.velocityX < 0) {
        newPlayer.x = platform.x + platform.width;
      }
      newPlayer.velocityX = 0;
    }
  }
  
  // Move vertically
  newPlayer.y += newPlayer.velocityY;
  newPlayer.isOnGround = false;
  
  // Platform collision (vertical)
  for (const platform of platforms) {
    if (checkCollision(newPlayer, platform)) {
      if (newPlayer.velocityY > 0) {
        // Landing on platform
        newPlayer.y = platform.y - newPlayer.height;
        newPlayer.velocityY = 0;
        newPlayer.isOnGround = true;
        newPlayer.isJumping = false;
        newPlayer.canDoubleJump = newPlayer.hasDoubleJump;
      } else if (newPlayer.velocityY < 0) {
        // Hitting platform from below
        newPlayer.y = platform.y + platform.height;
        newPlayer.velocityY = 0;
      }
    }
  }
  
  // Fall off screen
  if (newPlayer.y > BASE_HEIGHT + 50) {
    newPlayer.lives--;
    if (newPlayer.lives > 0) {
      newPlayer.x = 50;
      newPlayer.y = 200;
      newPlayer.velocityX = 0;
      newPlayer.velocityY = 0;
      newPlayer.invincible = true;
      newPlayer.invincibleTimer = 120;
    }
  }
  
  return newPlayer;
}

// Update camera to follow player
export function updateCamera(
  player: Player,
  camera: { x: number; y: number }
): { x: number; y: number } {
  const targetX = player.x - BASE_WIDTH / 3;
  const newX = camera.x + (targetX - camera.x) * 0.1;
  
  return {
    x: Math.max(0, Math.min(newX, LEVEL_WIDTH - BASE_WIDTH)),
    y: 0,
  };
}

// Update enemies
export function updateEnemies(
  enemies: Enemy[],
  player: Player,
  levelId: number,
  rainbowActive: boolean
): { enemies: Enemy[]; playerHit: boolean; rainbowTriggered: boolean } {
  let playerHit = false;
  let rainbowTriggered = false;
  
  const updatedEnemies = enemies.map(enemy => {
    const newEnemy = { ...enemy };
    newEnemy.animationFrame++;
    
    switch (enemy.type) {
      case 'butterfly':
        // Flutter movement
        newEnemy.x += Math.sin(newEnemy.animationFrame * 0.05) * enemy.speed;
        newEnemy.y += Math.cos(newEnemy.animationFrame * 0.08) * 0.5;
        break;
        
      case 'raindrop':
        // Fall down
        newEnemy.y += enemy.speed;
        if (newEnemy.y > BASE_HEIGHT) {
          newEnemy.y = -30;
          newEnemy.x = Math.random() * LEVEL_WIDTH;
        }
        break;
        
      case 'storm-cloud':
        // Follow player slowly
        if (!rainbowActive && enemy.hp > 0) {
          const dx = player.x - newEnemy.x;
          newEnemy.x += Math.sign(dx) * 0.5;
          newEnemy.y = Math.sin(newEnemy.animationFrame * 0.03) * 10 + 60;
        }
        break;
        
      case 'loneliness-monster':
        // Boss behavior
        if (enemy.hp > 0) {
          const dx = player.x - newEnemy.x;
          newEnemy.x += Math.sign(dx) * enemy.speed * 0.5;
          newEnemy.y = Math.sin(newEnemy.animationFrame * 0.02) * 20 + 80;
        }
        break;
        
      case 'puddle':
        // Stationary
        break;
        
      case 'coffee-steam':
        // Float and drift
        newEnemy.x += Math.sin(newEnemy.animationFrame * 0.03) * enemy.speed;
        newEnemy.y += Math.cos(newEnemy.animationFrame * 0.05) * 0.3;
        break;
        
      case 'shopping-bag':
        // Swing back and forth
        newEnemy.x += Math.sin(newEnemy.animationFrame * 0.04) * enemy.speed;
        break;
        
      case 'popcorn':
        // Bounce around
        newEnemy.x += Math.sin(newEnemy.animationFrame * 0.06) * enemy.speed;
        newEnemy.y += Math.cos(newEnemy.animationFrame * 0.08) * 0.8;
        break;
    }
    
    return newEnemy;
  });
  
  // Check player collision with enemies
  for (const enemy of updatedEnemies) {
    if (enemy.hp <= 0) continue;
    if (player.invincible) continue;
    
    if (checkCollision(player, enemy)) {
      if (enemy.type === 'puddle') {
        // Puddle slows player, doesn't damage
      } else if (enemy.type === 'storm-cloud') {
        // Can be defeated with sorry hearts
      } else {
        playerHit = true;
      }
    }
  }
  
  return { enemies: updatedEnemies, playerHit, rainbowTriggered };
}

// Update collectibles
export function updateCollectibles(
  collectibles: Collectible[],
  player: Player,
  enemies: Enemy[]
): { 
  collectibles: Collectible[]; 
  scoreGained: number; 
  powerUp: string | null;
  sorryHeartCollected: boolean;
  frameCollected: number | null;
} {
  let scoreGained = 0;
  let powerUp: string | null = null;
  let sorryHeartCollected = false;
  let frameCollected: number | null = null;
  
  const updatedCollectibles = collectibles.map(collectible => {
    const newCollectible = { ...collectible };
    newCollectible.animationFrame++;
    
    if (!collectible.collected && checkCollision(player, collectible)) {
      newCollectible.collected = true;
      
      switch (collectible.type) {
        case 'heart':
          scoreGained += 100;
          break;
        case 'icecream':
          scoreGained += 150;
          break;
        case 'shared-cone':
          scoreGained += 500;
          powerUp = 'double-jump';
          break;
        case 'sorry-heart':
          scoreGained += 200;
          sorryHeartCollected = true;
          break;
        case 'photo-frame':
          scoreGained += 300;
          frameCollected = collectible.frameIndex || 0;
          break;
        case 'bad-bad':
          scoreGained += 250;
          break;
        case 'love-token':
          scoreGained += 400;
          break;
        case 'coffee-cup':
          scoreGained += 200;
          break;
        case 'gift-box':
          scoreGained += 250;
          break;
        case 'movie-ticket':
          scoreGained += 200;
          break;
      }
    }
    
    return newCollectible;
  });
  
  return { 
    collectibles: updatedCollectibles, 
    scoreGained, 
    powerUp,
    sorryHeartCollected,
    frameCollected,
  };
}

// Create particles
export function createParticle(
  x: number,
  y: number,
  type: Particle['type'],
  color?: string
): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 2 + 1;
  
  return {
    x,
    y,
    velocityX: Math.cos(angle) * speed,
    velocityY: Math.sin(angle) * speed - 1,
    life: 60 + Math.random() * 60,
    maxLife: 120,
    size: Math.random() * 4 + 2,
    color: color || COLORS.softPink,
    type,
  };
}

// Update particles
export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map(particle => ({
      ...particle,
      x: particle.x + particle.velocityX,
      y: particle.y + particle.velocityY,
      velocityY: particle.velocityY + 0.02,
      life: particle.life - 1,
    }))
    .filter(particle => particle.life > 0);
}

// Spawn ambient particles
export function spawnAmbientParticles(
  particles: Particle[],
  type: Particle['type'],
  cameraX: number,
  maxParticles: number = 30
): Particle[] {
  if (particles.length < maxParticles && Math.random() < 0.1) {
    const x = cameraX + Math.random() * BASE_WIDTH;
    const y = Math.random() * BASE_HEIGHT * 0.7;
    
    const confettiColors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'];
    const rainbowColors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6'];
    const sparkleColors = ['#FFD700', '#FFFFFF', '#FFB6C1'];
    
    const colors: Record<string, string> = {
      heart: COLORS.softPink,
      star: COLORS.gold,
      petal: '#FFB6C1',
      raindrop: '#87CEEB',
      confetti: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      sparkle: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
      rainbow: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
    };
    
    return [...particles, createParticle(x, y, type, colors[type])];
  }
  return particles;
}

// Check if player reached goal
export function checkGoalReached(player: Player, goalX: number): boolean {
  return player.x >= goalX - 50;
}

// Throw heart at boss
export function throwHeartAtBoss(
  player: Player,
  enemies: Enemy[]
): { enemies: Enemy[]; hit: boolean } {
  const projectileRect = {
    x: player.facingRight ? player.x + player.width : player.x - 30,
    y: player.y + 10,
    width: 30,
    height: 20,
  };
  
  let hit = false;
  const updatedEnemies = enemies.map(enemy => {
    if (enemy.type === 'loneliness-monster' || enemy.type === 'storm-cloud') {
      if (enemy.hp > 0 && checkCollision(projectileRect, enemy)) {
        hit = true;
        return { ...enemy, hp: enemy.hp - 1 };
      }
    }
    return enemy;
  });
  
  return { enemies: updatedEnemies, hit };
}

// Get level data
export function getLevelData(levelIndex: number): LevelData | null {
  if (levelIndex >= 0 && levelIndex < LEVELS.length) {
    return JSON.parse(JSON.stringify(LEVELS[levelIndex])); // Deep copy
  }
  return null;
}

// Get high score from localStorage
export function getHighScore(): number {
  if (typeof window !== 'undefined') {
    return parseInt(localStorage.getItem('tuzyaSathi_highScore') || '0', 10);
  }
  return 0;
}

// Save high score to localStorage
export function saveHighScore(score: number): void {
  if (typeof window !== 'undefined') {
    const current = getHighScore();
    if (score > current) {
      localStorage.setItem('tuzyaSathi_highScore', String(score));
    }
  }
}

// Get completed levels from localStorage
export function getCompletedLevels(): number[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tuzyaSathi_completedLevels');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
}

// Save complete level
export function saveCompletedLevel(level: number): void {
  if (typeof window !== 'undefined') {
    const completed = getCompletedLevels();
    if (!completed.includes(level)) {
      completed.push(level);
      localStorage.setItem('tuzyaSathi_completedLevels', JSON.stringify(completed));
    }
  }
}
