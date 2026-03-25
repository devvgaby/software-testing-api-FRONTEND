import { api } from './api';

export async function listarEmprestimos() {
  const { data } = await api.get('/emprestimos');
  return data;
}

export async function criarEmprestimo(livro_id, usuario_id) {
  const { data } = await api.post('/emprestimos', { livro_id, usuario_id });
  return data;
}

export async function registrarDevolucao(emprestimoId) {
  const { data } = await api.post(`/emprestimos/${emprestimoId}/devolucao`);
  return data;
}