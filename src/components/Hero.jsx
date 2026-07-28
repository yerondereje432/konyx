import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
      {/* Background Video (Requires hero-bg.mp4 in public folder) */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        poster="/hero-bg.jpg"
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          zIndex: -2,
          backgroundColor: '#1a1a1a'
        }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: -1
      }} />

      <div className="container" style={{ textAlign: 'center', color: '#fff', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span style={{ 
            textTransform: 'uppercase', 
            letterSpacing: '4px', 
            fontSize: '0.9rem',
            color: 'var(--color-accent)',
            display: 'block',
            marginBottom: '1.5rem'
          }}>
            Premium Event Styling
          </span>
          <h1 className="heading-primary" style={{ maxWidth: '900px', margin: '0 auto 2rem auto' }}>
            Decorating moments people remember.
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            maxWidth: '600px', 
            margin: '0 auto 3rem auto',
            color: '#e0e0e0',
            fontWeight: 300
          }}>
            We design breathtaking atmospheres for weddings, corporate galas, and exclusive celebrations.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/quote" className="btn btn-primary">Request a Quote</Link>
            <a href="#gallery" className="btn btn-outline">View Our Work</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
