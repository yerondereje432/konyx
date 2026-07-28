import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    
    try {
      // 1. Send data to Supabase Database
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
            message: formData.get('Message')
          }
        ]);

      if (dbError) throw dbError;

      // 2. Telegram Instant Notification
      const telegramBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const telegramChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

      if (telegramBotToken && telegramChatId) {
        const textMessage = `
🎉 *NEW VIP QUOTE REQUEST* 🎉

👤 *Name:* ${formData.get('Name')}
📞 *Phone:* ${formData.get('Phone')}
✉️ *Email:* ${formData.get('Email')}

🎊 *Event:* ${formData.get('Event_Type') || 'Not specified'}
📅 *Date:* ${formData.get('Event_Date') || 'TBD'}
📍 *Location:* ${formData.get('Event_Location') || 'TBD'}
👥 *Guests:* ${formData.get('Guest_Count') || 'TBD'}

💎 *Package:* ${formData.get('Selected_Package') || 'Undecided'}
💰 *Budget:* ${formData.get('Estimated_Budget') || 'Undisclosed'}

📝 *Message:*
${formData.get('Message') || 'No additional message.'}
        `;

        try {
          const telegramResponse = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: textMessage,
              parse_mode: 'Markdown',
            }),
          });
          
          const telegramResult = await telegramResponse.json();
          if (!telegramResult.ok) {
            console.error("Telegram API rejected the message:", telegramResult);
          } else {
            console.log("Telegram message sent successfully!");
          }
        } catch (err) {
          console.error("Failed to reach Telegram API:", err);
        }
      } else {
        console.warn("Telegram credentials missing from environment variables.");
      }

      // 3. Send Email Notification via Web3Forms (Fallback/Record)
      const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
      if (accessKey && accessKey !== 'your_web3forms_key_here') {
        formData.append("access_key", accessKey);
        formData.append("subject", "New Premium Decor Quote Request 🌟");
        formData.append("from_name", "Aura Decor Website");
        
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        }).catch(err => console.error("Email error:", err));
      }
      
      setSubmitted(true);
      
    } catch (error) {
      console.error(error);
      alert("Something went wrong with the submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <input type="text" name="Name" className="form-input" required placeholder="Jane Doe" />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input type="email" name="Email" className="form-input" required placeholder="jane@example.com" />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input type="tel" name="Phone" className="form-input" required placeholder="+251 900 000 000" />
        </div>

        <div className="form-group">
          <label className="form-label">Preferred Contact Method</label>
          <select name="Preferred_Contact" className="form-select">
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
          <select name="Event_Type" className="form-select" required>
            <option value="">Select event type...</option>
            <option>Wedding</option>
            <option>Corporate Event</option>
            <option>Birthday / Social</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Event Date *</label>
          <input type="date" name="Event_Date" className="form-input" required />
        </div>

        <div className="form-group">
          <label className="form-label">Event Location / Venue</label>
          <input type="text" name="Event_Location" className="form-input" placeholder="Name of venue or city" />
        </div>

        <div className="form-group">
          <label className="form-label">Estimated Number of Guests</label>
          <input type="number" name="Guest_Count" className="form-input" placeholder="e.g., 150" />
        </div>

        {/* Styling & Requirements */}
        <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
          <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Styling & Preferences</h4>
        </div>

        <div className="form-group">
          <label className="form-label">Interested Package</label>
          <select name="Selected_Package" className="form-select">
            <option value="Undecided">Undecided</option>
            <option value="Essential">Essential</option>
            <option value="Signature">Signature</option>
            <option value="Complete Event">Complete Event</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Estimated Budget</label>
          <select name="Estimated_Budget" className="form-select">
            <option value="Undisclosed">Select range...</option>
            <option value="Under 50,000 ETB">Under 50,000 ETB</option>
            <option value="50,000 - 150,000 ETB">50,000 - 150,000 ETB</option>
            <option value="150,000 - 300,000 ETB">150,000 - 300,000 ETB</option>
            <option value="300,000+ ETB">300,000+ ETB</option>
          </select>
        </div>

        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">Additional Message / Vision</label>
          <textarea name="Message" className="form-textarea" placeholder="Tell us more about your theme, colors, and any specific requirements..."></textarea>
        </div>

        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">Inspiration Images (Optional)</label>
          <input type="file" name="Attachment" className="form-input" multiple accept="image/*" style={{ padding: '0.75rem' }} />
          <span style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem', display: 'block' }}>Upload mood boards or reference photos (Max 5MB)</span>
        </div>

        {/* Anti-spam honeypot */}
        <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

        <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'Sending Request...' : 'Submit Inquiry'}
          </button>
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
