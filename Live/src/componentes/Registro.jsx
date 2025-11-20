import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            
            await register(username, password); 
            navigate('/');
        } catch (err) {
            setError(err.message || 'Error en el registro. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900 pt-32 pb-16">
            <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg w-full max-w-sm">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-cyan-400">
                    Registro
                </h2>
                 {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                
                <input type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} required
                className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-black dark:text-white"/>
                
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 mb-6 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-black dark:text-white"/>
                
                <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-md transition duration-200" >
                    Registrarme
                </button>
                
                <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-400">
                    ¿Ya tienes cuenta? <Link to="/login" className="text-cyan-500 hover:underline">Inicia sesión aquí</Link>
                </p>
            </form>
        </div>
    );
}