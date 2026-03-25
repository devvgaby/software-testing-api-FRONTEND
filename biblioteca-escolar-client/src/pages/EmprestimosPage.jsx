import { useEffect, useState } from 'react';
import { EmprestimoForm } from '../components/emprestimos/EmprestimoForm';
import { EmprestimoLista } from '../components/emprestimos/EmprestimoLista';
import { useAuth } from '../context/AuthContext';
import * as emprestimoService from '../services/emprestimoService';
import * as livroService from '../services/livroService';
import * as usuarioService from '../services/usuarioService';

export function EmprestimosPage() {
  const { isAdmin } = useAuth();
  const [lista, setLista] = useState([]);
  const [livros, setLivros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState('');
  const [msg, setMsg] = useState('');

  const carregar = async () => {
    setErro('');
    try {
      const [e, l, u] = await Promise.all([
        emprestimoService.listarEmprestimos(),
        livroService.listarLivros(),
        isAdmin ? usuarioService.listarUsuarios() : Promise.resolve([]),
      ]);
      setLista(e);
      setLivros(l);
      setUsuarios(u);
    } catch (e) {
      setErro(e.response?.data?.erro || e.message);
    }
  };

  useEffect(() => {
    carregar();
  }, [isAdmin]);

  const handleNovo = async ({ livro_id, usuario_id }) => {
    setErro('');
    setMsg('');
    try {
      const res = await emprestimoService.criarEmprestimo(livro_id, usuario_id);
      setMsg(`Empréstimo #${res.id} registrado.`);
      await carregar();
    } catch (e) {
      setErro(e.response?.data?.erro || e.message);
    }
  };

  const handleDevolucao = async (id) => {
    if (!window.confirm('Registrar devolução deste empréstimo?')) return;
    setErro('');
    setMsg('');
    try {
      const res = await emprestimoService.registrarDevolucao(id);
      const multa = res.multaGerada ?? res.multa;
      if (multa) {
        setMsg(`Devolução ok. Multa: R$ ${Number(multa.valor).toFixed(2)}`);
      } else {
        setMsg('Devolução registrada.');
      }
      await carregar();
    } catch (e) {
      setErro(e.response?.data?.erro || e.message);
    }
  };

  return (
    <div className="stack">
      <div className="page-intro">
        <h2>Empréstimos</h2>
        <p>Retiradas e devoluções</p>
      </div>
      {erro && (
        <p className="alert alert--error" role="alert">
          {erro}
        </p>
      )}
      {msg && (
        <p className="alert alert--success" role="status">
          {msg}
        </p>
      )}
      {isAdmin && livros.length > 0 && usuarios.length > 0 && (
        <EmprestimoForm livros={livros} usuarios={usuarios} onSubmit={handleNovo} />
      )}
      <EmprestimoLista emprestimos={lista} isAdmin={isAdmin} onDevolucao={handleDevolucao} />
    </div>
  );
}