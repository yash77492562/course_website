export interface CourseLesson {
  title: string;
  description?: string;
  duration?: string;
}

export interface CourseModuleData {
  title: string;
  description?: string;
  duration?: string;
  lessons?: CourseLesson[];
}

export interface CourseCurriculumProps {
  title?: string;
  modules: CourseModuleData[];
  className?: string;
}