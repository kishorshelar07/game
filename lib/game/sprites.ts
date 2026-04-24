// Pixel art sprite drawing functions
import { COLORS } from './types';

// Draw Bubbu (player character - cute pixel girl)
export function drawBubbu(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  facingRight: boolean,
  state: 'idle' | 'running' | 'jumping' | 'throwing',
  scale: number = 1
) {
  ctx.save();
  
  const s = scale;
  const bobOffset = state === 'idle' ? Math.sin(frame * 0.15) * 2 : 0;
  const runOffset = state === 'running' ? Math.abs(Math.sin(frame * 0.3)) * 3 : 0;
  
  // Handle flipping for left-facing direction
  let drawX = x;
  if (!facingRight) {
    ctx.translate(x + 16 * s, 0);
    ctx.scale(-1, 1);
    drawX = 0;
  }
  
  // Pink dress
  ctx.fillStyle = COLORS.softPink;
  ctx.fillRect(drawX + 4 * s, y + 14 + bobOffset - runOffset, 8 * s, 10 * s);
  
  // Dress details
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(drawX + 4 * s, y + 20 + bobOffset - runOffset, 8 * s, 4 * s);
  
  // Skin color for face and hands
  ctx.fillStyle = '#FFE4C4';
  
  // Face
  ctx.fillRect(drawX + 4 * s, y + 4 + bobOffset, 8 * s, 10 * s);
  
  // Hair (dark brown/black)
  ctx.fillStyle = '#4a3728';
  ctx.fillRect(drawX + 2 * s, y + 2 + bobOffset, 12 * s, 4 * s);
  ctx.fillRect(drawX + 2 * s, y + 4 + bobOffset, 3 * s, 12 * s);
  ctx.fillRect(drawX + 11 * s, y + 4 + bobOffset, 3 * s, 12 * s);
  
  // Hair bow (pink)
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(drawX + 10 * s, y + 3 + bobOffset, 4 * s, 3 * s);
  
  // Eyes
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(drawX + 5 * s, y + 7 + bobOffset, 2 * s, 2 * s);
  ctx.fillRect(drawX + 9 * s, y + 7 + bobOffset, 2 * s, 2 * s);
  
  // Eye sparkle
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(drawX + 5 * s, y + 7 + bobOffset, 1 * s, 1 * s);
  ctx.fillRect(drawX + 9 * s, y + 7 + bobOffset, 1 * s, 1 * s);
  
  // Blush
  ctx.fillStyle = 'rgba(255, 182, 193, 0.7)';
  ctx.fillRect(drawX + 4 * s, y + 10 + bobOffset, 2 * s, 2 * s);
  ctx.fillRect(drawX + 10 * s, y + 10 + bobOffset, 2 * s, 2 * s);
  
  // Smile
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(drawX + 6 * s, y + 11 + bobOffset, 4 * s, 1 * s);
  
  // Legs
  ctx.fillStyle = '#FFE4C4';
  const legOffset = state === 'running' ? Math.sin(frame * 0.4) * 2 : 0;
  ctx.fillRect(drawX + 5 * s, y + 24 + bobOffset - runOffset, 2 * s, 6 * s);
  ctx.fillRect(drawX + 9 * s, y + 24 + bobOffset - runOffset + legOffset, 2 * s, 6 * s);
  
  // Shoes (pink)
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(drawX + 4 * s, y + 28 + bobOffset - runOffset, 3 * s, 2 * s);
  ctx.fillRect(drawX + 9 * s, y + 28 + bobOffset - runOffset + legOffset, 3 * s, 2 * s);
  
  // Arms
  ctx.fillStyle = '#FFE4C4';
  if (state === 'throwing') {
    ctx.fillRect(drawX + 12 * s, y + 14 + bobOffset, 4 * s, 2 * s);
  } else {
    const armBob = state === 'running' ? Math.sin(frame * 0.4) * 2 : 0;
    ctx.fillRect(drawX + 1 * s, y + 15 + bobOffset + armBob, 3 * s, 2 * s);
    ctx.fillRect(drawX + 12 * s, y + 15 + bobOffset - armBob, 3 * s, 2 * s);
  }
  
  ctx.restore();
}

