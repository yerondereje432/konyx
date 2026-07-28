import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AnimatedText from './AnimatedText';

const fallbackPortfolio = [
  { id: 1, title: 'The Grand Botanica', category: 'Wedding', img: '/gallery-1.jpg' },
  { id: 2, title: 'Tech Gala 2024', category: 'Corporate', img: '/gallery-2.jpg' },
  { id: 3, title: 'Golden Jubilee', category: 'Birthday', img: '/gallery-3.jpg' },
  { id: 4, title: 'Minimalist Romance', category: 'Wedding', img: '/gallery-4.jpg' }
];

const GalleryItem = ({ item, idx }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <Link to={`/quote?inspiration=${encodeURIComponent(item.title)}`}>
      <motion.div 
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="gallery-item"
        style={{ position: 'relative', overflow: 'hidden', cursor: 'none', borderRadius: '4px', height: '500px' }}
      >
        <motion.img 
          src={item.img} 
          alt={item.title} 
          style={{ width: '100%', height: '120%', objectFit: 'cover', y: y, transition: 'var(--transition-smooth)' }} 
          className="gallery-img"
        />
        <div className="gallery-overlay" style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '3rem 2rem',
          opacity: 0,
          transition: 'var(--transition-smooth)'
        }}>
          <motion.span initial={{ y: 20 }} whileHover={{ y: 0 }} style={{ color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>{item.category}</motion.span>
          <motion.h3 initial={{ y: 20 }} whileHover={{ y: 0 }} style={{ color: '#fff', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>{item.title}</motion.h3>
        </div>
      </motion.div>
    </Link>
  );
};

export default function Gallery() {
  const [portfolio, setPortfolio] = useState(fallbackPortfolio);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) setPortfolio(data);
      } catch (error) {
        console.error('Failed to fetch gallery from Supabase', error);
      }
    };
    fetchGallery();
  }, []);

  return (
    <section id="gallery" className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-subtitle" style={{ textAlign: 'left' }}>Portfolio</span>
            <AnimatedText text="Featured Projects" className="heading-secondary" style={{ textAlign: 'left', marginBottom: 0, overflow: 'hidden' }} />
          </div>
          <button className="btn btn-outline-dark" style={{ padding: '1rem 2rem' }}>View All Work</button>
        </div>

        <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
          {portfolio.map((item, idx) => (
            <GalleryItem key={item.id} item={item} idx={idx} />
          ))}
        </div>
      </div>
      <style>{`
        .gallery-item:hover .gallery-img { transform: scale(1.05); }
        .gallery-item:hover .gallery-overlay { opacity: 1; }
        .gallery-item:hover span, .gallery-item:hover h3 { transform: translateY(0) !important; }
      `}</style>
    </section>
  );
}
