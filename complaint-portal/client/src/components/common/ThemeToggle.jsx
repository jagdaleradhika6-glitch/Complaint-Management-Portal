import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ThemeToggle = () => {
  const { theme, setTheme } = useAuth();
  return (
    <button
      className="btn-secondary flex items-center gap-2"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      type="button"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
};

export default ThemeToggle;
