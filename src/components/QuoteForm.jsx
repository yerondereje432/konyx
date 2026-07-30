import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  User, 
  Building2, 
  Award, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuoteForm() {
  const [userType, setUserType] = useState('employer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: 'Addis Ababa',
    skillArea: 'Software & Technology',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [verificationId, setVerificationId] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const randomId = 'KX-' + Math.floor(100000 + Math.random() * 900000);
    setVerificationId(randomId);
    setSubmitted(true);
  };

  return (
    <section id="contact-form" className="section-padding bg-[#0B0E14] relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="section-subtitle">Join Konyx Today</span>
          <h2 className="heading-secondary">
            Get Started with Ethiopia’s <br />
            <span className="bg-gradient-to-r from-white via-slate-200 to-[#00E5FF] bg-clip-text text-transparent">
              Most Trusted Platform
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Whether you need to hire verified talent immediately, monetize your skills, or discuss strategic partnerships, get in touch below.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card bg-[#131A29]/95 border border-white/10 p-6 sm:p-10 rounded-3xl shadow-2xl relative"
              >
                {/* User Type Switcher */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8 p-1.5 bg-[#0B0E14] rounded-2xl border border-white/10">
                  {[
                    { id: 'employer', label: 'I’m an Employer (Hire Talent)', icon: Building2 },
                    { id: 'seeker', label: 'I’m a Job Seeker / Student', icon: User },
                    { id: 'investor', label: 'Investor & Strategic Partner', icon: Award }
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setUserType(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                          userType === tab.id
                            ? 'bg-gradient-to-r from-[#1D06F4] to-[#3B28FF] text-white shadow-lg shadow-[#1D06F4]/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="form-group mb-0">
                      <label className="form-label text-slate-300 font-semibold mb-2 block">
                        Full Name / Company Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder={userType === 'employer' ? 'e.g. Maya Digital Ventures' : 'e.g. Abebe Tesfaye'}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group mb-0">
                      <label className="form-label text-slate-300 font-semibold mb-2 block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. kenakeadinew12@gmail.com"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="form-group mb-0">
                      <label className="form-label text-slate-300 font-semibold mb-2 block">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+251 90 135 7102"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group mb-0">
                      <label className="form-label text-slate-300 font-semibold mb-2 block">
                        Location / Campus *
                      </label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="form-select bg-[#1A2338] text-white"
                      >
                        <option value="Addis Ababa">Addis Ababa</option>
                        <option value="Haramaya University Campus">Haramaya University Campus</option>
                        <option value="Maya City, Oromia">Maya City, Oromia</option>
                        <option value="Hawassa">Hawassa</option>
                        <option value="Adama">Adama</option>
                        <option value="Other Ethiopia Region / Remote">Other Ethiopia Region / Remote</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-slate-300 font-semibold mb-2 block">
                      {userType === 'employer' 
                        ? 'Primary Hiring Industry / Sector' 
                        : userType === 'seeker' 
                        ? 'Primary Skill / Specialization' 
                        : 'Inquiry Subject'}
                    </label>
                    <select
                      name="skillArea"
                      value={formData.skillArea}
                      onChange={handleChange}
                      className="form-select bg-[#1A2338] text-white"
                    >
                      <option value="Software & Technology">Software Engineering & Technology</option>
                      <option value="Accounting & Finance">Accounting, Finance & Tax</option>
                      <option value="UI/UX & Creative Design">UI/UX & Creative Graphic Design</option>
                      <option value="Digital Marketing">Digital Marketing & Content Strategy</option>
                      <option value="Business & Sales">Business Development, Sales & SMEs</option>
                      <option value="Strategic Partnership / Investment">Strategic Partnership / Equity Financing</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-slate-300 font-semibold mb-2 block">
                      {userType === 'employer' 
                        ? 'Job Vacancy Requirements & Notes' 
                        : userType === 'seeker' 
                        ? 'Brief Bio / Core Skills & Education' 
                        : 'Partnership & Funding Inquiry Details'}
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={
                        userType === 'employer'
                          ? 'Describe the role, salary range, and specific skills required...'
                          : userType === 'seeker'
                          ? 'Describe your university coursework, practical skills, or career goals...'
                          : 'Discuss investment terms, partnership ideas, or university collaboration...'
                      }
                      className="form-textarea"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="btn btn-primary w-full py-4 text-base font-bold rounded-xl shadow-xl shadow-[#1D06F4]/40 flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      {userType === 'employer'
                        ? 'Submit Employer Inquiry & Post Job'
                        : userType === 'seeker'
                        ? 'Register for Verified Profile & Badge'
                        : 'Send Partnership Inquiry'}
                    </button>
                  </div>

                  <p className="text-center text-xs text-slate-400 mt-4">
                    <ShieldCheck className="w-4 h-4 inline-block text-[#00E5FF] mr-1" />
                    Your information is protected by Konyx’s secure encryption protocols.
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card bg-[#131A29]/95 border-2 border-[#1D06F4] p-8 sm:p-12 rounded-3xl text-center shadow-2xl"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1D06F4] to-[#00E5FF] text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#1D06F4]/50 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <span className="badge-pill badge-verified mb-3">
                  Verification Initiated
                </span>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                  Welcome to Konyx, {formData.fullName || 'Partner'}!
                </h3>

                <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8">
                  Your inquiry has been logged in our secure database. Our team in Haramaya University / Addis Ababa will review your profile and activate your customized notifications.
                </p>

                {/* Simulated Verification Card */}
                <div className="max-w-sm mx-auto bg-[#0B0E14] border border-[#1D06F4]/50 rounded-2xl p-5 mb-8 text-left shadow-lg">
                  <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-slate-400">Konyx Digital Passport</span>
                    <span className="text-xs font-bold text-[#00E5FF]">{verificationId}</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-300">
                    <p><strong>Name:</strong> {formData.fullName}</p>
                    <p><strong>Role Type:</strong> {userType === 'employer' ? 'Verified Employer' : userType === 'seeker' ? 'Job Seeker / Student' : 'Strategic Partner'}</p>
                    <p><strong>Region:</strong> {formData.location}</p>
                    <p><strong>Specialization:</strong> {formData.skillArea}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        location: 'Addis Ababa',
                        skillArea: 'Software & Technology',
                        message: ''
                      });
                    }}
                    className="btn btn-outline px-6 py-3 text-sm font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Send Another Inquiry
                  </button>
                  <Link
                    to="/"
                    className="btn btn-primary px-6 py-3 text-sm font-semibold"
                  >
                    Back to Homepage
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
