import React, { createContext, useContext, useState, useEffect } from 'react';
export const ROLES = {
    JEFE: 'jefe',
    ADMIN: 'administrador',
    ESPECTADOR: 'espectador',
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const API_URL = `${BASE_URL}/api`;

const ContextoAuth = createContext();
export const useAuth = () => useContext(ContextoAuth);

export const ProveedorAuth = ({ children }) => {
    const [usuario, setUsuario] = useState(null); 
    const [estaLogeado, setEstaLogeado] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [calendarioLives, setCalendarioLives] = useState([]);

    const _saveSession = (userData, token) => {
        setUsuario(userData);
        setEstaLogeado(true);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const _clearSession = () => {
        setUsuario(null);
        setEstaLogeado(false);
        localStorage.clear();
    };

    const _fetchProtected = (url, options = {}) => {
        const token = localStorage.getItem('token');
        
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    };

    const iniciarSesion = async (username, password) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al conectar con el servidor.');
        }

        const { token, ...userData } = data;
        _saveSession(userData, token);
        return userData;
    };

    const registrarse = async (username, password) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en el registro.');
        }

        const { token, ...userData } = data;
        _saveSession(userData, token);
        return userData;
    };

    const cerrarSesion = () => {
        _clearSession();
    };

      const obtenerTodosLosUsuarios = async () => {
        try {
            const response = await _fetchProtected(`${API_URL}/users`);
            
            if (response.status === 401) {
                cerrarSesion();
                throw new Error("Sesión expirada. Por favor, inicia sesión de nuevo.");
            }
            
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Error del servidor al obtener usuarios.");
            }
            
            if (!Array.isArray(data)) {
                console.error("El backend devolvió un formato inesperado:", data);
                throw new Error("Formato de datos de usuario incorrecto. Revisa el backend.");
            }

            console.log("Usuarios obtenidos exitosamente del Backend:", data);
    
            return data;

        } catch (error) {
            console.error("Error de red o CORS al obtener usuarios:", error.message);
            if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
                console.warn("Devolviendo datos de prueba. Asegúrate de que el servidor esté activo en 'http://localhost:3001'.");
                return [
                    { userId: 'jefe-id-mock', username: 'JefeMock', role: ROLES.JEFE },
                    { userId: 'admin-id-mock', username: 'AdminMock', role: ROLES.ADMIN },
                    { userId: 'espect-id-mock', username: 'EspectadorMock', role: ROLES.ESPECTADOR },
                ];
            }
            throw error;
        }
    };  
    
    const actualizarRolUsuario = async (targetUserId, nuevoRol) => {

        const response = await _fetchProtected(`${API_URL}/users/${targetUserId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role: nuevoRol }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar el rol.');
        }
        
        if (targetUserId === usuario.userId) {
            _saveSession({ ...usuario, role: nuevoRol }, localStorage.getItem('token'));
        }

        return data;
    };

    const fetchCalendario = async () => {
        try {
            const response = await fetch(`${API_URL}/schedule`);
            const data = await response.json();
            
            if (response.ok) {
                setCalendarioLives(data);
            } else {
                console.error("Error al cargar el calendario:", data.message);
            }
        } catch(error) {
            console.error("Fallo de red al cargar el calendario:", error);
        }
    };
    
    const actualizarCalendarioLives = async (nuevoCalendario) => {
        const response = await _fetchProtected(`${API_URL}/schedule`, {
            method: 'PUT',
            body: JSON.stringify(nuevoCalendario),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Permiso denegado para editar el calendario.");
        }
        
        setCalendarioLives(nuevoCalendario);
        return data;
    };

    useEffect(() => {
        const inicializar = async () => {
            const token = localStorage.getItem('token');
            const userStored = localStorage.getItem('user');
        
            if (token && userStored) {
                try {
                    setUsuario(JSON.parse(userStored));
                    setEstaLogeado(true);
                } catch (e) {
                    localStorage.clear();
                }
            }
        
            try { 
                await fetchCalendario();
            } catch (e) {
                console.error("Fallo al obtener calendario al iniciar.", e);
            } finally {
                setCargando(false);
            }
        };
   
        inicializar();
    }, []);

     if (cargando) return null;

    return (
        <ContextoAuth.Provider value={{ user: usuario, isLoggedIn: estaLogeado, role: usuario ? usuario.role : null, cargando,
            login: iniciarSesion, logout: cerrarSesion, register: registrarse, actualizarRolUsuario, obtenerTodosLosUsuarios, ROLES, calendarioLives, actualizarCalendarioLives}}>
            {children}
        </ContextoAuth.Provider>
    );
};