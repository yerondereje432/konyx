import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const SECTIONS = [
  { numeral: 'I', label: 'Personal Details', hint: 'Who we\u2019ll be working with' },
  { numeral: 'II', label: 'Event Details', hint: 'The when, where, and how many' },
  { numeral: 'III', label: 'Styling & Vision', hint: 'The mood you want to create' },
];

function SectionHeading({ numeral, label }) {
  return (
    <div className="aq-section-head">
      <span className="aq-numeral">{numeral}</span>
      <span className="aq-rule" />
      <h4 className="aq-section-title">{label}</h4>
    </div>
  );
}

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileNames, setFileNames] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFileNames(files.map((f) => f.name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);

    try {
      const { error: dbError } = await supabase
        .from('quotes')
        .insert([
          {
            name: formData.get('Name'),
            email: formData.get('Email'),
            phone: formData.get('Phone'),
            contact_method: formData.get('Preferred_Contact'),
            event_type: formData.get('Event_Type'),
            event_date: formData.get('Event_Date'),
            location: formData.get('Event_Location'),
            guests: formData.get('Guest_Count'),
            package: formData.get('Selected_Package'),
            budget: formData.get('Estimated_Budget'),
            message: formData.get('Message'),
          },
        ]);

      if (dbError) throw dbError;

      const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
      if (accessKey && accessKey !== 'your_web3forms_key_here') {
        formData.append('access_key', accessKey);
        formData.append('subject', 'New Premium Decor Quote Request \ud83c\udf1f');
        formData.append('from_name', 'Aura Decor Website');

        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Something went wrong with the submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        paddingTop: '10rem',
        paddingBottom: '8rem',
        backgroundImage: 'url("/gallery-4.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
      }}
    >
      {/* Emerald-tinted overlay so the ivory card and gold accents have somewhere to breathe */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(9,17,14,0.88) 0%, rgba(11,22,18,0.82) 45%, rgba(9,17,14,0.92) 100%)',
        }}
      />
      {/* Soft gold glow, centered behind the hero copy */}
      <div
        style={{
          position: 'absolute',
          top: '4rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          maxWidth: '90vw',
          height: '420px',
          background:
            'radial-gradient(closest-side, rgba(184,146,90,0.16), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ maxWidth: '760px', margin: '0 auto', marginBottom: '5rem' }}
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.72rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: '#B8925A',
              marginBottom: '1.25rem',
            }}
          >
            Let&rsquo;s Create Magic
          </span>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 340,
              fontSize: 'clamp(2.6rem, 5vw, 3.8rem)',
              lineHeight: 1.08,
              color: '#FBF7EF',
              margin: 0,
            }}
          >
            Request a <em style={{ fontStyle: 'italic', color: '#B8925A' }}>Quote</em>
          </h1>
          <p
            style={{
              color: 'rgba(244,241,233,0.68)',
              marginTop: '1.5rem',
              fontSize: '1.05rem',
              fontWeight: 300,
              lineHeight: 1.7,
              maxWidth: '38rem',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Tell us about your event vision, and we will craft a bespoke
            proposal tailored to your needs. Please share as much detail as
            you can &mdash; it helps us understand your day before we ever meet.
          </p>
        </motion.div>

        {/* ===== Quote form (invitation-suite styling) ===== */}
        <div
          className="aq-shell"
          style={{
            '--aq-ink': '#2A2620',
            '--aq-ivory': '#FBF7EF',
            '--aq-emerald': '#16302A',
            '--aq-gold': '#B8925A',
            '--aq-gold-soft': 'rgba(184, 146, 90, 0.35)',
            '--aq-sage': '#8C9184',
          }}
        >
          {/* LEFT — orientation panel */}
          <motion.aside
            className="aq-aside"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <span className="aq-eyebrow">The Process</span>
            <h3 className="aq-aside-title">
              Every detail,
              <br />
              <em>considered.</em>
            </h3>
            <p className="aq-aside-copy">
              A bespoke proposal begins with a conversation. Walk us through
              your day in three short chapters and our styling team will
              take it from there.
            </p>

            <ol className="aq-numeral-list">
              {SECTIONS.map((s, i) => (
                <motion.li
                  key={s.numeral}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 * i }}
                >
                  <span className="aq-numeral-small">{s.numeral}</span>
                  <span>
                    <strong>{s.label}</strong>
                    <em>{s.hint}</em>
                  </span>
                </motion.li>
              ))}
            </ol>

            <svg className="aq-flourish" viewBox="0 0 220 24" fill="none">
              <path
                d="M0 12 H80 M140 12 H220 M100 12c0-6 6-10 10-10s10 4 10 10-6 10-10 10-10-4-10-10Z"
                stroke="var(--aq-gold)"
                strokeWidth="1"
              />
            </svg>

            <p className="aq-response-time">
              Our styling team typically responds within{' '}
              <strong>24&ndash;48 hours</strong>.
            </p>
          </motion.aside>

          {/* RIGHT — the form itself, styled as an invitation card */}
          <motion.div
            className="aq-card-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="aq-monogram" aria-hidden="true">
              <svg viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="28" />
                <text x="30" y="38" textAnchor="middle">A</text>
              </svg>
            </div>

            {submitted ? (
              <motion.div
                className="aq-card aq-success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="aq-seal"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}
                >
                  <svg viewBox="0 0 80 80">
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="34"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, ease: 'easeInOut' }}
                    />
                    <motion.path
                      d="M25 41 L35 51 L56 28"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    />
                  </svg>
                </motion.div>
                <span className="aq-eyebrow">Received</span>
                <h3 className="aq-success-title">Thank you.</h3>
                <p className="aq-aside-copy" style={{ margin: '0 auto 2rem', maxWidth: '30rem' }}>
                  Your inquiry has been received. Our styling team will
                  review your details and get back to you within
                  24&ndash;48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="aq-ghost-btn"
                  type="button"
                >
                  Send Another Request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="aq-card">
                <SectionHeading numeral="I" label="Personal Details" />
                <div className="aq-grid">
                  <label className="aq-field">
                    <span className="aq-label">Full Name *</span>
                    <input type="text" name="Name" required placeholder="Jane Doe" className="aq-input" />
                  </label>

                  <label className="aq-field">
                    <span className="aq-label">Email Address *</span>
                    <input type="email" name="Email" required placeholder="jane@example.com" className="aq-input" />
                  </label>

                  <label className="aq-field">
                    <span className="aq-label">Phone Number *</span>
                    <input type="tel" name="Phone" required placeholder="+251 900 000 000" className="aq-input" />
                  </label>

                  <label className="aq-field">
                    <span className="aq-label">Preferred Contact Method</span>
                    <select name="Preferred_Contact" className="aq-input aq-select" defaultValue="Email">
                      <option>Email</option>
                      <option>Phone Call</option>
                      <option>WhatsApp</option>
                    </select>
                  </label>
                </div>

                <SectionHeading numeral="II" label="Event Details" />
                <div className="aq-grid">
                  <label className="aq-field">
                    <span className="aq-label">Event Type *</span>
                    <select name="Event_Type" required className="aq-input aq-select" defaultValue="">
                      <option value="" disabled>Select event type&hellip;</option>
                      <option>Wedding</option>
                      <option>Corporate Event</option>
                      <option>Birthday / Social</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label className="aq-field">
                    <span className="aq-label">Event Date *</span>
                    <input type="date" name="Event_Date" required className="aq-input" />
                  </label>

                  <label className="aq-field">
                    <span className="aq-label">Event Location / Venue</span>
                    <input type="text" name="Event_Location" placeholder="Name of venue or city" className="aq-input" />
                  </label>

                  <label className="aq-field">
                    <span className="aq-label">Estimated Number of Guests</span>
                    <input type="number" name="Guest_Count" placeholder="e.g., 150" className="aq-input" />
                  </label>
                </div>

                <SectionHeading numeral="III" label="Styling & Preferences" />
                <div className="aq-grid">
                  <label className="aq-field">
                    <span className="aq-label">Interested Package</span>
                    <select name="Selected_Package" className="aq-input aq-select" defaultValue="Undecided">
                      <option value="Undecided">Undecided</option>
                      <option value="Essential">Essential</option>
                      <option value="Signature">Signature</option>
                      <option value="Complete Event">Complete Event</option>
                    </select>
                  </label>

                  <label className="aq-field">
                    <span className="aq-label">Estimated Budget</span>
                    <select name="Estimated_Budget" className="aq-input aq-select" defaultValue="Undisclosed">
                      <option value="Undisclosed">Select range&hellip;</option>
                      <option value="Under 50,000 ETB">Under 50,000 ETB</option>
                      <option value="50,000 - 150,000 ETB">50,000 &ndash; 150,000 ETB</option>
                      <option value="150,000 - 300,000 ETB">150,000 &ndash; 300,000 ETB</option>
                      <option value="300,000+ ETB">300,000+ ETB</option>
                    </select>
                  </label>

                  <label className="aq-field aq-field-full">
                    <span className="aq-label">Additional Message / Vision</span>
                    <textarea
                      name="Message"
                      className="aq-input aq-textarea"
                      placeholder="Tell us more about your theme, colors, and any specific requirements..."
                    />
                  </label>

                  <div className="aq-field aq-field-full">
                    <span className="aq-label">Inspiration Images (Optional)</span>
                    <label className="aq-dropzone">
                      <input
                        type="file"
                        name="Attachment"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <svg viewBox="0 0 24 24" className="aq-dropzone-icon">
                        <path d="M12 4v12m0-12l-5 5m5-5l5 5M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>
                        {fileNames.length > 0
                          ? `${fileNames.length} file${fileNames.length > 1 ? 's' : ''} selected`
                          : 'Drop mood boards or reference photos'}
                      </span>
                      <em>Max 5MB per image</em>
                    </label>
                  </div>

                  <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                  <div className="aq-field aq-field-full" style={{ marginTop: '0.5rem' }}>
                    <button type="submit" disabled={isSubmitting} className="aq-submit">
                      <span>{isSubmitting ? 'Sending Request\u2026' : 'Submit Inquiry'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,340;0,9..144,500;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');

        .aq-shell {
          display: grid;
          grid-template-columns: 0.82fr 1.18fr;
          gap: 4.5rem;
          align-items: start;
          font-family: 'Inter', sans-serif;
          color: var(--aq-ink);
        }

        .aq-aside { position: sticky; top: 6rem; color: #F4F1E9; padding-top: 0.5rem; }
        .aq-eyebrow {
          display: block;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--aq-gold);
          margin-bottom: 1rem;
          font-weight: 600;
        }
        .aq-aside-title {
          font-family: 'Fraunces', serif;
          font-weight: 340;
          font-size: 2.6rem;
          line-height: 1.1;
          margin: 0 0 1.25rem;
          color: #FBF7EF;
        }
        .aq-aside-title em { font-style: italic; color: var(--aq-gold); }
        .aq-aside-copy {
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(244,241,233,0.72);
          font-weight: 300;
          margin: 0 0 2.5rem;
        }
        .aq-numeral-list { list-style: none; margin: 0 0 2.5rem; padding: 0; display: flex; flex-direction: column; gap: 1.5rem; }
        .aq-numeral-list li { display: flex; align-items: flex-start; gap: 1.1rem; }
        .aq-numeral-small {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 1.5rem;
          color: var(--aq-gold);
          line-height: 1;
          min-width: 1.6rem;
        }
        .aq-numeral-list strong {
          display: block;
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 1.05rem;
          color: #FBF7EF;
          margin-bottom: 0.15rem;
        }
        .aq-numeral-list em {
          display: block;
          font-style: normal;
          font-size: 0.82rem;
          color: rgba(244,241,233,0.55);
        }
        .aq-flourish { width: 100%; max-width: 220px; opacity: 0.6; margin-bottom: 1.75rem; }
        .aq-response-time { font-size: 0.85rem; color: rgba(244,241,233,0.55); font-weight: 300; }
        .aq-response-time strong { color: var(--aq-gold); font-weight: 600; }

        .aq-card-wrap { position: relative; }
        .aq-monogram {
          position: absolute;
          top: -22px;
          right: 40px;
          width: 56px;
          height: 56px;
          z-index: 2;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.25));
        }
        .aq-monogram svg { width: 100%; height: 100%; }
        .aq-monogram circle { fill: var(--aq-emerald); stroke: var(--aq-gold); stroke-width: 1.5; }
        .aq-monogram text {
          fill: var(--aq-gold);
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 26px;
        }

        .aq-card {
          background: var(--aq-ivory);
          border: 1px solid var(--aq-gold-soft);
          border-radius: 2px;
          padding: 3.25rem 3rem;
          box-shadow: 0 30px 70px rgba(0,0,0,0.35);
        }

        .aq-section-head { display: flex; align-items: baseline; gap: 0.9rem; margin: 2.25rem 0 1.5rem; }
        .aq-section-head:first-child { margin-top: 0; }
        .aq-numeral {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 1.7rem;
          color: var(--aq-gold);
          line-height: 1;
        }
        .aq-section-title {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 1.15rem;
          letter-spacing: 0.01em;
          color: var(--aq-emerald);
          margin: 0;
          white-space: nowrap;
        }
        .aq-rule { flex: 1; height: 1px; background: linear-gradient(to right, var(--aq-gold-soft), transparent); }

        .aq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6rem 2rem; }
        .aq-field-full { grid-column: span 2; }

        .aq-field { display: flex; flex-direction: column; }
        .aq-label {
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--aq-sage);
          font-weight: 600;
          margin-bottom: 0.55rem;
        }
        .aq-input {
          font-family: 'Inter', sans-serif;
          font-size: 0.98rem;
          color: var(--aq-ink);
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(42,38,32,0.2);
          padding: 0.4rem 0.1rem 0.6rem;
          transition: border-color 0.25s ease;
          outline: none;
        }
        .aq-input::placeholder { color: rgba(42,38,32,0.35); }
        .aq-input:focus { border-bottom: 1.5px solid var(--aq-gold); }
        .aq-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23B8925A'%3E%3Cpath d='M5.5 7.5l4.5 5 4.5-5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.2rem center; background-size: 1rem; padding-right: 1.4rem; }
        .aq-textarea { resize: vertical; min-height: 5.5rem; line-height: 1.6; border: 1px solid rgba(42,38,32,0.2); border-radius: 2px; padding: 0.75rem; }
        .aq-textarea:focus { border-color: var(--aq-gold); }

        .aq-dropzone {
          border: 1px dashed var(--aq-gold-soft);
          border-radius: 2px;
          padding: 1.75rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          text-align: center;
          cursor: pointer;
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .aq-dropzone:hover { background: rgba(184,146,90,0.06); border-color: var(--aq-gold); }
        .aq-dropzone input { display: none; }
        .aq-dropzone-icon { width: 22px; height: 22px; stroke: var(--aq-gold); fill: none; stroke-width: 1.4; margin-bottom: 0.2rem; }
        .aq-dropzone span { font-size: 0.9rem; color: var(--aq-ink); font-weight: 500; }
        .aq-dropzone em { font-style: normal; font-size: 0.75rem; color: var(--aq-sage); }

        .aq-submit {
          position: relative;
          overflow: hidden;
          width: 100%;
          padding: 1.15rem;
          background: var(--aq-emerald);
          color: #F4F1E9;
          border: none;
          border-radius: 2px;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.25s ease, transform 0.15s ease;
        }
        .aq-submit:disabled { opacity: 0.65; cursor: not-allowed; }
        .aq-submit:not(:disabled):hover { transform: translateY(-1px); }
        .aq-submit span { position: relative; z-index: 1; }
        .aq-submit::after {
          content: '';
          position: absolute;
          top: 0; left: -60%;
          width: 40%; height: 100%;
          background: linear-gradient(120deg, transparent, rgba(184,146,90,0.55), transparent);
          transform: skewX(-20deg);
          transition: left 0.6s ease;
        }
        .aq-submit:not(:disabled):hover::after { left: 130%; }

        .aq-success { text-align: center; padding: 4rem 3rem; }
        .aq-seal { width: 80px; height: 80px; margin: 0 auto 1.5rem; }
        .aq-seal svg { width: 100%; height: 100%; }
        .aq-seal circle { fill: none; stroke: var(--aq-gold); stroke-width: 1.5; }
        .aq-seal path { fill: none; stroke: var(--aq-emerald); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
        .aq-success-title { font-family: 'Fraunces', serif; font-style: italic; font-weight: 400; font-size: 2rem; color: var(--aq-emerald); margin: 0 0 1rem; }
        .aq-ghost-btn {
          background: transparent;
          border: 1px solid var(--aq-emerald);
          color: var(--aq-emerald);
          padding: 0.85rem 2rem;
          font-size: 0.85rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.25s ease, color 0.25s ease;
        }
        .aq-ghost-btn:hover { background: var(--aq-emerald); color: #F4F1E9; }

        @media (max-width: 900px) {
          .aq-shell { grid-template-columns: 1fr; gap: 2.5rem; }
          .aq-aside { position: static; }
          .aq-numeral-list { flex-direction: row; flex-wrap: wrap; gap: 1.25rem 2rem; }
          .aq-flourish { display: none; }
          .aq-card { padding: 2.25rem 1.5rem; }
        }

        @media (max-width: 640px) {
          .aq-grid { grid-template-columns: 1fr; }
          .aq-field-full { grid-column: span 1; }
          .aq-monogram { top: -18px; right: 20px; width: 44px; height: 44px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .aq-submit::after { display: none; }
        }
      `}</style>
    </div>
  );
}
