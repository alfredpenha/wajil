export type AnalyticsProvider = 'gtm' | 'none';

export type AnalyticsConfig = {
  provider: AnalyticsProvider;
  gtmId?: string;
};

const provider = (import.meta.env.PUBLIC_ANALYTICS_PROVIDER ?? 'gtm') as AnalyticsProvider;

export const analyticsConfig: AnalyticsConfig = {
  provider,
  gtmId: import.meta.env.PUBLIC_GTM_ID
};

export function resolveAnalyticsConfig(): AnalyticsConfig {
  return { ...analyticsConfig };
}
