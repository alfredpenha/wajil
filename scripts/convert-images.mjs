import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('public/assets/images');
const presets = [
  { name: 'img1-hero-16x9', widths: [640, 960, 1280, 1536] },
  { name: 'img1-hero-9x16', widths: [360, 540, 720, 1024] },
  { name: 'img1-square', widths: [320, 480, 720, 1024] },
  { name: 'img2-texture', widths: [512, 768, 1024] },
  { name: 'img3-pattern', widths: [512, 768, 1024] },
  { name: 'img4-origin', widths: [640, 960, 1280, 1536] },
  { name: 'img5-square', widths: [320, 480, 720, 1024] },
  { name: 'img6-square', widths: [320, 480, 720, 1024] }
];

const formatters = [
  { ext: 'jpg', fn: (img) => img.jpeg({ quality: 80, mozjpeg: true }) },
  { ext: 'webp', fn: (img) => img.webp({ quality: 78 }) },
  { ext: 'avif', fn: (img) => img.avif({ quality: 55, effort: 5 }) }
];

for (const preset of presets) {
  const input = path.join(root, `${preset.name}.jpg`);
  const meta = await sharp(input).metadata();
  const maxWidth = meta.width ?? preset.widths[preset.widths.length - 1];

  for (const width of preset.widths) {
    if (width > maxWidth) continue;

    for (const format of formatters) {
      const output = path.join(root, `${preset.name}-${width}.${format.ext}`);
      await format.fn(
        sharp(input).resize({ width, withoutEnlargement: true })
      ).toFile(output);
    }
  }

  console.log(`Generated responsive variants for ${preset.name}`);
}
