import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-text)', color: '#fff', paddingTop: '5rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div className="grid grid-cols-4" style={{ gap: '4rem', marginBottom: '4rem' }}>
          
          <div style={{ gridColumn: 'span 1' }} className="footer-col">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1rem' }}>
              AURA<span style={{ color: 'var(--color-accent)' }}>DECOR</span>
            </h3>
            <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Decorating moments people remember. Premium event styling for weddings, corporate, and special occasions.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: '#fff' }}><FaInstagram size={20} /></a>
              <a href="#" style={{ color: '#fff' }}><FaFacebook size={20} /></a>
              <a href="#" style={{ color: '#fff' }}><FaTwitter size={20} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>Quick Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#ccc', fontSize: '0.9rem' }}>
              <li><Link to="/">Home</Link></li>
              <li><a href="/#services">Our Services</a></li>
              <li><a href="/#gallery">Portfolio</a></li>
              <li><a href="/#packages">Packages</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>Contact Info</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#ccc', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--color-accent)"/> +251 900 123 456
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--color-accent)"/> hello@auradecor.com
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '4px' }}/> 
                <span>Bole, Addis Ababa<br/>Ethiopia</span>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>Newsletter</h4>
            <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1rem' }}>Get updates on our latest designs and exclusive offers.</p>
            <form style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="email" placeholder="Your email" style={{ padding: '0.75rem', width: '100%', border: 'none', backgroundColor: '#333', color: '#fff' }} />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>Subscribe</button>
            </form>
          </div>

        </div>

        <div style={{ borderTop: '1px solid #333', paddingTop: '2rem', textAlign: 'center', color: '#888', fontSize: '0.8rem' }}>
          <p>&copy; {new Date().getFullYear()} Aura Decor. All rights reserved.</p>
        </div>
      </div>
      <style>{`
        @media (max-width: 1024px) {
          .footer-col { grid-column: span 2 !important; }
        }
        @media (max-width: 768px) {
          .footer-col { grid-column: span 4 !important; }
        }
      `}</style>
    </footer>
  );
}
