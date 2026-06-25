import { useState, useEffect } from 'react';
import { setSessionExpiredHandler } from '../services/api';

export const SessionExpiredNotification = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setSessionExpiredHandler((msg) => {
      setMessage(msg);
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    });
  }, []);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      background: '#dc2626', color: 'white',
      padding: '16px 24px', textAlign: 'center',
      fontSize: '16px', fontWeight: 600, zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      {message}
      <div style={{ fontSize: '13px', marginTop: '4px', opacity: 0.9 }}>
        Redirecting to login...
      </div>
    </div>
  );
};
