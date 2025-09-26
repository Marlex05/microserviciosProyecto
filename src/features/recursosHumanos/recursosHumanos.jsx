import React, { useState, useEffect } from "react";
import RHForm from "./RHForm";
import RHList from "./RHList";
import './rh.css';

const RH = () => {
  const [profesores, setProfesores] = useState([]);

  // Traer la lista de profesores al cargar
  const fetchProfesores = async () => {
    try {
      const res = await fetch("http://10.16.1.117:4001/profesores"); // tu puerto RH
      const data = await res.json();
      setProfesores(data);
    } catch (error) {
      console.error("Error al cargar profesores:", error);
    }
  };

  useEffect(() => {
    fetchProfesores();
  }, []);

  // Función para agregar profesor desde el formulario
  const agregarProfesor = (nuevoProfesor) => {
    setProfesores([...profesores, nuevoProfesor]);
  };

  return (
    <div className="rh-container">
      <h2>Recursos Humanos</h2>
      <RHForm onProfesorAgregado={agregarProfesor} />
      <RHList profesores={profesores} />
    </div>
  );
};

export default RH;
