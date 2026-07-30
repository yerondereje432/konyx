import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Award, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Users, 
  GraduationCap, 
  ShieldCheck,
  TrendingUp,
  CreditCard,
  PlusCircle,
  UserCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('All');
  const navigate = useNavigate();

  const handleSearchJobs = (e) => {
    e.preventDefault();
    navigate('/jobs');
  };

  const handleSearchTalent = (e) => {
    e.preventDefault();
    navigate('/talent');
  };

  const recentVacancies = [
    {
      id: 1,
      title: 'Senior Full-Stack Web Developer',
      company: 'Addis Digital Ventures',
      location: 'Addis Ababa (Hybrid)',
      salary: '35,000 - 55,000 ETB / month',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Tailwind'],
      matchScore: '98% Match',
      type: 'Full-time'
    },
    {
      id: 2,
      title: 'UI/UX Design & Product Intern',
      company: 'Maya Creative Tech',
      location: 'Haramaya Campus / Remote',
      salary: '15,000 - 22,000 ETB / month',
      skills: ['Figma', 'User Research', 'Wireframing'],
      matchScore: '96% Match',
      type: 'Internship'
    },
    {
      id: 3,
      title: 'Financial Analyst & Accountant',
      company: 'Oromia Trading Enterprise',
      location: 'Addis Ababa',
      salary: '28,000 - 40,000 ETB / month',
      skills: ['Peachtree', 'IFRS', 'Tax Filing ET'],
      matchScore: '94% Match',
      type: 'Full-time'
    }
  ];

  const featuredTalent = [
    {
      id: 101,
      name: 'Abebe Tesfaye',
      role: 'Full-Stack Web Developer',
      institution: 'Haramaya University • CS Graduate',
      badge: 'Gold Verified Badge',
      score: '99/100 Skill Score',
      rate: '28,000 - 45,000 ETB / mo',
      skills: ['React', 'Node.js', 'REST APIs', 'PostgreSQL']
    },
    {
      id: 102,
      name: 'Sara Melaku',
      role: 'UI/UX Designer & Prototyper',
      institution: 'Addis Ababa University • Design',
      badge: 'Gold Verified Badge',
      score: '96/100 Skill Score',
      rate: '25,000 - 35,000 ETB / mo',
      skills: ['Figma', 'Prototyping', 'Design Systems']
    },
    {
      id: 103,
      name: 'Dawit Kassahun',
      role: 'Corporate Financial Accountant',
      institution: 'Adama Science & Tech • Accounting',
      badge: 'Verified Professional',
      score: '94/100 Skill Score',
      rate: '32,000 - 45,000 ETB / mo',
      skills: ['Peachtree', 'IFRS Standards', 'Tax Law ET']
    }
  ];

  return (
    <div className="bg-[#0A0D14] min-h-screen">
      {/* 1. PLATFORM HERO WITH LIVE SEARCH ENGINE */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#1D06F4]/30 via-[#3B28FF]/20 to-transparent rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute top-3/4 right-10 w-[400px] h-[400px] bg-gradient-to-tr from-[#00E5FF]/20 to-[#1D06F4]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#1D06F4]/20 to-[#00E5FF]/20 border border-[#1D06F4]/40 mb-6 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Ethiopia’s Premier Digital Employment Platform
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]"></span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 font-['Syne']"
            >
              Connect. Match. Succeed. <br />
              <span className="bg-gradient-to-r from-white via-slate-200 to-[#00E5FF] bg-clip-text text-transparent">
                Smart Hiring Across Ethiopia.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
            >
              The digital employment platform that connects university students, skilled professionals, and employers with <span className="text-[#00E5FF] font-semibold">algorithmic skill matching</span>, verified achievement badges, 2-way reviews, and local payment integration.
            </motion.p>

            {/* Interactive Search Engine Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-[#131A29]/95 border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl max-w-3xl mx-auto mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Role, skill (e.g. React, Accounting), or company..."
                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div>
                  <select
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3.5 text-sm sm:text-base text-white focus:outline-none focus:border-[#00E5FF]"
                  >
                    <option value="All">All Ethiopia</option>
                    <option value="Addis Ababa">Addis Ababa</option>
                    <option value="Haramaya">Haramaya Campus</option>
                    <option value="Maya City">Maya City, Oromia</option>
                    <option value="Hawassa">Hawassa</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleSearchJobs}
                  className="btn btn-primary w-full sm:flex-1 py-3.5 justify-center text-sm font-bold shadow-lg shadow-[#1D06F4]/40"
                >
                  <Briefcase className="w-4 h-4 mr-1.5" />
                  Search Verified Jobs
                </button>
                <button
                  onClick={handleSearchTalent}
                  className="btn btn-outline w-full sm:flex-1 py-3.5 justify-center text-sm font-bold"
                >
                  <Users className="w-4 h-4 mr-1.5 text-[#00E5FF]" />
                  Search Verified Candidates
                </button>
              </div>
            </motion.div>

            {/* Popular Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Popular Searches:</span>
              {['Haramaya Campus', 'Addis Ababa Tech', 'Peachtree Accounting', 'Figma UI/UX', 'Internships'].map((tag) => (
                <Link
                  key={tag}
                  to="/jobs"
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. PLATFORM STATS BAR */}
      <section className="border-y border-white/10 bg-[#0F1420]/60 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { label: 'University Students & Job Seekers', value: '10,000+', icon: GraduationCap },
              { label: 'Verified Ethiopian Employers', value: '500+', icon: ShieldCheck },
              { label: 'Algorithmic Match Accuracy', value: '98%', icon: TrendingUp },
              { label: 'Local Payment Integrations', value: '100%', icon: CreditCard, sub: 'Telebirr, CBE Birr & Chapa' }
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-[#1D06F4]/20 text-[#00E5FF] flex items-center justify-center mx-auto mb-3 border border-[#1D06F4]/40">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Syne'] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-slate-400">{stat.label}</div>
                  {stat.sub && <div className="text-[10px] text-slate-500 mt-0.5">{stat.sub}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. LIVE VERIFIED JOB VACANCIES PREVIEW */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mb-1 block">
                Live Vacancies Feed
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white font-['Syne']">
                Recent Verified Opportunities
              </h2>
            </div>
            <Link
              to="/jobs"
              className="text-sm font-bold text-[#00E5FF] hover:underline flex items-center gap-1 group"
            >
              Browse All 100+ Live Jobs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentVacancies.map((job) => (
              <Link
                key={job.id}
                to="/jobs"
                className="bg-[#131A29]/90 border border-white/10 hover:border-[#1D06F4]/60 p-6 rounded-2xl transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                      {job.matchScore}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full">
                      {job.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#00E5FF] transition-colors mb-1">
                    {job.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#00E5FF]" />
                    {job.company}
                  </p>
                  <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {job.skills.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-0.5 rounded-md bg-[#0B0E14] text-slate-300 border border-white/5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm font-bold text-white font-['Syne']">
                    {job.salary}
                  </span>
                  <span className="text-xs font-bold text-[#00E5FF] flex items-center gap-1">
                    Apply Now &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VERIFIED TALENT & STUDENTS DIRECTORY PREVIEW */}
      <section className="py-20 bg-[#0F1420]/50 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mb-1 block">
                For Employers & Businesses
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white font-['Syne']">
                Featured Verified Ethiopian Talent
              </h2>
            </div>
            <Link
              to="/talent"
              className="text-sm font-bold text-[#00E5FF] hover:underline flex items-center gap-1 group"
            >
              Browse All Verified Candidates <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTalent.map((cand) => (
              <Link
                key={cand.id}
                to="/talent"
                className="bg-[#131A29]/90 border border-white/10 hover:border-[#00E5FF]/60 p-6 rounded-2xl transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">
                      {cand.badge}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full">
                      {cand.score}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#00E5FF] transition-colors mb-1">
                    {cand.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#00E5FF] mb-2">{cand.role}</p>
                  <p className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-slate-500" />
                    {cand.institution}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {cand.skills.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-0.5 rounded-md bg-[#0B0E14] text-slate-300 border border-white/5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm font-bold text-white font-['Syne']">
                    {cand.rate}
                  </span>
                  <span className="text-xs font-bold text-[#00E5FF] flex items-center gap-1">
                    Invite to Interview &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE TWO-SIDED VALUE PROPOSITION */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mb-2 block">
              Why Konyx
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white font-['Syne']">
              Engineered for Both Sides of the Market
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* For Job Seekers & Students */}
            <div className="bg-gradient-to-b from-[#131A29] to-[#0E1422] border border-white/10 p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#1D06F4]/20 border border-[#1D06F4]/40 flex items-center justify-center text-[#00E5FF] mb-6">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider block mb-1">
                  For Students & Job Seekers
                </span>
                <h3 className="text-2xl font-bold text-white font-['Syne'] mb-3">
                  Verify Skills & Get Discovered
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  No more sending CVs into a black hole. Build a Konyx profile, earn verified achievement badges, and get instant SMS alerts the moment a job matches your skills.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="text-sm text-slate-300 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span>Free forever account with unlimited job browsing</span>
                  </li>
                  <li className="text-sm text-slate-300 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span>Verified Gold Badge option (150 ETB/mo) via Telebirr/CBE Birr</span>
                  </li>
                  <li className="text-sm text-slate-300 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span>Two-way ratings & direct chat with verified employers</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="btn btn-primary w-full py-3.5 justify-center text-sm font-bold"
              >
                Create Job Seeker Profile &rarr;
              </Link>
            </div>

            {/* For Employers & Businesses */}
            <div className="bg-gradient-to-b from-[#131A29] to-[#0E1422] border border-white/10 p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/20 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] mb-6">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  For Employers & SMEs
                </span>
                <h3 className="text-2xl font-bold text-white font-['Syne'] mb-3">
                  Hire Vetted Talent in 3 Minutes
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Stop reading hundreds of unqualified CVs. Our algorithm scores applicants automatically, presenting you with the top 10% most qualified candidates.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="text-sm text-slate-300 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Post a job vacancy in under 3 minutes (450 ETB/post)</span>
                  </li>
                  <li className="text-sm text-slate-300 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Access verified Haramaya University & nationwide graduates</span>
                  </li>
                  <li className="text-sm text-slate-300 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Pay locally with Telebirr, CBE Birr, or Chapa Gateway</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/post-job"
                className="btn btn-outline w-full py-3.5 justify-center text-sm font-bold border-white/20 hover:border-[#00E5FF]"
              >
                Post an Employer Job Vacancy &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTEGRATED LOCAL PAYMENT BANNER */}
      <section className="py-14 border-t border-white/10 bg-[#0A0D14]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Integrated with Secure Ethiopian Payment Gateways
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-slate-300">
            <span className="px-5 py-2.5 rounded-xl bg-[#131A29] border border-white/10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Telebirr
            </span>
            <span className="px-5 py-2.5 rounded-xl bg-[#131A29] border border-white/10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> CBE Birr
            </span>
            <span className="px-5 py-2.5 rounded-xl bg-[#131A29] border border-white/10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> Chapa Payment Gateway
            </span>
            <span className="px-5 py-2.5 rounded-xl bg-[#131A29] border border-white/10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> BoaBirr
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
