//import React, { useState } from "react";
//import Dashboard from "./layouts/dashboard";
//import Login from "./features/auth/login";

//function App() {
  //const [isAuth, setIsAuth] = useState(true);

  //return (
    //<>
      //{isAuth ? (
        //<Dashboard />
      //) : (
        //<Login onLoginSuccess={() => setIsAuth(true)} />
      //)}
    //</>
  //);
//}

//export default App;

// src/App.jsx
import React from "react";
import Dashboard from "./layouts/dashboard";

export default function App() {
  return <Dashboard />;
}
