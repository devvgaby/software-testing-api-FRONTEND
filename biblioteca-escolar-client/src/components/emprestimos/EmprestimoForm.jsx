export function EmprestimoForm({ livros, usuarios, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    onSubmit({
      livro_id: Number(fd.get('livro_id')),
      usuario_id: Number(fd.get('usuario_id')),
    });
    e.target.reset();
  };

  const livrosDisponiveis = livros.filter((l) => (l.disponivel ?? 0) > 0);
  const formId = 'emprestimo-novo';

  return (
    <div className="card card--form">
      <h3 className="card__title">Novo empréstimo</h3>
      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor={`${formId}-livro`}>Livro disponível</label>
          <select id={`${formId}-livro`} name="livro_id" required>
            <option value="">Selecione</option>
            {livrosDisponiveis.map((l) => (
              <option key={l.id} value={l.id}>
                {l.titulo} · {l.disponivel} disp.
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor={`${formId}-user`}>Quem retira</label>
          <select id={`${formId}-user`} name="usuario_id" required>
            <option value="">Selecione</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome} ({u.email})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn--primary btn--block">
          Registrar empréstimo
        </button>
      </form>
    </div>
  );
}
