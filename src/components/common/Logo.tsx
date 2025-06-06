import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showText?: boolean;
}

export function Logo({ size = 'medium', className = '', showText = true }: LogoProps) {
  const textSizeClass = size === 'small' ? 'text-lg' : size === 'medium' ? 'text-2xl' : 'text-3xl';
  const iconSize = size === 'small' ? 20 : size === 'medium' ? 28 : 36;

  return (
    <Link href="/dashboard" className={`flex items-center gap-2 ${className}`}>
      <GraduationCap className="text-primary" size={iconSize} />
      {showText && <span className={`font-headline font-bold text-primary ${textSizeClass}`}>LearnSmart</span>}
    </Link>
  );
}
