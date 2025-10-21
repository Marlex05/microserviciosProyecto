import { useEffect, useMemo, useState } from "react";
import { getProfesorByUserId, getGruposByProfesor } from "../../services/profesoresApi";
import { getAlumnosDeGrupo, setCalificacion } from "../../services/gruposApi";
import "../../styles/profesores.css";

export default function Profesores() {
  const session = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  }, []);

  const [profesor, setProfesor] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [alumnosByGrupo, setAlumnosByGrupo] = useState({}); // { [grupoId]: AlumnoRow[] }
  const [edited, setEdited] = useState({});                 // { [grupoId]: { [alumnoId]: "9.5" } }
  const [saving, setSaving] = useState({});                 // { [grupoId]: { [alumnoId]: "idle"|"saving"|"saved"|"error" } }
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");

        // 🔒 ahora solo validamos idUsuario
        if (!session?.idUsuario) {
          setErr("No hay sesión activa.");
          return;
        }

        // 1) profesor por idUsuario
        const prof = await getProfesorByUserId(session.idUsuario);
        setProfesor(prof);

        // 2) grupos del profesor
        const gs = await getGruposByProfesor(prof.id);
        setGrupos(gs);

        // 3) alumnos por grupo (blindado: siempre arreglo)
        const entries = await Promise.all(
          gs.map(async (g) => {
            try {
              const alumnos = await getAlumnosDeGrupo(g.id);
              return [g.id, Array.isArray(alumnos) ? alumnos : []];
            } catch {
              return [g.id, []];
            }
          })
        );
        setAlumnosByGrupo(Object.fromEntries(entries));
      } catch (e) {
        setErr(e.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    })();
  // 👇 dependemos de idUsuario (no de id)
  }, [session?.idUsuario]);

  function getEditedValue(grupoId, alumno) {
    const current = edited?.[grupoId]?.[alumno.alumnoId];
    if (current === "") return "";
    if (current != null) return current;
    return alumno.calificacion ?? "";
  }

  function setEditedValue(grupoId, alumnoId, value) {
    setEdited(prev => ({
      ...prev,
      [grupoId]: { ...(prev[grupoId] || {}), [alumnoId]: value }
    }));
  }

  function setSavingStatus(grupoId, alumnoId, status) {
    setSaving(prev => ({
      ...prev,
      [grupoId]: { ...(prev[grupoId] || {}), [alumnoId]: status }
    }));
  }

  async function handleSave(grupoId, alumno) {
    if (!profesor?.id) return;
    const raw = getEditedValue(grupoId, alumno);
    const num = Number(raw);

    if (!Number.isFinite(num) || num < 0 || num > 10) {
      setSavingStatus(grupoId, alumno.alumnoId, "error");
      return;
    }

    try {
      setSavingStatus(grupoId, alumno.alumnoId, "saving");
      const resp = await setCalificacion(grupoId, alumno.alumnoId, {
        profesorId: profesor.id,
        calificacion: num
      });

      // Actualiza el estado local de alumnos con la nueva calificación
      setAlumnosByGrupo(prev => {
        const list = Array.isArray(prev[grupoId]) ? prev[grupoId] : [];
        const next = list.map(a =>
          a.alumnoId === alumno.alumnoId ? { ...a, calificacion: resp.calificacion } : a
        );
        return { ...prev, [grupoId]: next };
      });

      // Limpia el edited si coincide con lo guardado
      setEdited(prev => {
        const g = { ...(prev[grupoId] || {}) };
        delete g[alumno.alumnoId];
        return { ...prev, [grupoId]: g };
      });

      setSavingStatus(grupoId, alumno.alumnoId, "saved");
      setTimeout(() => setSavingStatus(grupoId, alumno.alumnoId, "idle"), 1500);
    } catch (e) {
      setSavingStatus(grupoId, alumno.alumnoId, "error");
      console.error(e);
    }
  }

  if (loading) return <div className="prof-card">Cargando grupos…</div>;
  if (err) return <div className="prof-card prof-error">{err}</div>;

  return (
    <div className="prof-wrap">
      <header className="prof-header">
        <h1>Mis grupos</h1>
        {profesor && (
          <div className="prof-subtitle">
            {profesor.nombre} — <span className="prof-badge">{profesor.numeroEmpleado}</span>
          </div>
        )}
      </header>

      {grupos.length === 0 ? (
        <div className="prof-card">No tienes grupos asignados.</div>
      ) : (
        grupos.map((g) => {
          // 🛡️ siempre usa arreglo para no romper el render
          const alumnos = Array.isArray(alumnosByGrupo[g.id]) ? alumnosByGrupo[g.id] : [];
          return (
            <section key={g.id} className="prof-section">
              <div className="prof-section-title">
                <h2>{g.nombre}</h2>
                <div className="prof-meta">
                  {g.materia && <span className="prof-chip">{g.materia}</span>}
                  {g.periodo && <span className="prof-chip">{g.periodo}</span>}
                </div>
              </div>

              <div className="prof-table-wrap">
                <table className="prof-table">
                  <thead>
                    <tr>
                      <th>Matrícula</th>
                      <th>Alumno</th>
                      <th style={{ width: 180 }}>Calificación</th>
                      <th style={{ width: 120 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnos.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="prof-empty">Sin alumnos inscritos</td>
                      </tr>
                    ) : (
                      alumnos.map((a) => {
                        const val = getEditedValue(g.id, a);
                        const status = saving?.[g.id]?.[a.alumnoId] || "idle";
                        const invalid = val !== "" && (Number(val) < 0 || Number(val) > 10 || !Number.isFinite(Number(val)));

                        return (
                          <tr key={a.alumnoId}>
                            <td>{a.matricula || "—"}</td>
                            <td>{a.nombre || "—"}</td>
                            <td>
                              <div className="prof-grade-cell">
                                <input
                                  className={`prof-input-grade ${invalid ? "is-invalid" : ""}`}
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="10"
                                  inputMode="decimal"
                                  value={val}
                                  placeholder="—"
                                  onChange={(e) => setEditedValue(g.id, a.alumnoId, e.target.value)}
                                />
                                <span className="prof-hint">0–10</span>
                              </div>
                            </td>
                            <td>
                              <div className="prof-actions">
                                <button
                                  className="prof-btn-save"
                                  disabled={status === "saving" || invalid || val === ""}
                                  onClick={() => handleSave(g.id, a)}
                                  title="Guardar calificación"
                                >
                                  {status === "saving" ? "Guardando…" : status === "saved" ? "Guardado ✓" : "Guardar"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
