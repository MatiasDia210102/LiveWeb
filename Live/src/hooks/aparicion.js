import { useState, useEffect, useRef } from 'react';

export const useScrollReveal = (options) => { 
  
  const [esVisible, setIsVisible] = useState(false); 
  const elementRef = useRef(null); 

  useEffect(() => { 

    const observer = new IntersectionObserver(([entry]) => { 
    
      if (entry.isIntersecting) { 

        setIsVisible(true); 
      } 
    }, options); 

    const currentElement = elementRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => { 

      if (currentElement) { 
        observer.unobserve(currentElement); 
      } 
    }; 
  }, [options]); 
  return [elementRef, esVisible]; 
};