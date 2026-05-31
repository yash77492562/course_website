'use client';

import { ModuleLessonsPage } from '@/page-components/MyCourses/ModuleLessonsPage';
import { use } from 'react';

export default function ModuleLessonsRoute({ 
  params 
}: { 
  params: Promise<{ courseId: string; moduleId: string }> 
}) {
  const { courseId, moduleId } = use(params);
  return <ModuleLessonsPage courseId={courseId} moduleId={moduleId} />;
}
