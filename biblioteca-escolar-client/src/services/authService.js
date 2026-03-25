import { api } from './api';

export async function login(email, senha) {
  const { data } = await api.post('/auth/login', { email, senha });
  return data;
}

export async function register(nome, email, senha) {
  const { data } = await api.post('/auth/register', { nome, email, senha });
  return data;
}