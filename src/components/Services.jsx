import { motion } from 'framer-motion';

const services = [
  {
    title: 'Wedding Decoration',
    desc: 'Bespoke floral arrangements, stage design, and lighting to make your special day unforgettable.',
    img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Corporate Events',
    desc: 'Professional styling for galas, product launches, and company milestones that reflect your brand.',
    img: 'https://images.unsplash.com/photo-1505366581177-033100235b2e?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Birthday & Social',
    desc: 'Themed decor, balloon installations, and custom backdrops for intimate and grand celebrations.',
    img: 'https://images.unsplash.com/photo-1530103862676-de88b6b0853a?q=80&w=2070&auto=format&fit=crop'
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
            <motion.div 
              key={idx}
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
