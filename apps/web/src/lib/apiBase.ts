/**
 * Where the browser sends API requests: this site's own origin, under /api.
 * next.config.ts rewrites /api/* to the real API server (NEXT_PUBLIC_API_URL).
 *
 * Same-origin on purpose. Calling the API's own domain made every request
 * cross-origin, so it depended on the API's CORS allow-list naming each
 * address the site is served from. Production served from an address that
 * list did not include, and vault creation failed for everyone with "That
 * vault could not be created". Through the rewrite there is no cross-origin
 * request, so no allow-list to keep in step.
 */
export const API_BASE = '/api';
