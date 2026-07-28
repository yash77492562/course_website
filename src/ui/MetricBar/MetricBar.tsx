'use client';

import { WhyMetric } from '@/types/why/types';

interface MetricBarProps {
  metric: WhyMetric;
}

export function MetricBar({ metric }: MetricBarProps) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="text-[0.8rem] text-foreground/55 min-w-[120px]">
        {metric.name}
      </span>
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full origin-left [animation:growBar_1.2s_ease_forwards]"
          style={{ width: `${metric.value}%` }}
        />
      </div>
      <span className="font-sans text-[0.9rem] font-bold text-foreground min-w-[38px] text-right">
        {metric.display}
      </span>
    </div>
  );
}