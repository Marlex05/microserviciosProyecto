import React from "react";

const RHList = ({ profesores }) => {
  return (
    <div className="rh-list">
      <h3>Lista de Profesores</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Puesto</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((p, index) => (
            <tr key={p.numeroEmpleado}>
              <td>{index + 1}</td>
              <td>{p.nombre}</td>
              <td>{p.puesto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RHList;
