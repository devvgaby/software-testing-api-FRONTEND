import { api } from './api';

export async function listarUsuarios() {
  const { data } = await api.get('/usuarios');
  return data;
}