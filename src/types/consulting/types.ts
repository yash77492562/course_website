export interface ConsultingService {
  icon: string;
  title: string;
  body: string;
}

export interface ConsultingData {
  services: ConsultingService[];
}