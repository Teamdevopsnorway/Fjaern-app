/* eslint-disable no-console */
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Get assets directory path
const assetsDir = path.join(process.cwd(), 'assets');

// Create app icon (1024x1024)
function createAppIcon() {
  const canvas = createCanvas(1024, 1024);
  const ctx = canvas.getContext('2d');

  // Background - Norwegian red gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
  gradient.addColorStop(0, '#EF4444');
  gradient.addColorStop(1, '#DC2626');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1024);

  // White circle background for troll
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.arc(512, 512, 380, 0, Math.PI * 2);
  ctx.fill();

  // Troll emoji (simplified)
  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 400px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🧹', 512, 540);

  // App name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 120px Arial';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  ctx.fillText('Fjærn', 512, 880);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(assetsDir, 'icon.png'), buffer);
  console.log('✅ App icon created: assets/icon.png');
}

// Create splash screen (2048x2048)
function createSplashScreen() {
  const canvas = createCanvas(2048, 2048);
  const ctx = canvas.getContext('2d');

  // Background - Norwegian red
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(0, 0, 2048, 2048);

  // White circle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.arc(1024, 1024, 600, 0, Math.PI * 2);
  ctx.fill();

  // Troll emoji
  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 600px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🧹', 1024, 1080);

  // App name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 180px Arial';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 5;
  ctx.fillText('Fjærn', 1024, 1650);

  // Tagline
  ctx.font = '80px Arial';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  ctx.fillText('Rydd bildene dine', 1024, 1780);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(assetsDir, 'splash.png'), buffer);
  console.log('✅ Splash screen created: assets/splash.png');
}

// Create adaptive icon for Android (foreground only, 1024x1024)
function createAdaptiveIcon() {
  const canvas = createCanvas(1024, 1024);
  const ctx = canvas.getContext('2d');

  // Transparent background
  ctx.clearRect(0, 0, 1024, 1024);

  // White circle
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(512, 512, 380, 0, Math.PI * 2);
  ctx.fill();

  // Troll emoji
  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 400px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🧹', 512, 540);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), buffer);
  console.log('✅ Adaptive icon created: assets/adaptive-icon.png');
}

// Generate all icons
console.log('🎨 Generating Fjærn app icons...\n');
createAppIcon();
createSplashScreen();
createAdaptiveIcon();
console.log('\n✨ All icons generated successfully!');
