import { useEffect, useMemo, useState } from "react";
import { getProfesorByUserId, getGruposByProfesor } from "../../services/profesoresApi";
import { getAlumnosDeGrupo } from "../../services/gruposApi";
import "../../styles/profesores.css";

export default function Profesores() {
  const session = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  }, []);

  const [profesor, setProfesor] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [alumnosByGrupo, setAlumnosByGrupo] = useState({}); // { [grupoId]: [] }
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");

        if (!session?.id) {
          setErr("No hay sesión activa.");
          return;
        }

        // 1) obtener profesor a partir del userId (en users.json)
        const prof = await getProfesorByUserId(session.id);
        setProfesor(prof);

        // 2) obtener grupos del profesor
        const gs = await getGruposByProfesor(prof.id);
        setGrupos(gs);

        // 3) cargar alumnos de cada grupo
        const entries = await Promise.all(
          gs.map(async (g) => {
            const alumnos = await getAlumnosDeGrupo(g.id);
            return [g.id, alumnos];
          })
        );
        setAlumnosByGrupo(Object.fromEntries(entries));
      } catch (e) {
        setErr(e.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    })();
  }, [session?.id]);

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
          const alumnos = alumnosByGrupo[g.id] || [];
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
                      <th>Calificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnos.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="prof-empty">Sin alumnos inscritos</td>
                      </tr>
                    ) : (
                      alumnos.map((a) => (
                        <tr key={a.alumnoId}>
                          <td>{a.matricula || "—"}</td>
                          <td>{a.nombre || "—"}</td>
                          <td>{a.calificacion ?? "—"}</td>
                        </tr>
                      ))
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
