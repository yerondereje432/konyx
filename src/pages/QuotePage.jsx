import { motion } from 'framer-motion';
import QuoteForm from '../components/QuoteForm';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function QuotePage() {
  return (
    <div className="pt-28 pb-20 bg-[#0A0D14] min-h-screen relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#1D06F4]/20 to-[#00E5FF]/20 border border-[#1D06F4]/40 mb-4">
            <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            <span className="text-xs font-semibold text-slate-200">
              Konyx Onboarding Portal
            </span>
          </div>
          <h1 className="heading-primary mb-4">
            Get Started with Konyx
          </h1>
          <p className="text-base sm:text-lg text-slate-300">
            Whether you're an employer in Addis Ababa seeking verified engineering talent, a Haramaya University graduate ready for your first career step, or a prospective partner, complete the inquiry below.
          </p>
        </motion.div>

        <QuoteForm />
      </div>
    </div>
  );
}
