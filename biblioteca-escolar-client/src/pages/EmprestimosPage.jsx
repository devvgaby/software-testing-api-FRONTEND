import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import * as emprestimoService from "../services/emprestimoService";
import * as livroService from "../services/livroService";
import * as usuarioService from "../services/usuarioService";
import {
  Plus,
  Book,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Edit2,
  Trash2,
} from "lucide-react";

export function EmprestimosPage() {
  const { isAdmin, usuario } = useAuth();

  const [lista, setLista] = useState([]);
  const [livros, setLivros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [confirmacao, setConfirmacao] = useState(null);

  const [pagina, setPagina] = useState(1);
  const porPagina = 6;

  const carregar = useCallback(async () => {
    setErro("");
    setLoading(true);

    try {
      const [e, l, u] = await Promise.all([
        emprestimoService.listarEmprestimos(),
        livroService.listarLivros(),
        usuarioService.listarUsuarios().catch(() => []),
      ]);

      setLista(Array.isArray(e) ? e : e ? [e] : []);
      setLivros(l);

      if (u.length === 0 && usuario) {
        setUsuarios([usuario]);
      } else {
        setUsuarios(u);
      }
    } catch (e) {
      setErro(e.response?.data?.erro || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const totalPaginas = Math.ceil(lista.length / porPagina);
  const atual = lista.slice((pagina - 1) * porPagina, pagina * porPagina);

  const mudarPagina = (onde) => {
    if (onde === "prox" && pagina < totalPaginas) setPagina((p) => p + 1);
    if (onde === "ant" && pagina > 1) setPagina((p) => p - 1);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();

    const fd = new FormData(e.target);
    const payload = {
      livro_id: Number(fd.get("livro_id")),
      usuario_id: Number(fd.get("usuario_id")),
      data_devolucao_prevista: fd.get("data_devolucao_prevista"),
    };

    setErro("");
    setMsg("");
    setSalvando(true);

    try {
      if (editando) {
        await emprestimoService.atualizarEmprestimo(editando.id, payload);
        setMsg("Empréstimo atualizado com sucesso.");
      } else {
        await emprestimoService.criarEmprestimo(
          payload.livro_id,
          payload.usuario_id,
          payload.data_devolucao_prevista
        );
        setMsg("Empréstimo registrado com sucesso.");
      }

      setModalAberto(false);
      setEditando(null);
      await carregar();
    } catch (e) {
      setErro(e.response?.data?.erro || "Erro ao salvar empréstimo.");
    } finally {
      setSalvando(false);
    }
  };

  const handleRemover = async (id) => {
    setConfirmacao({
      id,
      tipo: "danger",
      msg: "Deseja realmente excluir este empréstimo permanentemente?",
      action: async () => {
        try {
          await emprestimoService.deletarEmprestimo(id);
          setMsg("Empréstimo excluído.");
          carregar();
        } catch {
          setErro("Erro ao excluir.");
        } finally {
          setConfirmacao(null);
        }
      },
    });
  };

  const handleDevolucao = async (id) => {
    setConfirmacao({
      id,
      tipo: "success",
      msg: "Confirmar o recebimento deste livro agora?",
      action: async () => {
        try {
          await emprestimoService.registrarDevolucao(id);
          setMsg("Devolução concluída.");
          await carregar();
        } catch {
          setErro("Erro ao processar devolução.");
        } finally {
          setConfirmacao(null);
        }
      },
    });
  };

  const fmt = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  const abrirModalEditar = (e) => {
    setEditando(e);
    setModalAberto(true);
  };

  const livrosDisponiveis = livros.filter(
    (l) =>
      (l.disponivel ?? 0) > 0 ||
      (editando && l.id === editando.livro_id)
  );

  return (
    <div className="stack">
      <div className="page-intro">
        <h2>Empréstimos</h2>
        <p>Gestão de retiradas e devoluções</p>
      </div>

      {erro && (
        <div className="alert alert--error">
          <AlertCircle size={18} />
          <span>{erro}</span>
          <button onClick={() => setErro("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {msg && (
        <div className="alert alert--success">
          <CheckCircle size={18} />
          <span>{msg}</span>
          <button onClick={() => setMsg("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {loading && !lista.length ? (
        <p>Carregando...</p>
      ) : lista.length === 0 ? (
        <p>Nenhum registro encontrado.</p>
      ) : (
        <>
          <div className="list-cards">
            {atual.map((e) => {
              const ativo = !e.data_devolucao;

              return (
                <div key={e.id} className="list-card">
                  <h3>
                    {e.Livro?.titulo ?? `Livro #${e.livro_id}`}
                  </h3>

                  <p>
                    <User size={14} />{" "}
                    {e.Usuario?.nome ?? `Usuário #${e.usuario_id}`}
                  </p>

                  <p>Prazo: {fmt(e.data_devolucao_prevista)}</p>

                  {ativo ? (
                    <>
                      <button onClick={() => handleDevolucao(e.id)}>
                        Devolver
                      </button>
                      <button onClick={() => abrirModalEditar(e)}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleRemover(e.id)}>
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleRemover(e.id)}>
                      Excluir
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {totalPaginas > 1 && (
            <div>
              <button onClick={() => mudarPagina("ant")}>
                <ChevronLeft />
              </button>
              <span>
                {pagina} / {totalPaginas}
              </span>
              <button onClick={() => mudarPagina("prox")}>
                <ChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}