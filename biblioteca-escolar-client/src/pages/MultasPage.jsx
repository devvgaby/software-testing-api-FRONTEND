import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import * as multaService from "../services/multaService";
import * as emprestimoService from "../services/emprestimoService";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

export function MultasPage() {
  const { isAdmin } = useAuth();
  const [multas, setMultas] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [confirmacao, setConfirmacao] = useState(null);

  // Paginação
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const [m, e] = await Promise.all([
        multaService.listarMultas(),
        isAdmin ? emprestimoService.listarEmprestimos() : Promise.resolve([]),
      ]);
      setMultas(Array.isArray(m) ? m : m ? [m] : []);
      setEmprestimos(e);
    } catch (e) {
      setErro("Erro ao carregar dados de multas.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const totalPaginas = Math.ceil(multas.length / porPagina);
  const atual = multas.slice((pagina - 1) * porPagina, pagina * porPagina);

  const mudarPagina = (onde) => {
    if (onde === "prox" && pagina < totalPaginas) setPagina((p) => p + 1);
    if (onde === "ant" && pagina > 1) setPagina((p) => p - 1);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    // Payload contendo estritamente as propriedades do seu backend
    const payload = {
      emprestimo_id: Number(fd.get("emprestimo_id")),
      valor: parseFloat(fd.get("valor")),
      pago: fd.get("pago") === "on" ? true : false,
    };

    setErro("");
    setMsg("");
    setSalvando(true);
    try {
      if (editando) {
        await multaService.atualizarMulta(editando.id, payload);
        setMsg("Multa atualizada.");
      } else {
        await multaService.criarMulta(payload);
        setMsg("Nova multa aplicada.");
      }
      setModalAberto(false);
      setEditando(null);
      carregar();
    } catch (err) {
      setErro("Falha ao salvar multa.");
    } finally {
      setSalvando(false);
    }
  };

  const handleRemover = (id) => {
    setConfirmacao({
      msg: "Remover permanentemente este registro de multa?",
      tipo: "danger",
      icon: <Trash2 size={32} />,
      action: async () => {
        try {
          await multaService.deletarMulta(id);
          setMsg("Multa removida.");
          carregar();
        } catch {
          setErro("Erro ao excluir multa.");
        } finally {
          setConfirmacao(null);
        }
      },
    });
  };

  const abrirModalEditar = (m) => {
    setEditando(m);
    setModalAberto(true);
  };

  return (
    <div className="stack">
      <div className="page-intro">
        <h2>Gestão de Multas</h2>
        <p>Valores pendentes e histórico de quitação</p>
      </div>

      {erro && (
        <div
          className="alert alert--error"
          style={{ display: "flex", gap: "8px", alignItems: "center" }}
        >
          <AlertCircle size={18} />
          <span style={{ flex: 1 }}>{erro}</span>
          <button onClick={() => setErro("")} className="btn-icon">
            <X size={16} />
          </button>
        </div>
      )}

      {msg && (
        <div
          className="alert alert--success"
          style={{ display: "flex", gap: "8px", alignItems: "center" }}
        >
          <CheckCircle size={18} />
          <span style={{ flex: 1 }}>{msg}</span>
          <button onClick={() => setMsg("")} className="btn-icon">
            <X size={16} />
          </button>
        </div>
      )}

      {loading && !multas.length ? (
        <p className="empty-hint">Buscando multas...</p>
      ) : multas.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p className="text-muted">Parabéns! Nenhuma multa pendente.</p>
        </div>
      ) : (
        <>
          <div className="list-cards">
            {atual.map((m) => {
              const info = m.Emprestimo || {};
              const livroNome =
                info.Livro?.titulo || `Livro #${m.emprestimo_id}`;

              return (
                <div key={m.id} className="list-card">
                  <div className="list-card__top">
                    <div>
                      <h3 className="list-card__title">
                        R$ {Number(m.valor).toFixed(2)}
                      </h3>
                      <div className="list-card__meta">
                        <Clock size={14} style={{ marginRight: "4px" }} />
                        {livroNome}
                      </div>
                    </div>
                    <span
                      className={`badge ${m.pago ? "badge--ok" : "badge--no"}`}
                    >
                      {m.pago ? "Pago" : "Pendente"}
                    </span>
                  </div>

                  <div className="list-card__actions">
                    {isAdmin && (
                      <div
                        style={{ display: "flex", gap: "8px", width: "100%" }}
                      >
                        <button
                          className="btn btn--secondary btn--sm"
                          style={{ flex: 1 }}
                          onClick={() => abrirModalEditar(m)}
                        >
                          <Edit2 size={16} /> Editar
                        </button>
                        <button
                          className="btn btn--danger btn--sm"
                          style={{ flex: 1 }}
                          onClick={() => handleRemover(m.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPaginas > 1 && (
            <div className="pagination">
              <button
                onClick={() => mudarPagina("ant")}
                disabled={pagina === 1}
                className="btn btn--secondary btn--sm"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-muted">
                Pág. {pagina} de {totalPaginas}
              </span>
              <button
                onClick={() => mudarPagina("prox")}
                disabled={pagina === totalPaginas}
                className="btn btn--secondary btn--sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {isAdmin && (
        <button
          onClick={() => {
            setEditando(null);
            setModalAberto(true);
          }}
          className="fab"
        >
          <Plus size={28} />
        </button>
      )}

      {modalAberto && (
        <div className="overlay" onClick={() => setModalAberto(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editando ? "Editar Detalhes" : "Aplicar Multa"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setModalAberto(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSalvar}>
              <div className="modal-body form-stack">
                <div className="form-field">
                  <label>Empréstimo relacionado</label>
                  <select
                    name="emprestimo_id"
                    defaultValue={editando?.emprestimo_id || ""}
                    required
                  >
                    <option value="">Selecione o registro</option>
                    {emprestimos.map((e) => (
                      <option key={e.id} value={e.id}>
                        Ref: {e.id} - {e.Livro?.titulo || `Livro ${e.livro_id}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Valor da Multa (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="valor"
                    defaultValue={editando?.valor || ""}
                    required
                  />
                </div>
                {editando && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="pago"
                      id="chk-pago"
                      defaultChecked={editando.pago}
                      style={{ width: "auto" }}
                    />
                    <label htmlFor="chk-pago">Marcar como Pago</label>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={salvando}
                >
                  {salvando ? "Salvando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmacao && (
        <div className="overlay" onClick={() => setConfirmacao(null)}>
          <div
            className="modal"
            style={{ maxWidth: "340px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-body"
              style={{ textAlign: "center", padding: "2rem 1.5rem" }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "32px",
                  background:
                    confirmacao.tipo === "danger"
                      ? "var(--danger-soft)"
                      : "var(--success-soft)",
                  color:
                    confirmacao.tipo === "danger"
                      ? "var(--danger)"
                      : "var(--success)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                }}
              >
                {confirmacao.icon}
              </div>
              <h3 style={{ margin: "0 0 0.5rem" }}>Confirmação</h3>
              <p className="text-muted" style={{ margin: 0 }}>
                {confirmacao.msg}
              </p>
            </div>
            <div
              className="modal-footer"
              style={{ justifyContent: "center", background: "transparent" }}
            >
              <button
                className="btn btn--secondary"
                style={{ flex: 1 }}
                onClick={() => setConfirmacao(null)}
              >
                Não
              </button>
              <button
                className={`btn btn--${confirmacao.tipo}`}
                style={{ flex: 1 }}
                onClick={confirmacao.action}
              >
                Sim, confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
