const fs = require('fs');

const danceBuf = fs.readFileSync('dance.jpg');
const musicBuf = fs.readFileSync('music.jpg');
const fashionBuf = fs.readFileSync('fashionshow.jpg');

const danceBase64 = 'data:image/jpeg;base64,' + danceBuf.toString('base64');
const musicBase64 = 'data:image/jpeg;base64,' + musicBuf.toString('base64');
const fashionBase64 = 'data:image/jpeg;base64,' + fashionBuf.toString('base64');

function makeSvg(base64, directPath, width = 600, height = 700) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="event-grad" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#071322" stop-opacity="0.2" />
      <stop offset="60%" stop-color="#071322" stop-opacity="0" />
      <stop offset="100%" stop-color="#071322" stop-opacity="0.85" />
    </linearGradient>
  </defs>
  <!-- Base64 self-contained photo -->
  <image href="${base64}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" />
  <!-- Elegant cinematic gradient for text readability and branding -->
  <rect width="${width}" height="${height}" fill="url(#event-grad)" />
  <!-- Golden border outline -->
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="#e9b85f" stroke-width="1.5" stroke-opacity="0.35" />
</svg>`;
}

fs.writeFileSync('public/assets/placeholders/program-dance.svg', makeSvg(danceBase64, '/assets/events/dance.jpg'));
fs.writeFileSync('public/assets/placeholders/program-music.svg', makeSvg(musicBase64, '/assets/events/music.jpg'));
fs.writeFileSync('public/assets/placeholders/program-fashion.svg', makeSvg(fashionBase64, '/assets/events/fashionshow.jpg'));

console.log('Successfully updated program-dance.svg, program-music.svg, program-fashion.svg with authentic images!');

