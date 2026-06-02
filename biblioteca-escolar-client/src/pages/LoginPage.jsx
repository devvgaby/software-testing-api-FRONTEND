import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      await login(email, senha);
      navigate(from, { replace: true });
    } catch (err) {
      setErro(err.response?.data?.erro || err.message || 'Falha no login');
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1>Biblioteca</h1>
        <p className="auth-lead">Entre com seu e-mail e senha</p>
        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              inputMode="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="login-senha">Senha</label>
            <div className="password-wrapper">
              <input
                id="login-senha"
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Ver senha'}
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {erro && (
            <p className="alert alert--error" role="alert">
              {erro}
            </p>
          )}
          <button type="submit" className="btn btn--primary btn--block">
            Entrar
          </button>
        </form>
        <p className="auth-footer">
          Novo por aqui? <Link to="/cadastro">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}
