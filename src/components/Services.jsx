import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Wedding Decoration',
    desc: 'Bespoke floral arrangements, stage design, and lighting to make your special day unforgettable.',
    img: '/service-1.jpg'
  },
  {
    title: 'Corporate Events',
    desc: 'Professional styling for galas, product launches, and company milestones that reflect your brand.',
    img: '/service-2.jpg'
  },
  {
    title: 'Birthday & Social',
    desc: 'Themed decor, balloon installations, and custom backdrops for intimate and grand celebrations.',
    img: '/service-3.jpg'
  }
];

export default function Services() {
  return (
    <section id="services" className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="section-subtitle">What We Do</span>
          <h2 className="heading-secondary">Our Signature Services</h2>
        </div>

        <div className="grid grid-cols-3">
          {services.map((srv, idx) => (
            <Link to={`/quote?service=${encodeURIComponent(srv.title)}`} key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                style={{ group: 'true', cursor: 'pointer' }}
                className="service-card"
              >
                <div style={{ overflow: 'hidden', marginBottom: '1.5rem', borderRadius: '4px' }}>
                  <img 
                    src={srv.img} 
                    alt={srv.title} 
                    style={{ 
                      width: '100%', 
                      height: '350px', 
                      objectFit: 'cover',
                      transition: 'transform 0.6s ease'
                    }} 
                    className="service-img"
                  />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{srv.title}</h3>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>{srv.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .service-card:hover .service-img {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
