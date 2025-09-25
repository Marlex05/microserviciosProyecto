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
            const response = await fetch(`http://10.16.13.220:3001/api/alumnos/${userId}/password`, {
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
    const [alumno, setAlumno] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    // Recuperar usuario actual desde localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?.id; // obtenemos el id del usuario actual
 
    useEffect(() => {
        if (!userId) {
            setError('No se encontró el ID del usuario en el almacenamiento.');
            setLoading(false);
            return;
        }
 
        const fetchAlumnoData = async () => {
            try {
                const response = await fetch(`http://10.16.13.220:3001/api/alumnos/${userId}`);
                if (!response.ok) throw new Error('No se pudieron obtener los datos del alumno.');
                const data = await response.json();
                setAlumno(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
 
        fetchAlumnoData();
    }, [userId]);
 
    if (loading) return <p>Cargando datos del alumno...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!alumno) return <p>No se encontraron datos de alumno.</p>;
 
    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>Módulo de Alumnos</h1>
 
            <div style={cardStyle}>
                <h2 style={cardTitleStyle}>Información Personal</h2>
                <p><strong>Matrícula:</strong> {alumno.id || 'N/A'}</p>
                <p><strong>Nombre:</strong> {alumno.nombre}</p>
                <p><strong>Carrera:</strong> {alumno.carrera}</p>
            </div>
 
            <div style={cardStyle}>
                <h2 style={cardTitleStyle}>Grupos y Calificaciones</h2>
                {alumno.grupos?.length > 0 ? (
                    alumno.grupos.map((grupo, grupoIndex) => (
                        <div key={grupoIndex} style={groupCardStyle}>
                            <h3 style={groupTitleStyle}>Grupo: {grupo.nombreGrupo}</h3>
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={tableHeaderRowStyle}>
                                        <th style={tableHeaderStyle}>Materia</th>
                                        <th style={tableHeaderStyle}>Nota</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grupo.calificaciones.map((cal, calIndex) => (
                                        <tr
                                            key={`${grupo.nombreGrupo}-${cal.materia}-${calIndex}`}
                                            style={calIndex % 2 === 0 ? tableRowStyle : tableRowAlternateStyle}
                                        >
                                            <td style={tableDataStyle}>{cal.materia}</td>
                                            <td style={tableDataStyle}>{cal.nota}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                ) : (
                    <p>No ha estado en grupos.</p>
                )}
            </div>
 
            <CambiarPasswordForm userId={userId} />
        </div>
    );
}
 
// Estilos del componente principal
const containerStyle = { padding: '2rem', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' };
const titleStyle = { color: '#333', textAlign: 'center', marginBottom: '2rem' };
const cardStyle = { backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '1.5rem', color: '#333' };
const cardTitleStyle = { color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem', marginBottom: '1rem' };
const groupCardStyle = { border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' };
const groupTitleStyle = { color: '#555', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
const tableHeaderRowStyle = { backgroundColor: '#007bff', color: 'white' };
const tableHeaderStyle = { padding: '0.75rem', textAlign: 'left' };
const tableRowStyle = { backgroundColor: '#f2f2f2' };
const tableRowAlternateStyle = { backgroundColor: '#fff' };
const tableDataStyle = { padding: '0.75rem', border: '1px solid #ddd' };
 
export default Alumnos;
 
 