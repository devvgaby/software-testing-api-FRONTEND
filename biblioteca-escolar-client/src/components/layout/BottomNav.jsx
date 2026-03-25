import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
      />
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        d="M5 4h11a3 3 0 0 1 3 3v13H8a2 2 0 0 0-2 2V4Z"
      />
      <path fill="none" stroke="currentColor" strokeWidth="1.75" d="M5 4v15h14" />
    </svg>
  );
}

function IconSwap() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M7 7h13M7 7l3-3M7 7l3 3M17 17H4M17 17l-3 3m3-3-3-3"
      />
    </svg>
  );
}

function IconCoin() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M12 8v8M9.5 10h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3H14"
      />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm11 10v-2a4 4 0 0 0-3-3.87M21 13a4 4 0 0 0-7.75-1"
      />
    </svg>
  );
}

const itemsAluno = [
  { to: '/', label: 'Início', Icon: IconHome, end: true },
  { to: '/livros', label: 'Livros', Icon: IconBook },
  { to: '/emprestimos', label: 'Empréstimos', Icon: IconSwap },
  { to: '/multas', label: 'Multas', Icon: IconCoin },
];

const itemsAdmin = [
  ...itemsAluno,
  { to: '/usuarios', label: 'Equipe', Icon: IconUsers },
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