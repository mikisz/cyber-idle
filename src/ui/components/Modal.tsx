import type { ReactNode } from 'react';
import ButtonNeon from './ButtonNeon';

interface Props {
  open: boolean;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  onClose: () => void;
}

export default function Modal({ open, title, children, actions, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70">
      <div className="card neon-border bg-surface p-4 text-center">
        {title && <h2 className="mb-2 neon-text font-bold">{title}</h2>}
        <div className="mb-4">{children}</div>
        {actions ? (
          <div className="flex justify-center gap-2">{actions}</div>
        ) : (
          <ButtonNeon onClick={onClose}>Close</ButtonNeon>
        )}
      </div>
    </div>
  );
}

