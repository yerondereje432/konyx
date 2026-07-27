import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const packages = [
  {
    name: 'Essential',
    type: 'Intimate Gatherings',
    desc: 'Perfect for small events that need an elegant touch without overwhelming complexity.',
    features: ['Stage or photo backdrop', 'Basic floral arrangements', 'Welcome sign styling', 'Setup & takedown'],
    notIncluded: ['Custom lighting rigs', 'Large-scale ceiling draping']
  },
  {
    name: 'Signature',
    type: 'Medium to Large Events',
    desc: 'Our most popular choice, offering a comprehensive styling experience for your special day.',
    features: ['Full stage design & backdrop', 'Premium floral centerpieces', 'Custom entrance styling', 'Accent lighting', 'Setup & takedown'],
    notIncluded: ['Custom structural builds'],
    highlight: true
  },
  {
    name: 'Complete Event',
    type: 'Luxury & Corporate',
    desc: 'A fully bespoke service where every detail is custom-designed from scratch.',
    features: ['Custom structural builds', 'Immersive ceiling installations', 'Full venue transformation', 'Premium lighting production', 'Dedicated event stylist'],
    notIncluded: []
  }
];

export default function Packages() {
  return (
    <section id="packages" className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="section-subtitle">Investment</span>
          <h2 className="heading-secondary">Service Packages</h2>
        </div>

        <div className="grid grid-cols-3" style={{ alignItems: 'center' }}>
          {packages.map((pkg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              style={{
                backgroundColor: pkg.highlight ? 'var(--color-text)' : '#fff',
                color: pkg.highlight ? '#fff' : 'var(--color-text)',
                padding: pkg.highlight ? '3.5rem 2.5rem' : '2.5rem',
                border: pkg.highlight ? 'none' : '1px solid #eaeaea',
                borderRadius: '8px',
                boxShadow: pkg.highlight ? '0 20px 40px rgba(0,0,0,0.1)' : 'none',
                position: 'relative',
                transform: pkg.highlight ? 'scale(1.05)' : 'scale(1)',
                zIndex: pkg.highlight ? 2 : 1
              }}
              className="package-card"
            >
              {pkg.highlight && (
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'var(--color-accent)', color: '#fff', padding: '0.25rem 1rem', borderRadius: '20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Most Popular
                </div>
              )}
              <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{pkg.name}</h3>
              <div style={{ color: pkg.highlight ? 'var(--color-accent)' : '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>{pkg.type}</div>
              <p style={{ fontSize: '0.95rem', marginBottom: '2rem', color: pkg.highlight ? '#ccc' : '#666', lineHeight: 1.6 }}>{pkg.desc}</p>
              
              <ul style={{ marginBottom: '2rem' }}>
                {pkg.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    <Check size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{f}</span>
                  </li>
                ))}
                {pkg.notIncluded.map((f, i) => (
                  <li key={`not-${i}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem', color: pkg.highlight ? '#666' : '#999' }}>
                    <Check size={18} color={pkg.highlight ? '#444' : '#eee'} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ textDecoration: 'line-through' }}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/quote" 
                className={`btn ${pkg.highlight ? 'btn-primary' : 'btn-outline-dark'}`} 
                style={{ width: '100%' }}
              >
                Request Quote
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 1024px) {
          .package-card {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
