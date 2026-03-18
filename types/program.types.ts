export interface Program {
  icon: string;
  title: string;
  body: string;
  tags: string[];
  ctaText: string;
  ctaHref: string;
}

export interface ProgramDetail {
  badge: string;
  headline: string;
  subheadline: string;
  price: string;
  spotsLeft: number;
  nextCohort: string;
  checkoutUrl: string;
  highlights: string[];
  outcomes: string[];
  modules: ProgramModule[];
  faqs: FAQ[];
}

export interface ProgramModule {
  title: string;
  items: string[];
}

export interface FAQ {
  q: string;
  a: string;
}