export type AnalyticsProvider = 'ga4' | 'none';

export type AnalyticsConfig = {
  provider: AnalyticsProvider;
  ga4Id?: string;
};

const provider = (import.meta.env.PUBLIC_ANALYTICS_PROVIDER ?? 'ga4') as AnalyticsProvider;

export const analyticsConfig: AnalyticsConfig = {
  provider,
  ga4Id: import.meta.env.PUBLIC_GA4_ID
};

export function resolveAnalyticsConfig(): AnalyticsConfig {
  return { ...analyticsConfig };
}