// Draw Kishor (goal character - cute pixel boy)
export function drawKishor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1
) {
  const s = scale;
  const waveOffset = Math.sin(frame * 0.1) * 2;
  
  // Blue shirt
  ctx.fillStyle = '#4A90D9';
  ctx.fillRect(x + 4 * s, y + 14 * s, 10 * s, 10 * s);
  
  // Shirt details
  ctx.fillStyle = '#357ABD';
  ctx.fillRect(x + 4 * s, y + 20 * s, 10 * s, 4 * s);
  
  // Skin
  ctx.fillStyle = '#DEB887';
  
  // Face
  ctx.fillRect(x + 4 * s, y + 4 * s, 10 * s, 10 * s);
  
  // Hair (black)
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(x + 3 * s, y + 2 * s, 12 * s, 5 * s);
  ctx.fillRect(x + 3 * s, y + 4 * s, 2 * s, 6 * s);
  ctx.fillRect(x + 13 * s, y + 4 * s, 2 * s, 6 * s);
  
  // Eyes
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(x + 6 * s, y + 7 * s, 2 * s, 2 * s);
  ctx.fillRect(x + 10 * s, y + 7 * s, 2 * s, 2 * s);
  
  // Eye sparkle
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + 6 * s, y + 7 * s, 1 * s, 1 * s);
  ctx.fillRect(x + 10 * s, y + 7 * s, 1 * s, 1 * s);
  
  // Happy smile
  ctx.fillStyle = '#FF6B6B';
  ctx.fillRect(x + 7 * s, y + 11 * s, 4 * s, 2 * s);
  
  // Legs (jeans)
  ctx.fillStyle = '#4169E1';
  ctx.fillRect(x + 5 * s, y + 24 * s, 3 * s, 6 * s);
  ctx.fillRect(x + 10 * s, y + 24 * s, 3 * s, 6 * s);
  
  // Shoes
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + 4 * s, y + 28 * s, 4 * s, 2 * s);
  ctx.fillRect(x + 10 * s, y + 28 * s, 4 * s, 2 * s);
  
  // Waving arm
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(x + 14 * s, (y + 10 + waveOffset) * s, 4 * s, 2 * s);
  ctx.fillRect(x + 16 * s, (y + 8 + waveOffset) * s, 2 * s, 4 * s);
  
  // Other arm
  ctx.fillRect(x + 0 * s, y + 16 * s, 4 * s, 2 * s);
}

// Draw heart collectible
export function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1,
  color: string = COLORS.softPink
) {
  const s = scale;
  const pulse = 1 + Math.sin(frame * 0.15) * 0.1;
  const bob = Math.sin(frame * 0.1) * 3;
  
  ctx.save();
  ctx.translate(x + 12 * s, y + 12 * s + bob);
  ctx.scale(pulse, pulse);
  ctx.translate(-12 * s, -12 * s);
  
  ctx.fillStyle = color;
  // Heart shape using pixels
  ctx.fillRect(2 * s, 4 * s, 4 * s, 4 * s);
  ctx.fillRect(6 * s, 2 * s, 4 * s, 4 * s);
  ctx.fillRect(10 * s, 2 * s, 4 * s, 4 * s);
  ctx.fillRect(14 * s, 4 * s, 4 * s, 4 * s);
  ctx.fillRect(4 * s, 8 * s, 12 * s, 4 * s);
  ctx.fillRect(6 * s, 12 * s, 8 * s, 4 * s);
  ctx.fillRect(8 * s, 16 * s, 4 * s, 4 * s);
  
  // Shine
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(6 * s, 4 * s, 2 * s, 2 * s);
  
  ctx.restore();
}

