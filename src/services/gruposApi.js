// src/services/gruposApi.js
import { http } from './http';

// Usa el MISMO backend que Profesores
const BASE = import.meta.env.VITE_PROFESORES_URL;

export async function getAlumnosDeGrupo(grupoId) {
  return http(`${BASE}/grupos/${grupoId}/alumnos`);
}

// Asegúrate que coincida con tu backend (PATCH y ruta /calificaciones/:alumnoId)
export async function setCalificacion(grupoId, alumnoId, body) {
  return http(`${BASE}/grupos/${grupoId}/calificaciones/${alumnoId}`, {
    method: 'PATCH',
    body,
  });
}
