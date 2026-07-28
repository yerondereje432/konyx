import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = e => setMousePosition({ x: e.clientX, y: e.clientY });
    
    const handleMouseOver = e => {
      // Check if the user is hovering over a clickable element
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
        @media (max-width: 768px) {
          .aura-cursor { display: none !important; }
        }
      `}</style>
      <motion.div
        className="aura-cursor"
        animate={{ 
          x: mousePosition.x - (isHovering ? 24 : 16), 
          y: mousePosition.y - (isHovering ? 24 : 16), 
          scale: isHovering ? 1.5 : 1 
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
        style={{ 
          position: 'fixed', 
          top: 0, left: 0, 
          width: isHovering ? 48 : 32, 
          height: isHovering ? 48 : 32, 
          border: '1.5px solid var(--color-accent)', 
          borderRadius: '50%', 
          pointerEvents: 'none', 
          zIndex: 99999, 
          backgroundColor: isHovering ? 'rgba(184, 146, 90, 0.15)' : 'transparent', 
          backdropFilter: isHovering ? 'blur(2px)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-accent)',
          fontSize: '10px',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}
      >
        {isHovering && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}></motion.span>}
      </motion.div>
    </>
  );
}
