import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dropdown Mega Menu NavItem Component
const NavItem = ({ title, to, dropdownLinks, featured, isScrolled }) => {
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
          {title} {dropdownLinks && <ChevronDown size={14} style={{ transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
        </a>
      ) : (
        <Link to={to} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: textColor, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', transition: 'color 0.3s' }}>
          {title} {dropdownLinks && <ChevronDown size={14} style={{ transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
        </Link>
      )}

      {/* Hover Mega Menu */}
      {dropdownLinks && (
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
                right: '-20%', // Align heavily to the right instead of center
                paddingTop: '1rem', // Invisible bridge to keep hover active
                zIndex: 100
              }}
            >
              <div style={{
                backgroundColor: '#fff', 
                width: '600px', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)', 
                borderRadius: '12px', 
                padding: '2rem',
                border: '1px solid #eaeaea',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2.5rem',
                cursor: 'default',
                textAlign: 'left',
                position: 'relative',
                transform: 'translateX(0)' // Reset any internal translation
              }}>
                {/* Left: Link List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#999', marginBottom: '0.75rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                    {title} Options
                  </h4>
                  {dropdownLinks.map((item, idx) => (
                    <a 
                      key={idx} 
                      href={item.link}
                      style={{ 
                        padding: '0.5rem 0', 
                        color: 'var(--color-text)', 
                        fontSize: '0.95rem', 
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 500
                      }}
                      onMouseOver={(e) => { 
                        e.target.style.color = 'var(--color-accent)'; 
                        e.target.style.transform = 'translateX(5px)';
                      }}
                      onMouseOut={(e) => { 
                        e.target.style.color = 'var(--color-text)'; 
                        e.target.style.transform = 'translateX(0)';
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>

                {/* Right: Featured Image/Content */}
                {featured && (
                  <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
                    <img 
                      src={featured.img} 
                      alt={featured.title} 
                      style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} 
                    />
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>{featured.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.4, margin: 0 }}>{featured.desc}</p>
                  </div>
                )}
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

  // Force text to be dark if scrolled, not on home page, OR if mobile menu is open
  const isScrolledText = scrolled || !isHome || mobileMenuOpen;
  
  const navClass = `fixed w-full z-50 transition-all duration-500 ${
    isScrolledText ? 'bg-white shadow-sm py-4 text-black' : 'bg-transparent py-6 text-white'
  }`;

  return (
    <>
      <header className={navClass} style={{ paddingLeft: '2rem', paddingRight: '2rem', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'var(--transition-smooth)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0' }}>
          
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '2px', color: isScrolledText ? 'var(--color-text)' : '#fff', position: 'relative', zIndex: 51 }}>
            AURA<span style={{ color: 'var(--color-accent)' }}>DECOR</span>
          </Link>

          {/* Mobile Toggle Button */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: isScrolledText ? 'var(--color-text)' : '#fff',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 51
            }}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="desktop-nav">
            <NavItem title="Home" to="/" isScrolled={isScrolledText} />
            
            <NavItem 
              title="Services" 
              to="/#services" 
              isScrolled={isScrolledText} 
              dropdownLinks={[
                { name: 'Wedding Decoration', link: '/#services' },
                { name: 'Corporate Events', link: '/#services' },
                { name: 'Birthday & Social', link: '/#services' },
                { name: 'Custom Stage Design', link: '/#services' }
              ]}
              featured={{
                img: '/service-1.jpg',
                title: 'Flawless Execution',
                desc: 'Discover our premium setups that turn ordinary venues into magical experiences.'
              }}
            />
            
            <NavItem title="Gallery" to="/#gallery" isScrolled={isScrolledText} />
            
            <NavItem 
              title="Packages" 
              to="/#packages" 
              isScrolled={isScrolledText} 
              dropdownLinks={[
                { name: 'Essential Package', link: '/#packages' },
                { name: 'Signature Package', link: '/#packages' },
                { name: 'Complete Event', link: '/#packages' }
              ]}
              featured={{
                img: '/gallery-1.jpg',
                title: 'Signature Package',
                desc: 'Our most popular choice, offering a comprehensive styling experience for your special day.'
              }}
            />

            <Link to="/quote" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', marginLeft: '0.5rem' }}>Request Quote</Link>
          </nav>

        </div>
      </header>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu"
            style={{
              position: 'fixed',
              top: '70px',
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              zIndex: 49,
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.2rem', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Home</Link>
            <a href="/#services" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.2rem', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Services</a>
            <a href="/#gallery" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.2rem', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Gallery</a>
            <a href="/#packages" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.2rem', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Packages</a>
            
            <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
              <Link to="/quote" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Request Quote</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 769px) {
          .mobile-toggle { display: none !important; }
          .mobile-menu { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
