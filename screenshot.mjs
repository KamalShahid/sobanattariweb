import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

const existing = fs.readdirSync(outDir).filter(f => f.endsWith('.png'));
let maxN = 0;
for (const f of existing) {
  const m = f.match(/^screenshot-(\d+)/);
  if (m) maxN = Math.max(maxN, parseInt(m[1]));
}
const n = maxN + 1;
const filename = `screenshot-${n}${label}.png`;
const outPath = path.join(outDir, filename);

const browser = await puppeteer.launch({
  executablePath: '/Users/mac/.cache/puppeteer/chrome/mac_arm-147.0.7727.56/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

// Disable scroll animations for screenshot — force all animated elements visible
await page.evaluate(() => {
  const style = document.createElement('style');
  style.textContent = `
    .stat-card, .topic-card, .lecture-card, .book-card,
    .course-card, .social-card, .gallery-item,
    .reveal, .reveal-stagger, .reveal-stagger > * {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  `;
  document.head.appendChild(style);
});
await new Promise(r => setTimeout(r, 300));

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: temporary screenshots/${filename}`);
