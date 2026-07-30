import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Sparkles, 
  UserCheck, 
  Briefcase, 
  Search, 
  Users, 
  PlusCircle, 
  Info, 
  CreditCard 
} from 'lucide-react';
import konyxLogo from '../assets/konyx-logo.jpg';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Find Jobs', href: '/jobs', icon: Search },
    { name: 'Browse Talent', href: '/talent', icon: Users },
    { name: 'Pricing & Badges', href: '/pricing', icon: CreditCard },
    { name: 'About Konyx', href: '/about', icon: Info },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0B0E14]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl' 
          : 'bg-[#0B0E14]/70 backdrop-blur-sm border-b border-white/5 py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 shadow-lg shadow-[#1D06F4]/30 border border-[#1D06F4]/40 transition-transform duration-300 group-hover:scale-105" style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}>
            <img src={konyxLogo} alt="Konyx Logo" className="w-full h-full object-contain" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1 font-['Syne']">
              KONYX
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] inline-block animate-pulse"></span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
              Ethiopian Talent Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors py-1 flex items-center gap-1.5 relative ${
                  active ? 'text-[#00E5FF] font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                {link.name}
                {active && (
                  <span className="absolute bottom-[-6px] left-0 w-full h-[2px] bg-gradient-to-r from-[#1D06F4] to-[#00E5FF]"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons for Platform (Seeker & Employer) */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/register"
            className="text-sm font-medium text-slate-200 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 border border-white/10 transition-all flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4 text-[#00E5FF]" />
            Join as Seeker
          </Link>
          <Link
            to="/post-job"
            className="btn btn-primary text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-[#1D06F4]/40 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Post a Job
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#0F1420] border-b border-white/10 px-6 py-6 shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-slate-200 hover:text-[#00E5FF] transition-colors py-2.5 border-b border-white/5 flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4 text-[#00E5FF]" />
                    {link.name}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-3 pt-4">
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-sm font-medium text-white bg-white/10 rounded-xl flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-[#00E5FF]" />
                  Join as Job Seeker
                </Link>
                <Link
                  to="/post-job"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary w-full py-3 justify-center"
                >
                  <PlusCircle className="w-4 h-4" />
                  Post a Job Vacancy
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
