import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LogOut, Trash2 } from 'lucide-react';

export default function Dashboard({ session }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (!window.confirm('Are you sure you want to delete this quote?')) return;
    
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0 }}>AURA<span style={{ color: 'var(--color-accent)' }}>ADMIN</span></h1>
        <button onClick={handleSignOut} className="btn btn-outline-dark" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </header>

      <main className="container" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Incoming Quotes</h2>
        
        {loading ? (
          <p>Loading quotes...</p>
        ) : quotes.length === 0 ? (
          <div style={{ backgroundColor: '#fff', padding: '3rem', textAlign: 'center', borderRadius: '8px', color: '#6b7280' }}>
            No quote requests yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {quotes.map(quote => (
              <div key={quote.id} style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'relative' }}>
                
                <button 
                  onClick={() => deleteQuote(quote.id)} 
                  style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  title="Delete Quote"
                >
                  <Trash2 size={20} />
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem' }}>{quote.name}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                      <a href={`mailto:${quote.email}`} style={{ color: 'var(--color-accent)' }}>{quote.email}</a> • <a href={`tel:${quote.phone}`} style={{ color: 'var(--color-accent)' }}>{quote.phone}</a>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', paddingRight: '2rem' }}>
                    <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {quote.event_type}
                    </span>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#4b5563' }}>
                      Date: <strong>{new Date(quote.event_date).toLocaleDateString()}</strong>
                    </p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '6px', fontSize: '0.875rem', color: '#374151' }}>
                  <p style={{ margin: '0 0 0.5rem 0' }}><strong>Location:</strong> {quote.location || 'Not specified'} | <strong>Guests:</strong> {quote.guests || 'Not specified'}</p>
                  <p style={{ margin: '0 0 0.5rem 0' }}><strong>Package:</strong> {quote.package || 'Undecided'} | <strong>Budget:</strong> {quote.budget || 'Undisclosed'}</p>
                  {quote.message && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                      <strong>Message:</strong><br/>
                      {quote.message}
                    </div>
                  )}
                </div>
                
                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                  Submitted: {new Date(quote.created_at).toLocaleString()} via {quote.contact_method}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
