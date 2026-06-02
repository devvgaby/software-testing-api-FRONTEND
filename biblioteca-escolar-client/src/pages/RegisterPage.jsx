import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('aluno');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setOk('');
    try {
      await register(nome, email, senha, tipo);
      setOk('Conta criada. Indo para o login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setErro(err.response?.data?.erro || err.message || 'Falha no cadastro');
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1>Cadastro</h1>
        <p className="auth-lead">Crie sua conta de aluno</p>
        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="reg-nome">Nome</label>
            <input
              id="reg-nome"
              autoComplete="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="reg-email">E-mail</label>
            <input
              id="reg-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="reg-tipo">Tipo de Perfil</label>
            <select
              id="reg-tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            >
              <option value="aluno">Aluno</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="reg-senha">Senha</label>
            <div className="password-wrapper">
              <input
                id="reg-senha"
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="new-password"
                minLength={4}
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
          {ok && (
            <p className="alert alert--success" role="status">
              {ok}
            </p>
          )}
          <button type="submit" className="btn btn--primary btn--block">
            Cadastrar
          </button>
        </form>
        <p className="auth-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
