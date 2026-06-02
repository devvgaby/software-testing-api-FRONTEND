import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import * as usuarioService from "../services/usuarioService";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  User,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function UsuariosPage() {
  const { usuario: currentAccount } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  const [buscaId, setBuscaId] = useState("");
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "aluno",
  });

  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [confirmacao, setConfirmacao] = useState(null);

  // paginação
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await usuarioService.listarUsuarios();
      setUsuarios(Array.isArray(data) ? data : data ? [data] : []);
      setPagina(1);
      setErro("");
    } catch {
      setErro("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const totalPaginas = Math.ceil(usuarios.length / porPagina);
  const atual = usuarios.slice((pagina - 1) * porPagina, pagina * porPagina);

  const mudarPagina = (dir) => {
    if (dir === "prox" && pagina < totalPaginas) setPagina((p) => p + 1);
    if (dir === "ant" && pagina > 1) setPagina((p) => p - 1);
  };

  // 🔎 igual livros (SEM backend obrigatório)
  const buscar = async () => {
    if (!buscaId.trim()) return carregar();

    setLoading(true);
    try {
      const u = await usuarioService.buscarUsuarioPorId(buscaId.trim());
      setUsuarios(u ? [u] : []);
      setPagina(1);
      setErro("");
    } catch {
      setErro("Usuário não encontrado.");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const salvar = async (e) => {
    e.preventDefault();

    setSalvando(true);
    try {
      if (editando) {
        await usuarioService.atualizarUsuario(editando.id, form);
        setMsg("Usuário atualizado.");
      } else {
        await usuarioService.criarUsuario(form);
        setMsg("Usuário criado.");
      }

      setModalAberto(false);
      setEditando(null);
      carregar();
    } catch {
      setErro("Erro ao salvar usuário.");
    } finally {
      setSalvando(false);
    }
  };

  const remover = (id, nome) => {
    setConfirmacao({
      msg: `Excluir "${nome}"?`,
      action: async () => {
        try {
          await usuarioService.deletarUsuario(id);
          carregar();
        } catch {
          setErro("Erro ao excluir.");
        } finally {
          setConfirmacao(null);
        }
      },
    });
  };

  const abrirEditar = (u) => {
    setEditando(u);
    setForm(u);
    setModalAberto(true);
  };

  return (
    <div className="stack">
      <div className="page-intro">
        <h2>Gestão de Usuários</h2>
        <p>Controle de acesso</p>
      </div>

      {erro && (
        <div className="alert alert--error">
          <span>{erro}</span>
          <button onClick={() => setErro("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {msg && (
        <div className="alert alert--success">
          <span>{msg}</span>
          <button onClick={() => setMsg("")}>
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
          />
        </div>
        <button onClick={buscar} className="btn btn--primary">
          <Search size={18} />
        </button>
      </div>

      {loading ? (
        <p className="empty-hint">Carregando...</p>
      ) : usuarios.length === 0 ? (
        <p className="empty-hint">Nenhum usuário encontrado.</p>
      ) : (
        <>
          <div className="list-cards">
            {atual.map((u) => (
              <div key={u.id} className="list-card">
                <div className="list-card__top">
                  <div>
                    <h3 className="list-card__title">{u.nome}</h3>
                    <div className="list-card__meta">
                      <Mail size={14} style={{ marginRight: 4 }} />
                      {u.email}
                    </div>
                  </div>

                  <div className="badge badge--aluno">#{u.id}</div>
                </div>

                <div className="list-card__actions">
                  <button
                    className="btn btn--secondary btn--sm"
                    onClick={() => abrirEditar(u)}
                  >
                    <Edit2 size={16} /> Editar
                  </button>

                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => remover(u.id, u.nome)}
                  >
                    <Trash2 size={16} /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="pagination">
              <button
                className="btn btn--secondary btn--sm"
                onClick={() => mudarPagina("ant")}
              >
                <ChevronLeft size={18} />
              </button>

              <span>
                {pagina} / {totalPaginas}
              </span>

              <button
                className="btn btn--secondary btn--sm"
                onClick={() => mudarPagina("prox")}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      <button className="fab" onClick={() => setModalAberto(true)}>
        <Plus size={28} />
      </button>

      {modalAberto && (
        <div className="overlay" onClick={() => setModalAberto(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editando ? "Editar Usuário" : "Novo Usuário"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setModalAberto(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={salvar}>
              <div className="modal-body form-stack">
                <div className="form-field">
                  <label>Nome</label>
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Senha</label>
                  <input
                    type="password"
                    name="senha"
                    value={form.senha}
                    onChange={(e) =>
                      setForm({ ...form, senha: e.target.value })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Tipo</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  >
                    <option value="aluno">Aluno</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
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
        <div className="overlay">
          <div className="modal">
            <p>{confirmacao.msg}</p>
            <button onClick={() => setConfirmacao(null)}>Cancelar</button>
            <button onClick={confirmacao.action}>Confirmar</button>
          </div>
        </div>
      )}
    </div>
  );
}
