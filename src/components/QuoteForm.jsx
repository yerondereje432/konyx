import { useState } from 'react';
import { motion } from 'framer-motion';

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}
      >
        <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Thank You!</h3>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
          Your inquiry has been received. Our styling team will review your details and get back to you within 24-48 hours.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn btn-outline-dark">Send Another Request</button>
      </motion.div>
    );
  }

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      onSubmit={handleSubmit}
      style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}
    >
      <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
        
        {/* Personal Details */}
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Personal Details</h4>
        </div>

        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input type="text" className="form-input" required placeholder="Jane Doe" />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input type="email" className="form-input" required placeholder="jane@example.com" />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input type="tel" className="form-input" required placeholder="+251 900 000 000" />
        </div>

        <div className="form-group">
          <label className="form-label">Preferred Contact Method</label>
          <select className="form-select">
            <option>Email</option>
            <option>Phone Call</option>
            <option>WhatsApp</option>
          </select>
        </div>

        {/* Event Details */}
        <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
          <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Event Details</h4>
        </div>

        <div className="form-group">
          <label className="form-label">Event Type *</label>
          <select className="form-select" required>
            <option value="">Select event type...</option>
            <option>Wedding</option>
            <option>Corporate Event</option>
            <option>Birthday / Social</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Event Date *</label>
          <input type="date" className="form-input" required />
        </div>

        <div className="form-group">
          <label className="form-label">Event Location / Venue</label>
          <input type="text" className="form-input" placeholder="Name of venue or city" />
        </div>

        <div className="form-group">
          <label className="form-label">Estimated Number of Guests</label>
          <input type="number" className="form-input" placeholder="e.g., 150" />
        </div>

        {/* Styling & Requirements */}
        <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
          <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Styling & Preferences</h4>
        </div>

        <div className="form-group">
          <label className="form-label">Interested Package</label>
          <select className="form-select">
            <option value="">Undecided</option>
            <option>Essential</option>
            <option>Signature</option>
            <option>Complete Event</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Estimated Budget</label>
          <select className="form-select">
            <option value="">Select range...</option>
            <option>Under 50,000 ETB</option>
            <option>50,000 - 150,000 ETB</option>
            <option>150,000 - 300,000 ETB</option>
            <option>300,000+ ETB</option>
          </select>
        </div>

        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">Additional Message / Vision</label>
          <textarea className="form-textarea" placeholder="Tell us more about your theme, colors, and any specific requirements..."></textarea>
        </div>

        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">Inspiration Images (Optional)</label>
          <input type="file" className="form-input" multiple accept="image/*" style={{ padding: '0.75rem' }} />
          <span style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem', display: 'block' }}>Upload mood boards or reference photos (Max 5MB)</span>
        </div>

        <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1rem' }}>Submit Inquiry</button>
        </div>

      </div>
      <style>{`
        @media (max-width: 768px) {
          .grid-cols-2 > div {
            grid-column: span 2;
          }
        }
      `}</style>
    </motion.form>
  );
}
