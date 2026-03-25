import { api } from './api';

export async function listarMultas() {
  const { data } = await api.get('/multas');
  return data;
}

export async function marcarMultaPaga(id) {
  const { data } = await api.patch(`/multas/${id}/pagar`);
  return data;
}