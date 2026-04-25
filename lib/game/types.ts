// Game Types for Tuzya Sathi

export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX?: number;
  velocityY?: number;
}

export interface Player extends GameObject {
  isJumping: boolean;
  isOnGround: boolean;
  facingRight: boolean;
  lives: number;
  score: number;
  hasDoubleJump: boolean;
  canDoubleJump: boolean;
  animationFrame: number;
  animationTimer: number;
  state: 'idle' | 'running' | 'jumping' | 'throwing';
  invincible: boolean;
  invincibleTimer: number;
}

export interface Platform extends GameObject {
  type: 'normal' | 'flower' | 'branch' | 'cloud' | 'moon' | 'star' | 'heart' | 'umbrella' | 'icecream-cart' | 'coffee-table' | 'escalator' | 'theater-seat';
  color?: string;
}

export interface Enemy extends GameObject {
  type: 'butterfly' | 'puddle' | 'raindrop' | 'storm-cloud' | 'loneliness-monster' | 'coffee-steam' | 'shopping-bag' | 'popcorn';
  hp: number;
  maxHp: number;
  animationFrame: number;
  direction: number;
  speed: number;
}

export interface Collectible extends GameObject {
  type: 'heart' | 'icecream' | 'sorry-heart' | 'shared-cone' | 'photo-frame' | 'bad-bad' | 'love-token' | 'coffee-cup' | 'gift-box' | 'movie-ticket';
  collected: boolean;
  animationFrame: number;
  frameIndex?: number;
  text?: string;
}

export interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'heart' | 'star' | 'petal' | 'confetti' | 'sparkle' | 'rainbow' | 'raindrop';
}

export interface LevelData {
  id: number;
  name: string;
  nameMarathi: string;
  emoji: string;
  backgroundColor: string;
  backgroundGradient: string[];
  platforms: Platform[];
  enemies: Enemy[];
  collectibles: Collectible[];
  goalX: number;
  cutsceneText: string;
  particleType: 'heart' | 'star' | 'petal' | 'raindrop' | 'sparkle';
  specialMechanic?: string;
}

export interface GameState {
  screen: 'start' | 'playing' | 'cutscene' | 'paused' | 'gameover' | 'ending' | 'boss';
  currentLevel: number;
  player: Player;
  camera: Vector2D;
  particles: Particle[];
  loveMeter: number;
  collectedFrames: number[];
  bossDefeated: boolean;
  rainbowActive: boolean;
  musicStarted: boolean;
  isMuted: boolean;
}

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  throw: boolean;
}

export interface TouchButton {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  active: boolean;
}

// Why I Love You bubble messages
export const LOVE_BUBBLES = [
  { text: "Tuzya bad bad sathi 💬", emoji: "💬" },
  { text: "Tuzya icecream sathi 🍦", emoji: "🍦" },
  { text: "Tuzya hasnyasathi 😊", emoji: "😊" },
  { text: "Tuzya ragyasathi pn 😤💕", emoji: "😤" },
  { text: "Fakt tuzya sathi ❤️", emoji: "❤️" },
];

// Bad Bad bubble messages for Level 4
export const BAD_BAD_MESSAGES = [
  "Aik na...",
  "Mala watat ki...",
  "Tu aahes na?",
  "Aaj kay zala...",
];

// Color palette
export const COLORS = {
  softPink: '#FFB6C1',
  gold: '#FFD700',
  purple: '#9B59B6',
  cream: '#FFF8E7',
  skyBlue: '#AEE6FF',
  darkPink: '#FF69B4',
  white: '#FFFFFF',
  black: '#1a1a2e',
};
