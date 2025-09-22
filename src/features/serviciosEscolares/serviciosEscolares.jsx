import React, { useEffect, useMemo, useState } from "react";
import "../../styles/serviciosEscolares.css"; // <— importa el CSS

const BASE_URL = "http://localhost:4000";

async function callApi(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || data.message || res.statusText);
  return data;
}

export default function ServiciosEscolares() {
  const [alumno, setAlumno] = useState({ matricula: "", nombre: "", carrera: "" });
  const [grupo, setGrupo] = useState({ nombre: "", carrera: "" });
  const [grupos, setGrupos] = useState([]);
  const [grupoId, setGrupoId] = useState("");
  const [grupoSel, setGrupoSel] = useState(null);
  const [matricula, setMatricula] = useState("");
  const [profesorId, setProfesorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // {type:'ok'|'err', text}

  const canCrearAlumno = useMemo(
    () => alumno.matricula.trim() && alumno.nombre.trim() && alumno.carrera.trim(),
    [alumno]
  );
  const canCrearGrupo = useMemo(
    () => grupo.nombre.trim() && grupo.carrera.trim(),
    [grupo]
  );
  const canInscribir = useMemo(() => grupoId && matricula.trim(), [grupoId, matricula]);
  const canAsignar = useMemo(() => grupoId && profesorId.trim(), [grupoId, profesorId]);

  const tell = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3000); };

  useEffect(() => {
    (async () => {
      try { setGrupos(await callApi("/servicios-escolares/grupos")); }
      catch (e) { tell("err", e.message || "No se pudieron cargar los grupos"); }
    })();
  }, []);

  useEffect(() => {
    if (!grupoId) { setGrupoSel(null); return; }
    (async () => {
      try { setGrupoSel(await callApi(`/servicios-escolares/grupos/${grupoId}`)); }
      catch (e) { setGrupoSel(null); tell("err", e.message || "No se pudo obtener el grupo"); }
    })();
  }, [grupoId]);

  const crearAlumno = async () => {
    try { setLoading(true); await callApi("/servicios-escolares/alumnos", { method:"POST", body: alumno });
      setAlumno({ matricula:"", nombre:"", carrera:"" }); tell("ok","Alumno registrado");
    } catch(e){ tell("err", e.message || "Error al registrar alumno"); } finally { setLoading(false); }
  };

  const crearGrupo = async () => {
    try { setLoading(true);
      const r = await callApi("/servicios-escolares/grupos", { method:"POST", body: grupo });
      setGrupos(prev => [...prev, { id:r.id, ...grupo, alumnos:[], profesorId:null }]);
      setGrupo({ nombre:"", carrera:"" }); tell("ok", `Grupo creado: ${r.id}`);
    } catch(e){ tell("err", e.message || "Error al crear grupo"); } finally { setLoading(false); }
  };

  const inscribirAlumno = async () => {
    try { setLoading(true);
      await callApi(`/servicios-escolares/grupos/${grupoId}/inscribir`, { method:"POST", body:{ matricula }});
      setGrupoSel(await callApi(`/servicios-escolares/grupos/${grupoId}`));
      setMatricula(""); tell("ok","Alumno inscrito");
    } catch(e){ tell("err", e.message || "Error al inscribir"); } finally { setLoading(false); }
  };

  const desinscribirAlumno = async () => {
    try { setLoading(true);
      await callApi(`/servicios-escolares/grupos/${grupoId}/desinscribir`, { method:"POST", body:{ matricula }});
      setGrupoSel(await callApi(`/servicios-escolares/grupos/${grupoId}`));
      setMatricula(""); tell("ok","Alumno removido");
    } catch(e){ tell("err", e.message || "Error al desinscribir"); } finally { setLoading(false); }
  };

  const asignarProfesor = async () => {
    try { setLoading(true);
      await callApi(`/servicios-escolares/grupos/${grupoId}/asignar-profesor`, { method:"POST", body:{ profesorId }});
      setGrupoSel(await callApi(`/servicios-escolares/grupos/${grupoId}`));
      setProfesorId(""); tell("ok","Profesor asignado");
    } catch(e){ tell("err", e.message || "Error al asignar profesor"); } finally { setLoading(false); }
  };

  return (
    <div className="se">
      <h2 className="se-title">Servicios Escolares</h2>
      {msg && (
        <div className={`se-alert ${msg.type === "ok" ? "se-alert-ok" : "se-alert-err"}`}>
          {msg.text}
        </div>
      )}

      {/* Registrar alumno */}
      <section className="se-card">
        <h3>Registrar alumno</h3>
        <div className="se-row">
          <input className="se-input" placeholder="Matrícula"
                 value={alumno.matricula}
                 onChange={e=>setAlumno({ ...alumno, matricula:e.target.value })}/>
          <input className="se-input" placeholder="Nombre"
                 value={alumno.nombre}
                 onChange={e=>setAlumno({ ...alumno, nombre:e.target.value })}/>
          <input className="se-input" placeholder="Carrera"
                 value={alumno.carrera}
                 onChange={e=>setAlumno({ ...alumno, carrera:e.target.value })}/>
          <button className="se-btn se-btn-primary"
                  disabled={!canCrearAlumno || loading}
                  onClick={crearAlumno}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </section>

      {/* Crear grupo */}
      <section className="se-card">
        <h3>Crear grupo</h3>
        <div className="se-row">
          <input className="se-input" placeholder="Nombre del grupo"
                 value={grupo.nombre}
                 onChange={e=>setGrupo({ ...grupo, nombre:e.target.value })}/>
          <input className="se-input" placeholder="Carrera"
                 value={grupo.carrera}
                 onChange={e=>setGrupo({ ...grupo, carrera:e.target.value })}/>
          <button className="se-btn se-btn-primary"
                  disabled={!canCrearGrupo || loading}
                  onClick={crearGrupo}>
            {loading ? "Creando..." : "Crear"}
          </button>
        </div>
      </section>

      {/* Armar / gestionar grupo */}
      <section className="se-card">
        <h3>Armar / gestionar grupo</h3>
        <div className="se-row">
          <select className="se-input se-select" value={grupoId} onChange={e=>setGrupoId(e.target.value)}>
            <option value="">— Selecciona un grupo —</option>
            {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre} ({g.carrera})</option>)}
          </select>
          <button className="se-btn se-btn-ghost"
                  disabled={!grupoId}
                  onClick={async ()=>{
                    try { setLoading(true); setGrupoSel(await callApi(`/servicios-escolares/grupos/${grupoId}`)); tell("ok","Grupo actualizado"); }
                    catch(e){ tell("err", e.message); }
                    finally { setLoading(false); }
                  }}>
            Refrescar
          </button>
        </div>

        <div className="se-row" style={{ marginTop: 12 }}>
          <input className="se-input" placeholder="Matrícula"
                 value={matricula} onChange={e=>setMatricula(e.target.value)}/>
          <button className="se-btn se-btn-primary" disabled={!canInscribir || loading} onClick={inscribirAlumno}>
            Inscribir
          </button>
          <button className="se-btn se-btn-ghost" disabled={!canInscribir || loading} onClick={desinscribirAlumno}>
            Desinscribir
          </button>
        </div>

        <div className="se-row" style={{ marginTop: 12 }}>
          <input className="se-input" placeholder="profesorId (texto libre)"
                 value={profesorId} onChange={e=>setProfesorId(e.target.value)}/>
          <button className="se-btn se-btn-primary" disabled={!canAsignar || loading} onClick={asignarProfesor}>
            Asignar profesor
          </button>
        </div>

        {grupoSel && (
          <div className="se-group-detail">
            <div className="se-group-detail-title">
              {grupoSel.nombre} — {grupoSel.carrera}
            </div>
            <div style={{ marginBottom: 6 }}>
              Profesor asignado: <b>{grupoSel.profesorId || "—"}</b>
            </div>
            <div>
              Alumnos ({(grupoSel.alumnos || []).length}):
              <ul>
                {(grupoSel.alumnos || []).map(m => <li key={m}>{m}</li>)}
                {(grupoSel.alumnos || []).length === 0 && <li>Sin alumnos</li>}
              </ul>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
