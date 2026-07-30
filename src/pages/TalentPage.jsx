import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Award, 
  User, 
  GraduationCap, 
  CheckCircle2, 
  Filter, 
  ArrowRight, 
  X, 
  Mail, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TalentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedBadge, setSelectedBadge] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [inviteSent, setInviteSent] = useState(false);

  const sampleCandidates = [
    {
      id: 101,
      name: 'Abebe Tesfaye',
      role: 'Full-Stack Web Developer',
      institution: 'Haramaya University • BSc Computer Science',
      location: 'Addis Ababa / Remote',
      badge: 'Gold Verified Badge',
      score: '99/100 Skill Score',
      availability: 'Immediate (Full-time / Contract)',
      expectedRate: '28,000 - 45,000 ETB / mo',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Tailwind', 'REST APIs'],
      bio: 'Top-ranking computer science graduate from Haramaya University with proven client web app deliveries. Experienced in modern JavaScript stacks and secure payment APIs.',
      certifications: ['Konyx Full-Stack Engineering Assessment (Top 1%)', 'Haramaya Hackathon Winner 2025', 'AWS Cloud Fundamentals']
    },
    {
      id: 102,
      name: 'Sara Melaku',
      role: 'UI/UX Designer & Mobile Prototyper',
      institution: 'Addis Ababa University • Design Systems',
      location: 'Addis Ababa',
      badge: 'Gold Verified Badge',
      score: '96/100 Skill Score',
      availability: 'Immediate (Full-time)',
      expectedRate: '25,000 - 35,000 ETB / mo',
      skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
      bio: 'Creative UI/UX designer with 3 years of freelance experience building intuitive mobile and web interfaces for Ethiopian fintech and e-commerce brands.',
      certifications: ['Konyx Product Design Endorsement', 'Google UX Professional Certificate']
    },
    {
      id: 103,
      name: 'Dawit Kassahun',
      role: 'Senior Financial Analyst & Accountant',
      institution: 'Adama Science & Tech • BA Accounting',
      location: 'Maya City / Addis Ababa',
      badge: 'Verified Professional',
      score: '94/100 Skill Score',
      availability: '2 Weeks Notice',
      expectedRate: '32,000 - 45,000 ETB / mo',
      skills: ['Peachtree', 'IFRS', 'Tax Law ET', 'Financial Modeling', 'Excel VBA'],
      bio: 'Experienced corporate accountant specializing in Ethiopian tax compliance, payroll automation, and quarterly corporate financial reporting.',
      certifications: ['Konyx Financial Accounting Level III Badge', 'CPA Level II Candidate']
    },
    {
      id: 104,
      name: 'Hana Yimer',
      role: 'Digital Marketing & Community Lead',
      institution: 'Haramaya University • Marketing Management',
      location: 'Haramaya Campus / Remote',
      badge: 'Silver Verified Badge',
      score: '91/100 Skill Score',
      availability: 'Immediate (Internship / Junior)',
      expectedRate: '16,000 - 22,000 ETB / mo',
      skills: ['Social Ads', 'Content Strategy', 'Telegram Growth', 'Copywriting', 'Canva'],
      bio: 'High-energy digital strategist who grew Haramaya tech club social channels by 300%. Ready to help Ethiopian SMEs acquire youth customers online.',
      certifications: ['Konyx Social & Content Badge', 'HubSpot Marketing Specialist']
    },
    {
      id: 105,
      name: 'Yonas Bekele',
      role: 'Mobile App Engineer (Flutter/Android)',
      institution: 'Jimma University • Software Engineering',
      location: 'Addis Ababa',
      badge: 'Gold Verified Badge',
      score: '97/100 Skill Score',
      availability: 'Immediate',
      expectedRate: '35,000 - 55,000 ETB / mo',
      skills: ['Flutter', 'Dart', 'Kotlin', 'Firebase', 'Mobile Security'],
      bio: 'Mobile specialist with 2 live Android apps for Ethiopian retail and logistics businesses. Fast execution and clean modular codebase.',
      certifications: ['Konyx Mobile Engineering Badge', 'Verified Chapa & Telebirr Integration Pro']
    },
    {
      id: 106,
      name: 'Mekdes Tadesse',
      role: 'Business Development & Sales Executive',
      institution: 'Hawassa University • Business Administration',
      location: 'Hawassa / Addis Ababa',
      badge: 'Verified Professional',
      score: '92/100 Skill Score',
      availability: 'Immediate',
      expectedRate: '25,000 - 35,000 ETB / mo',
      skills: ['B2B Sales', 'Negotiation', 'CRM Management', 'Account Growth'],
      bio: 'Result-oriented B2B sales professional with deep supplier connections across southern Ethiopia and Addis Ababa SME networks.',
      certifications: ['Konyx Business & Negotiations Badge']
    }
  ];

  const filteredCandidates = sampleCandidates.filter((cand) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      cand.name.toLowerCase().includes(q) ||
      cand.role.toLowerCase().includes(q) ||
      cand.institution.toLowerCase().includes(q) ||
      cand.skills.some(s => s.toLowerCase().includes(q));
    if (!matchesSearch) return false;
    if (selectedSkill !== 'All' && !cand.skills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase()))) return false;
    if (selectedBadge !== 'All' && !cand.badge.includes(selectedBadge)) return false;
    return true;
  });

  return (
    <div className="pt-28 pb-20 bg-[#0A0D14] min-h-screen relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 mb-4 text-xs font-semibold text-[#00E5FF]">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Talent & Student Network
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Syne'] mb-3">
            Browse Verified Ethiopian Talent
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            For employers & businesses: Filter candidates by verified Konyx achievement badges, university background, and proven skill scores.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#131A29]/95 border border-white/10 rounded-2xl p-4 sm:p-6 mb-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="md:col-span-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, skill, or university..."
                className="w-full bg-[#0B0E14] border border-white/15 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            {/* Skill Filter */}
            <div>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="All">All Skill Specializations</option>
                <option value="React">React / Web Engineering</option>
                <option value="Figma">UI/UX & Figma Design</option>
                <option value="Peachtree">Accounting & Peachtree</option>
                <option value="Marketing">Social & Digital Marketing</option>
                <option value="Flutter">Mobile App Engineering</option>
              </select>
            </div>

            {/* Verification Badge Select */}
            <div>
              <select
                value={selectedBadge}
                onChange={(e) => setSelectedBadge(e.target.value)}
                className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="All">All Verification Badges</option>
                <option value="Gold">Gold Verified Badge</option>
                <option value="Silver">Silver Verified Badge</option>
                <option value="Verified Professional">Verified Professional</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count & Employer Banner */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-semibold text-slate-300">
            Showing <strong className="text-white">{filteredCandidates.length}</strong> Verified Candidates
          </span>
          <Link
            to="/post-job"
            className="text-xs font-bold text-[#00E5FF] hover:underline flex items-center gap-1"
          >
            Want applicants to apply to you? Post a Job &rarr;
          </Link>
        </div>

        {/* Candidate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCandidates.map((cand) => (
              <motion.div
                key={cand.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onClick={() => {
                  setSelectedCandidate(cand);
                  setInviteSent(false);
                }}
                className="bg-[#131A29]/90 border border-white/10 hover:border-[#00E5FF]/60 p-6 rounded-2xl flex flex-col justify-between cursor-pointer group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {cand.badge}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
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

                  <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                    {cand.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {cand.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2.5 py-0.5 rounded-md bg-[#0B0E14] text-slate-300 border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {cand.expectedRate}
                  </span>
                  <span className="text-xs font-bold text-[#00E5FF] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Inspect Profile <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Candidate Detail & Interview Invitation Modal */}
        <AnimatePresence>
          {selectedCandidate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setSelectedCandidate(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#131A29] border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                {!inviteSent ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF]">
                        {selectedCandidate.badge}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full">
                        {selectedCandidate.score}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1">{selectedCandidate.name}</h2>
                    <p className="text-sm font-semibold text-[#00E5FF] mb-3">{selectedCandidate.role}</p>
                    <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-slate-500" /> {selectedCandidate.institution} • <MapPin className="w-3.5 h-3.5 ml-2" /> {selectedCandidate.location}
                    </p>

                    <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-white/10 mb-5 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Target Monthly Compensation:</span>
                      <span className="text-base font-bold text-white font-['Syne']">{selectedCandidate.expectedRate}</span>
                    </div>

                    <div className="mb-5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Professional Summary & Bio
                      </h3>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {selectedCandidate.bio}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                        Verified Credentials & Certifications
                      </h3>
                      <ul className="space-y-1.5">
                        {selectedCandidate.certifications.map((cert, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setInviteSent(true)}
                        className="btn btn-primary flex-1 py-3.5 justify-center text-sm font-bold shadow-lg shadow-[#1D06F4]/40"
                      >
                        Invite to Interview / Direct Message
                      </button>
                      <button
                        onClick={() => setSelectedCandidate(null)}
                        className="btn btn-outline px-5 py-3.5 text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-400/40">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Invitation Sent!</h3>
                    <p className="text-sm text-slate-300 mb-6">
                      Your interview request has been sent to <strong>{selectedCandidate.name}</strong> via SMS and Konyx direct notification.
                    </p>
                    <button
                      onClick={() => {
                        setInviteSent(false);
                        setSelectedCandidate(null);
                      }}
                      className="btn btn-primary w-full py-3 justify-center text-sm font-semibold"
                    >
                      Back to Candidate Directory
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
