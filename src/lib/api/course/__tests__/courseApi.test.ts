import { courseApi } from '../courseApi';
import { Course } from '@/types/course/types';

// Mock fetch globally
global.fetch = jest.fn();

describe('CourseApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPublishedCourses', () => {
    it('should handle non-paginated response (plain array)', async () => {
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Test Course 1',
          description: 'Description 1',
          category: 'Data Science',
          status: 'PUBLISHED',
          price: 99.99,
          features: ['Feature 1'],
          modules: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Test Course 2',
          description: 'Description 2',
          category: 'Data Engineering',
          status: 'PUBLISHED',
          price: 149.99,
          features: ['Feature 2'],
          modules: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock backend response for non-paginated request
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          status_code: 200,
          message: 'Published courses retrieved successfully',
          data: mockCourses, // Plain array
        }),
      });

      const result = await courseApi.getPublishedCourses();

      expect(result).toEqual(mockCourses);
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Test Course 1');
    });

    it('should handle paginated response', async () => {
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Test Course 1',
          description: 'Description 1',
          category: 'Data Science',
          status: 'PUBLISHED',
          price: 99.99,
          features: ['Feature 1'],
          modules: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock backend response for paginated request
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          status_code: 200,
          message: 'Published courses retrieved successfully',
          data: {
            data: mockCourses,
            pagination: {
              page: 1,
              limit: 10,
              total: 1,
              totalPages: 1,
              hasNext: false,
              hasPrev: false,
            },
          },
        }),
      });

      const result = await courseApi.getPublishedCourses();

      expect(result).toEqual(mockCourses);
      expect(result).toHaveLength(1);
    });

    it('should handle API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          status_code: 500,
          message: 'Internal server error',
        }),
      });

      await expect(courseApi.getPublishedCourses()).rejects.toThrow('HTTP error! status: 500');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(courseApi.getPublishedCourses()).rejects.toThrow('Network error');
    });
  });

  describe('getCourseById', () => {
    it('should fetch a single course by ID', async () => {
      const mockCourse: Course = {
        id: '1',
        title: 'Test Course',
        description: 'Description',
        category: 'Data Science',
        status: 'PUBLISHED',
        price: 99.99,
        features: ['Feature 1'],
        modules: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          status_code: 200,
          message: 'Course retrieved successfully',
          data: mockCourse,
        }),
      });

      const result = await courseApi.getCourseById('1');

      expect(result).toEqual(mockCourse);
      expect(result.id).toBe('1');
    });
  });
});
