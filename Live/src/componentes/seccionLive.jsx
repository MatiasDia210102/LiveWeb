import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';

const LiveDayEditor = ({ dayData, onUpdate }) => {

    const [juegos, setJuegos] = useState(dayData.games.join(', '));
    const [horarios, setHorarios] = useState(dayData.times.join(', '));
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleSave = () => {
        setCargando(true);
        setMensaje('');

        try {
            const newGamesArray = juegos.split(',').map(g => g.trim()).filter(g => g.length > 0);
            const newTimesArray = horarios.split(',').map(t => t.trim()).filter(t => t.length > 0);

            if (newGamesArray.length !== newTimesArray.length) {
                throw new Error("El número de juegos debe coincidir con el número de horarios.");
            }

            const updatedDay = {day: dayData.day, games: newGamesArray, times: newTimesArray};
            onUpdate(updatedDay);
            setMensaje('Guardado exitoso.');
        } catch (error) {
            setMensaje(`Error: ${error.message}`);
        } finally {
            setCargando(false);
        }
    };
    
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-cyan-600 mb-6">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">{dayData.day}</h3>
            
            <div className="mb-4">
                <label className="block text-gray-400 mb-1">Juegos (separados por coma):</label>
                <input type="text" value={juegos} onChange={(e) => setJuegos(e.target.value)} disabled={cargando}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:ring-cyan-500 focus:border-cyan-500"/>
            </div>
            
            <div className="mb-4">
                <label className="block text-gray-400 mb-1">Horarios (separados por coma, ej: 20:00, 22:30):</label>
                <input type="text" value={horarios} onChange={(e) => setHorarios(e.target.value)} disabled={cargando}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:ring-cyan-500 focus:border-cyan-500"/>
            </div>

            <button onClick={handleSave} disabled={cargando}
                className={`w-full py-2 rounded font-semibold transition duration-200 flex items-center justify-center ${cargando ? 'bg-gray-600 text-gray-400' : 'bg-cyan-600 hover:bg-cyan-700 text-white'}`}>
                <FaSave className="mr-2"/> {cargando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            {mensaje && <p className={`mt-2 text-center text-sm ${mensaje.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{mensaje}</p>}
        </div>
    );
};

export default function DashboardLive() {
    const { isLoggedIn, role, calendarioLives, actualizarCalendarioLives, ROLES } = useAuth();
    const [currentSchedule, setCurrentSchedule] = useState(calendarioLives || []);
    const [globalMessage, setGlobalMessage] = useState('');

    useEffect(() => {
        if (calendarioLives) {
            setCurrentSchedule(calendarioLives);
        }
    }, [calendarioLives]); 

    if (!isLoggedIn || (role !== ROLES.JEFE && role !== ROLES.ADMIN)) {
        return <Navigate to="/" replace />; 
    }

    const handleDayUpdate = (updatedDay) => {
        const newSchedule = currentSchedule.map(dayData => 
            dayData.day === updatedDay.day ? updatedDay : dayData
        );
        setCurrentSchedule(newSchedule);
    
        actualizarCalendarioLives(newSchedule)
            .then(() => setGlobalMessage('Todo el calendario actualizado y guardado en el servidor.'))
            .catch(err => setGlobalMessage(`Error Global: ${err.message}`));
    };

    return (
        <div className="min-h-screen bg-gray-900 pt-32 px-4 flex justify-center pb-20">
            <div className="w-full max-w-4xl pt-10">
                <h1 className="text-4xl font-bold text-cyan-400 mb-8 text-center drop-shadow-[0_0_5px_cyan]">
                    Panel de Lives (Admin)
                </h1>
                
                {globalMessage && <div className={`p-3 mb-4 rounded text-center font-semibold ${globalMessage.startsWith('Error') ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>{globalMessage}</div>}

                <div className="grid grid-cols-1 gap-6">
                    {Array.isArray(currentSchedule) && currentSchedule.length > 0 ? (
                        currentSchedule.map((dayData) => (
                            <LiveDayEditor key={dayData.day} dayData={dayData} onUpdate={handleDayUpdate} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 text-xl p-8 bg-gray-800 rounded-lg">
                            Calendario vacío. Si eres Jefe, por favor, inicializa el calendario desde el "Panel de Control (Jefe)".
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}