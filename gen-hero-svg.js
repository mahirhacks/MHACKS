const fs = require('fs');
const data = JSON.parse(fs.readFileSync('hero-paths.json', 'utf8'));
const [vbX, vbY, vbW, vbH] = data.viewBox.split(' ').map(Number);

const inner = `<svg class="hero-name-svg" viewBox="${data.viewBox}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
<defs>
  <mask id="heroFiberMask" maskUnits="userSpaceOnUse" x="${vbX}" y="${vbY}" width="${vbW}" height="${vbH}">
    <path fill="#fff" d="${data.mahir}"/>
    <path fill="#fff" d="${data.asif}"/>
  </mask>
</defs>
<path class="hero-name-fill hero-name-fill--mahir" opacity="0.8" d="${data.mahir}"/>
<path class="hero-name-fill hero-name-fill--asif" opacity="0.8" d="${data.asif}"/>
<foreignObject class="hero-fiber-fo" x="${vbX}" y="${vbY}" width="${vbW}" height="${vbH}" mask="url(#heroFiberMask)">
  <canvas xmlns="http://www.w3.org/1999/xhtml" class="hero-fiber-flow" aria-hidden="true"></canvas>
</foreignObject>
</svg>`;

fs.writeFileSync('hero-svg-fragment.html', inner);
console.log('written', inner.length);
