import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

export default function Login({ setSession }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSession(data.session);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0A', backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%)' }}>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ width: '100%', maxWidth: '420px', position: 'relative' }}
      >
        {/* Glow effect behind card */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', right: '-10%', bottom: '-10%', background: 'radial-gradient(circle at center, rgba(197, 168, 128, 0.15) 0%, transparent 70%)', zIndex: -1, filter: 'blur(40px)' }} />

        <div style={{ backgroundColor: '#111111', padding: '3.5rem 3rem', borderRadius: '16px', border: '1px solid #222', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#FFF', letterSpacing: '2px' }}>
              AURA<span style={{ color: 'var(--color-accent)' }}>ADMIN</span>
            </h1>
            <p style={{ color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Authorized Personnel Only</p>
          </div>
          
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ width: '100%', padding: '1rem', backgroundColor: '#0A0A0A', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1rem', transition: 'border-color 0.3s', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Security Key</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '1rem', backgroundColor: '#0A0A0A', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1rem', transition: 'border-color 0.3s', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '1.25rem', backgroundColor: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s', opacity: loading ? 0.7 : 1 }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 10px 20px -10px var(--color-accent)')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>

        </div>
      </motion.div>
      
    </div>
  );
}
