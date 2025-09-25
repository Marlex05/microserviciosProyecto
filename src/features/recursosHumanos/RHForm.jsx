import React, { useState } from "react";

const RHForm = ({ onProfesorAgregado }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    puesto: "profesor",
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4001/profesores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Profesor registrado con éxito");
        onProfesorAgregado(data.profesor);
        setFormData({ nombre: "", puesto: "profesor", username: "", password: "" });
      } else {
        alert(data.message || "Error al registrar profesor");
      }
    } catch (error) {
      console.error("Error al registrar profesor:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rh-form">
      <input
        type="text"
        name="nombre"
        value={formData.nombre}
        placeholder="Nombre completo"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="username"
        value={formData.username}
        placeholder="Usuario"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        placeholder="Contraseña"
        onChange={handleChange}
        required
      />
      <select name="puesto" value={formData.puesto} onChange={handleChange}>
        <option value="profesor">Profesor</option>
        <option value="servicios escolares">Servicios Escolares</option>
        <option value="rh">Recursos Humanos</option>
      </select>
      <button type="submit">Registrar Profesor</button>
    </form>
  );
};

export default RHForm;
