export interface Program {
  icon: string;
  title: string;
  body: string;
  tags: string[];
  ctaText: string;
  ctaHref: string;
}

export interface ProgramCardProps {
  program: Program;
}

export interface ProgramsSectionProps {
  programs: Program[];
}