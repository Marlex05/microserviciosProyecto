import React, { useState, useEffect } from 'react';

// Componente hijo para el formulario de cambio de contraseña
const CambiarPasswordForm = ({ userId }) => {
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setMensaje('No se pudo obtener el ID del usuario.');
            return;
        }

        setLoading(true);
        setMensaje('');

        try {
            const response = await fetch(`http://localhost:3001/api/alumnos/${userId}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nuevaPassword: password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje(data.message || 'Contraseña actualizada con éxito.');
                setPassword('');
            } else {
                setMensaje(data.message || 'No se pudo actualizar la contraseña.');
            }
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            setMensaje('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={formContainerStyle}>
            <h2 style={formTitleStyle}>Cambiar Contraseña</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nueva contraseña"
                    required
                    style={inputStyle}
                />
                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
            </form>
            {mensaje && <p style={messageStyle}>{mensaje}</p>}
        </div>
    );
};
//lol que mal
// Estilos para el formulario
const formContainerStyle = { marginTop: '2rem', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f9f9f9' };
const formTitleStyle = { color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '0.5rem', marginBottom: '1.5rem' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const inputStyle = { padding: '0.75rem', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' };
const buttonStyle = { padding: '0.75rem', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', fontSize: '1rem', cursor: 'pointer' };
const messageStyle = { color: 'red', marginTop: '1rem' };

// Componente principal
function Alumnos() {
    return (
        <div style={{ 
            height: '100%', 
            width: '100%',
            color: 'black',
            padding: '1rem'
        }}>
            <h1>Módulo de Alumnos</h1>
            <p>Contenido específico para la gestión de alumnos...</p>
            {/* Tablas, formularios, etc. */}
        </div>
    );
}

export default Alumnos;