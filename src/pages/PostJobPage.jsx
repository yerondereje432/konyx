import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Send,
  CreditCard,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PostJobPage() {
  const [step, setStep] = useState(1);
  const [jobData, setJobData] = useState({
    companyName: '',
    jobTitle: '',
    location: 'Addis Ababa',
    jobType: 'Full-time',
    salaryRange: '25,000 - 45,000 ETB / month',
    skills: 'React, Node.js, Amharic',
    description: '',
    plan: 'starter',
    paymentMethod: 'telebirr'
  });
  const [posted, setPosted] = useState(false);
  const [listingId, setListingId] = useState('');

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  const handlePost = (e) => {
    e.preventDefault();
    const id = 'KX-JOB-' + Math.floor(100000 + Math.random() * 900000);
    setListingId(id);
    setPosted(true);
  };

  return (
    <div className="pt-28 pb-20 bg-[#0A0D14] min-h-screen relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D06F4]/20 border border-[#1D06F4]/40 mb-4 text-xs font-semibold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            3-Minute Employer Job Posting Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Syne'] mb-3">
            Post a Job Vacancy on Konyx
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Connect directly with verified Haramaya University graduates and top Ethiopian professionals. Pay securely with local payment gateways.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!posted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#131A29]/95 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl"
              >
                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#1D06F4] text-white flex items-center justify-center font-bold text-sm">
                      1
                    </span>
                    <span className="text-sm font-bold text-white">Vacancy Details</span>
                  </div>
                  <div className="w-10 h-0.5 bg-white/10"></div>
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      step === 2 ? 'bg-[#1D06F4] text-white' : 'bg-white/10 text-slate-400'
                    }`}>
                      2
                    </span>
                    <span className="text-sm font-bold text-white">Local Payment & Publish</span>
                  </div>
                </div>

                <form onSubmit={handlePost}>
                  {step === 1 ? (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                            Company / Organization Name *
                          </label>
                          <input
                            type="text"
                            name="companyName"
                            required
                            value={jobData.companyName}
                            onChange={handleChange}
                            placeholder="e.g. Maya Digital Ventures"
                            className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                            Job Title *
                          </label>
                          <input
                            type="text"
                            name="jobTitle"
                            required
                            value={jobData.jobTitle}
                            onChange={handleChange}
                            placeholder="e.g. Senior Full-Stack Web Developer"
                            className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                            Location / Campus *
                          </label>
                          <select
                            name="location"
                            value={jobData.location}
                            onChange={handleChange}
                            className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                          >
                            <option value="Addis Ababa">Addis Ababa</option>
                            <option value="Haramaya University Campus">Haramaya University Campus</option>
                            <option value="Maya City, Oromia">Maya City, Oromia</option>
                            <option value="Hawassa">Hawassa</option>
                            <option value="Remote ET">Remote (Ethiopia)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                            Job Type *
                          </label>
                          <select
                            name="jobType"
                            value={jobData.jobType}
                            onChange={handleChange}
                            className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                            <option value="Part-time">Part-time</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                            Salary / Compensation (ETB) *
                          </label>
                          <input
                            type="text"
                            name="salaryRange"
                            required
                            value={jobData.salaryRange}
                            onChange={handleChange}
                            placeholder="e.g. 30,000 - 45,000 ETB / mo"
                            className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Required Skills (Comma separated for Konyx algorithm match) *
                        </label>
                        <input
                          type="text"
                          name="skills"
                          required
                          value={jobData.skills}
                          onChange={handleChange}
                          placeholder="e.g. React, Node.js, Peachtree, Figma, Amharic"
                          className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Detailed Job Description & Requirements *
                        </label>
                        <textarea
                          name="description"
                          rows={4}
                          required
                          value={jobData.description}
                          onChange={handleChange}
                          placeholder="Describe the day-to-day responsibilities, required qualifications, and why candidates should join..."
                          className="w-full bg-[#0B0E14] border border-white/15 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                        ></textarea>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="btn btn-primary px-8 py-3.5 text-sm font-bold rounded-xl shadow-lg shadow-[#1D06F4]/40"
                        >
                          Proceed to Payment Plan &rarr;
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-white mb-2">Select Employer Posting Plan</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                          onClick={() => setJobData({ ...jobData, plan: 'starter' })}
                          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                            jobData.plan === 'starter'
                              ? 'border-[#1D06F4] bg-[#1D06F4]/10 shadow-lg shadow-[#1D06F4]/20'
                              : 'border-white/10 bg-[#0B0E14] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                              Starter Vacancy
                            </span>
                            <span className="text-xl font-bold text-white">450 ETB</span>
                          </div>
                          <p className="text-xs text-slate-400 mb-3">
                            Standard 30-day listing. Algorithmic matching for top 25 candidates + messaging tools.
                          </p>
                          <span className="text-xs font-bold text-[#00E5FF]">Selected by default</span>
                        </div>

                        <div
                          onClick={() => setJobData({ ...jobData, plan: 'featured' })}
                          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                            jobData.plan === 'featured'
                              ? 'border-[#00E5FF] bg-[#00E5FF]/10 shadow-lg shadow-[#00E5FF]/20'
                              : 'border-white/10 bg-[#0B0E14] hover:border-white/20'
                          }`}
                        >
                          <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded bg-[#00E5FF] text-[#0A0D14] text-[10px] font-extrabold uppercase">
                            Featured
                          </span>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                              Featured Gold Post
                            </span>
                            <span className="text-xl font-bold text-white">1,450 ETB</span>
                          </div>
                          <p className="text-xs text-slate-400 mb-3">
                            30-day top banner placement + Unlimited candidate filtering + Campus outreach.
                          </p>
                          <span className="text-xs font-bold text-emerald-400">Top exposure</span>
                        </div>
                      </div>

                      {/* Payment Method Selector */}
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-2">
                          Select Local Ethiopian Payment Method *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'telebirr', label: 'Telebirr', color: 'text-emerald-400' },
                            { id: 'cbe', label: 'CBE Birr', color: 'text-blue-400' },
                            { id: 'chapa', label: 'Chapa Gateway', color: 'text-purple-400' }
                          ].map((pay) => (
                            <button
                              key={pay.id}
                              type="button"
                              onClick={() => setJobData({ ...jobData, paymentMethod: pay.id })}
                              className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all ${
                                jobData.paymentMethod === pay.id
                                  ? 'border-[#00E5FF] bg-[#00E5FF]/15 text-white'
                                  : 'border-white/10 bg-[#0B0E14] text-slate-400 hover:text-white'
                              }`}
                            >
                              <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${pay.color}`}></span>
                              {pay.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#0B0E14] border border-white/10 flex items-center justify-between text-xs text-slate-300">
                        <span>Total Due ({jobData.plan === 'starter' ? '450 ETB' : '1,450 ETB'}) via {jobData.paymentMethod.toUpperCase()}:</span>
                        <span className="font-bold text-[#00E5FF] text-sm">
                          {jobData.plan === 'starter' ? '450 ETB' : '1,450 ETB'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          &larr; Back to Vacancy Details
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary px-8 py-3.5 text-sm font-bold rounded-xl shadow-lg shadow-[#1D06F4]/40"
                        >
                          Confirm & Publish Vacancy <Send className="w-4 h-4 ml-1" />
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
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-widest block mb-2">
                  Vacancy Published Successfully
                </span>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
                  {jobData.jobTitle} is Now Live!
                </h3>

                <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mb-6">
                  Your job vacancy for <strong>{jobData.companyName}</strong> has been indexed in Konyx's matching engine. We are notifying verified candidates in <strong>{jobData.location}</strong> now.
                </p>

                <div className="max-w-sm mx-auto bg-[#0B0E14] border border-[#1D06F4]/50 rounded-2xl p-4 mb-8 text-left text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between border-b border-white/10 pb-2 mb-2">
                    <span className="font-bold text-slate-400">Konyx Job Reference:</span>
                    <span className="font-bold text-[#00E5FF]">{listingId}</span>
                  </div>
                  <p><strong>Payment Status:</strong> Verified ({jobData.paymentMethod.toUpperCase()})</p>
                  <p><strong>Plan:</strong> {jobData.plan === 'starter' ? 'Starter (450 ETB)' : 'Featured Gold (1,450 ETB)'}</p>
                  <p><strong>Skills Indexed:</strong> {jobData.skills}</p>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setPosted(false);
                      setStep(1);
                      setJobData({
                        companyName: '',
                        jobTitle: '',
                        location: 'Addis Ababa',
                        jobType: 'Full-time',
                        salaryRange: '25,000 - 45,000 ETB / month',
                        skills: 'React, Node.js, Amharic',
                        description: '',
                        plan: 'starter',
                        paymentMethod: 'telebirr'
                      });
                    }}
                    className="btn btn-outline px-6 py-3 text-sm font-semibold"
                  >
                    Post Another Job
                  </button>
                  <Link
                    to="/jobs"
                    className="btn btn-primary px-6 py-3 text-sm font-semibold"
                  >
                    View in Live Jobs Board
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
