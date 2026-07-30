import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = e => setMousePosition({ x: e.clientX, y: e.clientY });
    
    const handleMouseOver = e => {
      if (['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName) || e.target.closest('a, button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          body, a, button, input, select, textarea {
            cursor: none !important;
          }
        }
      `}</style>
      <motion.div
        className="hidden lg:flex pointer-events-none fixed top-0 left-0 z-[99999] items-center justify-center rounded-full border border-[#00E5FF]/80 transition-colors"
        animate={{ 
          x: mousePosition.x - (isHovering ? 20 : 14), 
          y: mousePosition.y - (isHovering ? 20 : 14), 
          scale: isHovering ? 1.4 : 1 
        }}
        transition={{ type: 'spring', stiffness: 600, damping: 32, mass: 0.5 }}
        style={{ 
          width: isHovering ? 40 : 28, 
          height: isHovering ? 40 : 28, 
          backgroundColor: isHovering ? 'rgba(29, 6, 244, 0.25)' : 'transparent', 
          backdropFilter: isHovering ? 'blur(4px)' : 'none',
          boxShadow: isHovering ? '0 0 20px rgba(0, 229, 255, 0.4)' : 'none'
        }}
      >
        {isHovering && <div className="w-2 h-2 rounded-full bg-[#00E5FF]"></div>}
      </motion.div>
    </>
  );
}
