'use client';

import { CourseModulesPage } from '@/page-components/MyCourses/CourseModulesPage';
import { use } from 'react';

export default function CourseModulesRoute({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  return <CourseModulesPage courseId={courseId} />;
}
