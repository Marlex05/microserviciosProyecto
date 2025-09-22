import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  // si no hay usuario, redirige a /login
  if (!user) return <Navigate to="/login" replace />;
  // si hay, deja pasar a las rutas hijas
  return <Outlet />;
}
