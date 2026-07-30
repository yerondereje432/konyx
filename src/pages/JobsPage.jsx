import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Award, 
  Briefcase, 
  Building2, 
  Filter, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  DollarSign, 
  Sparkles,
  Bookmark,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  const sampleJobs = [
    {
      id: 1,
      title: 'Senior Full-Stack Web Developer',
      company: 'Addis Digital Ventures',
      location: 'Addis Ababa (Hybrid)',
      type: 'Full-time',
      category: 'Software & Technology',
      salary: '35,000 - 55,000 ETB / month',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'REST APIs'],
      matchScore: '98% Match',
      verifiedEmployer: true,
      featured: true,
      postedDate: '2 hours ago',
      description: 'We are looking for an experienced full-stack engineer to lead our internal fintech product dashboard. Strong experience in modern Javascript frameworks and REST APIs required.',
      requirements: [
        'BSc in Computer Science, Software Engineering or related field',
        '3+ years full-stack web development experience',
        'Proficiency in React and Node.js',
        'Strong problem-solving and Amharic/English communication skills'
      ]
    },
    {
      id: 2,
      title: 'UI/UX Design & Product Intern',
      company: 'Maya Creative Tech',
      location: 'Haramaya University Campus / Remote',
      type: 'Internship',
      category: 'UI/UX & Creative',
      salary: '15,000 - 22,000 ETB / month',
      skills: ['Figma', 'Prototyping', 'User Research', 'Wireframing'],
      matchScore: '96% Match',
      verifiedEmployer: true,
      featured: true,
      postedDate: '5 hours ago',
      description: 'Exciting opportunity for Haramaya University students and recent graduates! Help design intuitive mobile workflows for our emerging local edtech apps.',
      requirements: [
        'Verified Figma or UI/UX Portfolio',
        'Passion for human-centered digital design',
        'Available 20-30 hours per week during academic term or full-time after graduation'
      ]
    },
    {
      id: 3,
      title: 'Financial Analyst & Accountant',
      company: 'Oromia Logistics & Trading Enterprise',
      location: 'Addis Ababa',
      type: 'Full-time',
      category: 'Accounting & Finance',
      salary: '28,000 - 40,000 ETB / month',
      skills: ['Peachtree', 'IFRS Standards', 'Tax Filing', 'Excel VBA'],
      matchScore: '94% Match',
      verifiedEmployer: true,
      featured: false,
      postedDate: '1 day ago',
      description: 'Seeking a detail-oriented financial analyst to manage payroll, tax filings, and quarterly accounting reports for our logistics division.',
      requirements: [
        'BA in Accounting, Banking & Finance, or Economics',
        '2+ years working with Peachtree & Ethiopian Tax Laws',
        'High ethical standards and analytical precision'
      ]
    },
    {
      id: 4,
      title: 'Digital Marketing Specialist',
      company: 'EthioDigital Incubator',
      location: 'Maya City, Oromia',
      type: 'Contract',
      category: 'Marketing',
      salary: '20,000 - 28,000 ETB / month',
      skills: ['SEO', 'Content Strategy', 'Telegram Ads', 'Copywriting'],
      matchScore: '93% Match',
      verifiedEmployer: true,
      featured: false,
      postedDate: '2 days ago',
      description: 'Lead social media campaigns across Telegram, LinkedIn, and Instagram for emerging Ethiopian tech startups in our Haramaya incubator.',
      requirements: [
        'Proven track record growing social media channels',
        'Strong copywriting in Amharic & English',
        'Experience with Canva or Adobe Suite'
      ]
    },
    {
      id: 5,
      title: 'Mobile App Engineer (Flutter/Kotlin)',
      company: 'Abyssinia Pay Systems',
      location: 'Addis Ababa',
      type: 'Full-time',
      category: 'Software & Technology',
      salary: '40,000 - 60,000 ETB / month',
      skills: ['Flutter', 'Dart', 'Firebase', 'Mobile Security'],
      matchScore: '97% Match',
      verifiedEmployer: true,
      featured: true,
      postedDate: 'Just now',
      description: 'Join our fintech mobile engineering team to build secure, high-performance payment applications integrating Telebirr and CBE Birr APIs.',
      requirements: [
        'Verified Mobile Development Konyx Badge',
        'Published at least 2 apps on Google Play / App Store',
        'Deep understanding of secure mobile storage & REST APIs'
      ]
    },
    {
      id: 6,
      title: 'Business Development Specialist',
      company: 'Hawassa Industrial Trading',
      location: 'Hawassa / Addis Ababa',
      type: 'Full-time',
      category: 'Business & Sales',
      salary: '25,000 - 35,000 ETB / month',
      skills: ['B2B Sales', 'Negotiation', 'CRM', 'Market Analysis'],
      matchScore: '91% Match',
      verifiedEmployer: true,
      featured: false,
      postedDate: '3 days ago',
      description: 'Drive B2B partnerships and supplier contracts for our agricultural export and logistics operations.',
      requirements: [
        'BA in Management, Marketing or International Trade',
        '3+ years experience in B2B sales or SME consulting',
        'Strong network across southern Ethiopia'
      ]
    }
  ];

  const filteredJobs = sampleJobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.skills.some(s => s.toLowerCase().includes(q));
    if (!matchesSearch) return false;
    if (selectedLocation !== 'All' && !job.location.includes(selectedLocation)) return false;
    if (selectedType !== 'All' && job.type !== selectedType) return false;
    if (selectedCategory !== 'All' && job.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="pt-28 pb-20 bg-[#0A0D14] min-h-screen relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D06F4]/20 border border-[#1D06F4]/40 mb-4 text-xs font-semibold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            Ethiopian Job Marketplace & Algorithmic Match Engine
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Syne'] mb-3">
            Find Your Next Role on Konyx
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Filter by skill, university campus, or region. Apply instantly with your verified Konyx profile.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#131A29]/95 border border-white/10 rounded-2xl p-4 sm:p-6 mb-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, skill (e.g. React, Peachtree), or company..."
                className="w-full bg-[#0B0E14] border border-white/15 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            {/* Location Select */}
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="All">All Locations in Ethiopia</option>
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Haramaya">Haramaya University Campus</option>
                <option value="Maya City">Maya City, Oromia</option>
                <option value="Hawassa">Hawassa</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Job Type Select */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="All">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10">
            <span className="text-xs text-slate-400 font-semibold mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {[
              'All',
              'Software & Technology',
              'Accounting & Finance',
              'UI/UX & Creative',
              'Marketing',
              'Business & Sales'
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1D06F4] text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter & List */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-semibold text-slate-300">
            Showing <strong className="text-white">{filteredJobs.length}</strong> Verified Vacancies
          </span>
          <Link
            to="/post-job"
            className="text-xs font-bold text-[#00E5FF] hover:underline flex items-center gap-1"
          >
            Are you an employer? Post a job vacancy &rarr;
          </Link>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  onClick={() => setSelectedJob(job)}
                  className="bg-[#131A29]/90 border border-white/10 hover:border-[#1D06F4]/60 p-5 sm:p-6 rounded-2xl transition-all cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {job.matchScore}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full">
                        {job.type}
                      </span>
                      {job.featured && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                          Featured
                        </span>
                      )}
                      <span className="text-xs text-slate-500">{job.postedDate}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#00E5FF] transition-colors mb-1">
                      {job.title}
                    </h3>

                    <p className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#00E5FF]" />
                      {job.company}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </span>
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2.5 py-0.5 rounded-md bg-[#0B0E14] text-slate-300 border border-white/5"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-0 border-white/10">
                    <span className="text-sm sm:text-base font-bold text-white font-['Syne']">
                      {job.salary}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job);
                      }}
                      className="text-xs font-bold text-[#00E5FF] hover:underline mt-1 flex items-center gap-1"
                    >
                      View Details & Apply <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 bg-[#131A29]/50 rounded-2xl border border-white/10">
                <p className="text-slate-400">No vacancies match your current filter. Try adjusting your search term!</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Job Details Modal */}
        <AnimatePresence>
          {selectedJob && !applyModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setSelectedJob(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#131A29] border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <button
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full">
                    {selectedJob.matchScore}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full">
                    {selectedJob.type}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">{selectedJob.title}</h2>
                <p className="text-sm font-semibold text-[#00E5FF] mb-4 flex items-center gap-2">
                  {selectedJob.company} • <span className="text-slate-300">{selectedJob.location}</span>
                </p>

                <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-white/10 mb-6 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Offered Salary / Rate:</span>
                  <span className="text-base font-bold text-white font-['Syne']">{selectedJob.salary}</span>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Role Description
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Requirements & Verified Skills
                  </h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setApplyModalOpen(true);
                      setApplySuccess(false);
                    }}
                    className="btn btn-primary flex-1 py-3.5 justify-center text-sm font-bold shadow-lg shadow-[#1D06F4]/40"
                  >
                    Apply Now with Konyx Profile
                  </button>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="btn btn-outline px-5 py-3.5 text-sm"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Quick Apply Modal */}
          {applyModalOpen && selectedJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
              onClick={() => setApplyModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#131A29] border border-[#1D06F4] rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl"
              >
                {!applySuccess ? (
                  <>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Apply to {selectedJob.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-6">
                      Your Konyx verified profile skills and achievement badge will be attached to this application.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setApplySuccess(true);
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Abebe Tesfaye"
                          className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Phone / SMS Number (for instant status alerts) *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+251 90 135 7102"
                          className="w-full bg-[#0B0E14] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Why are you the best fit for {selectedJob.company}? *
                        </label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Brief message highlighting your experience or Haramaya/University coursework..."
                          className="w-full bg-[#0B0E14] border border-white/15 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                        ></textarea>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="btn btn-primary flex-1 py-3 justify-center text-sm font-bold shadow-lg shadow-[#1D06F4]/40"
                        >
                          Send Application <Send className="w-4 h-4 ml-1" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setApplyModalOpen(false)}
                          className="btn btn-outline px-4 py-3 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-400/40">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Application Delivered!</h3>
                    <p className="text-sm text-slate-300 mb-6">
                      Your verified application and skill match score have been sent to <strong>{selectedJob.company}</strong>. You will receive real-time SMS updates as they review your profile.
                    </p>
                    <button
                      onClick={() => {
                        setApplySuccess(false);
                        setApplyModalOpen(false);
                        setSelectedJob(null);
                      }}
                      className="btn btn-primary w-full py-3 justify-center text-sm font-semibold"
                    >
                      Back to Jobs Feed
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
