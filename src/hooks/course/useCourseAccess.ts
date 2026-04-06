import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/useAuth';

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

/**
 * Hook to check if user has purchased/has access to a course
 * Provides caching and automatic refresh
 */
export function useCourseAccess(courseId: string | null): UseCourseAccessReturn {
  const { user, isAuthenticated, accessToken, isLoading: authLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  // Debug: Log state changes
  useEffect(() => {
    console.log('[useCourseAccess] 📊 State changed:', { hasAccess, isLoading, reason });
  }, [hasAccess, isLoading, reason]);

  const checkAccess = useCallback(async () => {
    // Wait for auth to finish loading
    if (authLoading) {
      console.log('[useCourseAccess] Waiting for auth to finish loading...');
      setIsLoading(true);
      return;
    }

    // If no courseId, no access
    if (!courseId) {
      console.log('[useCourseAccess] No course ID provided');
      setHasAccess(false);
      setIsLoading(false);
      setReason('no_course_id');
      return;
    }

    // If not authenticated, no access
    if (!isAuthenticated || !user || !accessToken) {
      console.log('[useCourseAccess] Not authenticated:', { isAuthenticated, hasUser: !!user, hasToken: !!accessToken });
      setHasAccess(false);
      setIsLoading(false);
      setReason('not_authenticated');
      return;
    }

    console.log('[useCourseAccess] Starting access check for course:', courseId);
    setIsLoading(true);
    setError(null);

    try {
      // Check localStorage cache first (5 minute TTL)
      const cacheKey = `course_access_${courseId}_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      
      // Skip cache on first load to ensure fresh data
      const skipCache = sessionStorage.getItem(`skip_cache_${courseId}`) === 'true';
      
      if (cached && !skipCache) {
        try {
          const { hasAccess: cachedAccess, timestamp, reason: cachedReason } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
          
          if (age < CACHE_TTL) {
            console.log(`[useCourseAccess] Using cached access for course ${courseId}:`, cachedAccess);
            setHasAccess(cachedAccess);
            setReason(cachedReason);
            setIsLoading(false);
            return;
          } else {
            console.log(`[useCourseAccess] Cache expired (age: ${Math.floor(age / 1000)}s)`);
          }
        } catch (e) {
          // Invalid cache, continue to API call
          console.log('[useCourseAccess] Invalid cache, removing');
          localStorage.removeItem(cacheKey);
        }
      } else if (skipCache) {
        console.log('[useCourseAccess] Skipping cache on first load');
        sessionStorage.removeItem(`skip_cache_${courseId}`);
      }

      // Call backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      console.log(`[useCourseAccess] Fetching from API: ${apiUrl}/courses/access/${courseId}`);
      
      const response = await fetch(`${apiUrl}/courses/access/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Access check failed: ${response.status}`);
      }

      const data: CourseAccessResponse = await response.json();
      
      console.log(`[useCourseAccess] ========== ACCESS CHECK ==========`);
      console.log(`[useCourseAccess] Course ID: ${courseId}`);
      console.log(`[useCourseAccess] User ID: ${user.id}`);
      console.log(`[useCourseAccess] API Response:`, data);
      console.log(`[useCourseAccess] Has Access: ${data.hasAccess}`);
      console.log(`[useCourseAccess] Reason: ${data.reason}`);
      console.log(`[useCourseAccess] ====================================`);
      
      // Check reload flag
      const reloadFlag = sessionStorage.getItem(`first_access_check_${courseId}`);
      console.log(`[useCourseAccess] 🔄 Reload flag for ${courseId}:`, reloadFlag);
      
      setHasAccess(data.hasAccess);
      setReason(data.reason);
      
      // If access granted and this is first check, reload page to ensure UI updates
      if (data.hasAccess && reloadFlag !== 'done') {
        console.log('[useCourseAccess] ✅ Access granted! Reloading page to update UI...');
        sessionStorage.setItem(`first_access_check_${courseId}`, 'done');
        console.log('[useCourseAccess] 🔄 Flag set, reloading in 500ms...');
        // Small delay to ensure state is saved
        setTimeout(() => {
          console.log('[useCourseAccess] 🔄 RELOADING NOW!');
          window.location.reload();
        }, 500);
        return;
      } else if (data.hasAccess) {
        console.log('[useCourseAccess] ✅ Access granted (already reloaded once)');
      }
      
      // Cache the result
      localStorage.setItem(cacheKey, JSON.stringify({
        hasAccess: data.hasAccess,
        reason: data.reason,
        timestamp: Date.now(),
      }));
      
      // If user has access, also cache in the old format for backward compatibility
      if (data.hasAccess) {
        localStorage.setItem(`purchased_${courseId}_${user.id}`, 'true');
      }
    } catch (err: any) {
      console.error('[useCourseAccess] Error checking access:', err);
      setError(err.message || 'Failed to check course access');
      setHasAccess(false);
      setReason('error');
    } finally {
      setIsLoading(false);
    }
  }, [courseId, isAuthenticated, user, accessToken, authLoading]);

  // Check access on mount and when dependencies change
  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  // CRITICAL: Also re-check when auth state changes (for dev mode)
  useEffect(() => {
    if (isAuthenticated && user && accessToken && !authLoading) {
      console.log('[useCourseAccess] 🔄 Auth state changed, re-checking access...');
      checkAccess();
    }
  }, [isAuthenticated, user?.id, accessToken, authLoading, checkAccess]);

  const clearCache = useCallback(() => {
    if (!courseId || !user) return;
    
    const cacheKey = `course_access_${courseId}_${user.id}`;
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(`purchased_${courseId}_${user.id}`);
    console.log('[useCourseAccess] Cache cleared for course:', courseId);
    
    // Re-check access
    checkAccess();
  }, [courseId, user, checkAccess]);

  return {
    hasAccess,
    isLoading,
    error,
    checkAccess,
    reason,
    clearCache,
  };
}

/**
 * Hook to get all courses the user has purchased
 */
export function useUserPurchasedCourses() {
  const { user, isAuthenticated, accessToken } = useAuth();
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPurchasedCourses() {
      if (!isAuthenticated || !user || !accessToken) {
        setCourseIds([]);
        setIsLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const response = await fetch(`${apiUrl}/courses/access/user/purchased`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch purchased courses: ${response.status}`);
        }

        const data = await response.json();
        setCourseIds(data.courseIds || []);
      } catch (err: any) {
        console.error('[useUserPurchasedCourses] Error:', err);
        setError(err.message);
        setCourseIds([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPurchasedCourses();
  }, [isAuthenticated, user, accessToken]);

  return {
    courseIds,
    isLoading,
    error,
    hasPurchased: (courseId: string) => courseIds.includes(courseId),
  };
}
