export function MultaLista({ multas, isAdmin, onMarcarPago }) {
  if (!multas.length) {
    return <p className="empty-hint">Nenhuma multa registrada.</p>;
  }

  return (
    <div className="list-cards">
      {multas.map((m) => {
        const usuario =
          m.emprestimo?.usuario?.nome ?? m.Emprestimo?.Usuario?.nome ?? '—';
        const livro =
          m.emprestimo?.livro?.titulo ?? m.Emprestimo?.Livro?.titulo ?? '—';
        return (
          <article key={m.id} className="list-card">
            <div className="list-card__top">
              <div>
                <h3 className="list-card__title">R$ {Number(m.valor).toFixed(2)}</h3>
                <p className="list-card__meta">
                  {livro} · {usuario}
                </p>
              </div>
              <span className={`badge ${m.pago ? 'badge--ok' : 'badge--no'}`}>
                {m.pago ? 'Pago' : 'Pendente'}
              </span>
            </div>
            {isAdmin && !m.pago && (
              <div className="list-card__actions">
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => onMarcarPago(m.id)}
                >
                  Marcar como pago
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
