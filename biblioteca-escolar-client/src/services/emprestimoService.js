import { api } from './api';

export async function listarEmprestimos() {
  const { data } = await api.get('/emprestimos');
  return data;
}

export async function criarEmprestimo(livro_id, usuario_id, data_devolucao_prevista) {
  const { data } = await api.post('/emprestimos', { livro_id, usuario_id, data_devolucao_prevista });
  return data;
}

export async function atualizarEmprestimo(id, payload) {
  const { data } = await api.put(`/emprestimos/${id}`, payload);
  return data;
}

export async function deletarEmprestimo(id) {
  await api.delete(`/emprestimos/${id}`);
}

export async function registrarDevolucao(emprestimoId) {
  const hoje = new Date().toISOString();
  const { data } = await api.put(`/emprestimos/${emprestimoId}`, { data_devolucao: hoje });
  return data;
}