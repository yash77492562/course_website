'use client';

/**
 * React Query hooks for course data.
 *
 * Replaces the manual `useEffect` + `useState` fetch flows in
 * courses/page.tsx and MyCoursesPage. Loading/error/data and caching are all
 * handled by React Query.
 */

import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/lib/api/course/courseApi';
import { enrollmentApi } from '@/lib/api/enrollment/enrollmentApi';
import { queryKeys } from '@/lib/api/queryKeys';
import type { Course } from '@/types/course/types';

/** Publicly listed (published) courses. Enabled by default. */
export function usePublishedCourses(enabled = true) {
  return useQuery<Course[]>({
    queryKey: queryKeys.courses.published,
    queryFn: () => courseApi.getPublishedCourses(),
    enabled,
  });
}

/**
 * Courses the authenticated user is enrolled in.
 * `enabled` should be gated on auth so we don't fire while logged out.
 */
export function useEnrolledCourses(enabled = true) {
  return useQuery<Course[]>({
    queryKey: queryKeys.enrollment.enrolled,
    queryFn: () => enrollmentApi.getEnrolledCourses(),
    enabled,
  });
}
