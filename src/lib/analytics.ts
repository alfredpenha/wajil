export type AnalyticsProvider = 'plausible' | 'ga4' | 'none';

const provider = (import.meta.env.PUBLIC_ANALYTICS_PROVIDER ?? 'plausible') as AnalyticsProvider;

export const analyticsProvider = provider;

export type AnalyticsProps = Record<string, string | number | boolean>;

export function trackEvent(name: string, props?: AnalyticsProps) {
  if (typeof window === 'undefined') return;

  if (provider === 'plausible') {
    const plausible = (window as typeof window & { plausible?: (event: string, options?: { props?: AnalyticsProps }) => void })
      .plausible;
    if (typeof plausible === 'function') {
      plausible(name, props ? { props } : undefined);
    }
    return;
  }

  if (provider === 'ga4') {
    const gtag = (window as typeof window & { gtag?: (...args: any[]) => void }).gtag;
    if (typeof gtag === 'function') {
      gtag('event', name, props ?? {});
    }
  }
}
