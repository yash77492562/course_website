export interface CourseHeroProps {
  title: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  spotsLeft: number;
  nextCohort: string;
  features: string[];
  onEnroll?: () => void;
  onTalkToUs?: () => void;
  className?: string;
}