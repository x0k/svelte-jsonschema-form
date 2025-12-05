const base = import.meta.env.BASE_URL;

export function withBase(href?: string | URL | null): string | undefined {
  if (!href) return undefined;
  const hrefStr = typeof href === 'string' ? href : href.toString();

  if (hrefStr.startsWith('/') && !hrefStr.startsWith('http')) {
    return base + hrefStr.slice(1);
  }
  
  return hrefStr;
}
