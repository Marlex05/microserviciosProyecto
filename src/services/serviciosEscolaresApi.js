const SE = import.meta.env.VITE_SE_URL; // p.ej. http://OTRA_IP:4001

async function http(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${SE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || data.message || `Error ${res.status}`);
  return data;
}

// === Endpoints de Servicios Escolares (con prefijo /servicios-escolares) ===
export const seListarGrupos       = () => http("/servicios-escolares/grupos");
export const seObtenerGrupo       = (grupoId) => http(`/servicios-escolares/grupos/${grupoId}`);
export const seCrearGrupo         = (payload) => http("/servicios-escolares/grupos", { method: "POST", body: payload });

export const seRegistrarAlumno    = (payload) => http("/servicios-escolares/alumnos", { method: "POST", body: payload });

export const seInscribirAlumno    = (grupoId, matricula) =>
  http(`/servicios-escolares/grupos/${grupoId}/inscribir`, { method: "POST", body: { matricula } });

export const seDesinscribirAlumno = (grupoId, matricula) =>
  http(`/servicios-escolares/grupos/${grupoId}/desinscribir`, { method: "POST", body: { matricula } });

export const seAsignarProfesor    = (grupoId, profesorId) =>
  http(`/servicios-escolares/grupos/${grupoId}/asignar-profesor`, { method: "POST", body: { profesorId } });
