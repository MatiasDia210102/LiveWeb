import React from 'react';
import { useAuth } from './AuthContext.jsx';
import { FaCalendarAlt, FaGamepad } from 'react-icons/fa';
import { games } from './data/juegos.js'; 

const GAME_IMAGE_MAP = games.reduce((map, game) => {
  map[game.name.toLowerCase().trim()] = game.image; 
  return map;
}, {});

export default function LiveSchedule() {
  const { calendarioLives } = useAuth();
  const getGameImage = (gameName) => {

    const normalizedName = gameName.toLowerCase().trim();
    const imageUrl = GAME_IMAGE_MAP[normalizedName];

    if (imageUrl) {
      return <img src={imageUrl} alt={gameName} className="w-full h-full object-cover" />;
    }
    return <FaGamepad size={30} className="text-gray-400" />;
  };

  return (
  
    <section id="lives" className="py-20 bg-gray-100 dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <h2 className="text-4xl font-bold text-center text-purple-600 dark:text-cyan-400 mb-12">
          <FaCalendarAlt className="inline-block mr-3" /> 
          Calendario de Próximos Lives
        </h2>
          
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {Array.isArray(calendarioLives) && calendarioLives.length > 0 ? (
            calendarioLives.map((dayData) => (
              <div key={dayData.day} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl border-t-4 border-purple-500 transform transition duration-500 hover:scale-[1.02]">
              
                <h3 className="text-3xl font-extrabold text-black dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  {dayData.day}
                </h3>
                
                <div className="flex flex-col items-center">
                  <div className="flex justify-center flex-wrap gap-4 mb-4 min-h-[120px]">
                    {dayData.games.map((game, index) => (
                    
                      <div key={index} className="flex flex-col items-center w-24 text-center">
                        
                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-1 overflow-hidden shadow-lg">
                          {getGameImage(game)}
                        </div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate w-full">{game}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 w-full">
                    
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Horarios:</p>
                    
                    <div className="flex justify-center space-x-4">
                      {dayData.times.map((time, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full font-mono text-sm shadow-md">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-xl text-gray-600 dark:text-gray-400 p-8">
              Cargando el calendario de Lives...
            </p>
          )}
        </div>
      </div>
    </section>
  );
}