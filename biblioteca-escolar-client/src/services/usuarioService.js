import { api } from './api';

export async function criarUsuario(payload) {
  const { data } = await api.post('/usuarios', payload);
  return data;
}

export async function listarUsuarios() {
  const { data } = await api.get('/usuarios');
  return data;
}

export async function atualizarUsuario(id, payload) {
  const { data } = await api.put(`/usuarios/${id}`, payload);
  return data;
}

export async function deletarUsuario(id) {
  await api.delete(`/usuarios/${id}`);
}

export async function buscarUsuarioPorId(id) {
  const { data } = await api.get(`/usuarios/${id}`);
  return data;
}