import { http } from './http';

const BASE = import.meta.env.VITE_RH_URL;

// GET /profesores => devuelve array de profesores
export async function getProfesores() {
  return http(`${BASE}/profesores`);
}

// POST /profesores => crea profesor (backend devuelve { success:true, data: { profesor, user } })
export async function createProfesor(payload) {
  return http(`${BASE}/profesores`, { method: 'POST', body: payload });
}

// PATCH /profesores/:idProfesor/pass => cambiar contraseña
export async function changeProfesorPassword(idProfesor, newPassword) {
  return http(`${BASE}/profesores/${idProfesor}/pass`, {
    method: 'PATCH',
    body: { newPassword }
  });
}