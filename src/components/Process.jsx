import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'Tell us about your event', desc: 'Fill out our detailed inquiry form to give us a clear picture of your vision, date, and venue.' },
  { num: '02', title: 'Choose a direction', desc: 'We will present mood boards and initial design concepts to align with your personal style.' },
  { num: '03', title: 'Receive a proposal', desc: 'A transparent, comprehensive quote outlining the services, materials, and scope of work.' },
  { num: '04', title: 'Confirm your date', desc: 'Once approved, we secure your date and begin sourcing premium materials for your event.' },
  { num: '05', title: 'We prepare and decorate', desc: 'Our team executes flawless setup on the day, letting you enjoy the moment stress-free.' }
];

export default function Process() {
  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-text)', color: '#fff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="section-subtitle">How It Works</span>
          <h2 className="heading-secondary" style={{ color: '#fff' }}>The Customer Journey</h2>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              style={{ 
                display: 'flex', 
                gap: '2rem', 
                marginBottom: idx === steps.length - 1 ? 0 : '3rem',
                position: 'relative'
              }}
            >
              {idx !== steps.length - 1 && (
                <div style={{ position: 'absolute', left: '1.25rem', top: '3rem', bottom: '-3rem', width: '1px', backgroundColor: '#333' }} />
              )}
              
              <div style={{ 
                fontSize: '1.2rem', 
                fontWeight: 700, 
                color: 'var(--color-accent)', 
                fontFamily: 'var(--font-heading)',
                backgroundColor: '#222',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                flexShrink: 0,
                zIndex: 1
              }}>
                {step.num}
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', marginTop: '0.2rem' }}>{step.title}</h3>
                <p style={{ color: '#aaa', fontSize: '1rem', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
