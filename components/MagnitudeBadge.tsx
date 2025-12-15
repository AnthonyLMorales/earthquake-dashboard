import { getMagnitudeColor } from '@/utils/getMagnitudeColor';

interface MagnitudeBadgeProps {
  magnitude: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function MagnitudeBadge({ magnitude, size = 'md' }: MagnitudeBadgeProps) {
  const colors = getMagnitudeColor(magnitude);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const shouldPulse = magnitude >= 7.0;

  return (
    <span
      className={`
        bg-gradient-to-br ${colors.gradient}
        ${colors.text}
        ${sizeClasses[size]}
        rounded-full
        font-bold
        shadow-md
        inline-flex items-center justify-center
        ${shouldPulse ? 'animate-pulse' : ''}
      `}
    >
      M {magnitude.toFixed(1)}
    </span>
  );
}
