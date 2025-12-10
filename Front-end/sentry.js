import * as Sentry from "@sentry/react-native";


export const navigationIntegration = Sentry.reactNavigationIntegration();


Sentry.init({
  dsn: 'https://cdf50c32e2af1aa0e5dbb90fa2525c24@o4510374047186944.ingest.de.sentry.io/4510379644354640',  // Thay bằng DSN của bạn
  tracePropagationTargets: ["https://myproject.org", /^\/api\//],
  debug: true,// Bật để xem logs khi test


  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% transactions khi test
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 5000,


  // User Interaction Tracking
  enableUserInteractionTracing: true,
})
