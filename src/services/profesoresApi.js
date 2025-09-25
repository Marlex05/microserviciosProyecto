const ACADEMICO = import.meta.env.VITE_ACADEMICO_URL;

async function httpGet(path) {
  const res = await fetch(`${ACADEMICO}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

export const getProfesorByUserId = (userId) =>
  httpGet(`/profesores/by-user/${userId}`);

export const getGruposByProfesor = (profesorId) =>
  httpGet(`/profesores/${profesorId}/grupos`);
