interface Props {
  percentage: number;
  color?: 'cyan' | 'magenta' | 'yellow';
  className?: string;
}

export default function ProgressBarNeon({
  percentage,
  color = 'cyan',
  className = '',
}: Props) {
  const colorClass =
    color === 'magenta'
      ? 'bg-neon-magenta'
      : color === 'yellow'
      ? 'bg-neon-yellow'
      : 'bg-neon-cyan';
  return (
    <div className={`neon-border h-2 w-full ${className}`}>
      <div className={`${colorClass} h-full`} style={{ width: `${percentage}%` }} />
    </div>
  );
}

