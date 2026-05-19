import { api } from './api';

export async function listarLivros() {
  const { data } = await api.get('/livros');
  return data;
}

export async function buscarLivroPorId(id) {
  const { data } = await api.get(`/livros/${id}`);
  return data;
}

export async function criarLivro(payload) {
  const { data } = await api.post('/livros', payload);
  return data;
}

export async function atualizarLivro(id, payload) {
  const { data } = await api.put(`/livros/${id}`, payload);
  return data;
}

export async function deletarLivro(id) {
  await api.delete(`/livros/${id}`);
}