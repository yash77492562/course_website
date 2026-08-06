import React from 'react';
import { 
  CircleStackIcon, 
  ChartBarSquareIcon, 
  CpuChipIcon, 
  CloudIcon 
} from '@heroicons/react/24/outline';
import { ConsultingService } from '@/types/consulting/types';

export const consultingData: ConsultingService[] = [
  {
    icon: <CircleStackIcon className="w-full h-full text-primary" />,
    title: "Data Pipelines",
    body: "End-to-end pipeline design, build, and optimisation. From ingestion to transformation to delivery — reliable, scalable, and observable."
  },
  {
    icon: <ChartBarSquareIcon className="w-full h-full text-primary" />,
    title: "BI & Reporting",
    body: "Unified reporting layers and interactive dashboards that give leadership real-time visibility across the entire organisation."
  },
  {
    icon: <CpuChipIcon className="w-full h-full text-primary" />,
    title: "AI & Advanced Analytics",
    body: "Predictive models, NLP solutions, and AI-powered decision tools tailored to your specific business context and data assets."
  },
  {
    icon: <CloudIcon className="w-full h-full text-primary" />,
    title: "Cloud Data Architecture",
    body: "Modern cloud-native data platforms on AWS, Azure, or GCP. Architected for performance, governance, and cost efficiency."
  }
];
