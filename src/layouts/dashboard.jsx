import React, { useState } from "react";
import Alumnos from "../features/alumnos/alumnos";
import Profesores from "../features/profesores/profesores";
import ServiciosEscolares from "../features/serviciosEscolares/serviciosEscolares";
import RecursosHumanos from "../features/recursosHumanos/recursosHumanos";
import "../styles/dashboard.css";

function Dashboard() {
    const [active, setActive] = useState("Alumnos");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const renderContent = () => {
        switch (active) {
            case "Alumnos":
                return <Alumnos />;
            case "Profesores":
                return <Profesores />;
            case "Servicios":
                return <ServiciosEscolares />;
            case "Recursos":
                return <RecursosHumanos />;
            default:
                return <div>Selecciona una opción</div>;
        }
    };

    return (
        <div className="dashboard-container">
            {/* Botón hamburguesa - se oculta cuando sidebarOpen es true */}
            {!sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="hamburger-btn"
                >
                    ☰
                </button>
            )}

            {/* Overlay para cerrar el menú al hacer click fuera */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="sidebar-overlay"
                />
            )}

            {/* Barra lateral flotante */}
            <nav className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
                <ul className="sidebar-menu">
                    <li
                        onClick={() => {
                            setActive("Alumnos");
                            setSidebarOpen(false);
                        }}
                        className={`menu-item ${active === "Alumnos" ? "active" : ""}`}
                    >
                        Alumnos
                    </li>
                    <li
                        onClick={() => {
                            setActive("Profesores");
                            setSidebarOpen(false);
                        }}
                        className={`menu-item ${active === "Profesores" ? "active" : ""}`}
                    >
                        Profesores
                    </li>
                    <li
                        onClick={() => {
                            setActive("Servicios");
                            setSidebarOpen(false);
                        }}
                        className={`menu-item ${active === "Servicios" ? "active" : ""}`}
                    >
                        Servicios Escolares
                    </li>
                    <li
                        onClick={() => {
                            setActive("Recursos");
                            setSidebarOpen(false);
                        }}
                        className={`menu-item ${active === "Recursos" ? "active" : ""}`}
                    >
                        Recursos Humanos
                    </li>
                </ul>
            </nav>

            {/* Contenedor central */}
            <main className="main-content">
                <div className="content-wrapper">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;