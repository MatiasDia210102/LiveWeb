import { FaInstagram, FaTiktok, FaTwitch, FaKickstarter, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { useScrollReveal } from '../hooks/aparicion.js';

const Colores = {
  "Instagram": "hover:text-pink-500",
  "TikTok": "hover:text-gray-400", 
  "Twitch": "hover:text-purple-500",
  "Kick": "hover:text-green-400",
  "Email": "hover:text-cyan-400",
  "WhatsApp": "hover:text-green-400",
};

const streamLinks = [
  { Icono: FaInstagram, title: "Instagram", link: "https://www.instagram.com/matias_diaz05", color: "text-pink-500" },
  { Icono: FaTiktok, title: "TikTok", link: "https://www.tiktok.com/@matiasg_diaz", color: "text-gray-400" },
  { Icono: FaTwitch, title: "Twitch", link: "https://www.twitch.tv/tomatidecherry", color: "text-purple-500" },
  { Icono: FaKickstarter, title: "Kick", link: "https://kick.com/tomatidecherry", color: "text-green-400" },
  { Icono: FaEnvelope, title: "Email", link: "mailto:matiu210102dewilde@gmail.com", color: "text-cyan-400" },
  { Icono: FaWhatsapp, title: "WhatsApp", link: "https://wa.me/541131707740?text=Hola,%20vengo%20de%20tu%20página%20web", color: "text-green-400" },
];

const links = [
  { title: 'Presentacion', link: '/#main' },
  { title: 'Sobre Mí', link: '/#about' },
  { title: 'Contenido', link: '/#content' },
];

export default function Footer() {
    
  const [contentRef, isVisible] = useScrollReveal({ threshold: 0.05 }); 
  
  const transitionClasses = `transition-all duration-1000 ease-out ${ 
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10' 
  }`;

  return (
    <footer id="footer" className="bg-gradient-to-b from-neutral-900 to-black text-white pt-12 pb-8 border-t border-gray-700 font-[Poppins]">
            
      <div ref={contentRef} className="container mx-auto max-w-6xl px-6">
                
        <div className={`grid grid-cols-2 md:grid-cols-4 md:flex md:justify-between gap-x-8 gap-y-12 text-left pb-10 border-b border-gray-700 ${transitionClasses}`}
          style={{ transitionDelay: '300ms' }}>
                    
          <div className="text-left md:col-span-2">
            <h3 className="text-xl font-bold uppercase mb-4 text-cyan-400 drop-shadow-md"> Menú</h3>
                        
            <ul className="flex flex-wrap space-x-4 space-y-0">
                            
              {links.map((item, index) => (
                <li key={index}>
                  <a href={item.link} className="inline-block text-lg text-gray-300 drop-shadow-[0_4px_6px_purple] font-semibold transition-all duration-300  
                   hover:text-purple-500 hover:scale-110 ">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xl font-bold uppercase mb-4 text-cyan-400 drop-shadow-md"> Horario de Stream</h3>
            <p className="text-lg text-gray-300"> Jueves a Domingo a partir de las <span className="text-pink-400 font-bold">20:00 hs</span></p>
          </div>
                    
          <div className="col-span-2 text-center md:col-span-2 md:text-left"> 
                        
            <h3 className="text-xl font-bold uppercase mb-4 text-cyan-400 drop-shadow-md">Redes y Contacto</h3>

            <div className="flex justify-center md:justify-start space-x-5 mb-5"> 
              {streamLinks.map((Social, index) => (
                <a key={index} href={Social.link} target="_blank" rel="noopener noreferrer" 
                  className={`text-3xl text-white transition-colors duration-300 hover:scale-110 ${Colores[Social.title]}`}>
                  <Social.Icono />
                </a>
              ))}
            </div>

            <p className="text-sm text-gray-500 pt-2"> ¡Gracias por visitar mi página! 🚀</p>
            <p className="text-sm text-gray-500 pt-2"> Moni vicia del Counter</p>
          </div>
        </div>
                
        <p className={`text-sm text-gray-500 pt-2 text-center ${transitionClasses}`} style={{ transitionDelay: '300ms' }}>
          © {new Date().getFullYear()} Matías Díaz. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}