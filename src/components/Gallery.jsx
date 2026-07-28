import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Fallback items just in case the database is empty or failing
const fallbackPortfolio = [
  { id: 1, title: 'The Grand Botanica', category: 'Wedding', img: '/gallery-1.jpg' },
  { id: 2, title: 'Tech Gala 2024', category: 'Corporate', img: '/gallery-2.jpg' },
  { id: 3, title: 'Golden Jubilee', category: 'Birthday', img: '/gallery-3.jpg' },
  { id: 4, title: 'Minimalist Romance', category: 'Wedding', img: '/gallery-4.jpg' }
];

export default function Gallery() {
  const [portfolio, setPortfolio] = useState(fallbackPortfolio);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          setPortfolio(data);
        }
      } catch (error) {
        console.error('Failed to fetch gallery from Supabase', error);
      }
    };
    
    fetchGallery();
  }, []);

  return (
    <section id="gallery" className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-subtitle" style={{ textAlign: 'left' }}>Portfolio</span>
            <h2 className="heading-secondary" style={{ textAlign: 'left', marginBottom: 0 }}>Featured Projects</h2>
          </div>
          <button className="btn btn-outline-dark" style={{ padding: '0.75rem 1.5rem' }}>View All Work</button>
        </div>

        <div className="grid grid-cols-2">
          {portfolio.map((item, idx) => (
            <Link to={`/quote?inspiration=${encodeURIComponent(item.title)}`} key={item.id}>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="gallery-item"
                style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', borderRadius: '4px' }}
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  style={{ width: '100%', height: '500px', objectFit: 'cover', transition: 'var(--transition-smooth)' }} 
                  className="gallery-img"
                />
                <div className="gallery-overlay" style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '2rem',
                  opacity: 0,
                  transition: 'var(--transition-smooth)'
                }}>
                  <span style={{ color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{item.category}</span>
                  <h3 style={{ color: '#fff', fontSize: '1.75rem', fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .gallery-item:hover .gallery-img {
          transform: scale(1.05);
        }
        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
