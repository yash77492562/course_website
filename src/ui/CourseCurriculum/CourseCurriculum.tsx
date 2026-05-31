'use client';

import { useState } from 'react';
import { Section } from '@/ui/Section/Section';
import { SectionLabel } from '@/ui/SectionLabel/SectionLabel';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { CourseCurriculumProps } from './CourseCurriculum.types';

export function CourseCurriculum({
  title = "Modules & projects",
  modules,
  className = ''
}: CourseCurriculumProps) {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  const toggleModule = (index: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedModules(newExpanded);
  };

  return (
    <Section className={className}>
      <div className="max-w-4xl">
        <SectionLabel>Curriculum</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          {title}
        </h2>
        
        <div className="space-y-4">
          {modules.map((module, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleModule(index)}
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {module.title}
                    </h3>
                    {module.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {module.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {module.duration && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {module.duration}
                    </span>
                  )}
                  {expandedModules.has(index) ? (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {expandedModules.has(index) && module.lessons && (
                <div className="px-6 pb-4 bg-gray-50">
                  <div className="space-y-3 pt-4">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {lesson.title}
                          </h4>
                          {lesson.description && (
                            <p className="text-gray-600 text-sm mt-1">
                              {lesson.description}
                            </p>
                          )}
                          {lesson.duration && (
                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded mt-2 inline-block">
                              {lesson.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}