const fs = require('fs');
const https = require('https');
const opentype = require('opentype.js');

const FONTS = {
  light: 'https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@5.0.0/latin-300-normal.ttf',
  italic: 'https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@5.0.0/latin-400-italic.ttf',
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) return resolve();
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

function cmdToD(cmd) {
  const n = (v) => (Number.isFinite(v) ? v.toFixed(1) : '0');
  switch (cmd.type) {
    case 'M': return `M${n(cmd.x)} ${n(cmd.y)}`;
    case 'L': return `L${n(cmd.x)} ${n(cmd.y)}`;
    case 'C': return `C${n(cmd.x1)} ${n(cmd.y1)} ${n(cmd.x2)} ${n(cmd.y2)} ${n(cmd.x)} ${n(cmd.y)}`;
    case 'Q': return `Q${n(cmd.x1)} ${n(cmd.y1)} ${n(cmd.x)} ${n(cmd.y)}`;
    case 'Z': return 'Z';
    default: return '';
  }
}

function pathToD(path) {
  return path.commands.map(cmdToD).join('');
}

function bounds(path) {
  const b = path.getBoundingBox();
  return { x1: b.x1, y1: b.y1, x2: b.x2, y2: b.y2 };
}

function mergeBounds(a, b) {
  return {
    x1: Math.min(a.x1, b.x1),
    y1: Math.min(a.y1, b.y1),
    x2: Math.max(a.x2, b.x2),
    y2: Math.max(a.y2, b.y2),
  };
}

async function main() {
  await download(FONTS.light, 'font-light.ttf');
  await download(FONTS.italic, 'font-italic.ttf');

  const fontLight = opentype.parse(fs.readFileSync('font-light.ttf'));
  const fontItalic = opentype.parse(fs.readFileSync('font-italic.ttf'));
  if (!fontLight?.getPath || !fontItalic?.getPath) throw new Error('Font parse failed');
  const SIZE = 280;
  const letterSpacing = SIZE * 0.14;

  const mahirText = 'Mahir';
  let x = 0;
  let mahirD = '';
  let mahirBounds = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };

  for (const ch of mahirText) {
    const p = fontLight.getPath(ch, x, 0, SIZE);
    mahirD += pathToD(p);
    mahirBounds = mergeBounds(mahirBounds, bounds(p));
    x += fontLight.getAdvanceWidth(ch, SIZE) + letterSpacing * 0.15;
  }

  const gap = SIZE * 0.22;
  x += gap;
  const asifText = 'Asif';
  let asifD = '';
  let asifBounds = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };

  for (const ch of asifText) {
    const p = fontItalic.getPath(ch, x, 0, SIZE);
    asifD += pathToD(p);
    asifBounds = mergeBounds(asifBounds, bounds(p));
    x += fontItalic.getAdvanceWidth(ch, SIZE) + letterSpacing * 0.12;
  }

  const fullBounds = mergeBounds(mahirBounds, asifBounds);
  const pad = SIZE * 0.04;
  const viewBox = [
    (fullBounds.x1 - pad).toFixed(1),
    (fullBounds.y1 - pad).toFixed(1),
    (fullBounds.x2 - fullBounds.x1 + pad * 2).toFixed(1),
    (fullBounds.y2 - fullBounds.y1 + pad * 2).toFixed(1),
  ].join(' ');

  const cx = (fullBounds.x1 + fullBounds.x2) / 2;
  const cy = (fullBounds.y1 + fullBounds.y2) / 2;

  const data = {
    viewBox,
    mahir: mahirD,
    asif: asifD,
    full: mahirD + asifD,
    cx,
    cy,
  };

  if (data.full.includes('NaN')) throw new Error('Path contains NaN');
  fs.writeFileSync('hero-paths.json', JSON.stringify(data));
  console.log('viewBox', viewBox, 'cx', cx.toFixed(1), 'cy', cy.toFixed(1));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
