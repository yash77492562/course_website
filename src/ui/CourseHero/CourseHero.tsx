'use client';

import { Button } from '@/ui/Button/Button';
import { Badge } from '@/ui/Badge/Badge';
import type { CourseHeroProps } from './CourseHero.types';

export function CourseHero({
  title,
  description,
  category,
  price,
  originalPrice,
  spotsLeft,
  nextCohort,
  features,
  onEnroll,
  onTalkToUs,
  className = ''
}: CourseHeroProps) {
  return (
    <section className={`bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <Badge variant="secondary" className="mb-4">
              {category}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {title}
            </h1>
            
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              {description}
            </p>

            {/* Course Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-sm text-blue-200 uppercase tracking-wide">Spots Left</div>
                <div className="text-2xl font-bold">{spotsLeft}</div>
              </div>
              <div>
                <div className="text-sm text-blue-200 uppercase tracking-wide">Next Cohort</div>
                <div className="text-2xl font-bold">{nextCohort}</div>
              </div>
              <div>
                <div className="text-sm text-blue-200 uppercase tracking-wide">Price</div>
                <div className="text-2xl font-bold">£{price}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="primary" 
                size="lg"
                onClick={onEnroll}
                className="flex-1 sm:flex-none"
              >
                Pay Now
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                onClick={onTalkToUs}
                className="flex-1 sm:flex-none"
              >
                Talk to us first
              </Button>
            </div>

            <p className="text-sm text-blue-200 mt-4">
              Secure checkout • Seat reserved after payment • Limited cohort size
            </p>
          </div>

          {/* Right Content - Pricing Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-6">
              <div className="text-sm text-blue-200 uppercase tracking-wide mb-2">
                Reserve Your Seat
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl font-bold">£{price}</span>
                {originalPrice && (
                  <span className="text-xl text-blue-200 line-through">£{originalPrice}</span>
                )}
              </div>
              <p className="text-blue-100 mt-2">Seats are limited to keep mentoring quality high</p>
            </div>

            <Button 
              variant="primary" 
              size="lg" 
              onClick={onEnroll}
              className="w-full mb-6"
            >
              Pay Now
            </Button>

            {/* Features List */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-blue-100">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}