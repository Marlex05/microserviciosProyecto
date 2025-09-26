import React, { useState } from "react";
import Dashboard from "./layouts/dashboard";
import Login from "./features/auth/login";

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("user"));

  return (
    <>
      {isAuth ? (
        <Dashboard />
      ) : (
        <Login onLoginSuccess={() => setIsAuth(true)} />
      )}
    </>
  );
}

export default App;
