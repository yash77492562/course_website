import { Course } from '@/types/course/types';
import { tokenManager } from '@/lib/utils/tokenManager/tokenManager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface ApiResponse<T = any> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
}

interface EnrolledCoursesResponse {
  courseIds: string[];
  count: number;
}

class EnrollmentApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = tokenManager.getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      console.log('🔵 Enrollment API Request:', url);
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
        cache: 'no-store',
      });
      
      console.log('🔵 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();
      console.log('🔵 API Response:', result);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data as T;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  /**
   * Get all courses the user is enrolled in
   */
  async getEnrolledCourses(): Promise<Course[]> {
    console.log('📚 Fetching enrolled courses...');
    
    // First get the course IDs
    const enrollmentData = await this.request<EnrolledCoursesResponse>('/courses/access/user/purchased');
    
    console.log('📚 Enrollment data:', enrollmentData);
    
    if (!enrollmentData.courseIds || enrollmentData.courseIds.length === 0) {
      console.log('📚 No enrolled courses found');
      return [];
    }

    console.log(`📚 Found ${enrollmentData.courseIds.length} enrolled courses, fetching details...`);
    
    // Then fetch full course details for each enrolled course
    const coursePromises = enrollmentData.courseIds.map(courseId =>
      this.request<Course>(`/courses/${courseId}`)
    );

    const courses = await Promise.all(coursePromises);
    console.log('📚 Courses loaded:', courses.length);
    return courses;
  }

  /**
   * Get a specific enrolled course with modules and lessons
   */
  async getEnrolledCourseById(courseId: string): Promise<Course> {
    return this.request<Course>(`/courses/${courseId}`);
  }
}

export const enrollmentApi = new EnrollmentApiClient(API_BASE_URL);
