const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

interface ApiResponse<T = any> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
}

interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  duration: string;
  level: string;
  category: string;
  thumbnail: string;
  instructor: string;
  instructorBio?: string;
  rating: number;
  studentsCount: number;
  
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
  
  status: string;
  createdAt: string;
  updatedAt: string;
  modules?: CourseModule[];
  _count?: {
    enrollments: number;
  };
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  objectives?: string[];
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

class CourseApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getPublishedCourses(): Promise<Course[]> {
    return this.request<Course[]>('/courses/public');
  }

  async getCourseById(id: string): Promise<Course> {
    return this.request<Course>(`/courses/${id}`);
  }
}

export const courseApi = new CourseApiClient(API_BASE_URL);
export type { Course, CourseModule };