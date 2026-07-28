import { motion } from 'framer-motion';
import { Star, Shield, Clock, Heart } from 'lucide-react';

const strengths = [
  { icon: <Star size={24} />, title: 'Original Designs', desc: 'No two events are the same. We create bespoke designs tailored to your unique story.' },
  { icon: <Shield size={24} />, title: 'Quality Materials', desc: 'From premium florals to luxury linens, we source only the finest materials for your event.' },
  { icon: <Clock size={24} />, title: 'Reliable Setup', desc: 'Punctual and organized execution so you can enjoy your day without worrying about logistics.' },
  { icon: <Heart size={24} />, title: 'Attention to Detail', desc: 'It is the small touches that make an event truly memorable. We perfect every element.' }
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '4rem' }}>
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-subtitle" style={{ textAlign: 'left' }}>The Aura Difference</span>
            <h2 className="heading-secondary" style={{ textAlign: 'left' }}>Crafting unforgettable atmospheres with precision.</h2>
            <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
              We believe that every celebration deserves to be beautiful and stress-free. Our dedicated team combines creative vision with meticulous planning to transform spaces into magical experiences.
            </p>
            <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
              {strengths.map((s, idx) => (
                <div key={idx}>
                  <div style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>{s.icon}</div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: '#777' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}
          >
            <img 
              src="/why-us.jpg" 
              alt="Decoration setup" 
              style={{ width: '100%', height: '600px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <div style={{ 
              position: 'absolute', 
              bottom: '-2rem', 
              left: '-2rem', 
              backgroundColor: 'var(--color-text)', 
              color: '#fff', 
              padding: '2rem', 
              maxWidth: '250px',
              borderRadius: '4px'
            }}>
              <span style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--color-accent)', lineHeight: 1 }}>10+</span>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Years of experience transforming spaces and creating memories.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
