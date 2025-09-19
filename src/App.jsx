import React, { useState } from "react";
import Dashboard from "./layouts/dashboard";
import Login from "./features/auth/login";

function App() {
  const [isAuth, setIsAuth] = useState(false);

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
