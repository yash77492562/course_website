'use client';

/**
 * useAuth — thin accessor for the shared auth context.
 *
 * All auth state/logic now lives in a single <AuthProvider> (see
 * providers/AuthProvider.tsx). This hook just reads that context, so every
 * component shares ONE auth state, ONE init profile fetch, and ONE refresh
 * timer — instead of each caller spinning up its own copy.
 *
 * The return shape is unchanged, so existing call sites need no edits.
 */

import { useAuthContext, type AuthContextValue } from '@/providers/AuthProvider';

export type UseAuthReturn = AuthContextValue;

export function useAuth(): UseAuthReturn {
  return useAuthContext();
}
