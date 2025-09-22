const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function httpGet(path) {
  const res = await fetch(`${API}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

export function getProfesorByUserId(userId) {
  return httpGet(`/profesores/by-user/${userId}`);
}

export function getGruposByProfesor(profesorId) {
  return httpGet(`/profesores/${profesorId}/grupos`);
}
