import { useState, useEffect } from 'react';
import { getToken } from '../services/api';

const decodeToken = (token: string): { exp: number } | null => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const WARNING_THRESHOLD = 5 * 60 * 1000;

export const SessionCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const decoded = decodeToken(token);
    if (!decoded?.exp) return;

    const update = () => {
      const remaining = decoded.exp * 1000 - Date.now();
      setTimeLeft(remaining > 0 ? remaining : 0);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (timeLeft === null || timeLeft > WARNING_THRESHOLD) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#f59e0b', color: 'white',
      padding: '10px 24px', textAlign: 'center',
      fontSize: '14px', fontWeight: 600, zIndex: 9998,
    }}>
      Your session will expire in {minutes}m {seconds}s — save your work.
    </div>
  );
};