// Draw ice cream collectible
export function drawIceCream(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1
) {
  const s = scale;
  const bob = Math.sin(frame * 0.12) * 2;
  
  // Cone
  ctx.fillStyle = '#DEB887';
  ctx.beginPath();
  ctx.moveTo(x + 6 * s, (y + 10 + bob) * 1);
  ctx.lineTo(x + 10 * s, (y + 22 + bob) * 1);
  ctx.lineTo(x + 14 * s, (y + 10 + bob) * 1);
  ctx.closePath();
  ctx.fill();
  
  // Cone texture
  ctx.strokeStyle = '#C4A574';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 7 * s, (y + 12 + bob) * 1);
  ctx.lineTo(x + 13 * s, (y + 12 + bob) * 1);
  ctx.stroke();
  
  // Pink scoop
  ctx.fillStyle = COLORS.softPink;
  ctx.beginPath();
  ctx.arc(x + 10 * s, (y + 8 + bob) * 1, 6 * s, 0, Math.PI * 2);
  ctx.fill();
  
  // Scoop highlight
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x + 8 * s, (y + 6 + bob) * 1, 2 * s, 0, Math.PI * 2);
  ctx.fill();
}

// Draw butterfly enemy
export function drawButterfly(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1
) {
  const s = scale;
  const wingFlap = Math.sin(frame * 0.5) * 0.3;
  
  ctx.save();
  
  // Body
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(x + 10 * s, y + 8 * s, 4 * s, 12 * s);
  
  // Left wing
  ctx.save();
  ctx.translate(x + 10 * s, y + 12 * s);
  ctx.rotate(-wingFlap);
  ctx.fillStyle = COLORS.softPink;
  ctx.fillRect(-10 * s, -6 * s, 10 * s, 12 * s);
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(-8 * s, -4 * s, 4 * s, 4 * s);
  ctx.restore();
  
  // Right wing
  ctx.save();
  ctx.translate(x + 14 * s, y + 12 * s);
  ctx.rotate(wingFlap);
  ctx.fillStyle = COLORS.softPink;
  ctx.fillRect(0, -6 * s, 10 * s, 12 * s);
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(4 * s, -4 * s, 4 * s, 4 * s);
  ctx.restore();
  
  // Antennae
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 11 * s, y + 8 * s);
  ctx.lineTo(x + 8 * s, y + 2 * s);
  ctx.moveTo(x + 13 * s, y + 8 * s);
  ctx.lineTo(x + 16 * s, y + 2 * s);
  ctx.stroke();
  
  ctx.restore();
}

