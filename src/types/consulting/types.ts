import { ReactNode } from 'react';

export interface ConsultingService {
  icon: ReactNode;
  title: string;
  body: string;
}

export interface ConsultingData {
  services: ConsultingService[];
}