import { motion } from 'framer-motion';

export default function AnimatedText({ text, className, style }) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.04 * i }
    })
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 12, stiffness: 100 }
    },
    hidden: { opacity: 0, y: 40 }
  };

  return (
    <motion.h1 
      className={className} 
      style={{ ...style, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }} 
      variants={container} 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true }}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={child} style={{ display: 'inline-block', marginRight: '0.25em' }}>
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
