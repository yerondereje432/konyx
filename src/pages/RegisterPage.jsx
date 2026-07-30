import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: 'Haramaya University Campus',
    degree: 'BSc Computer Science',
    role: 'Full-Stack Web Developer',
    skills: 'React, Javascript, Node.js, Amharic',
    bio: '',
    tier: 'verified'
  });
  const [registered, setRegistered] = useState(false);
  const [passportId, setPassportId] = useState('');

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleComplete = (e) => {
    e.preventDefault();
    const pid = 'KX-PASS-' + Math.floor(100000 + Math.random() * 900000);
    setPassportId(pid);
    setRegistered(true);
  };

  return (
    <div className="pt-28 pb-20 bg-[#0A0D14] min-h-screen relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D06F4]/20 border border-[#1D06F4]/40 mb-4 text-xs font-semibold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            Job Seeker & Student Profile Builder
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Syne'] mb-3">
            Create Your Verified Konyx Profile
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Stand out to top Ethiopian employers with verified skill badges, university credentials, and real-time SMS job notifications.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!registered ? (
              <motion.div
                key="builder"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#131A29]/95 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl"
              >
                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10 text-xs sm:text-sm font-bold">
                  <div className="flex items-center gap-2 text-white">
                    <span className="w-7 h-7 rounded-full bg-[#1D06F4] text-white flex items-center justify-center">1</span>
                    <span>University & Role</span>
                  </div>
                  <div className="w-6 h-0.5 bg-white/10"></div>
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      step >= 2 ? 'bg-[#1D06F4] text-white' : 'bg-white/10 text-slate-400'
                    }`}>2</span>
                    <span className={step >= 2 ? 'text-white' : 'text-slate-400'}>Skills & Bio</span>
                  </div>
                  <div className="w-6 h-0.5 bg-white/10"></div>
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      step === 3 ? 'bg-[#1D06F4] text-white' : 'bg-white/10 text-slate-400'
                    }`}>3</span>
                    <span className={step === 3 ? 'text-white' : 'text-slate-400'}>Verification Badge</span>
                  </div>
                </div>

                <form onSubmit={handleComplete}>
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            required
                            value={profile.fullName}
                            onChange={handleChange}
                            placeholder="e.g. Abebe Tesfaye"
                            className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={profile.email}
                            onChange={handleChange}
                            placeholder="e.g. abebe@gmail.com"
                            className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                            Phone / SMS Alert Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={profile.phone}
                            onChange={handleChange}
                            placeholder="+251 90 135 7102"
                            className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                            University / Campus / Institution *
                          </label>
                          <select
                            name="institution"
                            value={profile.institution}
                            onChange={handleChange}
                            className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                          >
                            <option value="Haramaya University Campus">Haramaya University Campus</option>
                            <option value="Addis Ababa University">Addis Ababa University</option>
                            <option value="Adama Science & Technology">Adama Science & Technology</option>
                            <option value="Jimma University">Jimma University</option>
                            <option value="Hawassa University">Hawassa University</option>
                            <option value="Other / Professional">Other / Experienced Professional</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                            Degree / Field of Study *
                          </label>
                          <input
                            type="text"
                            name="degree"
                            required
                            value={profile.degree}
                            onChange={handleChange}
                            placeholder="e.g. BSc Computer Science"
                            className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                            Primary Professional Title *
                          </label>
                          <input
                            type="text"
                            name="role"
                            required
                            value={profile.role}
                            onChange={handleChange}
                            placeholder="e.g. Full-Stack Web Developer"
                            className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="btn btn-primary px-8 py-3.5 text-sm font-bold rounded-xl shadow-lg shadow-[#1D06F4]/40"
                        >
                          Next: Skills & Bio &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Top Skills (Comma separated for algorithmic matching) *
                        </label>
                        <input
                          type="text"
                          name="skills"
                          required
                          value={profile.skills}
                          onChange={handleChange}
                          placeholder="e.g. React, Node.js, Peachtree, Figma, Amharic, Python"
                          className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Professional Bio & Career Objectives *
                        </label>
                        <textarea
                          name="bio"
                          rows={4}
                          required
                          value={profile.bio}
                          onChange={handleChange}
                          placeholder="Describe your university coursework, freelance projects, internships, or what makes you stand out..."
                          className="w-full bg-[#0B0E14] border border-white/15 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                        ></textarea>
                      </div>

                      <div className="pt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-xs font-bold text-slate-400 hover:text-white"
                        >
                          &larr; Back to Step 1
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="btn btn-primary px-8 py-3.5 text-sm font-bold rounded-xl shadow-lg shadow-[#1D06F4]/40"
                        >
                          Next: Badge Tier Selection &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-white mb-2">Select Your Konyx Badge Tier</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Free forever */}
                        <div
                          onClick={() => setProfile({ ...profile, tier: 'free' })}
                          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                            profile.tier === 'free'
                              ? 'border-[#00E5FF] bg-[#00E5FF]/10 shadow-lg'
                              : 'border-white/10 bg-[#0B0E14] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                              Standard Profile
                            </span>
                            <span className="text-xl font-bold text-white">0 ETB</span>
                          </div>
                          <p className="text-xs text-slate-400 mb-3">
                            Unlimited job browsing, algorithmic matching, and standard email notifications.
                          </p>
                          <span className="text-xs font-bold text-slate-400">Forever Free</span>
                        </div>

                        {/* Verified Gold Badge */}
                        <div
                          onClick={() => setProfile({ ...profile, tier: 'verified' })}
                          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                            profile.tier === 'verified'
                              ? 'border-[#1D06F4] bg-[#1D06F4]/15 shadow-lg shadow-[#1D06F4]/30'
                              : 'border-white/10 bg-[#0B0E14] hover:border-white/20'
                          }`}
                        >
                          <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded bg-[#1D06F4] text-white text-[10px] font-extrabold uppercase">
                            Recommended
                          </span>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#00E5FF]">
                              Verified Gold Badge
                            </span>
                            <span className="text-xl font-bold text-white">150 ETB/mo</span>
                          </div>
                          <p className="text-xs text-slate-300 mb-3">
                            Verified Profile Badge + Top 10% search placement + Instant SMS/Telegram job alerts.
                          </p>
                          <span className="text-xs font-bold text-[#00E5FF]">Pay via Telebirr / CBE Birr</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#0B0E14] border border-white/10 text-xs text-slate-300 flex items-center justify-between">
                        <span>Selected Tier:</span>
                        <strong className="text-white">
                          {profile.tier === 'verified' ? 'Verified Gold Badge (150 ETB/mo)' : 'Standard Free Profile'}
                        </strong>
                      </div>

                      <div className="pt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-xs font-bold text-slate-400 hover:text-white"
                        >
                          &larr; Back to Step 2
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary px-8 py-3.5 text-sm font-bold rounded-xl shadow-lg shadow-[#1D06F4]/40"
                        >
                          Complete Registration & Activate Passport
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#131A29]/95 border-2 border-[#1D06F4] p-8 sm:p-12 rounded-3xl text-center shadow-2xl"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1D06F4] to-[#00E5FF] text-white flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Award className="w-8 h-8" />
                </div>

                <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-widest block mb-2">
                  Registration Complete
                </span>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
                  Welcome to Konyx, {profile.fullName}!
                </h3>

                <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mb-6">
                  Your profile has been indexed in Konyx’s algorithmic talent directory. Verified employers across Ethiopia can now discover your skills.
                </p>

                {/* Simulated Konyx Digital Passport Card */}
                <div className="max-w-sm mx-auto bg-gradient-to-br from-[#0A0D14] to-[#131A29] border border-[#00E5FF]/40 rounded-2xl p-5 mb-8 text-left shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-slate-400">KONYX DIGITAL PASSPORT</span>
                    <span className="text-xs font-bold text-[#00E5FF]">{passportId}</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p><strong>Name:</strong> {profile.fullName}</p>
                    <p><strong>Institution:</strong> {profile.institution}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                    <p><strong>Badge Tier:</strong> {profile.tier === 'verified' ? 'Gold Verified Pro (150 ETB)' : 'Standard Free'}</p>
                    <p><strong>Skills:</strong> {profile.skills}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Link
                    to="/jobs"
                    className="btn btn-primary px-8 py-3.5 text-sm font-semibold shadow-lg shadow-[#1D06F4]/40"
                  >
                    Browse Live Jobs Feed Now
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
