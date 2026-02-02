export type AnalyticsProvider = 'plausible' | 'ga4' | 'gtm' | 'none';

export type AnalyticsConfig = {
  provider: AnalyticsProvider;
  plausibleDomain?: string;
  ga4Id?: string;
  gtmId?: string;
};

const provider = (import.meta.env.PUBLIC_ANALYTICS_PROVIDER ?? 'plausible') as AnalyticsProvider;

export const analyticsConfig: AnalyticsConfig = {
  provider,
  plausibleDomain: import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN,
  ga4Id: import.meta.env.PUBLIC_GA4_ID,
  gtmId: import.meta.env.PUBLIC_GTM_ID
};

export function resolveAnalyticsConfig(fallbackPlausibleDomain?: string): AnalyticsConfig {
  return {
    ...analyticsConfig,
    plausibleDomain: analyticsConfig.plausibleDomain ?? fallbackPlausibleDomain
  };
}
