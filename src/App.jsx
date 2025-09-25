import React, { useState } from "react";
import Dashboard from "./layouts/dashboard";
import Login from "./features/auth/login";
import RH from "./features/recursoshumanos/recursosHumanos"; // importar módulo RH

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [rol, setRol] = useState(null);

  // Leer rol del usuario logueado
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <>
      {isAuth ? (
        user?.rol === "rh" ? <RH /> : <Dashboard />
      ) : (
        <Login onLoginSuccess={() => setIsAuth(true)} />
      )}
    </>
  );
}

export default App;
