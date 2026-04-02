// Course-related TypeScript types
export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  duration: string; // e.g., "8 weeks", "3 months"
  level: CourseLevel;
  category: string;
  thumbnail: string;
  instructor: string;
  instructorBio?: string;
  rating: number;
  studentsCount: number;
  
  // Course scheduling and availability
  spotsLeft?: number;
  nextCohort?: string;
  
  // Course content
  features: string[];
  skills?: string[];
  tools?: string[];
  
  // Course outcomes
  outcomes?: string[];
  careerPaths?: string[];
  jobTitles?: string[];
  
  // Course structure
  totalModules: number;
  totalLessons: number;
  totalHours?: string;
  
  // Prerequisites
  prerequisites?: string[];
  requirements?: string[];
  
  // Support and certification
  careerSupport?: string[];
  certification: boolean;
  certificateName?: string;
  
  // Additional info
  faqs?: any[];
  highlights?: string[];
  
  modules: CourseModule[];
  status: CourseStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  objectives?: string[];
  courseId: string;
  createdAt: string;
  updatedAt: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  resources: LessonResource[];
  order: number;
  isCompleted?: boolean;
  contentType?: 'VIDEO' | 'PDF';
}

export interface LessonResource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  size?: string;
}

export interface UserCourseProgress {
  userId: string;
  courseId: string;
  enrolledAt: string;
  expiresAt: string;
  progress: number; // 0-100
  completedLessons: string[];
  lastAccessedAt: string;
  status: EnrollmentStatus;
}

export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type ResourceType = 'pdf' | 'video' | 'link' | 'quiz' | 'assignment';
export type EnrollmentStatus = 'active' | 'completed' | 'expired' | 'suspended';

// Component Props
export interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  onViewDetails?: (courseId: string) => void;
  className?: string;
}

export interface CourseListProps {
  courses: Course[];
  loading?: boolean;
  onEnroll?: (courseId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

export interface CourseDetailProps {
  course: Course;
  userProgress?: UserCourseProgress;
  onEnroll?: (courseId: string) => void;
  onStartLesson?: (lessonId: string) => void;
}

// API Response types
export interface CoursesResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    courses: Course[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface CourseResponse {
  success: boolean;
  status: number;
  message: string;
  data: Course;
}

export interface EnrollmentResponse {
  success: boolean;
  status: number;
  message: string;
  data?: {
    enrollmentId: string;
    expiresAt: string;
  };
}