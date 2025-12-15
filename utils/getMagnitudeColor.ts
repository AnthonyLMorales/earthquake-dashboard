export interface MagnitudeColorScheme {
  gradient: string;
  text: string;
  ring: string;
}

export function getMagnitudeColor(magnitude: number): MagnitudeColorScheme {
  if (magnitude < 3.0) {
    return {
      gradient: 'from-emerald-400 to-green-500',
      text: 'text-white',
      ring: 'ring-green-500/50'
    };
  }
  if (magnitude < 5.0) {
    return {
      gradient: 'from-yellow-400 to-amber-500',
      text: 'text-amber-900',
      ring: 'ring-amber-500/50'
    };
  }
  if (magnitude < 7.0) {
    return {
      gradient: 'from-orange-400 to-orange-600',
      text: 'text-white',
      ring: 'ring-orange-500/50'
    };
  }
  return {
    gradient: 'from-red-500 to-red-700',
    text: 'text-white',
    ring: 'ring-red-500/50'
  };
}
