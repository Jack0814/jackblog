import { AnalyticsEvent } from '../types';

export const trackEvent = (event: string, payload?: Record<string, any>) => {
  const analyticsData: AnalyticsEvent = {
    event,
    payload,
    timestamp: Date.now(),
  };
  
  // In a real app, send to Google Analytics, Mixpanel, or custom backend
  console.log('[Analytics]', analyticsData);
};
