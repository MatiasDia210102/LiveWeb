import React, { useState, useRef, useEffect } from 'react'; 
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

export default function GameCard({ game }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false); 
    const [isMuted, setIsMuted] = useState(true); 
    const videoRef = useRef(null); 
    const timerRef = useRef(null);
    const DELAY_MS = 100; 

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleMouseEnter = () => {
        setIsHovered(true);

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            setIsVideoPlaying(true);
            
            if (videoRef.current) {
                videoRef.current.play().catch(error => {
                    console.error("Error al intentar reproducir el video:", error);
                });
            }
        }, DELAY_MS);
    };

    const handleMouseLeave = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        
        timerRef.current = setTimeout(() => {
            setIsVideoPlaying(false);
            setIsHovered(false); 

            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
                setIsMuted(true); 
            }
        }, DELAY_MS);
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    const toggleMute = (e) => {
        e.stopPropagation(); 
        setIsMuted(prev => !prev);
    };

    return (
        <div className="relative w-full max-w-xs md:max-w-sm h-64 md:h-80 rounded-xl overflow-hidden shadow-xl 
            bg-slate-800 transition-all duration-500 cursor-pointer group"
            onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            
            <img src={game.image} alt={`Imagen de ${game.name}`} className={`w-full h-full object-cover transition-transform duration-500 ease-in-out 
                ${isHovered ? 'scale-110 opacity-30' : 'scale-100 opacity-100'}`}/>
            
            {isVideoPlaying && game.trailerUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <video ref={videoRef} src={game.trailerUrl} loop muted={isMuted} playsInline controls={false} className="w-full h-full object-cover" >
                        Tu navegador no soporta la etiqueta de video.
                    </video>
                    
                    <button onClick={toggleMute}
                        className="absolute bottom-1/4 right-2 p-2 bg-black/50 text-white rounded-full z-10 transition-colors hover:bg-black/70"
                        aria-label={isMuted ? "Activar sonido" : "Silenciar"}>
                        {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                    </button>
                </div>
            )}
        </div>
    );
}