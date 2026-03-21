'use client';

import { UsersIcon, BookOpenIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { CourseCardProps } from '@/types/course/types';

export function CourseCard({ course, onEnroll, onViewDetails, className = '' }: CourseCardProps) {
  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEnroll?.(course.id);
  };

  const handleCardClick = () => {
    window.location.href = `/courses/${course.id}`;
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* Course Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            {course.level}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {course.category}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Title and Description */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Instructor */}
        <p className="text-sm text-gray-500 mb-4">
          by <span className="font-medium text-gray-700">{course.instructor}</span>
        </p>

        {/* Course Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <UsersIcon className="w-4 h-4" />
            <span>{course.studentsCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpenIcon className="w-4 h-4" />
            <span>{course.modules.length} modules</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {course.features.slice(0, 3).map((feature, index) => (
              <span 
                key={index}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
              >
                {feature}
              </span>
            ))}
            {course.features.length > 3 && (
              <span className="text-xs text-gray-500">
                +{course.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Price and Enroll Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              £{course.price}
            </span>
            {course.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                £{course.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={handleEnrollClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}