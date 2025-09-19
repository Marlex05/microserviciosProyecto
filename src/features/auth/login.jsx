import React, { useState } from 'react';
import '../../styles/login.css';

const Login = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Enviando login:", formData);  // Log antes de enviar

        try {
            const res = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            console.log("Respuesta recibida del backend:", res);

            const data = await res.json();
            console.log("Data parseada:", data);

            if (res.ok && data.success) {
                console.log("Login exitoso:", data.user);
                // Guardamos token y rol en localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token || '');

                // Llamamos a la función del App para mostrar Dashboard
                onLoginSuccess?.();
            } else {
                console.log("Login fallido:", data.message);
                alert(data.message || 'Error al iniciar sesión');

            }
        } catch (error) {
            console.error('Error en login:', error);
            alert('Error al conectar con el servidor');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Iniciar Sesión</h2>
                    <p>Bienvenido de vuelta</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Ingresa tu usuario"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Ingresa tu contraseña"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="checkbox-container">
                            <input type="checkbox" />
                            <span className="checkmark"></span>
                            Recordar sesión
                        </label>
                        <a href="#forgot" className="forgot-link">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    <button type="submit" className="login-button">
                        Iniciar Sesión
                    </button>
                </form>

                <div className="login-footer">
                    <p>¿No tienes una cuenta? <a href="#register">Regístrate</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
