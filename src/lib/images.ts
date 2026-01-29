export function baseFromPath(path: string) {
  return path.replace(/\.(avif|webp|jpg|jpeg|png)$/i, '');
}

export function withBase(path: string, baseUrl = import.meta.env.BASE_URL) {
  if (!path) return path;
  if (path.startsWith('http')) return path;
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}

export function buildSrcset(basePath: string, widths: number[], ext: string, baseUrl = import.meta.env.BASE_URL) {
  return widths
    .map((width) => `${withBase(`${basePath}-${width}.${ext}`, baseUrl)} ${width}w`)
    .join(', ');
}
