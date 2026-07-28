import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dropdown NavItem Component
const NavItem = ({ title, to, dropdown, isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isHash = to.startsWith('/#');
  const textColor = isScrolled ? 'var(--color-text)' : '#fff';

  return (
    <div 
      style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%', padding: '0.5rem 0', cursor: 'pointer' }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {isHash ? (
        <a href={to} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: textColor, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', transition: 'color 0.3s' }}>
          {title} {dropdown && <ChevronDown size={14} style={{ transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
        </a>
      ) : (
        <Link to={to} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: textColor, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', transition: 'color 0.3s' }}>
          {title} {dropdown && <ChevronDown size={14} style={{ transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
        </Link>
      )}

      {/* Hover Dropdown Menu */}
      {dropdown && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              style={{ 
                position: 'absolute', 
                top: '100%', 
                left: '50%',
                transform: 'translateX(-50%)',
                paddingTop: '0.5rem', // Invisible bridge to keep hover active
                zIndex: 100
              }}
            >
              <div style={{
                backgroundColor: '#fff', 
                minWidth: '240px', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
                borderRadius: '8px', 
                padding: '0.75rem 0',
                border: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                {dropdown.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.link}
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      color: 'var(--color-text)', 
                      fontSize: '0.85rem', 
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      display: 'block',
                      fontWeight: 500,
                      textTransform: 'none',
                      letterSpacing: 'normal'
                    }}
                    onMouseOver={(e) => { 
                      e.target.style.backgroundColor = '#faf9f6'; 
                      e.target.style.color = 'var(--color-accent)'; 
                      e.target.style.paddingLeft = '1.75rem'; 
                    }}
                    onMouseOut={(e) => { 
                      e.target.style.backgroundColor = 'transparent'; 
                      e.target.style.color = 'var(--color-text)'; 
                      e.target.style.paddingLeft = '1.5rem'; 
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
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

  const isScrolledText = scrolled || !isHome;
  
  const navClass = `fixed w-full z-50 transition-all duration-500 ${
    isScrolledText ? 'bg-white shadow-sm py-4 text-black' : 'bg-transparent py-6 text-white'
  }`;

  return (
    <header className={navClass} style={{ paddingLeft: '2rem', paddingRight: '2rem', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'var(--transition-smooth)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0' }}>
        
        <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '2px', color: isScrolledText ? 'var(--color-text)' : '#fff' }}>
          AURA<span style={{ color: 'var(--color-accent)' }}>DECOR</span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="desktop-nav">
          <NavItem title="Home" to="/" isScrolled={isScrolledText} />
          
          <NavItem 
            title="Services" 
            to="/#services" 
            isScrolled={isScrolledText} 
            dropdown={[
              { name: 'Wedding Decoration', link: '/#services' },
              { name: 'Corporate Events', link: '/#services' },
              { name: 'Birthday & Social', link: '/#services' }
            ]} 
          />
          
          <NavItem title="Gallery" to="/#gallery" isScrolled={isScrolledText} />
          
          <NavItem 
            title="Packages" 
            to="/#packages" 
            isScrolled={isScrolledText} 
            dropdown={[
              { name: 'Essential Package', link: '/#packages' },
              { name: 'Signature Package', link: '/#packages' },
              { name: 'Complete Event', link: '/#packages' }
            ]} 
          />

          <Link to="/quote" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', marginLeft: '0.5rem' }}>Request Quote</Link>
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
