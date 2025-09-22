const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function httpGet(path) {
  const res = await fetch(`${API}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

export function getAlumnosDeGrupo(grupoId) {
  return httpGet(`/grupos/${grupoId}/alumnos`);
}

// (lo usaremos en el siguiente paso para editar calificaciones)
export async function setCalificacion(grupoId, alumnoId, body) {
  const res = await fetch(`${API}/grupos/${grupoId}/alumnos/${alumnoId}/calificacion`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}
