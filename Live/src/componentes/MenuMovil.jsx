import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const menuVariants = {
    hidden: { 
        opacity: 0, 
        y: -20,
        transition: { when: "afterChildren" }
    },

    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            duration: 0.3, 
            when: "beforeChildren",
            staggerChildren: 0.05
        }
    },

    exit: {
        opacity: 0, 
        y: -20,
        transition: { duration: 0.3 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
};

export default function MobileMenu({ navbarLinks, handleLinkClick }) {
    return (
        <motion.ul variants={menuVariants} initial="hidden" animate="visible" exit="exit" className={`navlg:hidden absolute top-full left-0 w-full flex flex-col items-center bg-black/90 py-4 shadow-2xl rounded-b-xl 
                text-white text-xl font-orbitron drop-shadow-lg`}>

            {navbarLinks.map((item) => (
                <motion.li key={item.id} className="w-full text-center p-2" variants={itemVariants}>
                    <Link to={item.link} onClick={handleLinkClick} className="inline-block py-2 px-2 font-semibold drop-shadow-[0_2px_4px_cyan] hover:text-cyan-400 transition-all duration-300 hover:scale-110 w-full">
                        {item.title}
                    </Link>
                </motion.li>
            ))}
        </motion.ul>
    );
}