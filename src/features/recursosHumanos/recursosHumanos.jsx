import React, { useState, useEffect } from "react";
import RHForm from "./RHForm";
import RHList from "./RHList";
import './rh.css';
import { getProfesores } from "../../services/rhApi";

const RH = () => {
  const [profesores, setProfesores] = useState([]);

  // Traer la lista de profesores al cargar
  const fetchProfesores = async () => {
    try {
      const res = await getProfesores();
      // backend devuelve array directly; por seguridad normalizamos:
      const list = Array.isArray(res) ? res : (res?.data ?? []);
      setProfesores(list);
    } catch (error) {
      console.error("Error al cargar profesores:", error);
    }
  };

  useEffect(() => {
    fetchProfesores();
  }, []);

  // Función para agregar profesor desde el formulario
  const agregarProfesor = (nuevoProfesor) => {
    // si backend devolvió objeto { id, ... } o si devolvió { profesor: {...} }
    const prof = nuevoProfesor?.profesor ?? nuevoProfesor;
    setProfesores(prev => [...prev, prof]);
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
