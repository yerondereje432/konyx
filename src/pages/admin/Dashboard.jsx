import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LogOut, LayoutDashboard, Mail, Phone, Calendar, MapPin, DollarSign, Package, Sparkles, Inbox, TrendingUp, User, Image as ImageIcon, Archive, UploadCloud, Trash2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard({ session }) {
  const [activeTab, setActiveTab] = useState('quotes'); // 'quotes' or 'portfolio'
  
  // Quotes State
  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [filter, setFilter] = useState('All');
  const [showArchived, setShowArchived] = useState(false);

  // Gallery State
  const [gallery, setGallery] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState({ title: '', category: 'Wedding', file: null });

  useEffect(() => {
    fetchQuotes();
    fetchGallery();
  }, []);

  // --- QUOTES (CRM) LOGIC ---
  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error.message);
    } finally {
      setLoadingQuotes(false);
    }
  };

  const updateQuoteStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('quotes').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q));
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  const toggleArchive = async (id, currentArchived) => {
    try {
      const { error } = await supabase.from('quotes').update({ archived: !currentArchived }).eq('id', id);
      if (error) throw error;
      setQuotes(quotes.map(q => q.id === id ? { ...q, archived: !currentArchived } : q));
    } catch (error) {
      console.error('Error archiving:', error.message);
    }
  };

  // --- GALLERY (CMS) LOGIC ---
  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setGallery(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error.message);
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleUploadGallery = async (e) => {
    e.preventDefault();
    if (!newImage.file || !newImage.title) return alert('Please provide a title and image.');
    setUploading(true);

    try {
      // 1. Upload image to Supabase Storage Bucket 'portfolio'
      const fileExt = newImage.file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, newImage.file);
      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);

      // 3. Save to database
      const { data: dbData, error: dbError } = await supabase.from('gallery').insert([
        { title: newImage.title, category: newImage.category, img: publicUrl }
      ]).select();
      
      if (dbError) throw dbError;

      setGallery([dbData[0], ...gallery]);
      setNewImage({ title: '', category: 'Wedding', file: null });
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error('Error uploading:', error.message);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteGalleryItem = async (id) => {
    if (!window.confirm("Delete this image from your portfolio?")) return;
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      setGallery(gallery.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error deleting:', error.message);
    }
  };

  // --- CALCULATIONS ---
  const activeQuotes = quotes.filter(q => showArchived ? q.archived : !q.archived);
  const filteredQuotes = filter === 'All' ? activeQuotes : activeQuotes.filter(q => q.event_type?.toLowerCase().includes(filter.toLowerCase()));
  
  // Pipeline Revenue Forecasting (Extracts numbers from budget strings safely)
  const pipelineValue = quotes.filter(q => !q.archived).reduce((acc, q) => {
    if (q.budget?.includes('300,000')) return acc + 300000;
    if (q.budget?.includes('150,000')) return acc + 150000;
    if (q.budget?.includes('50,000')) return acc + 50000;
    return acc;
  }, 0);

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#E5E7EB', fontFamily: 'var(--font-body)' }}>
      
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ width: '280px', backgroundColor: '#111111', borderRight: '1px solid #1F1F1F', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 10 }}>
        <div className="sidebar-header" style={{ padding: '2.5rem 2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0, color: '#FFF', letterSpacing: '2px' }}>
            AURA<span style={{ color: 'var(--color-accent)' }}>ADMIN</span>
          </h1>
          <p className="sidebar-subtitle" style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem', margin: 0 }}>VIP Dashboard</p>
        </div>

        <nav className="sidebar-nav" style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('quotes')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: activeTab === 'quotes' ? '#1A1A1A' : 'transparent', color: activeTab === 'quotes' ? 'var(--color-accent)' : '#888', border: activeTab === 'quotes' ? '1px solid #2A2A2A' : '1px solid transparent', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, transition: 'all 0.3s' }}
          >
            <LayoutDashboard size={18} /> CRM Leads
          </button>
          
          <button 
            onClick={() => setActiveTab('portfolio')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: activeTab === 'portfolio' ? '#1A1A1A' : 'transparent', color: activeTab === 'portfolio' ? 'var(--color-accent)' : '#888', border: activeTab === 'portfolio' ? '1px solid #2A2A2A' : '1px solid transparent', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, transition: 'all 0.3s' }}
          >
            <ImageIcon size={18} /> Portfolio CMS
          </button>
        </nav>

        <div className="sidebar-footer" style={{ padding: '2rem' }}>
          <button onClick={() => supabase.auth.signOut()} className="logout-btn" style={{ width: '100%', padding: '0.75rem', backgroundColor: 'transparent', border: '1px solid #333', color: '#888', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#555'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333'; }}>
            <LogOut size={16} /> <span className="logout-text">Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main" style={{ marginLeft: '280px', flex: 1, padding: '3rem 4rem', position: 'relative', width: '100%' }}>
        
        {/* ===================== QUOTES CRM TAB ===================== */}
        {activeTab === 'quotes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: '#FFF', margin: '0 0 0.5rem 0' }}>Pipeline Overview</h2>
                <p style={{ color: '#888', margin: 0 }}>Review, update statuses, and manage your incoming styling requests.</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button 
                  onClick={() => setShowArchived(!showArchived)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #333', backgroundColor: showArchived ? '#1A1A1A' : 'transparent', color: showArchived ? 'var(--color-accent)' : '#888', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  <Archive size={16} /> {showArchived ? 'View Active Leads' : 'View Archived'}
                </button>
              </div>
            </header>

            {!showArchived && (
              <div className="admin-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                {[
                  { title: 'Active Inquiries', value: quotes.filter(q=>!q.archived).length, icon: <Inbox size={24} color="var(--color-accent)" />, spark: 'To be processed' },
                  { title: 'Est. Pipeline Revenue', value: `${(pipelineValue / 1000)}k+`, icon: <DollarSign size={24} color="#10B981" />, spark: 'Total projected value (ETB)' },
                  { title: 'Booked Events', value: quotes.filter(q=>q.status==='Booked').length, icon: <CheckCircle size={24} color="#3B82F6" />, spark: 'Successfully closed' }
                ].map((stat, idx) => (
                  <div key={idx} style={{ backgroundColor: '#111', border: '1px solid #1F1F1F', borderRadius: '12px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '0.9rem', color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>{stat.title}</h3>
                      <div style={{ backgroundColor: '#1A1A1A', padding: '0.5rem', borderRadius: '8px' }}>{stat.icon}</div>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: '#FFF', lineHeight: 1, marginBottom: '0.5rem' }}>{stat.value}</div>
                    <p style={{ fontSize: '0.8rem', color: '#555', margin: 0 }}>{stat.spark}</p>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, var(--color-accent) 0%, transparent 100%)', opacity: 0.5 }} />
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <AnimatePresence>
                {filteredQuotes.map(quote => (
                  <motion.div 
                    key={quote.id} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="quote-row"
                    style={{ backgroundColor: '#111', border: '1px solid #1F1F1F', borderRadius: '12px', padding: '2rem', display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr auto', gap: '2rem', alignItems: 'center', position: 'relative' }}
                  >
                    
                    <div className="quote-col">
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{ backgroundColor: 'rgba(197, 168, 128, 0.1)', color: 'var(--color-accent)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{quote.event_type}</span>
                        {quote.status === 'Booked' && <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Booked 🎉</span>}
                      </div>
                      <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-heading)' }}>{quote.name}</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <a href={`mailto:${quote.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem', textDecoration: 'none' }}><Mail size={14} /> {quote.email}</a>
                        <a href={`tel:${quote.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem', textDecoration: 'none' }}><Phone size={14} /> {quote.phone}</a>
                      </div>
                    </div>

                    <div className="quote-col quote-border" style={{ borderLeft: '1px solid #222', paddingLeft: '2rem' }}>
                      <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Event Details</p>
                      <p style={{ margin: '0 0 0.25rem', color: '#E5E7EB', fontSize: '0.9rem' }}><strong>Date:</strong> {quote.event_date ? new Date(quote.event_date).toLocaleDateString() : 'TBD'}</p>
                      <p style={{ margin: '0 0 0.25rem', color: '#E5E7EB', fontSize: '0.9rem' }}><strong>Venue:</strong> {quote.location || 'TBD'}</p>
                      <p style={{ margin: 0, color: '#E5E7EB', fontSize: '0.9rem' }}><strong>Guests:</strong> {quote.guests || 'N/A'}</p>
                    </div>

                    <div className="quote-col quote-border" style={{ borderLeft: '1px solid #222', paddingLeft: '2rem' }}>
                      <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Lead Value</p>
                      <p style={{ margin: '0 0 0.25rem', color: 'var(--color-accent)', fontWeight: 600 }}>{quote.package || 'Undecided'}</p>
                      <p style={{ margin: 0, color: '#10B981', fontWeight: 500 }}>{quote.budget || 'Undisclosed'}</p>
                    </div>

                    <div className="quote-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                      
                      {/* STATUS DROPDOWN */}
                      <select 
                        value={quote.status || 'New'} 
                        onChange={(e) => updateQuoteStatus(quote.id, e.target.value)}
                        style={{ backgroundColor: '#1A1A1A', color: '#FFF', border: '1px solid #333', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="New">Status: New</option>
                        <option value="Contacted">Status: Contacted</option>
                        <option value="Proposal Sent">Status: Proposal Sent</option>
                        <option value="Booked">Status: Booked</option>
                        <option value="Lost">Status: Lost</option>
                      </select>

                      <button 
                        onClick={() => toggleArchive(quote.id, quote.archived)}
                        style={{ backgroundColor: 'transparent', color: '#888', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', transition: 'color 0.3s' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#FFF'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#888'}
                      >
                        <Archive size={16} /> {quote.archived ? 'Unarchive' : 'Archive'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ===================== PORTFOLIO CMS TAB ===================== */}
        {activeTab === 'portfolio' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header className="admin-header" style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: '#FFF', margin: '0 0 0.5rem 0' }}>Portfolio CMS</h2>
              <p style={{ color: '#888', margin: 0 }}>Upload new images here. They will instantly appear on the public Gallery page.</p>
            </header>

            {/* UPLOAD FORM */}
            <form className="cms-form" onSubmit={handleUploadGallery} style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '12px', border: '1px dashed #333', display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Project Title</label>
                <input type="text" value={newImage.title} onChange={e=>setNewImage({...newImage, title: e.target.value})} required style={{ width: '100%', padding: '0.8rem', backgroundColor: '#0A0A0A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }} placeholder="e.g. The Grand Botanica" />
              </div>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Category</label>
                <select value={newImage.category} onChange={e=>setNewImage({...newImage, category: e.target.value})} style={{ width: '100%', padding: '0.8rem', backgroundColor: '#0A0A0A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }}>
                  <option>Wedding</option>
                  <option>Corporate</option>
                  <option>Birthday</option>
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Image File</label>
                <input type="file" accept="image/*" onChange={e=>setNewImage({...newImage, file: e.target.files[0]})} required style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0A0A0A', border: '1px solid #333', color: '#FFF', borderRadius: '6px' }} />
              </div>
              <button type="submit" disabled={uploading} style={{ padding: '0.8rem 2rem', backgroundColor: 'var(--color-accent)', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: uploading ? 0.7 : 1 }}>
                <UploadCloud size={18} /> {uploading ? 'Uploading...' : 'Publish'}
              </button>
            </form>

            {/* LIVE GALLERY GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {gallery.map(img => (
                <div key={img.id} style={{ backgroundColor: '#111', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222', position: 'relative', group: 'true' }}>
                  <img src={img.img} alt={img.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <div style={{ padding: '1rem' }}>
                    <p style={{ color: 'var(--color-accent)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{img.category}</p>
                    <p style={{ color: '#FFF', margin: 0, fontWeight: 500, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.title}</p>
                  </div>
                  <button 
                    onClick={() => deleteGalleryItem(img.id)}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: 'rgba(0,0,0,0.7)', color: '#EF4444', border: 'none', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {gallery.length === 0 && !loadingGallery && <p style={{ color: '#666' }}>No images in the portfolio yet. Upload one above!</p>}
            </div>
          </motion.div>
        )}

      </main>
      
      <style>{`
        @media (max-width: 1024px) {
          .admin-sidebar { width: 240px !important; }
          .admin-main { margin-left: 240px !important; padding: 2rem !important; }
          .admin-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .admin-layout { flex-direction: column !important; }
          
          /* Mobile Sidebar */
          .admin-sidebar { 
            width: 100% !important; 
            height: auto !important; 
            position: relative !important; 
            flex-direction: column !important; 
            padding: 0 !important; 
            border-right: none !important; 
            border-bottom: 1px solid #1F1F1F !important; 
          }
          
          .sidebar-header { 
            padding: 1.5rem !important; 
            display: flex !important; 
            justify-content: space-between !important; 
            align-items: center !important; 
          }
          .sidebar-subtitle { display: none !important; }
          
          .sidebar-nav { 
            display: flex !important; 
            flex-direction: row !important; 
            padding: 0 1.5rem 1.5rem 1.5rem !important; 
            gap: 1rem !important; 
          }
          .sidebar-nav button { 
            padding: 0.75rem !important; 
            font-size: 0.85rem !important; 
            justify-content: center !important; 
          }
          .sidebar-footer { display: none !important; }
          
          /* Mobile Main Content */
          .admin-main { 
            margin-left: 0 !important; 
            padding: 1.5rem !important; 
            width: 100% !important; 
            box-sizing: border-box !important; 
          }
          
          .admin-header { 
            flex-direction: column !important; 
            align-items: flex-start !important; 
            gap: 1rem !important; 
            margin-bottom: 2rem !important; 
          }
          
          .admin-stats { 
            grid-template-columns: 1fr !important; 
            gap: 1rem !important; 
            margin-bottom: 2rem !important; 
          }
          
          /* Mobile Quote Rows */
          .quote-row { 
            grid-template-columns: 1fr !important; 
            gap: 1rem !important; 
            padding: 1.5rem !important; 
          }
          .quote-border { 
            border-left: none !important; 
            padding-left: 0 !important; 
            border-top: 1px solid #1F1F1F !important; 
            padding-top: 1rem !important; 
          }
          .quote-actions { 
            flex-direction: row !important; 
            justify-content: space-between !important; 
            border-top: 1px solid #1F1F1F !important; 
            padding-top: 1rem !important; 
            align-items: center !important;
          }
          
          /* Mobile Portfolio CMS */
          .cms-form {
            flex-direction: column !important;
            align-items: stretch !important;
          }
        }
      `}</style>
    </div>
  );
}
