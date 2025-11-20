import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';
// No necesitamos Navigate ya que eliminaremos las comprobaciones de rol/login.

// Mantendremos FilaUsuario intacta, pero simplificaremos las props.
// Ahora ignora 'usuarioActualId' y 'nombreUsuarioActual'
const FilaUsuario = ({ usuario, asignarRol, ROLES }) => {
    // Usamos datos dummy para el estado inicial
    const [nuevoRol, setNuevoRol] = useState(usuario.role);
    const [mensaje, setMensaje] = useState('Modo Diagnóstico');
    const [estaActualizando, setEstaActualizando] = useState(false);
    
    // Eliminamos la lógica de inmutabilidad (esUsuarioLogueado, esJefe, esInmutable)
    const esInmutable = false; // Desactivado para diagnóstico

    // La función manejarCambioDeRol ahora solo mostrará un log,
    // ya que no tenemos un usuario logueado en este modo de prueba.
    const manejarCambioDeRol = () => {
        console.log(`[DIAGNÓSTICO] Intento de asignar rol ${nuevoRol} a ${usuario.username}`);
        setMensaje(`Rol: ${usuario.role} (Cambio deshabilitado en modo diagnóstico)`);
    };

    const colorRol = (rol) => {
        switch(rol) {
            case ROLES.JEFE: return 'text-yellow-500 font-bold';
            case ROLES.ADMIN: return 'text-purple-500 font-bold';
            default: return 'text-cyan-400';
        }
    };

    return (
        <div className="flex items-center justify-between p-4 mb-2 bg-gray-800 rounded-lg border border-red-500">
            <div className="flex flex-col">
                {/* Ahora no podemos poner (Tú) porque eliminamos la prop del usuario logueado */}
                <p className="text-white text-lg">{usuario.username} (ID: {usuario.userId.substring(0, 5)}...)</p>
                <p className={`text-sm ${colorRol(usuario.role)}`}>Rol actual: {usuario.role}</p>
                {mensaje && <p className="text-xs text-red-500 mt-1">{mensaje}</p>}
            </div>
            
            <div className="flex items-center space-x-3">
                <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)} disabled={true} // Deshabilitado
                    className="p-2 rounded bg-gray-700 text-white border border-gray-600">
                    {Object.values(ROLES).map((rol) => (
                        <option key={rol} value={rol}>{rol.toUpperCase()}</option>
                    ))}
                </select>
                
                <button onClick={manejarCambioDeRol} disabled={true} // Deshabilitado
                    className={`px-4 py-2 rounded transition duration-200 bg-gray-600 text-gray-400 cursor-not-allowed`}>
                    Diagnóstico
                </button>
            </div>
        </div>
    );
};


export default function PanelJefeDiagnostico() {
    // Solo necesitamos obtenerTodosLosUsuarios y ROLES.
    const { obtenerTodosLosUsuarios, ROLES } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [setCargandoUsuarios] = useState(true);
    const [errorCarga, setErrorCarga] = useState('');
    
    // Eliminamos toda la lógica de Calendario para simplificar la vista.
    
    const cargarUsuarios = useCallback(async () => {
        setCargandoUsuarios(true);
        setErrorCarga('');

        try {
            const data = await obtenerTodosLosUsuarios(); 
            setUsuarios(data); 

            // LOG DE DIAGNÓSTICO
            console.log("-----------------------------------------");
            console.log("✅ RESULTADO DE DIAGNÓSTICO DEL FRONTEND:");
            console.log("Usuarios recibidos (data.length):", data.length);
            console.log("Datos:", data);
            console.log("-----------------------------------------");

        } catch (err) {
            setErrorCarga(`ERROR: ${err.message}. Asegúrate que el backend esté corriendo y la URL sea correcta.`);
            setUsuarios([]);
        } finally {
            setCargandoUsuarios(false);
        }
    }, [obtenerTodosLosUsuarios])
    

    useEffect(() => {
        // Ejecuta la carga de usuarios inmediatamente al montar el componente.
        cargarUsuarios();
    }, [cargarUsuarios]);
    
    // Eliminamos la verificación de rol/login.
    
    // Función Dummy para pasar a FilaUsuario
    const handleAssignRoleDummy = (targetUserId, newRole) => {
         console.log(`[DIAGNÓSTICO] Intento de asignar rol a ID: ${targetUserId}, Rol: ${newRole}`);
         return Promise.resolve({ message: "Dummy update." });
    };


    return (
        <div className="min-h-screen bg-gray-900 pt-32 px-4 flex justify-center pb-20">
            <div className="w-full max-w-4xl pt-10">
                <h1 className="text-4xl font-orbitron text-red-500 mb-8 text-center drop-shadow-[0_0_5px_red]">
                    PANEL DE DIAGNÓSTICO (IGNORANDO ROLES Y LOGIN)
                </h1>
                
                <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-red-700">
                    <h2 className="text-2xl text-white mb-6">Resultado: ({usuarios.length} Usuarios)</h2>
                    
                    {usuarios.length > 0 ? (
                        usuarios.map((u) => (
                            <FilaUsuario 
                                key={u.userId} 
                                usuario={u} 
                                asignarRol={handleAssignRoleDummy} 
                                ROLES={ROLES}
                            />
                        ))
                    ) : (
                         <p className="text-xl text-yellow-400 mt-4 text-center p-4">
                            CERO USUARIOS. Revisa la consola para ver si hubo un error de red, o si el backend está enviando un array vacío.
                        </p>
                    )}
                    
                    {errorCarga && <p className="text-red-400 mt-4 text-center font-bold">Error de Carga: {errorCarga}</p>}
                </div>
                
                {/* Eliminamos la sección de Herramientas de Contenido */}

            </div>
        </div>
    );
}