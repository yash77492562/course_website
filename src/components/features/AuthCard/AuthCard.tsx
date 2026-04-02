'use client';

import { Card } from '@/ui/Card/Card';
import { cn } from '@/lib/utils/utils';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, title, subtitle, className }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className={cn('max-w-md w-full', className)}>
        <div className="text-center mb-8">
          <h2 className="font-syne text-3xl font-bold text-slate-900 mb-2">
            {title}
          </h2>
          {subtitle && (
            <div className="text-sm text-slate-600">
              {subtitle}
            </div>
          )}
        </div>

        <Card className="shadow-lg">
          {children}
        </Card>
      </div>
    </div>
  );
}
