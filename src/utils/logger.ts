// Logger utility - dev-only logging to keep production builds clean
const isProduction = !__DEV__;

export const logger = {
    log: (...args: unknown[]) => {
        if (!isProduction) {
            console.log('[Ihssan]', ...args);
        }
    },
    warn: (...args: unknown[]) => {
        if (!isProduction) {
            console.warn('[Ihssan]', ...args);
        }
    },
    error: (...args: unknown[]) => {
        if (!isProduction) {
            console.error('[Ihssan]', ...args);
        }
        // In production, hook into crash reporter here (e.g., Sentry.captureException)
    },
    info: (...args: unknown[]) => {
        if (!isProduction) {
            console.info('[Ihssan]', ...args);
        }
    },
};
