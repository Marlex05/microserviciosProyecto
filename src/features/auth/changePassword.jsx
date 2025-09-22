import { useState } from "react";
import { changePassword } from "../../services/authApi";
import "../../styles/changePassword.css";

export default function ChangePassword() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id ?? null;

  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (!userId) return setMsg("No hay usuario autenticado.");
    try {
      setLoading(true);
      setMsg("");
      await changePassword({ userId, oldPassword, newPassword });
      setMsg("Contraseña actualizada ✅");
      setOld("");
      setNew("");
    } catch (err) {
      setMsg(err.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="cp-container">
      <h2 className="cp-title">Cambio de contraseña</h2>

      <form className="cp-form" onSubmit={onSubmit}>
        <label className="cp-field">
          <span>Contraseña actual</span>
          <input
            className="cp-input"
            type="password"
            value={oldPassword}
            onChange={(e) => setOld(e.target.value)}
            required
          />
        </label>

        <label className="cp-field">
          <span>Nueva contraseña</span>
          <input
            className="cp-input"
            type="password"
            value={newPassword}
            onChange={(e) => setNew(e.target.value)}
            required
          />
        </label>

        <button className="cp-button" type="submit" disabled={loading}>
          {loading ? "Actualizando..." : "Guardar"}
        </button>
      </form>

      {msg && <div className="cp-msg">{msg}</div>}
    </section>
  );
}
