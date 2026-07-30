import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  CreditCard, 
  HelpCircle,
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Job Seeker Free',
      target: 'For Students & Emerging Talent',
      price: '0',
      currency: 'ETB',
      period: 'Forever Free',
      description: 'Everything you need to build your Konyx profile, search Ethiopian job listings, and apply.',
      features: [
        'Unlimited job browsing & searching',
        'Standard skill profile creation',
        'Algorithmic job matching score',
        'Standard email job alerts',
        'Community forum access'
      ],
      popular: false,
      ctaText: 'Create Free Profile',
      link: '/register',
      badge: 'Free Tier'
    },
    {
      name: 'Job Seeker Verified Pro',
      target: 'For Ambitious Graduates & Pro Talent',
      price: billingCycle === 'monthly' ? '150' : '1,500',
      currency: 'ETB',
      period: billingCycle === 'monthly' ? '/ month' : '/ year (Save 17%)',
      description: 'Stand out from thousands of applicants with verified Konyx achievement badges.',
      features: [
        'Verified Gold Achievement Badge on profile',
        'Top 10% priority placement in employer searches',
        'Real-time SMS & Telegram instant job alerts',
        'Advanced application tracking & view analytics',
        'Direct chat unlock with verified employers',
        'Verified skill assessment certificates'
      ],
      popular: true,
      ctaText: 'Get Verified Badge',
      link: '/register',
      badge: 'Most Popular'
    },
    {
      name: 'Employer Starter Vacancy',
      target: 'For SMEs, Startups & Local Businesses',
      price: '450',
      currency: 'ETB',
      period: 'per job vacancy',
      description: 'A fast, cost-effective way to hire vetted Ethiopian talent without resume spam.',
      features: [
        'Standard 30-day job vacancy listing',
        'Algorithmic skill matching (Top 25 candidates)',
        'Built-in applicant pipeline dashboard',
        'Two-way rating & review tools',
        'Secure payment via Telebirr or CBE Birr',
        'Standard customer support'
      ],
      popular: false,
      ctaText: 'Post a Job Vacancy',
      link: '/post-job',
      badge: 'Pay-As-You-Hire'
    },
    {
      name: 'Employer Featured Enterprise',
      target: 'For Institutions & High-Volume Hiring',
      price: billingCycle === 'monthly' ? '1,450' : '14,500',
      currency: 'ETB',
      period: billingCycle === 'monthly' ? '/ month' : '/ year (Save 17%)',
      description: 'Unlimited hiring and complete access to Ethiopia’s top university graduate pools.',
      features: [
        'Unlimited job vacancy postings',
        'Featured Gold Badge on all listings',
        'Unlimited candidate filtering & screening',
        'Dedicated Haramaya & Campus talent outreach',
        'Dedicated recruitment account manager',
        'Custom API & HR dashboard integration'
      ],
      popular: false,
      ctaText: 'Partner with Konyx',
      link: '/post-job',
      badge: 'Enterprise'
    }
  ];

  const faqs = [
    {
      q: 'Which local payment methods does Konyx support?',
      a: 'Konyx integrates with Telebirr, CBE Birr, Chapa Payment Gateway, and BoaBirr. You can pay in Ethiopian Birr (ETB) instantly without credit cards or foreign currencies.'
    },
    {
      q: 'What is the Verified Achievement Badge?',
      a: 'Job seekers can take Konyx skill assessments or upload verified university credentials. Earning a Verified Badge pushes your profile to the top of employer searches and unlocks real-time SMS alerts.'
    },
    {
      q: 'How does the algorithmic skill matching work?',
      a: 'Our algorithm evaluates candidate skills, coursework, and badges against employer vacancy requirements, assigning a match score (e.g. 98% Match) so neither side wastes time on unqualified applications.'
    },
    {
      q: 'Can employers hire from Haramaya University and across Ethiopia?',
      a: 'Yes! Konyx originated at Haramaya University Campus and serves students, graduates, and professionals digitally across Addis Ababa, Maya City, Hawassa, Adama, and all Ethiopian regions.'
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-[#0A0D14] min-h-screen relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D06F4]/20 border border-[#1D06F4]/40 mb-4 text-xs font-semibold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            Transparent Platform Monetization
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Syne'] mb-3">
            Affordable Plans for Ethiopia’s Economy
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Pay easily with Telebirr, CBE Birr, or Chapa. No hidden fees or foreign exchange barriers.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-8 rounded-full bg-[#131A29] border border-white/20 p-1 flex items-center transition-all"
          >
            <div
              className={`w-6 h-6 rounded-full bg-gradient-to-r from-[#1D06F4] to-[#00E5FF] shadow-md transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </button>
          <span className={`text-sm font-semibold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
            Annual Billing 
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30">
              Save 17%
            </span>
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`glass-card flex flex-col justify-between relative ${
                plan.popular 
                  ? 'bg-gradient-to-b from-[#131A29] via-[#161F34] to-[#131A29] border-2 border-[#1D06F4] shadow-2xl shadow-[#1D06F4]/20' 
                  : 'bg-[#131A29]/80 border border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#1D06F4] to-[#00E5FF] text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 uppercase">
                    {plan.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-5">{plan.target}</p>

                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white font-['Syne']">
                    {plan.price}
                  </span>
                  <span className="text-sm font-bold text-[#00E5FF]">{plan.currency}</span>
                  <span className="text-xs text-slate-400 ml-1">{plan.period}</span>
                </div>

                <p className="text-xs text-slate-300 mb-6 leading-relaxed border-b border-white/10 pb-5">
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={plan.link}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm text-center transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'btn btn-primary shadow-lg shadow-[#1D06F4]/40'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/15'
                }`}
              >
                {plan.ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Syne'] mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400">Everything you need to know about Konyx badges, payments, and skill matching.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((f, i) => (
              <div key={i} className="bg-[#131A29]/80 border border-white/10 p-6 rounded-2xl">
                <h3 className="text-base font-bold text-white mb-2 flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5" />
                  {f.q}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed pl-7">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
