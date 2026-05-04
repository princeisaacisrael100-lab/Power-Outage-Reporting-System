import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 hover:from-violet-200 hover:to-purple-200 dark:hover:from-violet-900/50 dark:hover:to-purple-900/50 flex items-center justify-center transition-all hover:scale-105 border border-violet-200 dark:border-violet-700/50"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-violet-600 dark:text-violet-300" />
      ) : (
        <Moon className="w-5 h-5 text-violet-600" />
      )}
    </button>
  );
}
