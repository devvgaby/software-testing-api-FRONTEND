import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Library, FileText, CreditCard, Users } from 'lucide-react';

const itemsAluno = [
  { to: '/livros', label: 'Livros', Icon: Library },
  { to: '/emprestimos', label: 'Empréstimos', Icon: FileText },
  { to: '/', label: 'Início', Icon: Home, end: true },
  { to: '/multas', label: 'Multas', Icon: CreditCard },
];

const itemsAdmin = [
  ...itemsAluno,
  { to: '/usuarios', label: 'Equipe', Icon: Users },
];

export function BottomNav() {
  const { isAdmin } = useAuth();
  const items = isAdmin ? itemsAdmin : itemsAluno;

  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      <div className="bottom-nav__inner">
        {items.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`
            }
          >
            <span className="bottom-nav__icon">
              <Icon />
            </span>
            <span className="bottom-nav__label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