// Draw puddle enemy
export function drawPuddle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1
) {
  const s = scale;
  const wobble = Math.sin(frame * 0.1) * 2;
  
  ctx.fillStyle = 'rgba(135, 206, 235, 0.6)';
  ctx.beginPath();
  ctx.ellipse(x + 15 * s, y + 25 * s, (15 + wobble) * s, 5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.ellipse(x + 12 * s, y + 24 * s, 4 * s, 2 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Draw raindrop enemy
export function drawRaindrop(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1
) {
  const s = scale;
  
  ctx.fillStyle = 'rgba(100, 149, 237, 0.8)';
  ctx.beginPath();
  ctx.moveTo(x + 10 * s, y);
  ctx.quadraticCurveTo(x + 20 * s, y + 15 * s, x + 10 * s, y + 25 * s);
  ctx.quadraticCurveTo(x, y + 15 * s, x + 10 * s, y);
  ctx.fill();
  
  // Shine
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.ellipse(x + 7 * s, y + 10 * s, 2 * s, 4 * s, -0.3, 0, Math.PI * 2);
  ctx.fill();
}

// Draw storm cloud
export function drawStormCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  hp: number,
  scale: number = 1
) {
  const s = scale;
  const float = Math.sin(frame * 0.08) * 3;
  
  ctx.fillStyle = hp > 0 ? '#4A5568' : '#87CEEB';
  
  // Cloud shape
  ctx.beginPath();
  ctx.arc(x + 15 * s, (y + 20 + float) * 1, 12 * s, 0, Math.PI * 2);
  ctx.arc(x + 30 * s, (y + 18 + float) * 1, 15 * s, 0, Math.PI * 2);
  ctx.arc(x + 45 * s, (y + 22 + float) * 1, 10 * s, 0, Math.PI * 2);
  ctx.fill();
  
  if (hp > 0) {
    // Angry eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 20 * s, (y + 15 + float) * 1, 6 * s, 6 * s);
    ctx.fillRect(x + 32 * s, (y + 15 + float) * 1, 6 * s, 6 * s);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(x + 22 * s, (y + 17 + float) * 1, 3 * s, 3 * s);
    ctx.fillRect(x + 34 * s, (y + 17 + float) * 1, 3 * s, 3 * s);
  }
}

// Draw loneliness monster (boss)
export function drawLonelinessMonster(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  hp: number,
  maxHp: number,
  scale: number = 1
) {
  const s = scale;
  const sizeMultiplier = hp / maxHp;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.05;
  const float = Math.sin(frame * 0.05) * 5;
  
  ctx.save();
  ctx.translate(x + 40 * s, y + 40 * s + float);
  ctx.scale(sizeMultiplier * pulse, sizeMultiplier * pulse);
  
  // Shadow body
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 40 * s);
  gradient.addColorStop(0, 'rgba(26, 26, 46, 0.9)');
  gradient.addColorStop(0.5, 'rgba(45, 27, 78, 0.8)');
  gradient.addColorStop(1, 'rgba(26, 26, 46, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, 40 * s, 0, Math.PI * 2);
  ctx.fill();
  
  // Core
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.arc(0, 0, 30 * s, 0, Math.PI * 2);
  ctx.fill();
  
  // Sad eyes
  ctx.fillStyle = '#9B59B6';
  ctx.fillRect(-15 * s, -10 * s, 10 * s, 8 * s);
  ctx.fillRect(5 * s, -10 * s, 10 * s, 8 * s);
  
  // Eye glow
  ctx.fillStyle = '#E0B0FF';
  ctx.fillRect(-13 * s, -8 * s, 4 * s, 4 * s);
  ctx.fillRect(7 * s, -8 * s, 4 * s, 4 * s);
  
  // Sad mouth
  ctx.strokeStyle = '#9B59B6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 15 * s, 10 * s, Math.PI * 0.2, Math.PI * 0.8);
  ctx.stroke();
  
  ctx.restore();
}

// Draw photo frame collectible
export function drawPhotoFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  frameIndex: number,
  scale: number = 1
) {
  const s = scale;
  const bob = Math.sin(frame * 0.1) * 3;
  const glow = 0.5 + Math.sin(frame * 0.15) * 0.3;
  
  // Glow effect
  ctx.fillStyle = `rgba(255, 215, 0, ${glow})`;
  ctx.fillRect((x - 2) * 1, (y - 2 + bob) * 1, 28 * s, 28 * s);
  
  // Frame border
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(x, (y + bob) * 1, 24 * s, 24 * s);
  
  // Photo area
  ctx.fillStyle = '#FFF8E7';
  ctx.fillRect((x + 3) * 1, (y + 3 + bob) * 1, 18 * s, 18 * s);
  
  // Memory icon based on frame index
  const iconColors = ['#FFB6C1', '#87CEEB', '#98FB98', '#DDA0DD'];
  ctx.fillStyle = iconColors[(frameIndex - 1) % 4] || COLORS.softPink;
  
  // Simple pixel art representation
  ctx.fillRect((x + 6) * 1, (y + 6 + bob) * 1, 12 * s, 12 * s);
  
  // Frame number
  ctx.fillStyle = COLORS.gold;
  ctx.font = `${8 * s}px Arial`;
  ctx.fillText(String(frameIndex), x + 10 * s, (y + 14 + bob) * 1);
}

// Draw love token
export function drawLoveToken(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1
) {
  const s = scale;
  const spin = frame * 0.1;
  const bob = Math.sin(frame * 0.12) * 3;
  
  ctx.save();
  ctx.translate(x + 12 * s, y + 12 * s + bob);
  ctx.rotate(spin);
  
  // Outer glow
  ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.beginPath();
  ctx.arc(0, 0, 14 * s, 0, Math.PI * 2);
  ctx.fill();
  
  // Token
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.arc(0, 0, 10 * s, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner circle
  ctx.fillStyle = '#FFF8E7';
  ctx.beginPath();
  ctx.arc(0, 0, 6 * s, 0, Math.PI * 2);
  ctx.fill();
  
  // Heart in center
  ctx.fillStyle = COLORS.softPink;
  ctx.fillRect(-3 * s, -2 * s, 3 * s, 3 * s);
  ctx.fillRect(0, -2 * s, 3 * s, 3 * s);
  ctx.fillRect(-2 * s, 1 * s, 4 * s, 2 * s);
  ctx.fillRect(-1 * s, 3 * s, 2 * s, 1 * s);
  
  ctx.restore();
}

// Draw platform
export function drawPlatform(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  type: string,
  frame: number,
  scale: number = 1
) {
  const s = scale;
  
  switch (type) {
    case 'flower':
      ctx.fillStyle = '#90EE90';
      ctx.fillRect(x, y, width, height);
      // Flower decorations
      for (let i = 0; i < width; i += 20) {
        ctx.fillStyle = COLORS.softPink;
        ctx.beginPath();
        ctx.arc(x + i + 10, y - 5, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = COLORS.gold;
        ctx.beginPath();
        ctx.arc(x + i + 10, y - 5, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
      
    case 'branch':
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(x, y, width, 4);
      // Leaves
      ctx.fillStyle = '#228B22';
      ctx.beginPath();
      ctx.ellipse(x + width - 5, y - 3, 8, 4, 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'cloud':
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(x + 15, y + height / 2, 15, 0, Math.PI * 2);
      ctx.arc(x + width / 2, y + height / 2 - 5, 20, 0, Math.PI * 2);
      ctx.arc(x + width - 15, y + height / 2, 15, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'moon':
      ctx.fillStyle = '#FFFACD';
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFE4B5';
      ctx.beginPath();
      ctx.arc(x + width / 2 - 5, y + height / 2 - 5, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'star':
      const starBob = Math.sin(frame * 0.1) * 2;
      ctx.fillStyle = COLORS.gold;
      ctx.save();
      ctx.translate(x + width / 2, y + height / 2 + starBob);
      for (let i = 0; i < 5; i++) {
        ctx.rotate(Math.PI * 2 / 5);
        ctx.fillRect(-3, -width / 2, 6, width / 2);
      }
      ctx.restore();
      break;
      
    case 'heart':
      const heartPulse = 1 + Math.sin(frame * 0.1) * 0.05;
      ctx.save();
      ctx.translate(x + width / 2, y + height / 2);
      ctx.scale(heartPulse, heartPulse);
      ctx.fillStyle = COLORS.softPink;
      ctx.beginPath();
      ctx.moveTo(0, -height / 4);
      ctx.bezierCurveTo(-width / 2, -height, -width / 2, 0, 0, height / 2);
      ctx.bezierCurveTo(width / 2, 0, width / 2, -height, 0, -height / 4);
      ctx.fill();
      ctx.restore();
      break;
      
    case 'umbrella':
      ctx.fillStyle = '#FF6B6B';
      ctx.beginPath();
      ctx.arc(x + width / 2, y + 5, width / 2, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#4A4A4A';
      ctx.fillRect(x + width / 2 - 2, y + 5, 4, height + 10);
      break;
      
    case 'icecream-cart':
      ctx.fillStyle = '#DEB887';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = COLORS.softPink;
      ctx.fillRect(x + 5, y - 10, 15, 10);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + width - 20, y - 8, 15, 8);
      // Wheels
      ctx.fillStyle = '#4A4A4A';
      ctx.beginPath();
      ctx.arc(x + 10, y + height + 5, 5, 0, Math.PI * 2);
      ctx.arc(x + width - 10, y + height + 5, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'coffee-table':
      // Table top
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(x, y, width, 4);
      // Coffee cup decoration
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + width / 2 - 6, y - 8, 12, 8);
      ctx.fillStyle = '#6F4E37';
      ctx.fillRect(x + width / 2 - 4, y - 6, 8, 4);
      break;
      
    case 'escalator':
      // Moving stairs effect
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = '#A0A0A0';
      const stepOffset = (frame * 0.5) % 10;
      for (let i = 0; i < width; i += 10) {
        ctx.fillRect(x + i + stepOffset, y, 2, height);
      }
      // Rails
      ctx.fillStyle = '#808080';
      ctx.fillRect(x, y - 3, width, 3);
      break;
      
    case 'theater-seat':
      // Seat back
      ctx.fillStyle = '#8B0000';
      ctx.fillRect(x, y - 5, width, 10);
      // Seat cushion
      ctx.fillStyle = '#DC143C';
      ctx.fillRect(x + 2, y + 5, width - 4, height - 5);
      // Armrests
      ctx.fillStyle = '#4A4A4A';
      ctx.fillRect(x, y, 4, height);
      ctx.fillRect(x + width - 4, y, 4, height);
      break;
      
    default:
      // Normal platform
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = '#A08060';
      ctx.fillRect(x, y, width, 4);
      ctx.fillStyle = '#6B5344';
      ctx.fillRect(x, y + height - 3, width, 3);
  }
}

// Draw shared cone power-up
export function drawSharedCone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1
) {
  const s = scale;
  const glow = 0.5 + Math.sin(frame * 0.15) * 0.3;
  const bob = Math.sin(frame * 0.12) * 3;
  
  // Glow
  ctx.fillStyle = `rgba(255, 215, 0, ${glow})`;
  ctx.beginPath();
  ctx.arc(x + 12 * s, (y + 12 + bob) * 1, 18 * s, 0, Math.PI * 2);
  ctx.fill();
  
  // Large cone
  ctx.fillStyle = '#DEB887';
  ctx.beginPath();
  ctx.moveTo(x + 4 * s, (y + 10 + bob) * 1);
  ctx.lineTo(x + 12 * s, (y + 24 + bob) * 1);
  ctx.lineTo(x + 20 * s, (y + 10 + bob) * 1);
  ctx.closePath();
  ctx.fill();
  
  // Two scoops
  ctx.fillStyle = COLORS.softPink;
  ctx.beginPath();
  ctx.arc(x + 8 * s, (y + 6 + bob) * 1, 6 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#87CEEB';
  ctx.beginPath();
  ctx.arc(x + 16 * s, (y + 6 + bob) * 1, 6 * s, 0, Math.PI * 2);
  ctx.fill();
  
  // Heart on top
  drawHeart(ctx, x + 4 * s, (y - 8 + bob) * 1, frame, 0.4, '#FF1493');
}

// Draw sorry heart (Level 3)
export function drawSorryHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1
) {
  const bob = Math.sin(frame * 0.1) * 3;
  
  // Rainbow glow
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6'];
  const glowColor = colors[Math.floor(frame * 0.1) % colors.length];
  
  ctx.fillStyle = `${glowColor}40`;
  ctx.beginPath();
  ctx.arc(x + 12 * scale, y + 12 * scale + bob, 16 * scale, 0, Math.PI * 2);
  ctx.fill();
  
  drawHeart(ctx, x, y + bob, frame, scale, '#FF6B6B');
  
  // Sparkle
  ctx.fillStyle = '#FFFFFF';
  const sparkleOffset = Math.sin(frame * 0.2) * 3;
  ctx.fillRect((x + 4 + sparkleOffset) * 1, (y + 4 + bob) * 1, 3 * scale, 3 * scale);
}

// Draw bad bad bubble
export function drawBadBadBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  text: string,
  scale: number = 1
) {
  const bob = Math.sin(frame * 0.08) * 5;
  const wobble = Math.sin(frame * 0.1) * 2;
  
  ctx.save();
  ctx.translate(x, y + bob);
  
  // Bubble
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.ellipse(24 * scale, 12 * scale, (24 + wobble) * scale, 14 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Bubble tail
  ctx.beginPath();
  ctx.moveTo(20 * scale, 24 * scale);
  ctx.lineTo(24 * scale, 32 * scale);
  ctx.lineTo(28 * scale, 24 * scale);
  ctx.fill();
  
  // Text
  ctx.fillStyle = '#4A5568';
  ctx.font = `${8 * scale}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(text, 24 * scale, 15 * scale);
  
  ctx.restore();
}

// Draw coffee cup collectible
export function drawCoffeeCup(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1
) {
  const s = scale;
  const bob = Math.sin(frame * 0.12) * 2;
  const steamWave = Math.sin(frame * 0.2) * 2;
  
  // Cup body
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + 4 * s, (y + 8 + bob), 16 * s, 16 * s);
  
  // Cup bottom
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(x + 4 * s, (y + 20 + bob), 16 * s, 4 * s);
  
  // Coffee inside
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + 6 * s, (y + 10 + bob), 12 * s, 8 * s);
  
  // Handle
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x + 20 * s, (y + 14 + bob), 5 * s, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  
  // Steam
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 8 * s, (y + 6 + bob));
  ctx.quadraticCurveTo(x + 10 * s + steamWave, (y + 2 + bob), x + 8 * s, (y - 2 + bob));
  ctx.moveTo(x + 14 * s, (y + 6 + bob));
  ctx.quadraticCurveTo(x + 16 * s - steamWave, (y + 2 + bob), x + 14 * s, (y - 2 + bob));
  ctx.stroke();
}

// Draw coffee steam enemy
export function drawCoffeeSteam(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1
) {
  const s = scale;
  const wave = Math.sin(frame * 0.1) * 3;
  
  ctx.fillStyle = 'rgba(200, 200, 200, 0.6)';
  
  // Steam cloud shape
  ctx.beginPath();
  ctx.arc(x + 10 * s, y + 15 * s + wave, 8 * s, 0, Math.PI * 2);
  ctx.arc(x + 20 * s, y + 12 * s + wave, 10 * s, 0, Math.PI * 2);
  ctx.arc(x + 30 * s, y + 15 * s + wave, 8 * s, 0, Math.PI * 2);
  ctx.fill();
  
  // Hot face
  ctx.fillStyle = '#FF6B6B';
  ctx.fillRect(x + 16 * s, y + 10 * s + wave, 3 * s, 3 * s);
  ctx.fillRect(x + 22 * s, y + 10 * s + wave, 3 * s, 3 * s);
}

// Draw gift box collectible
export function drawGiftBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1
) {
  const s = scale;
  const bob = Math.sin(frame * 0.12) * 2;
  const sparkle = Math.sin(frame * 0.2) > 0.5;
  
  // Box body
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(x + 2 * s, (y + 10 + bob), 20 * s, 14 * s);
  
  // Box lid
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(x, (y + 6 + bob), 24 * s, 6 * s);
  
  // Ribbon vertical
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(x + 10 * s, (y + 6 + bob), 4 * s, 18 * s);
  
  // Ribbon horizontal
  ctx.fillRect(x, (y + 12 + bob), 24 * s, 4 * s);
  
  // Bow
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.ellipse(x + 8 * s, (y + 4 + bob), 5 * s, 3 * s, -0.3, 0, Math.PI * 2);
  ctx.ellipse(x + 16 * s, (y + 4 + bob), 5 * s, 3 * s, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Sparkle
  if (sparkle) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 4 * s, (y + 2 + bob), 2 * s, 2 * s);
    ctx.fillRect(x + 18 * s, (y + 2 + bob), 2 * s, 2 * s);
  }
}

// Draw shopping bag enemy
export function drawShoppingBag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1
) {
  const s = scale;
  const swing = Math.sin(frame * 0.08) * 3;
  
  ctx.save();
  ctx.translate(x + 12 * s, y);
  ctx.rotate(swing * 0.05);
  
  // Bag body
  ctx.fillStyle = '#FFB6C1';
  ctx.fillRect(-10 * s, 8 * s, 20 * s, 22 * s);
  
  // Bag opening
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(-10 * s, 8 * s, 20 * s, 4 * s);
  
  // Handles
  ctx.strokeStyle = '#FF69B4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-4 * s, 8 * s, 4 * s, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(4 * s, 8 * s, 4 * s, Math.PI, 0);
  ctx.stroke();
  
  // Cute face
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(-5 * s, 16 * s, 3 * s, 3 * s);
  ctx.fillRect(2 * s, 16 * s, 3 * s, 3 * s);
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(-3 * s, 22 * s, 6 * s, 2 * s);
  
  ctx.restore();
}

// Draw movie ticket collectible
export function drawMovieTicket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1
) {
  const s = scale;
  const bob = Math.sin(frame * 0.12) * 2;
  const glow = 0.5 + Math.sin(frame * 0.15) * 0.3;
  
  // Glow
  ctx.fillStyle = `rgba(255, 215, 0, ${glow})`;
  ctx.fillRect((x - 2), (y - 2 + bob), 28 * s, 20 * s);
  
  // Ticket body
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(x, (y + bob), 24 * s, 16 * s);
  
  // Ticket stripe
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(x, (y + 4 + bob), 24 * s, 3 * s);
  ctx.fillRect(x, (y + 10 + bob), 24 * s, 3 * s);
  
  // Perforation
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(x + 18 * s, (y + 2 + i * 4 + bob), 2 * s, 2 * s);
  }
  
  // Heart
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(x + 6 * s, (y + 6 + bob), 4 * s, 4 * s);
}

// Draw popcorn enemy
export function drawPopcorn(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  scale: number = 1
) {
  const s = scale;
  const pop = Math.sin(frame * 0.15) * 2;
  
  // Container
  ctx.fillStyle = '#FF4444';
  ctx.beginPath();
  ctx.moveTo(x + 5 * s, y + 10 * s);
  ctx.lineTo(x + 8 * s, y + 28 * s);
  ctx.lineTo(x + 22 * s, y + 28 * s);
  ctx.lineTo(x + 25 * s, y + 10 * s);
  ctx.closePath();
  ctx.fill();
  
  // Stripes
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + 10 * s, y + 10 * s, 3 * s, 18 * s);
  ctx.fillRect(x + 17 * s, y + 10 * s, 3 * s, 18 * s);
  
  // Popcorn pieces
  ctx.fillStyle = '#FFF8DC';
  const offsets = [
    { ox: 8, oy: 5 + pop },
    { ox: 15, oy: 3 - pop },
    { ox: 22, oy: 6 + pop * 0.5 },
    { ox: 12, oy: 8 - pop * 0.5 },
    { ox: 18, oy: 7 + pop },
  ];
  offsets.forEach(({ ox, oy }) => {
    ctx.beginPath();
    ctx.arc(x + ox * s, y + oy * s, 4 * s, 0, Math.PI * 2);
    ctx.fill();
  });
}
