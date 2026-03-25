import { api } from './api';

export async function fetchResumo() {
  const { data } = await api.get('/dashboard');
  return data;
}