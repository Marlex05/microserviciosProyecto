import { http } from './http';
const BASE = import.meta.env.VITE_PROFESORES_URL;

// Mantén el nombre de función que ya usa tu componente,
// pero ahora envía :idUsuario en la URL
export const getProfesorByUserId = (idUsuario) =>
  http(`${BASE}/profesores/by-user/${idUsuario}`);

export const getGruposByProfesor = (profesorId) =>
  http(`${BASE}/profesores/${profesorId}/grupos`);
