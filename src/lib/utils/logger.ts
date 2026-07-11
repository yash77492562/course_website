/**
 * Environment-gated logger.
 *
 * Replaces raw `console.log` across the app. Debug/info are silenced in
 * production so we never leak tokens, JTIs, or API payloads to the browser
 * console. Warnings and errors are always emitted (real signal).
 *
 * Usage: `import { logger } from '@/lib/utils/logger'` then `logger.debug(...)`.
 */

const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  /** Verbose tracing — dev only. Use for flow/debug noise. */
  debug: (...args: unknown[]): void => {
    if (isDev) console.log(...args);
  },
  /** Informational — dev only. */
  info: (...args: unknown[]): void => {
    if (isDev) console.info(...args);
  },
  /** Warnings — always emitted. */
  warn: (...args: unknown[]): void => {
    console.warn(...args);
  },
  /** Errors — always emitted. */
  error: (...args: unknown[]): void => {
    console.error(...args);
  },
};
