import { api } from './api';

export async function listarMultas() {
  const { data } = await api.get('/multas');
  return data;
}

export async function quitarMulta(id) {
  const { data } = await api.put(`/multas/quitar/${id}`);
  return data;
}

export async function criarMulta(payload) {
  const { data } = await api.post('/multas', payload);
  return data;
}

export async function deletarMulta(id) {
  await api.delete(`/multas/${id}`);
}

export async function atualizarMulta(id, payload) {
  const { data } = await api.put(`/multas/${id}`, payload);
  return data;
}