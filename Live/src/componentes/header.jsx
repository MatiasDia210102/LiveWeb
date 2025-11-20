import React, { useState } from 'react';
import { navbarLinks } from "./data/data.js";
import { FaGamepad, FaBars, FaTimes, FaLock, FaUserCircle, FaCrown, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useScrollPosition } from '../hooks/hookNavbar.js';
import { AnimatePresence } from 'framer-motion'; 
import MenuMovil from './MenuMovil.jsx'; 
import { useAuth, ROLES } from './AuthContext.jsx'; 

const AuthButton = () => {
    const { isLoggedIn, role, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!isLoggedIn) {
        return (
            <button onClick={() => navigate('/login')} aria-label='Iniciar Sesión' title='Iniciar Sesión' 
                className={`p-2 rounded-full transition-colors duration-300 text-cyan-400 bg-white dark:bg-gray-700 hover:scale-110`}>
                <FaLock size={24} /> 
            </button>
        );
    }

    let PanelIcon;
    let PanelText;
    let PanelRoute;
    let PanelColor;

    if (role === ROLES.JEFE) {
        PanelIcon = FaCrown;
        PanelText = `Panel Jefe (${user.username})`;
        PanelRoute = '/dashboard/admin';
        PanelColor = 'text-yellow-500';
    } else if (role === ROLES.ADMIN) {
        PanelIcon = FaUserCircle;
        PanelText = `Panel Admin (${user.username})`;
        PanelRoute = '/dashboard/lives';
        PanelColor = 'text-purple-500';
    } else {
        return (
            <button onClick={handleLogout} aria-label={`Cerrar Sesión (${user.username})`} title={`Cerrar Sesión (${user.username})`}
                className={`p-2 rounded-full transition-colors duration-300 text-gray-400 bg-white dark:bg-gray-700 hover:scale-110 hover:text-red-500`}>
                <FaSignOutAlt size={24} /> 
            </button>
        );
    }

    return (
        <div className="flex items-center space-x-3">
            <button onClick={() => navigate(PanelRoute)} aria-label={PanelText} title={PanelText} 
                className={`p-2 rounded-full transition-colors duration-300 ${PanelColor} bg-white dark:bg-gray-700 hover:scale-110`}>
                <PanelIcon size={24} /> 
            </button>

            <button onClick={handleLogout} aria-label="Cerrar Sesión" title="Cerrar Sesión"
                className={`p-2 rounded-full transition-colors duration-300 text-gray-400 bg-white dark:bg-gray-700 hover:scale-110 hover:text-red-500`}>
                <FaSignOutAlt size={24} /> 
            </button>
        </div>
    );
};

export default function NavBar() {
    const isScrolled = useScrollPosition(50);
    const [menuAbierto, setIsMenuOpen] = useState(false);
    const claseNav = `w-full transition-all duration-300 ease-in-out drop-shadow-[0_4px_6px_cyan] bg-white/95 dark:bg-black/95 dark:drop-shadow-[0_4px_6px_purple]
    ${isScrolled ? 'max-w-4xl mx-auto py-2 rounded-xl' : 'max-w-5xl mx-auto py-8 rounded-2xl' }`;
    const claseLogo = `text-2xl flex items-center font-bold uppercase transition-all duration-300 ${isScrolled ? 'text-xl gap-3' : '2xl gap-4'} `;
    const tamañoLogo = isScrolled ? 24 : 40; 

    const handleLinkClick = () => {
        if (menuAbierto) {
            setIsMenuOpen(false); 
        }
    };

    return (
        <div className="fixed top-0 inset-x-0 z-50 px-4">
            <nav className={claseNav}>
                <div className="flex justify-between items-center px-6 navlg:px-10"> 
    
                    <div className={claseLogo}>
                        <FaGamepad className="text-purple-500 animate-bounce mr-2" size={tamañoLogo} /> 
                        <p className="text-black dark:text-white">Matias</p>
                        <p className="text-purple-500 drop-shadow-[0_4px_6px_purple]">Diaz</p>
                    </div>

                    <div className="navlg:hidden flex items-center gap-3">
                        <AuthButton /> 
                        <button onClick={() => setIsMenuOpen(!menuAbierto)} className="text-black dark:text-white focus:outline-none" aria-label="Toggle menu">
                            {menuAbierto ? <FaTimes size={30} className="text-cyan-400" /> : <FaBars size={30} className="text-cyan-400" />}
                        </button>
                    </div>

                    <div className={`hidden navlg:flex items-center gap-8`}>
                        <ul className={`flex items-center gap-6 text-black dark:text-white text-xl font-orbitron drop-shadow-lg`}>
                            {navbarLinks.map((item) => (
                            <li key={item.id}>
                                <Link to={item.link} onClick={handleLinkClick}
                                    className="inline-block py-1 px-2 font-semibold drop-shadow-[0_2px_4px_cyan] hover:text-cyan-400 transition-all duration-300 hover:scale-110">
                                    {item.title}
                                </Link>
                            </li>
                            ))}
                        </ul>
                        <AuthButton />
                    </div>


                    <AnimatePresence>
                        {menuAbierto && (<MenuMovil navbarLinks={navbarLinks} handleLinkClick={handleLinkClick}/>)}
                    </AnimatePresence>
                </div> 
            </nav>
        </div>
    );
}