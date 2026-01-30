export type AnalyticsProvider = 'plausible' | 'ga4' | 'none';

export const AnalyticsEvents = {
  uberEatsHeader: 'click_ubereats_header',
  uberEatsHero: 'click_ubereats_hero',
  uberEatsProducts: 'click_ubereats_products',
  uberEatsOrigin: 'click_ubereats_origin',
  uberEatsBottom: 'click_ubereats_bottom'
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

const provider = (import.meta.env.PUBLIC_ANALYTICS_PROVIDER ?? 'plausible') as AnalyticsProvider;

export const analyticsProvider = provider;

export type AnalyticsProps = Record<string, string | number | boolean>;

export function trackEvent(name: AnalyticsEventName, props?: AnalyticsProps) {
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
