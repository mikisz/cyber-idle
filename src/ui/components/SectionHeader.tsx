import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function SectionHeader({ children, className = '' }: Props) {
  return (
    <h2 className={`mb-2 border-b border-neon-cyan pb-1 font-bold ${className}`}>
      {children}
    </h2>
  );
}

