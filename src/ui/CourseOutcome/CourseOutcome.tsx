'use client';

import { Section } from '@/ui/Section/Section';
import { SectionLabel } from '@/ui/SectionLabel/SectionLabel';
import type { CourseOutcomeProps } from './CourseOutcome.types';

export function CourseOutcome({
  title = "What you'll be able to do",
  outcomes,
  className = ''
}: CourseOutcomeProps) {
  return (
    <Section className={className}>
      <div className="max-w-4xl">
        <SectionLabel>Program Outcome</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          {title}
        </h2>
        
        <div className="space-y-4">
          {outcomes.map((outcome, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {outcome}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}