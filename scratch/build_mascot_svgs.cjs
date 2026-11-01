const fs = require('fs');

const colourBuf = fs.readFileSync('public/assets/fest/mascot-colour-800.png');
const sketchBuf = fs.readFileSync('public/assets/fest/mascot-sketch-800.png');
const maskBuf = fs.readFileSync('public/assets/fest/mascot-mask-800.png');

const colourBase64 = 'data:image/png;base64,' + colourBuf.toString('base64');
const sketchBase64 = 'data:image/png;base64,' + sketchBuf.toString('base64');
const maskBase64 = 'data:image/png;base64,' + maskBuf.toString('base64');

// 1. mascot-rig.svg
// Symbols for body-colour and body-sketch with self-contained base64
// Plus empty symbols for joints so MascotRig.tsx doesn't throw or miss symbols
const mascotRigSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
  <defs>
    <symbol id="body-colour" viewBox="0 0 800 1000">
      <image href="${colourBase64}" width="800" height="1000" preserveAspectRatio="xMidYMid meet" />
    </symbol>
    <symbol id="ribbon-colour" viewBox="0 0 800 1000"><path d="M395 405" opacity="0" /></symbol>
    <symbol id="left-sleeve-colour" viewBox="0 0 800 1000"><path d="M307 388" opacity="0" /></symbol>
    <symbol id="left-hand-colour" viewBox="0 0 800 1000"><path d="M133 395" opacity="0" /></symbol>
    <symbol id="right-sleeve-colour" viewBox="0 0 800 1000"><path d="M427 392" opacity="0" /></symbol>
    <symbol id="right-hand-colour" viewBox="0 0 800 1000"><path d="M541 269" opacity="0" /></symbol>

    <symbol id="body-sketch" viewBox="0 0 800 1000">
      <image href="${sketchBase64}" width="800" height="1000" preserveAspectRatio="xMidYMid meet" />
    </symbol>
    <symbol id="ribbon-sketch" viewBox="0 0 800 1000"><path d="M395 405" opacity="0" /></symbol>
    <symbol id="left-sleeve-sketch" viewBox="0 0 800 1000"><path d="M307 388" opacity="0" /></symbol>
    <symbol id="left-hand-sketch" viewBox="0 0 800 1000"><path d="M133 395" opacity="0" /></symbol>
    <symbol id="right-sleeve-sketch" viewBox="0 0 800 1000"><path d="M427 392" opacity="0" /></symbol>
    <symbol id="right-hand-sketch" viewBox="0 0 800 1000"><path d="M541 269" opacity="0" /></symbol>
  </defs>
</svg>`;
fs.writeFileSync('public/assets/placeholders/mascot-rig.svg', mascotRigSvg);
console.log('Saved mascot-rig.svg');

// 2. mascot-colour.svg
const mascotColourSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
  <image href="${colourBase64}" width="800" height="1000" preserveAspectRatio="xMidYMid meet" />
</svg>`;
fs.writeFileSync('public/assets/placeholders/mascot-colour.svg', mascotColourSvg);
console.log('Saved mascot-colour.svg');

// 3. mascot-sketch.svg
const mascotSketchSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
  <image href="${sketchBase64}" width="800" height="1000" preserveAspectRatio="xMidYMid meet" />
</svg>`;
fs.writeFileSync('public/assets/placeholders/mascot-sketch.svg', mascotSketchSvg);
console.log('Saved mascot-sketch.svg');

// 4. mascot-mask.svg
// Completely removes the cartoon placeholder domino mask path.
// Instead renders the authentic character's gold ornamentation & ceremonial mask.
const mascotMaskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
  <!-- Authentic mascot ceremonial gold mask and ornamentation from Components -->
  <image href="${colourBase64}" width="800" height="1000" preserveAspectRatio="xMidYMid meet" />
</svg>`;
fs.writeFileSync('public/assets/placeholders/mascot-mask.svg', mascotMaskSvg);
console.log('Saved mascot-mask.svg without cartoon mask!');

