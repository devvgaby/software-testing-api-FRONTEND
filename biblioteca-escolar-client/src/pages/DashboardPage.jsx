import { useEffect, useState } from 'react';
import * as dashboardService from '../services/dashboardService';

export function DashboardPage() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await dashboardService.fetchResumo();
        if (!cancel) setDados(r);
      } catch (e) {
        if (!cancel) setErro(e.response?.data?.erro || e.message);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <div className="stack">
      <div className="page-intro">
        <h2>Resumo</h2>
        <p>Totagens do sistema na palma da mão</p>
      </div>
      {erro && (
        <p className="alert alert--error" role="alert">
          {erro}
        </p>
      )}
      {dados && (
        <div className="stat-row">
          <div className="stat-pill">
            <p className="stat-pill__label">Livros</p>
            <p className="stat-pill__value">{dados.totalLivros}</p>
          </div>
          <div className="stat-pill">
            <p className="stat-pill__label">Empréstimos ativos</p>
            <p className="stat-pill__value">{dados.emprestimosAtivos}</p>
          </div>
          <div className="stat-pill stat-pill--full">
            <p className="stat-pill__label">Multas pendentes</p>
            <p className="stat-pill__value">{dados.multasPendentes}</p>
          </div>
        </div>
      )}
    </div>
  );
}