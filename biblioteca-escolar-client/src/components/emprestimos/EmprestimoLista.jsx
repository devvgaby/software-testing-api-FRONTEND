function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function EmprestimoLista({ emprestimos, isAdmin, onDevolucao }) {
  if (!emprestimos.length) {
    return <p className="empty-hint">Nenhum empréstimo registrado.</p>;
  }

  return (
    <div className="list-cards">
      {emprestimos.map((e) => {
        const ativo = !e.data_devolucao_real;
        return (
          <article key={e.id} className="list-card">
            <div className="list-card__top">
              <div>
                <h3 className="list-card__title">{e.Livro?.titulo ?? `Livro #${e.livro_id}`}</h3>
                <p className="list-card__meta">{e.Usuario?.nome ?? `Usuário #${e.usuario_id}`}</p>
              </div>
              <span className={`badge ${ativo ? 'badge--ok' : 'badge--aluno'}`}>
                {ativo ? 'Ativo' : 'Devolvido'}
              </span>
            </div>
            <div className="list-card__row">
              <span>
                <strong>Retirada</strong> {fmt(e.data_emprestimo)}
              </span>
              <span>
                <strong>Prevista</strong> {fmt(e.data_devolucao_prevista)}
              </span>
            </div>
            {!ativo && <p className="list-card__foot">Devolvido em {fmt(e.data_devolucao_real)}</p>}
            {isAdmin && ativo && (
              <div className="list-card__actions">
                <button
                  type="button"
                  className="btn btn--success btn--sm"
                  onClick={() => onDevolucao(e.id)}
                >
                  Registrar devolução
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
