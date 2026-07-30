import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Sparkles, 
  Award, 
  MapPin, 
  GraduationCap, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Heart,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const coreValues = [
    {
      title: 'Accessibility & Integrity',
      desc: 'We ensure our digital platform is accessible, affordable, and easy to navigate for every Ethiopian job seeker and employer.'
    },
    {
      title: 'Efficient Connection & Speed',
      desc: 'We prioritize rapid algorithmic matching and direct communication tools to eliminate weeks of waiting.'
    },
    {
      title: 'Service Excellence & Verification',
      desc: 'We maintain high standards through verified achievement badges, employer account vetting, and 2-way reviews.'
    },
    {
      title: 'Community Impact & Youth Focus',
      desc: 'We actively combat youth unemployment by bridging university education with real-world economic opportunities.'
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-[#0A0D14] min-h-screen relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D06F4]/20 border border-[#1D06F4]/40 mb-4 text-xs font-semibold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            About Konyx Partnership
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Syne'] mb-4">
            Empowering Ethiopia’s Next-Generation Labor Market
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Konyx is a digital platform connecting job seekers and employers across Ethiopia with speed, trust, and algorithmic skill-based matching.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20 items-center">
          <div className="bg-[#131A29]/80 border border-white/10 p-8 rounded-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mb-2 block">
              Our Origin & Purpose
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Syne'] mb-4">
              Born from Observation at Haramaya University
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
              Research for Konyx began by observing the struggles of university students and graduates who possess real skills but lack structured channels to find work. At the same time, Ethiopian SMEs and startups spend weeks filtering irrelevant CVs.
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We engineered Konyx to replace outdated paper job boards and informal referrals with an AI-driven, skill-first employment engine that supports local Ethiopian payment gateways like Telebirr and CBE Birr.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#131A29] p-6 rounded-2xl border border-white/10 text-center">
              <GraduationCap className="w-8 h-8 text-[#00E5FF] mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-white font-['Syne']">10,000+</div>
              <div className="text-xs text-slate-400">Target Student & Job Seeker Base</div>
            </div>
            <div className="bg-[#131A29] p-6 rounded-2xl border border-white/10 text-center">
              <ShieldCheck className="w-8 h-8 text-[#00E5FF] mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-white font-['Syne']">500+</div>
              <div className="text-xs text-slate-400">Verified Ethiopian Employers</div>
            </div>
            <div className="bg-[#131A29] p-6 rounded-2xl border border-white/10 text-center">
              <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-white font-['Syne']">98%</div>
              <div className="text-xs text-slate-400">Algorithmic Match Accuracy</div>
            </div>
            <div className="bg-[#131A29] p-6 rounded-2xl border border-white/10 text-center">
              <Globe className="w-8 h-8 text-[#1D06F4] mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-white font-['Syne']">Nationwide</div>
              <div className="text-xs text-slate-400">Digital Reach across Ethiopia</div>
            </div>
          </div>
        </div>

        {/* Leadership & Founders Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mb-2 block">
              Leadership & Partnership
            </span>
            <h2 className="text-3xl font-extrabold text-white font-['Syne']">
              Meet the Founders of Konyx
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kenake Adinew */}
            <div className="bg-[#131A29] border border-white/10 hover:border-[#1D06F4]/50 p-8 rounded-3xl transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1D06F4] to-[#00E5FF] text-white flex items-center justify-center text-xl font-bold font-['Syne']">
                  KA
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Kenake Adinew</h3>
                  <p className="text-sm font-semibold text-[#00E5FF]">Founder & Managing Director</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Kenake leads the strategic direction and overall management of Konyx, drawing from his strong background in coding, website development, and project coordination.
              </p>
              <div className="text-xs text-slate-400 border-t border-white/10 pt-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
                <span>Product Architecture & Vision • Investor Partnerships</span>
              </div>
            </div>

            {/* Yeron Dereje */}
            <div className="bg-[#131A29] border border-white/10 hover:border-[#1D06F4]/50 p-8 rounded-3xl transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-[#1D06F4] text-white flex items-center justify-center text-xl font-bold font-['Syne']">
                  YD
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Yeron Dereje</h3>
                  <p className="text-sm font-semibold text-[#00E5FF]">Co-Founder & Operations Director</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Yeron leads Konyx’s daily operations, service quality, and community support with his strong experience in cybersecurity, programming, and university leadership.
              </p>
              <div className="text-xs text-slate-400 border-t border-white/10 pt-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
                <span>Cybersecurity & Infrastructure • User Experience & Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white font-['Syne'] mb-2">
              Our Core Values
            </h2>
            <p className="text-sm text-slate-400">The standards that guide every algorithm and interaction on Konyx.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {coreValues.map((val, idx) => (
              <div key={idx} className="bg-[#131A29]/80 border border-white/10 p-6 rounded-2xl">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
                  {val.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed pl-6">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/jobs"
              className="btn btn-primary px-8 py-3.5 rounded-xl font-semibold shadow-xl shadow-[#1D06F4]/40"
            >
              Explore Live Opportunities on Konyx
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
