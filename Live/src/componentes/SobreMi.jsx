import { FaUser, FaBullseye, FaLightbulb } from "react-icons/fa"; 
import { useScrollReveal } from '../hooks/aparicion.js';
import { useBackgroundRotator } from '../hooks/multiImagen.js';

export default function About() { 

  const currentBgUrl = useBackgroundRotator(); 
  const [contentRef, isVisible] = useScrollReveal({ threshold: 0.1 }); 

  const transicion = `transition-all duration-1000 ease-out ${ 
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10' 
  }`;
  
  return ( 
    <section id="about" className="py-10 text-white bg-no-repeat bg-cover bg-bottom w-full relative overflow-hidden transition-bg duration-1000 ease-in-out
    "style={{ backgroundImage: `url('${currentBgUrl}')`}}> 
      
      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-black/100 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/100 to-transparent"></div>
      
      <div className="relative z-10">

        <h2 className={`text-4xl font-bold text-center mb-10 text-cyan-400 ${transicion}`} style={{ transitionDelay: '0ms' }}>Sobre mí</h2> 

        <div ref={contentRef} className="container max-w-5xl mx-auto px-6 flex flex-wrap md:flex-nowrap justify-center md:justify-between items-center gap-8 md:gap-12"> 
          
          <div className={`w-full md:w-2/5 flex justify-center ${transicion}`} style={{ transitionDelay: '150ms' }}> 
            <img src="/Fotos/Pain.png"  alt="Personaje de anime" className="w-full h-auto max-h-96 object-contain md:h-96 md:w-auto" /> 
          </div> 

          <div className={`w-full md:w-2/3 space-y-8 text-center md:text-left ${transicion}`} style={{ transitionDelay: '300ms' }}> 
            
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border-l-8 border-purple-500 mx-auto max-w-lg">

              <p className="text-base md:text-xl leading-relaxed"> 
                <FaUser className="inline-block text-cyan-400 mr-2 text-2xl" /> 
                Conocido también como{" "} 
                <span className="text-pink-400 font-semibold">TomatideCherry</span>,  
                creador de contenido y streamer. Mi aventura comenzó en TikTok haciendo lives  
                y subiendo clips de partidas, y ahora también hago directos en Twitch y Kick 🎮. 
              </p> 
            </div> 
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-lg"> 
              
              <div className="bg-slate-800 text-white p-4 rounded-2xl shadow-lg border-l-8 border-purple-500"> 
                <h3 className="text-2xl font-semibold text-purple-400 flex items-center justify-center md:justify-start gap-1"> 
                  <FaBullseye /> Objetivos 
                </h3> 
                <ul className="mt-3 space-y-2 text-base md:text-xl"> 
                  <li className="flex items-center gap-2 justify-center md:justify-start">🎯 Hacer crecer la comunidad</li> 
                  <li className="flex items-center gap-2 justify-center md:justify-start">🎯 Crear un espacio cómodo para todos</li> 
                  <li className="flex items-center gap-2 justify-center md:justify-start">🎯 Llegar a más plataformas</li> 
                </ul> 
              </div> 
              
              <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg border-l-8 border-purple-500"> 
                <h3 className="text-2xl font-semibold text-yellow-400 flex items-center justify-center md:justify-start gap-1"> 
                  <FaLightbulb /> Habilidades 
                </h3> 
                <ul className="mt-3 space-y-2 text-base md:text-xl"> 
                  <li className="flex items-center gap-2 justify-center md:justify-start">💡 Constancia en streams</li> 
                  <li className="flex items-center gap-2 justify-center md:justify-start">💡 Interacción con el chat</li> 
                  <li className="flex items-center gap-2 justify-center md:justify-start">💡 Edición de contenido</li> 
                </ul> 
              </div> 
            </div> 
          </div> 
        </div> 
       </div>
    </section> 
  ); 
}