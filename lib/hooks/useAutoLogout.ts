import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseAutoLogoutOptions {
  /** timeout en ms (défaut: 5min = 300000ms) */
  timeout?: number;
  /** route de redirect après logout */
  logoutUrl?: string;
  /** clé storage pour le last activity (optionnel) */
  storageKey?: string;
}

export function useAutoLogout({
  timeout = 5 * 60 * 1000, // 5 min par défaut
  logoutUrl = '/login',
  storageKey = 'lastActivity',
}: UseAutoLogoutOptions = {}) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem(storageKey);
    router.push(logoutUrl);
  }, [logoutUrl, router, storageKey]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    localStorage.setItem(storageKey, Date.now().toString());
    timeoutRef.current = setTimeout(logout, timeout);
  }, [logout, timeout, storageKey]);

  useEffect(() => {
    // events qui reset le timer
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      // ignore si pas de token
      if (!localStorage.getItem('authToken') && !sessionStorage.getItem('authToken')) {
        return;
      }
      resetTimer();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // init timer au mount
    resetTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer]);

  return { logout, resetTimer };
}