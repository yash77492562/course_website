'use client';

import { usePayNow } from './CourseAccessControl';

interface PayNowButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function PayNowButton({ className, children = 'Pay Now' }: PayNowButtonProps) {
  const { handlePayNow, hasPurchased } = usePayNow();

  // Don't show button if already purchased
  if (hasPurchased) {
    return null;
  }

  return (
    <button
      onClick={handlePayNow}
      type="button"
      className={className || "inline-flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-sm text-foreground py-3.5 px-[30px] rounded-lg font-medium text-[0.95rem] transition-all duration-200 shadow-[0_4px_24px_rgba(14,165,233,0.35)] hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(14,165,233,0.45)] border-none cursor-pointer"}
    >
      {children}
    </button>
  );
}
