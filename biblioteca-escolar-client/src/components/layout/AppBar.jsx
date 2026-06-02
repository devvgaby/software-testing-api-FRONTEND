import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut } from 'lucide-react';

const TITLES = [
  { match: /^\/$/, title: 'Início' },
  { match: /^\/livros\/?$/, title: 'Livros' },
  { match: /^\/emprestimos\/?$/, title: 'Empréstimos' },
  { match: /^\/multas\/?$/, title: 'Multas' },
  { match: /^\/usuarios\/?$/, title: 'Equipe' },
];

export function AppBar() {
  const { pathname } = useLocation();
  const { usuario, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const title = useMemo(() => {
    const found = TITLES.find((t) => t.match.test(pathname));
    return found?.title ?? 'Biblioteca';
  }, [pathname]);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="app-bar" role="banner">
      <div className="app-bar__inner">
        <h1 className="app-bar__title"></h1>
        <div className="app-bar__actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Alternar tema"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button
            type="button"
            className="app-bar__logout app-bar__logout--danger"
            onClick={handleLogout}
            aria-label="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
