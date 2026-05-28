import { useEffect, useState, useCallback } from "react";
import * as livroService from "../services/livroService";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  BookOpen,
  User,
  Hash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function LivrosPage() {
  const [livros, setLivros] = useState([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [buscaId, setBuscaId] = useState("");
  const [form, setForm] = useState({ titulo: "", autor: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmacao, setConfirmacao] = useState(null);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  const carregar = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await livroService.listarLivros();
      setLivros(Array.isArray(data) ? data : data ? [data] : []);
      setErro("");
      setPaginaAtual(1);
    } catch (e) {
      setErro("Não foi possível carregar os livros.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Lógica de Paginação
  const totalPaginas = Math.ceil(livros.length / itensPorPagina);
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensAtuais = livros.slice(indexPrimeiroItem, indexUltimoItem);

  const mudarPagina = (onde) => {
    if (onde === "prox" && paginaAtual < totalPaginas)
      setPaginaAtual((prev) => prev + 1);
    if (onde === "ant" && paginaAtual > 1) setPaginaAtual((prev) => prev - 1);
  };

  const salvar = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.autor.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    setIsSaving(true);
    try {
      if (editando) {
        await livroService.atualizarLivro(editando.id, form);
      } else {
        await livroService.criarLivro(form);
      }
      setModalAberto(false);
      setErro("");
      carregar();
    } catch (e) {
      setErro("Erro ao salvar o livro.");
    } finally {
      setIsSaving(false);
    }
  };

  const remover = async (id, titulo) => {
    setConfirmacao({
      msg: `Deseja realmente excluir o livro "${titulo}"?`,
      action: async () => {
        try {
          await livroService.deletarLivro(id);
          carregar();
        } catch {
          setErro("Erro ao excluir livro.");
        } finally {
          setConfirmacao(null);
        }
      },
    });
  };

  const buscar = async () => {
    if (!buscaId.trim()) return carregar();

    setIsLoading(true);
    try {
      const d = await livroService.buscarLivroPorId(buscaId.trim());
      setLivros(d ? [d] : []);
      if (!d) setErro("Livro não encontrado.");
      else setErro("");
      setPaginaAtual(1);
    } catch {
      setErro("Erro na busca pelo ID.");
      setLivros([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") buscar();
  };

  const abrirModalNovo = () => {
    setEditando(null);
    setForm({ titulo: "", autor: "" });
    setModalAberto(true);
    setErro("");
  };

  const abrirModalEditar = (livro) => {
    setEditando(livro);
    setForm({ titulo: livro.titulo, autor: livro.autor });
    setModalAberto(true);
    setErro("");
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEditando(null);
    setForm({ titulo: "", autor: "" });
  };

  return (
    <div className="stack">
      <div className="page-intro">
        <h2>Acervo de Livros</h2>
        <p>Gerenciamento completo da biblioteca</p>
      </div>

      {erro && (
        <div
          className="alert alert--error"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>{erro}</span>
          <button onClick={() => setErro("")} className="btn-icon">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="search-bar">
        <div className="form-field" style={{ flex: 1 }}>
          <input
            placeholder="Buscar por ID..."
            value={buscaId}
            onChange={(e) => setBuscaId(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button
          onClick={buscar}
          className="btn btn--primary"
          style={{ padding: "0 1rem" }}
        >
          <Search size={18} />
        </button>
      </div>

      {isLoading ? (
        <p className="empty-hint">Carregando acervo...</p>
      ) : livros.length === 0 ? (
        <p className="empty-hint">Nenhum livro disponível.</p>
      ) : (
        <>
          <div className="list-cards">
            {itensAtuais.map((l) => (
              <div key={l.id} className="list-card">
                <div className="list-card__top">
                  <div>
                    <h3 className="list-card__title">{l.titulo}</h3>
                    <div className="list-card__meta">
                      <User
                        size={14}
                        style={{ marginRight: "4px", verticalAlign: "middle" }}
                      />
                      {l.autor}
                    </div>
                  </div>
                  <div className="badge badge--aluno">#{l.id}</div>
                </div>

                <div className="list-card__row">
                  <span>Disponível para empréstimo em breve.</span>
                </div>

                <div className="list-card__actions">
                  <button
                    onClick={() => abrirModalEditar(l)}
                    className="btn btn--secondary btn--sm"
                  >
                    <Edit2 size={16} /> Editar
                  </button>
                  <button
                    onClick={() => remover(l.id, l.titulo)}
                    className="btn btn--danger btn--sm"
                  >
                    <Trash2 size={16} /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div
              className="pagination"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1.5rem",
                padding: "0 0.5rem",
              }}
            >
              <button
                onClick={() => mudarPagina("ant")}
                disabled={paginaAtual === 1}
                className="btn btn--secondary btn--sm"
                style={{ padding: "0.5rem" }}
              >
                <ChevronLeft size={20} />
              </button>

              <span
                className="text-muted"
                style={{ fontSize: "0.9rem", fontWeight: "500" }}
              >
                Página {paginaAtual} de {totalPaginas}
              </span>

              <button
                onClick={() => mudarPagina("prox")}
                disabled={paginaAtual === totalPaginas}
                className="btn btn--secondary btn--sm"
                style={{ padding: "0.5rem" }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      <button onClick={abrirModalNovo} className="fab">
        <Plus size={28} />
      </button>

      {modalAberto && (
        <div className="overlay" onClick={fecharModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editando ? "Editar Livro" : "Novo Livro"}
              </h3>
              <button onClick={fecharModal} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={salvar}>
              <div className="modal-body form-stack">
                <div className="form-field">
                  <label>Título do Livro</label>
                  <input
                    placeholder="Ex: Dom Casmurro"
                    name="titulo"
                    value={form.titulo}
                    onChange={(e) =>
                      setForm({ ...form, titulo: e.target.value })
                    }
                    required
                    autoFocus
                  />
                </div>
                <div className="form-field">
                  <label>Autor</label>
                  <input
                    placeholder="Ex: Machado de Assis"
                    name="autor"
                    value={form.autor}
                    onChange={(e) =>
                      setForm({ ...form, autor: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="btn btn--secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Confirmar"}
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
            style={{ maxWidth: "360px" }}
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
                  background: "var(--danger-soft)",
                  color: "var(--danger)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                }}
              >
                <Trash2 size={32} />
              </div>
              <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.2rem" }}>
                Confirmar exclusão?
              </h3>
              <p
                className="text-muted"
                style={{ margin: 0, fontSize: "0.95rem" }}
              >
                {confirmacao.msg}
              </p>
            </div>
            <div
              className="modal-footer"
              style={{
                justifyContent: "center",
                padding: "0 1.5rem 1.5rem",
                background: "transparent",
              }}
            >
              <button
                className="btn btn--secondary"
                style={{ flex: 1 }}
                onClick={() => setConfirmacao(null)}
              >
                Voltar
              </button>
              <button
                className="btn btn--danger"
                style={{ flex: 1 }}
                onClick={confirmacao.action}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
