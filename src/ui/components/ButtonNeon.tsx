import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'danger' | 'success' | 'neutral';
}

const variants = {
  danger: 'border-neon-magenta text-neon-magenta hover:shadow-[0_0_6px_#ff00ff]',
  success: 'border-neon-yellow text-neon-yellow hover:shadow-[0_0_6px_#ffff00]',
  neutral: 'border-neon-cyan text-neon-cyan hover:shadow-[0_0_6px_#00ffff]',
} as const;

export default function ButtonNeon({
  variant = 'neutral',
  className = '',
  ...rest
}: Props) {
  return (
    <button
      className={`btn-neon ${variants[variant]} ${className}`}
      {...rest}
    />
  );
}

