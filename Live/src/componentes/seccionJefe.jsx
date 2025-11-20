import React, { useState, useEffect, useCallback } from 'react';
import { useAuth} from './AuthContext.jsx';
import { Navigate } from 'react-router-dom';

const FilaUsuario = ({ usuario, asignarRol, nombreUsuarioActual, ROLES }) => {
    const [nuevoRol, setNuevoRol] = useState(usuario.role);
    const [mensaje, setMensaje] = useState('');
    const [estaActualizando, setEstaActualizando] = useState(false);

    const manejarCambioDeRol = async () => {
        if (nuevoRol === usuario.role) return; 

        setEstaActualizando(true);
        setMensaje('');
        try {
            await asignarRol(usuario.userId, nuevoRol); 
            setMensaje(`Rol cambiado a ${nuevoRol}.`);
        } catch (err) {
            setMensaje(`Error: ${err.message}`);
            setNuevoRol(usuario.role); 
        } finally {
            setEstaActualizando(false);
        }
    };

    const colorRol = (rol) => {
        switch(rol) {
            case ROLES.JEFE: return 'text-yellow-500 font-bold';
            case ROLES.ADMIN: return 'text-purple-500 font-bold';
            default: return 'text-cyan-400';
        }
    };

    return (
        <div className="flex items-center justify-between p-4 mb-2 bg-gray-800 rounded-lg">
            <div className="flex flex-col">
                <p className="text-white text-lg">{usuario.username} {usuario.username === nombreUsuarioActual ? '(Tú)' : ''}</p>
                <p className={`text-sm ${colorRol(usuario.role)}`}>Rol actual: {usuario.role}</p>
                {mensaje && <p className="text-xs text-green-500 mt-1">{mensaje}</p>}
            </div>
            
            <div className="flex items-center space-x-3">
                <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)} disabled={estaActualizando}
                    className="p-2 rounded bg-gray-700 text-white border border-gray-600">
                    {Object.values(ROLES).filter(rol => rol !== ROLES.JEFE).map((rol) => (
                        <option key={rol} value={rol}>{rol.toUpperCase()}</option>
                    ))}
                </select>
                
                <button onClick={manejarCambioDeRol} disabled={estaActualizando || nuevoRol === usuario.role}
                    className={`px-4 py-2 rounded transition duration-200 ${nuevoRol !== usuario.role && !estaActualizando ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>
                    {estaActualizando ? 'Guardando...' : 'Asignar'}
                </button>
            </div>
        </div>
    );
};


export default function PanelJefe() {
    const { user, isLoggedIn, role, obtenerTodosLosUsuarios, actualizarRolUsuario, calendarioLives, actualizarCalendarioLives, ROLES } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [setCargandoUsuarios] = useState(true);
    const [errorCarga, setErrorCarga] = useState('');
    const [mensajeCalendario, setMensajeCalendario] = useState('');
    const [cargandoGuardado, setCargandoGuardado] = useState(false);

    const calendarioInicial = [
        { day: 'Viernes', games: ['Resident Evil', 'Outlast'], times: ['20:00', '22:00'] },
        { day: 'Sabado', games: ['Blood Strike', 'Among us', 'Roblox'], times: ['20:00', '22:00', '00:15'] },
        { day: 'Domingo', games: ['Outlast', 'R.E.P.O'], times: ['19:00', '21:00'] },
    ];

    const manejarGuardadoCalendario = async () => {
        setCargandoGuardado(true);
        setMensajeCalendario('');
        try {
            await actualizarCalendarioLives(calendarioInicial);
            setMensajeCalendario('✅ ¡Calendario inicial guardado exitosamente!');
        } catch (err) {
            setMensajeCalendario(`❌ Error al guardar el calendario: ${err.message}`);
        } finally {
            setCargandoGuardado(false);
        }
    };

    const cargarUsuarios = useCallback(async () => {
        setCargandoUsuarios(true);
        setErrorCarga('');

        try {
            const data = await obtenerTodosLosUsuarios(); 
            setUsuarios(data.filter(u => u.userId !== user.userId)); 
        } catch (err) {
            setErrorCarga(err.message);
        } finally {
            setCargandoUsuarios(false);
        }
    }, [obtenerTodosLosUsuarios, user.userId, setCargandoUsuarios])

    useEffect(() => {
        if (isLoggedIn && role === ROLES.JEFE) {
            cargarUsuarios();
        }
    }, [ROLES.JEFE, cargarUsuarios, isLoggedIn, role]);

    if (!isLoggedIn || role !== ROLES.JEFE) {
        return <Navigate to="/" replace />;
    }

    const handleAssignRole = async (targetUserId, newRole) => {
        try {
            await actualizarRolUsuario(targetUserId, newRole);
            await cargarUsuarios();
            return { message: `Rol de ${targetUserId} cambiado a ${newRole} con éxito.` };
        } catch (err) {
            throw err;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 pt-32 px-4 flex justify-center pb-20">
            <div className="w-full max-w-4xl pt-10">
                <h1 className="text-4xl font-orbitron text-cyan-400 mb-8 text-center drop-shadow-[0_0_5px_cyan]">
                    Panel de Control (Jefe)
                </h1>
                
                <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-purple-700">
                    <h2 className="text-2xl text-white mb-6">Administración de Roles ({usuarios.length} Usuarios)</h2>
                    
                    {usuarios.map((u) => (
                        <FilaUsuario key={u.userId} usuario={u} asignarRol={handleAssignRole} nombreUsuarioActual={user.username} ROLES={ROLES}/>
                    ))}
                    {errorCarga && <p className="text-red-400 mt-4 text-center">Error al cargar usuarios: {errorCarga}</p>}
                </div>

                <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-blue-700 mt-8">
                    <h2 className="text-2xl text-white mb-6">Herramientas de Contenido</h2>
                    
                    <div className="bg-gray-800 p-4 rounded-lg border border-cyan-700">
                        <h3 className="text-xl text-cyan-400 mb-3">Inicializar Calendario de Lives</h3>
                        <p className="text-gray-400 mb-3">
                            {calendarioLives && calendarioLives.length === 0 
                                ? 'La base de datos de Lives está vacía. ¡Presiona para cargar el horario inicial!' 
                                : `El calendario ya tiene ${calendarioLives ? calendarioLives.length : 0} días cargados.`
                            }
                        </p>

                        <button onClick={manejarGuardadoCalendario} disabled={cargandoGuardado} className="w-full py-2 rounded font-semibold transition duration-200 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:text-gray-400">
                            {cargandoGuardado ? 'Guardando...' : 'Guardar Horario Inicial'}
                        </button>
                        {mensajeCalendario && <p className={`mt-2 text-sm text-center font-bold ${mensajeCalendario.startsWith('❌') ? 'text-red-400' : 'text-green-400'}`}>{mensajeCalendario}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}