'use client';

import React from 'react';

export type Theme = 'dark' | 'light';

function subscribe(callback: () => void) {
  // Listen to class attribute changes on <html>
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  // Listen to localStorage changes across tabs/windows
  window.addEventListener('storage', callback);

  return () => {
    observer.disconnect();
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot(): Theme {
  // Check localStorage first if available, fallback to DOM class
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }
  }
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getServerSnapshot(): Theme {
  return 'light';
}

export function useTheme() {
  const theme = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Sync initial theme to DOM on mount if mismatched
  React.useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme) {
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }
  }, []);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    // Save to local storage immediately
    localStorage.setItem('theme', nextTheme);

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    if (!document.startViewTransition) {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      return;
    }

    const transition = document.startViewTransition(() => {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    });

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

      document.documentElement.animate(
        {
          clipPath: nextTheme === 'dark' ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 500,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement:
            nextTheme === 'dark' ? '::view-transition-new(root)' : '::view-transition-old(root)',
        },
      );
    });
  };

  return { theme, toggleTheme };
}
