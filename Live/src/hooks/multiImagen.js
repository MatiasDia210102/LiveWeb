import { useState, useEffect } from 'react';

const BACKGROUNDS = [
  '/Fotos/amegakure.jpg',
  '/Fotos/bienvenida.jpg',
  '/Fotos/among.jpg',
  '/Fotos/roblox.jpg',
];

const INTERVAL_TIME = 2000; 

export const useBackgroundRotator = () => {

  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    BACKGROUNDS.forEach(url => {
      const img = new Image();
      img.src = url;
    });

    const timer = setInterval(() => {
      setCurrentBgIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % BACKGROUNDS.length;
        return newIndex;
      });
    }, INTERVAL_TIME);

    return () => clearInterval(timer);
  }, []); 

  return BACKGROUNDS[currentBgIndex];
};