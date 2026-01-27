import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('public/assets/images');
const sources = [
  'img1-hero-16x9.jpg',
  'img1-hero-9x16.jpg',
  'img1-square.jpg',
  'img2-texture.jpg',
  'img3-pattern.jpg',
  'img4-origin.jpg',
  'img5-square.jpg',
  'img6-square.jpg'
];

const toWebp = (input, output) =>
  sharp(input).webp({ quality: 78 }).toFile(output);

const toAvif = (input, output) =>
  sharp(input).avif({ quality: 55, effort: 5 }).toFile(output);

for (const file of sources) {
  const input = path.join(root, file);
  const base = file.replace(/\.jpg$/i, '');
  const webp = path.join(root, `${base}.webp`);
  const avif = path.join(root, `${base}.avif`);

  await Promise.all([toWebp(input, webp), toAvif(input, avif)]);
  console.log(`Generated ${base}.webp + ${base}.avif`);
}
