import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedText from './AnimatedText';
import Magnetic from './Magnetic';

export default function Hero() {
  return (
    <section style={{ 
      position: 'relative', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: 'url("/hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -2
      }} />
      
      {/* Dark Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: -1
      }} />

      <div className="container" style={{ textAlign: 'center', color: '#fff', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ 
              textTransform: 'uppercase', 
              letterSpacing: '4px', 
              fontSize: '0.9rem',
              color: 'var(--color-accent)',
              display: 'block',
              marginBottom: '1.5rem'
            }}>
            Premium Event Styling
          </motion.span>
          
          <AnimatedText 
            text="Decorating moments people remember." 
            className="heading-primary" 
            style={{ maxWidth: '900px', margin: '0 auto 2rem auto', overflow: 'hidden' }} 
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            style={{ 
              fontSize: '1.1rem', 
              maxWidth: '600px', 
              margin: '0 auto 3rem auto',
              color: '#e0e0e0',
              fontWeight: 300
            }}>
            We design breathtaking atmospheres for weddings, corporate galas, and exclusive celebrations.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Magnetic>
              <Link to="/quote" className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '0.95rem' }}>Request a Quote</Link>
            </Magnetic>
            <Magnetic strength={0.1}>
              <a href="#gallery" className="btn btn-outline" style={{ padding: '1.25rem 2.5rem', fontSize: '0.95rem' }}>View Our Work</a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
