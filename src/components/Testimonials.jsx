import { motion } from 'framer-motion';

const reviews = [
  {
    name: 'Sarah & Michael',
    type: 'Wedding',
    text: 'Aura Decor completely transformed our venue. The floral arrangements were breathtaking, and every detail was executed flawlessly. They truly understood our vision and elevated it beyond our expectations.',
    img: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=200&auto=format&fit=crop'
  },
  {
    name: 'Elena Rostova',
    type: 'Corporate Gala',
    text: 'Professional, punctual, and incredibly talented. The team designed our annual tech summit with a perfect balance of modern elegance and brand identity. Highly recommended for corporate styling.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
  },
  {
    name: 'James Walker',
    type: '50th Birthday Celebration',
    text: 'The attention to detail was immaculate. From the bespoke backdrop to the table settings, everything felt luxurious and perfectly coordinated. A seamless and stress-free experience.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  }
];

export default function Testimonials() {
  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-surface-alt)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="section-subtitle">Client Stories</span>
          <h2 className="heading-secondary">Kind Words</h2>
        </div>

        <div className="grid grid-cols-3">
          {reviews.map((rev, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}
            >
              <div style={{ color: 'var(--color-accent)', fontSize: '2rem', fontFamily: 'var(--font-heading)', lineHeight: 1, marginBottom: '1rem' }}>
                "
              </div>
              <p style={{ fontSize: '0.95rem', color: '#555', fontStyle: 'italic', marginBottom: '2rem', minHeight: '100px' }}>
                {rev.text}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={rev.img} alt={rev.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.1rem' }}>{rev.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{rev.type}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
