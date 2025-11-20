import { useState, useEffect } from 'react';

export const useScrollPosition = (threshold = 50) => {
  
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {

    const handleScroll = () => {

      const isScrolled = window.scrollY > threshold;

      if (isScrolled !== scrolled) {

        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {

      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled, threshold]);

  return scrolled;
};