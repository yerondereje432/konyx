import { motion } from 'framer-motion';
import QuoteForm from '../components/QuoteForm';

export default function QuotePage() {
  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '6rem' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '4rem' }}
        >
          <span className="section-subtitle">Let's Create Magic</span>
          <h1 className="heading-secondary" style={{ color: 'var(--color-text)' }}>Request a Quote</h1>
          <p style={{ color: '#666', marginTop: '1rem' }}>
            Tell us about your event vision, and we will craft a bespoke proposal tailored to your needs. Please provide as much detail as possible to help us understand your requirements better.
          </p>
        </motion.div>

        <QuoteForm />
      </div>
    </div>
  );
}
