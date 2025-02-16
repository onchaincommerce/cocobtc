const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 192, 512];
const appleIconSizes = [180];

async function generateIcons() {
  // Create public directory if it doesn't exist
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  // Base icon - you can replace this with your own icon
  const baseIcon = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#1E40AF"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="200" fill="white">CocoBTC</text>
    </svg>
  `);

  // Generate standard icons
  for (const size of sizes) {
    await sharp(baseIcon)
      .resize(size, size)
      .toFile(path.join(publicDir, size === 16 || size === 32 
        ? `favicon-${size}x${size}.png`
        : `icon-${size}x${size}.png`));
  }

  // Generate Apple icons
  for (const size of appleIconSizes) {
    await sharp(baseIcon)
      .resize(size, size)
      .toFile(path.join(publicDir, `apple-icon-${size}.png`));
  }

  // Generate base Apple icon
  await sharp(baseIcon)
    .resize(180, 180)
    .toFile(path.join(publicDir, 'apple-icon.png'));
}

generateIcons().catch(console.error); 