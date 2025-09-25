const ACADEMICO = import.meta.env.VITE_ACADEMICO_URL;

export async function getAlumnosDeGrupo(grupoId) {
  const r = await fetch(`${ACADEMICO}/grupos/${grupoId}/alumnos`);
  const data = await r.json().catch(()=> ({}));
  if (!r.ok) throw new Error(data.message || `Error ${r.status}`);
  return data;
}

export async function setCalificacion(grupoId, alumnoId, body) {
  const r = await fetch(`${ACADEMICO}/grupos/${grupoId}/alumnos/${alumnoId}/calificacion`, {
    method: "PUT",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(()=> ({}));
  if (!r.ok) throw new Error(data.message || `Error ${r.status}`);
  return data;
}
