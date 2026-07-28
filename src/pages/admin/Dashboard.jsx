import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LogOut, Trash2, LayoutDashboard, Mail, Phone, Calendar, MapPin, DollarSign, Package, Sparkles, Inbox, TrendingUp, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard({ session }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuote = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this inquiry?')) return;
    
    try {
      const { error } = await supabase.from('quotes').delete().eq('id', id);
      if (error) throw error;
      setQuotes(quotes.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error deleting quote:', error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Stats calculation
  const totalQuotes = quotes.length;
  const thisWeek = quotes.filter(q => new Date(q.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
  const highValue = quotes.filter(q => q.budget?.includes('300,000+') || q.budget?.includes('150,000')).length;

  const filteredQuotes = filter === 'All' ? quotes : quotes.filter(q => q.event_type?.toLowerCase().includes(filter.toLowerCase()));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#E5E7EB', fontFamily: 'var(--font-body)' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '280px', backgroundColor: '#111111', borderRight: '1px solid #1F1F1F', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 10 }}>
        <div style={{ padding: '2.5rem 2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0, color: '#FFF', letterSpacing: '2px' }}>
            AURA<span style={{ color: 'var(--color-accent)' }}>ADMIN</span>
          </h1>
          <p style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>VIP Dashboard</p>
        </div>

        <nav style={{ flex: 1, padding: '0 1rem' }}>
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#1A1A1A', color: 'var(--color-accent)', border: '1px solid #2A2A2A', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600 }}>
            <LayoutDashboard size={18} /> Inquiries
          </button>
          {/* Future Sidebar Items can go here */}
        </nav>

        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#1A1A1A', borderRadius: '8px' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <User size={18} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Admin</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{session?.user?.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'transparent', border: '1px solid #333', color: '#888', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#555'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333'; }}>
            <LogOut size={16} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '280px', flex: 1, padding: '3rem 4rem', position: 'relative' }}>
        
        {/* Header Area */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: '#FFF', margin: '0 0 0.5rem 0' }}>Overview</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ color: '#888', margin: 0 }}>Review and manage your incoming event styling requests.</motion.p>
          </div>
          
          {/* Quick Filters */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#111', padding: '0.5rem', borderRadius: '8px', border: '1px solid #222' }}>
            {['All', 'Wedding', 'Corporate', 'Birthday'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: filter === f ? 'var(--color-accent)' : 'transparent', color: filter === f ? '#fff' : '#888', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.3s' }}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </header>

        {/* Stats Row */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { title: 'Total Inquiries', value: totalQuotes, icon: <Inbox size={24} color="var(--color-accent)" />, spark: '+12% this month' },
            { title: 'New This Week', value: thisWeek, icon: <TrendingUp size={24} color="#10B981" />, spark: 'Hot streak' },
            { title: 'High-Value Leads', value: highValue, icon: <Sparkles size={24} color="#F59E0B" />, spark: '150k+ ETB budget' }
          ].map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} style={{ backgroundColor: '#111', border: '1px solid #1F1F1F', borderRadius: '12px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.title}</h3>
                <div style={{ backgroundColor: '#1A1A1A', padding: '0.5rem', borderRadius: '8px' }}>{stat.icon}</div>
              </div>
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: '#FFF', lineHeight: 1, marginBottom: '0.5rem' }}>{stat.value}</div>
              <p style={{ fontSize: '0.8rem', color: '#555', margin: 0 }}>{stat.spark}</p>
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, var(--color-accent) 0%, transparent 100%)', opacity: 0.5 }} />
            </motion.div>
          ))}
        </motion.div>

        {/* Quotes List */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#FFF', fontFamily: 'var(--font-heading)' }}>Recent Requests</h3>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Showing {filteredQuotes.length} results</span>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>Loading elite requests...</div>
        ) : filteredQuotes.length === 0 ? (
          <div style={{ backgroundColor: '#111', border: '1px dashed #222', padding: '4rem', textAlign: 'center', borderRadius: '12px', color: '#666' }}>
            <Inbox size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
            <p>No inquiries found for this category.</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <AnimatePresence>
              {filteredQuotes.map(quote => (
                <motion.div 
                  key={quote.id} 
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  style={{ backgroundColor: '#111', border: '1px solid #1F1F1F', borderRadius: '12px', padding: '2rem', display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr auto', gap: '2rem', alignItems: 'center', transition: 'border-color 0.3s', position: 'relative' }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#333'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#1F1F1F'}
                >
                  
                  {/* Column 1: Client Info */}
                  <div>
                    <div style={{ display: 'inline-block', backgroundColor: 'rgba(197, 168, 128, 0.1)', color: 'var(--color-accent)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
                      {quote.event_type}
                    </div>
                    <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-heading)' }}>{quote.name}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <a href={`mailto:${quote.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem', textDecoration: 'none' }}><Mail size={14} /> {quote.email}</a>
                      <a href={`tel:${quote.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem', textDecoration: 'none' }}><Phone size={14} /> {quote.phone}</a>
                    </div>
                  </div>

                  {/* Column 2: Event Details */}
                  <div style={{ borderLeft: '1px solid #222', paddingLeft: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                      <Calendar size={18} color="#666" style={{ marginTop: '2px' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Event Date</p>
                        <p style={{ margin: 0, color: '#E5E7EB', fontWeight: 500 }}>{quote.event_date ? new Date(quote.event_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <MapPin size={18} color="#666" style={{ marginTop: '2px' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Location & Guests</p>
                        <p style={{ margin: 0, color: '#E5E7EB', fontWeight: 500 }}>{quote.location || 'TBD'} • {quote.guests ? `${quote.guests} ppl` : 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Package & Budget */}
                  <div style={{ borderLeft: '1px solid #222', paddingLeft: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                      <Package size={18} color="#666" style={{ marginTop: '2px' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Selected Package</p>
                        <p style={{ margin: 0, color: 'var(--color-accent)', fontWeight: 600 }}>{quote.package || 'Undecided'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <DollarSign size={18} color="#666" style={{ marginTop: '2px' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Est. Budget</p>
                        <p style={{ margin: 0, color: '#10B981', fontWeight: 500 }}>{quote.budget || 'Undisclosed'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Column 4: Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#555' }}>{new Date(quote.created_at).toLocaleDateString()}</span>
                    <button 
                      onClick={() => deleteQuote(quote.id)}
                      style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                      title="Discard Inquiry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Optional Message Dropdown Area */}
                  {quote.message && (
                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px dashed #222' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#888', lineHeight: 1.6 }}>
                        <strong style={{ color: '#ccc' }}>Client's Vision:</strong> "{quote.message}"
                      </p>
                    </div>
                  )}
                  
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
