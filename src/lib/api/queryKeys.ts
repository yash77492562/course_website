/**
 * Centralized React Query key factory.
 *
 * Keeping keys in one place prevents typos and makes targeted cache
 * invalidation easy (e.g. after a purchase, invalidate courseAccess + enrolled).
 */

export const queryKeys = {
  courses: {
    all: ['courses'] as const,
    published: ['courses', 'published'] as const,
    detail: (id: string) => ['courses', 'detail', id] as const,
  },
  enrollment: {
    enrolled: ['enrollment', 'enrolled'] as const,
    purchasedIds: ['enrollment', 'purchased-ids'] as const,
  },
  courseAccess: (courseId: string, userId: string) =>
    ['course-access', courseId, userId] as const,
} as const;
