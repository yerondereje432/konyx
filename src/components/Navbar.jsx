import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = `fixed w-full z-50 transition-all duration-500 ${
    scrolled || !isHome ? 'bg-white shadow-sm py-4 text-black' : 'bg-transparent py-6 text-white'
  }`;

  const linkClass = "text-sm uppercase tracking-widest font-medium hover:text-[var(--color-accent)] transition-colors duration-300";

  return (
    <header className={navClass} style={{ paddingLeft: '2rem', paddingRight: '2rem', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'var(--transition-smooth)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
        <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '2px', color: scrolled || !isHome ? 'var(--color-text)' : '#fff' }}>
          MJ<span style={{ color: 'var(--color-accent)' }}>DECOR</span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          <Link to="/" style={{ color: scrolled || !isHome ? 'var(--color-text)' : '#fff', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Home</Link>
          <a href="/#services" style={{ color: scrolled || !isHome ? 'var(--color-text)' : '#fff', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Services</a>
          <a href="/#gallery" style={{ color: scrolled || !isHome ? 'var(--color-text)' : '#fff', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Gallery</a>
          <a href="/#packages" style={{ color: scrolled || !isHome ? 'var(--color-text)' : '#fff', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Packages</a>
          <Link to="/quote" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Request Quote</Link>
        </nav>

      </div>
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
