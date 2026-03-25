import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

  const title = useMemo(() => {
    const found = TITLES.find((t) => t.match.test(pathname));
    return found?.title ?? 'Biblioteca';
  }, [pathname]);

  return (
    <header className="app-bar" role="banner">
      <div className="app-bar__inner">
        <h1 className="app-bar__title">{title}</h1>
        <div className="app-bar__actions">
          <span className="app-bar__user" title={usuario?.email}>
            {usuario?.nome?.split?.(' ')?.[0] ?? '—'}
          </span>
          <button type="button" className="app-bar__logout" onClick={logout} aria-label="Sair">
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}