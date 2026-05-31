export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline-dark';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

export interface IconProps {
  className?: string;
  size?: number;
}