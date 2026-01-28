export function baseFromPath(path: string) {
  return path.replace(/\.(avif|webp|jpg|jpeg|png)$/i, '');
}

export function buildSrcset(basePath: string, widths: number[], ext: string) {
  return widths.map((width) => `${basePath}-${width}.${ext} ${width}w`).join(', ');
}
