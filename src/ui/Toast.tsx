import { useEffect, useState } from 'react';

let trigger: ((msg: string) => void) | null = null;

export function NeonToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    trigger = (msg: string) => {
      setMessage(msg);
      setTimeout(() => setMessage(null), 3000);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 bg-neon-magenta px-4 py-2 text-black">
      {message}
    </div>
  );
}

export function showToast(msg: string) {
  trigger?.(msg);
}
