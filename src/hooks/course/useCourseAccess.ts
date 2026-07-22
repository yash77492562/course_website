'use client';

/**
 * useCourseAccess — checks whether the authenticated user has access to a course.
 *
 * Rewritten to use React Query instead of a hand-rolled localStorage TTL cache.
 * The old version kept its own 5-min cache in localStorage (plus a parallel
 * `purchased_*` key and a `skip_cache` sessionStorage flag) that never
 * invalidated on purchase, so a paying user could see stale "no access" for up
 * to 5 minutes. React Query's staleTime handles freshness, and a purchase can
 * now invalidate the key precisely (see queryKeys.courseAccess).
 *
 * The return shape is preserved for existing callers.
 */

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/useAuth';
import { fetchWithAuth } from '@/lib/utils/apiInterceptor';
import { queryKeys } from '@/lib/api/queryKeys';

interface CourseAccessResponse {
  hasAccess: boolean;
  reason: string;
  enrolledAt?: string;
  expiresAt?: string;
  progress?: number;
  warning?: string;
  error?: string;
}

interface UseCourseAccessReturn {
  hasAccess: boolean;
  isLoading: boolean;
  error: string | null;
  checkAccess: () => Promise<void>;
  reason: string | null;
  clearCache: () => void;
}

async function fetchCourseAccess(courseId: string): Promise<CourseAccessResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
  const response = await fetchWithAuth(`${apiUrl}/courses/access/${courseId}`);

  if (!response.ok) {
    throw new Error(`Access check failed: ${response.status}`);
  }

  const result = await response.json();
  // Gateway wraps payloads as { success, data }.
  return (result.data || result) as CourseAccessResponse;
}

export function useCourseAccess(courseId: string | null): UseCourseAccessReturn {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const enabled = !!courseId && !authLoading && isAuthenticated && !!user;
  const queryKey = queryKeys.courseAccess(courseId ?? '', user?.id ?? '');

  const query = useQuery<CourseAccessResponse>({
    queryKey,
    queryFn: () => fetchCourseAccess(courseId as string),
    enabled,
  });

  const checkAccess = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const clearCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    hasAccess: query.data?.hasAccess ?? false,
    // Loading while auth resolves, or while the (enabled) query is fetching.
    isLoading: authLoading || (enabled && query.isLoading),
    error: query.error ? (query.error as Error).message : null,
    checkAccess,
    reason: query.data?.reason ?? (enabled ? null : 'not_authenticated'),
    clearCache,
  };
}

/**
 * useUserPurchasedCourses — the set of course IDs the user has purchased.
 */
export function useUserPurchasedCourses() {
  const { user, isAuthenticated } = useAuth();

  const enabled = isAuthenticated && !!user;

  const query = useQuery<string[]>({
    queryKey: queryKeys.enrollment.purchasedIds,
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
      const response = await fetchWithAuth(`${apiUrl}/courses/access/user/purchased`);
      if (!response.ok) {
        throw new Error(`Failed to fetch purchased courses: ${response.status}`);
      }
      const result = await response.json();
      const data = result.data || result;
      return (data.courseIds || []) as string[];
    },
    enabled,
  });

  const courseIds = query.data ?? [];

  return {
    courseIds,
    isLoading: enabled && query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    hasPurchased: (courseId: string) => courseIds.includes(courseId),
  };
}
