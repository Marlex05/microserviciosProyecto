import { http } from './http';
const BASE = import.meta.env.VITE_AUTH_URL;

export const login = (credentials) =>
  http(`${BASE}/login`, { method: 'POST', body: credentials });

export const changePassword = (payload) =>
  http(`${BASE}/cuenta/password`, { method: 'PATCH', body: payload });
