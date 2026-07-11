import { logger } from '@/lib/utils/logger';
import { Course } from '@/types/course/types';
import { tokenManager } from '@/lib/utils/tokenManager/tokenManager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

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
      logger.debug('🔵 Enrollment API Request:', url);
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
        cache: 'no-store',
      });
      
      logger.debug('🔵 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        logger.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();
      logger.debug('🔵 API Response:', result);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data as T;
    } catch (error) {
      logger.error('❌ API request failed:', error);
      throw error;
    }
  }

  /**
   * Get all courses the user is enrolled in.
   *
   * Was an N+1: it fetched the enrolled ids, then fired one GET /courses/:id
   * per course. Now it makes ONE batch call (POST /courses/batch) — O(1)
   * requests regardless of how many courses the user is enrolled in.
   */
  async getEnrolledCourses(): Promise<Course[]> {
    // First get the enrolled course IDs.
    const enrollmentData = await this.request<EnrolledCoursesResponse>('/courses/access/user/purchased');

    if (!enrollmentData.courseIds || enrollmentData.courseIds.length === 0) {
      return [];
    }

    // Then fetch all course details in a single batch request.
    const url = `${this.baseURL}/courses/batch`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      cache: 'no-store',
      body: JSON.stringify({ ids: enrollmentData.courseIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch enrolled courses: ${response.status}`);
    }

    const result: ApiResponse<Course[]> = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data ?? [];
  }

  /**
   * Get a specific enrolled course with modules and lessons
   */
  async getEnrolledCourseById(courseId: string): Promise<Course> {
    return this.request<Course>(`/courses/${courseId}`);
  }
}

export const enrollmentApi = new EnrollmentApiClient(API_BASE_URL);
