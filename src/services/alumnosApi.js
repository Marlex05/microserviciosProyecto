const ALUMNOS = import.meta.env.VITE_API_ALUMNOS;

export const alumnosApi = {
    get: (id) => fetch(`${ALUMNOS}/api/alumnos/${id}`).then(r => r.json()),
    crear: (a) => fetch(`${ALUMNOS}/api/alumnos`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(a)
    }).then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.message); return d; }),
    patch: (id, p) => fetch(`${ALUMNOS}/api/alumnos/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p)
    }).then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.message); return d; }),
    calificaciones: (id) => fetch(`${ALUMNOS}/api/alumnos/${id}/calificaciones`).then(r => r.json()),
};
