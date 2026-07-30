import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';
import konyxLogo from '../assets/konyx-logo.jpg';

export default function Footer() {
  return (
    <footer className="bg-[#080B10] text-slate-400 border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle Blue Glow in Footer */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-[#1D06F4]/15 to-transparent rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 shadow-lg shadow-[#1D06F4]/30 border border-[#1D06F4]/40" style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}>
                <img src={konyxLogo} alt="Konyx Logo" className="w-full h-full object-contain" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-1 font-sans">
                KONYX
                <span className="w-2 h-2 rounded-full bg-[#00E5FF]"></span>
              </span>
            </Link>

            <p className="text-sm text-slate-300 max-w-sm mb-6 leading-relaxed">
              Ethiopia’s leading digital employment platform. Combining algorithmic skill-based matching, verified achievement badges, and secure local payments to accelerate hiring across the nation.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                <span><strong>Managing Director:</strong> Kenake Adinew</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                <span><strong>Operations Director:</strong> Yeron Dereje</span>
              </div>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-sans">
              Platform Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Find Verified Jobs
                </Link>
              </li>
              <li>
                <Link to="/talent" className="hover:text-white transition-colors">
                  Browse Student Talent
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="hover:text-white transition-colors">
                  Post a Job Vacancy
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing & Badges
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  How Konyx Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Users */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-sans">
              Who We Serve
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/register" className="hover:text-[#00E5FF] transition-colors">
                  University Students & Interns
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#00E5FF] transition-colors">
                  Skilled Graduates
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="hover:text-[#00E5FF] transition-colors">
                  Ethiopian SMEs & Startups
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#00E5FF] transition-colors">
                  Haramaya University Network
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Local Payment Gateways
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-sans">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <a href="mailto:Kenakeadinew12@gmail.com" className="hover:text-white transition-colors break-all">
                  Kenakeadinew12@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00E5FF] shrink-0" />
                <a href="tel:+251901357102" className="hover:text-white transition-colors">
                  +251 901 357 102
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <span>
                  Haramaya University Campus, <br />
                  Maya City, Oromia Region, ET <br />
                  <span className="text-slate-400 text-xs">Digital Services Nationwide</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Konyx Digital Employment Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security & Compliance</span>
            <span className="hover:text-white cursor-pointer">Local Payment Gateway</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
