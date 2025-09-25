import React, { useState } from "react";
import Dashboard from "./layouts/dashboard";
import Login from "./features/auth/login";
import RH from "./features/recursoshumanos/recursosHumanos"; // importar módulo RH

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("user"));

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
