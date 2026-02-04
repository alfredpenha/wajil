import { analyticsConfig, type AnalyticsProvider } from './analytics-config';

export const AnalyticsEvents = {
  uberEatsHeader: 'click_ubereats_header',
  uberEatsHero: 'click_ubereats_hero',
  uberEatsProducts: 'click_ubereats_products',
  uberEatsOrigin: 'click_ubereats_origin',
  uberEatsBottom: 'click_ubereats_bottom'
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export type AnalyticsProps = Record<string, string | number | boolean>;

export function trackEvent(name: AnalyticsEventName, props?: AnalyticsProps) {
  if (typeof window === 'undefined') return;

  const handlers: Record<AnalyticsProvider, (eventName: AnalyticsEventName, eventProps?: AnalyticsProps) => void> = {
    gtm: (eventName, eventProps) => {
      const dataLayer = (window as typeof window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer;
      if (Array.isArray(dataLayer)) {
        dataLayer.push({ event: eventName, ...(eventProps ?? {}) });
      } else {
        (window as typeof window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer = [
          { event: eventName, ...(eventProps ?? {}) }
        ];
      }
    },
    none: () => {}
  };

  handlers[analyticsConfig.provider]?.(name, props);
}

export { analyticsConfig };
export type { AnalyticsProvider } from './analytics-config';
