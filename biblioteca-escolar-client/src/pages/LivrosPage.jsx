import { useEffect, useState, useCallback } from "react";
import * as livroService from "../services/livroService";

const IconEdit = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3l4 4-7 7H10v-4l7-7z" />
    <path d="M4 20h16" />
  </svg>
);

const IconDelete = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 7h16" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13" />
    <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
  </svg>
);

const IconPlus = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IconSearch = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export function LivrosPage() {
  const [livros, setLivros] = useState([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [buscaId, setBuscaId] = useState("");
  const [form, setForm] = useState({ titulo: "", autor: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const carregar = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await livroService.listarLivros();
      setLivros(Array.isArray(data) ? data : [data]);
      setErro("");
    } catch (e) {
      setErro("Não foi possível carregar os livros. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const salvar = async () => {
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
      setErro("Erro ao salvar. Verifique os dados e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const remover = async (id, titulo) => {
    if (
      window.confirm(
        `Deseja realmente excluir "${titulo}"? Esta ação não pode ser desfeita.`,
      )
    ) {
      try {
        await livroService.removerLivro(id);
        carregar();
      } catch {
        setErro("Erro ao excluir livro.");
      }
    }
  };

  const buscar = async () => {
    if (!buscaId.trim()) {
      return carregar();
    }
    setIsLoading(true);
    try {
      const d = await livroService.buscarLivroPorId(buscaId.trim());
      setLivros(d ? [d] : []);
      if (!d) setErro("Nenhum livro encontrado com este ID.");
      else setErro("");
    } catch {
      setErro("Erro na busca. Verifique o ID informado.");
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
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Biblioteca</h1>
        <p style={styles.subtitle}>Gerencie seu acervo de livros</p>
      </div>

      {/* Error Toast */}
      {erro && (
        <div style={styles.errorToast}>
          <span>{erro}</span>
          <button onClick={() => setErro("")} style={styles.closeError}>
            ×
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div style={styles.searchCard}>
        <div style={styles.searchWrapper}>
          <div style={styles.searchIcon}>
            <IconSearch />
          </div>
          <input
            style={styles.searchInput}
            placeholder="Buscar por ID do livro..."
            value={buscaId}
            onChange={(e) => setBuscaId(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={buscar}
            style={styles.searchButton}
            disabled={isLoading}
          >
            {isLoading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Título</th>
              <th style={styles.th}>Autor</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Ações</th>{" "}
            </tr>
          </thead>
          <tbody>
            {isLoading && livros.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.emptyState}>
                  <div style={styles.loadingSpinner} />
                  <span>Carregando livros...</span>
                </td>
              </tr>
            ) : livros.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.emptyState}>
                  <span>Nenhum livro encontrado.</span>
                </td>
              </tr>
            ) : (
              livros.map((l) => (
                <tr key={l.id} style={styles.tr}>
                  <td style={styles.td} data-label="ID">
                    #{l.id}
                  </td>
                  <td style={styles.tdTitle} data-label="Título">
                    <strong>{l.titulo}</strong>
                  </td>
                  <td style={styles.td} data-label="Autor">
                    {l.autor}
                  </td>
                  <td style={styles.tdActions} data-label="Ações">
                    <button
                      onClick={() => abrirModalEditar(l)}
                      style={styles.btnEdit}
                      title="Editar livro"
                    >
                      <IconEdit />
                    </button>
                    <button
                      onClick={() => remover(l.id, l.titulo)}
                      style={styles.btnDel}
                      title="Excluir livro"
                    >
                      <IconDelete />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FAB Button */}
      <button
        onClick={abrirModalNovo}
        style={styles.fab}
        title="Adicionar novo livro"
      >
        <IconPlus />
      </button>

      {/* Modal */}
      {modalAberto && (
        <div style={styles.overlay} onClick={fecharModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editando ? "Editar Livro" : "Adicionar Novo Livro"}
              </h3>
              <button onClick={fecharModal} style={styles.modalClose}>
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Título</label>
                <input
                  style={styles.modalInput}
                  placeholder="Ex: O Senhor dos Anéis"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  autoFocus
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Autor</label>
                <input
                  style={styles.modalInput}
                  placeholder="Ex: J.R.R. Tolkien"
                  value={form.autor}
                  onChange={(e) => setForm({ ...form, autor: e.target.value })}
                />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={fecharModal} style={styles.btnCancel}>
                Cancelar
              </button>
              <button
                onClick={salvar}
                style={styles.btnSave}
                disabled={isSaving}
              >
                {isSaving
                  ? "Salvando..."
                  : editando
                    ? "Salvar Alterações"
                    : "Adicionar Livro"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    padding: "2rem 1rem",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "600",
    color: "#0f172a",
    letterSpacing: "-0.025em",
    marginBottom: "0.25rem",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#475569",
  },
  errorToast: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fef2f2",
    border: "1px solid #fee2e2",
    borderRadius: "12px",
    padding: "0.75rem 1rem",
    marginBottom: "1.5rem",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    color: "#dc2626",
    fontSize: "0.875rem",
  },
  closeError: {
    background: "none",
    border: "none",
    fontSize: "1.25rem",
    cursor: "pointer",
    color: "#dc2626",
    padding: "0 0.25rem",
  },
  searchCard: {
    maxWidth: "600px",
    margin: "0 auto 2rem auto",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    padding: "0.5rem",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s ease",
  },
  searchIcon: {
    display: "flex",
    alignItems: "center",
    paddingLeft: "0.75rem",
    color: "#94a3b8",
  },
  searchInput: {
    flex: 1,
    padding: "0.75rem 0",
    border: "none",
    fontSize: "0.875rem",
    outline: "none",
    background: "transparent",
    color: "#0f172a",
  },
  searchButton: {
    background: "#f1f5f9",
    border: "none",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    fontSize: "0.8125rem",
    fontWeight: "500",
    color: "#1e293b",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginRight: "0.5rem",
  },
  tableContainer: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "#fff",
    borderRadius: "20px",
    boxShadow:
      "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "500px",
  },
  th: {
    textAlign: "left",
    padding: "1rem 1.25rem",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#64748b",
    borderBottom: "1px solid #e2e8f0",
    background: "#fefefe",
  },
  tr: {
    transition: "background 0.15s ease",
  },
  td: {
    padding: "1rem 1.25rem",
    fontSize: "0.875rem",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
  },
  tdTitle: {
    padding: "1rem 1.25rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#0f172a",
    borderBottom: "1px solid #f1f5f9",
  },
  tdActions: {
    padding: "1rem 1.25rem",
    textAlign: "right",
    borderBottom: "1px solid #f1f5f9",
    whiteSpace: "nowrap",
  },
  btnEdit: {
    background: "none",
    border: "none",
    color: "#3b82f6",
    cursor: "pointer",
    padding: "0.5rem",
    borderRadius: "8px",
    transition: "all 0.15s ease",
    marginRight: "0.25rem",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnDel: {
    background: "none",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    padding: "0.5rem",
    borderRadius: "8px",
    transition: "all 0.15s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "fixed",
    bottom: "5rem",
    right: "2rem",
    width: "52px",
    height: "52px",
    borderRadius: "26px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(59,130,246,0.3)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    zIndex: 100,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    padding: "1rem",
  },
  modal: {
    background: "#fff",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    overflow: "hidden",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #f1f5f9",
  },
  modalTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
  },
  modalClose: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#94a3b8",
    padding: "0",
    lineHeight: 1,
  },
  modalBody: {
    padding: "1.5rem",
  },
  inputGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontSize: "0.8125rem",
    fontWeight: "500",
    color: "#334155",
    marginBottom: "0.375rem",
  },
  modalInput: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "0.875rem",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    padding: "1rem 1.5rem 1.5rem",
    borderTop: "1px solid #f1f5f9",
  },
  btnSave: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "0.625rem 1.25rem",
    borderRadius: "40px",
    fontSize: "0.8125rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  btnCancel: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    padding: "0.625rem 1.25rem",
    borderRadius: "40px",
    fontSize: "0.8125rem",
    fontWeight: "500",
    cursor: "pointer",
    color: "#475569",
    transition: "all 0.2s ease",
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem 1rem",
    color: "#64748b",
    fontSize: "0.875rem",
    borderBottom: "1px solid #f1f5f9",
  },
  loadingSpinner: {
    width: "24px",
    height: "24px",
    border: "2px solid #e2e8f0",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto 0.75rem auto",
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  button {
    transition: transform 0.1s ease, background 0.2s ease;
  }
  button:active {
    transform: scale(0.96);
  }
  input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }
  tr:hover {
    background: #fefefe;
  }
`;
document.head.appendChild(styleSheet);
