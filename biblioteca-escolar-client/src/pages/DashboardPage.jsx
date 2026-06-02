import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as livroService from '../services/livroService';
import * as emprestimoService from '../services/emprestimoService';
import * as multaService from '../services/multaService';
import { useAuth } from '../context/AuthContext';
import { Book, Handshake, Scale, Library, FileText, Users, CreditCard } from 'lucide-react';

export function DashboardPage() {
  const { usuario } = useAuth();
  const [dados, setDados] = useState({
    totalLivros: 0,
    emprestimosAtivos: 0,
    multasPendentes: 0,
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setCarregando(true);

        const [livros, emprestimos, multas] = await Promise.all([
          livroService.listarLivros(),
          emprestimoService.listarEmprestimos(),
          multaService.listarMultas(),
        ]);

        if (!cancel) {
          setDados({
            totalLivros: livros?.length || 0,
            emprestimosAtivos: emprestimos?.filter(e => e.status === 'ativo' || !e.data_devolucao).length || 0,
            multasPendentes: multas?.filter(m => m.status === 'pendente' || !m.paga).length || 0,
          });
        }
      } catch (e) {
        if (!cancel) setErro(e.response?.data?.erro || e.message);
      } finally {
        if (!cancel) setCarregando(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <div className="stack">
      <header className="welcome-hero" style={{ marginTop: '2.5rem' }}>
        <h1>Olá, {usuario?.nome || 'Bibliotecário'}!</h1>
        <p>Bem-vindo ao painel de controle da sua biblioteca.</p>
      </header>

      {erro && (
        <p className="alert alert--error" role="alert">
          {erro}
        </p>
      )}

      <div className="section-title" style={{ marginTop: '0.5rem' }}>
        <h3
          style={{
            margin: 0,
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 700,
          }}
        >
          Resumo Geral
        </h3>
      </div>

      <div className="stat-row">
        <div className="stat-pill stat-pill--brand">
          <Book className="stat-pill__icon" size={24} color="var(--brand)" />
          <p className="stat-pill__label">Acervo de Livros</p>
          <p className="stat-pill__value">{carregando ? '...' : dados.totalLivros}</p>
        </div>
        <div className="stat-pill stat-pill--success">
          <Handshake className="stat-pill__icon" size={24} color="var(--success)" />
          <p className="stat-pill__label">Empréstimos Ativos</p>
          <p className="stat-pill__value">{carregando ? '...' : dados.emprestimosAtivos}</p>
        </div>
        <div className="stat-pill stat-pill--warning stat-pill--full">
          <Scale className="stat-pill__icon" size={24} color="var(--warning)" />
          <p className="stat-pill__label">Multas Pendentes</p>
          <p className="stat-pill__value">{carregando ? '...' : dados.multasPendentes}</p>
        </div>
      </div>
    </div>
  );
}