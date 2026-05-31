export interface WhyReason {
  icon: string;
  title: string;
  description: string;
}

export interface WhyMetric {
  name: string;
  value: number;
  display: string;
}

export interface WhyData {
  reasons: WhyReason[];
  metrics: WhyMetric[];
}