export function UsuarioLista({ usuarios }) {
  if (!usuarios.length) {
    return <p className="empty-hint">Nenhum usuário cadastrado.</p>;
  }

  return (
    <div className="list-cards">
      {usuarios.map((u) => (
        <article key={u.id} className="list-card">
          <div className="list-card__top">
            <div>
              <h3 className="list-card__title">{u.nome}</h3>
              <p className="list-card__meta">{u.email}</p>
            </div>
            <span className={`badge ${u.admin ? 'badge--ok' : 'badge--no'}`}>
              {u.admin ? 'Admin' : 'Aluno'}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}