import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundImage: 'url("/gallery-1.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      padding: '2rem'
    }}>
      
      {/* Dark Overlay with subtle blur so the image remains recognizable */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ 
          width: '100%', 
          maxWidth: '900px', 
          display: 'flex',
          flexDirection: 'row',
          borderRadius: '24px', 
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
          position: 'relative',
          zIndex: 1
        }}
        className="login-container"
      >
        {/* Left Panel - Branding (Solid Dark) */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#0A0A0A', 
          padding: '4rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          position: 'relative'
        }} className="login-left">
          
          {/* Aesthetic background curves */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0, opacity: 0.5 }}>
            <div style={{ position: 'absolute', width: '200%', height: '100%', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%', top: '50%', left: '-50%' }} />
            <div style={{ position: 'absolute', width: '150%', height: '100%', border: '1px solid rgba(255,255,255,0.02)', borderRadius: '50%', top: '60%', left: '-25%' }} />
          </div>

          <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(197, 168, 128, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '2rem',
              border: '1px solid rgba(197, 168, 128, 0.2)'
            }}>
              <Lock size={32} color="var(--color-accent)" />
            </div>
            
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: '0 0 1rem 0', color: '#FFF', letterSpacing: '1px' }}>
              AURA<span style={{ color: 'var(--color-accent)' }}>ADMIN</span>
            </h1>
            
            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '260px', margin: '0 auto' }}>
              Authorized personnel only. Access your premium event styling dashboard.
            </p>
            
            <div style={{ marginTop: '3rem', padding: '0.5rem 1.5rem', border: '1px solid rgba(197, 168, 128, 0.3)', borderRadius: '20px', fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ✦ Secure Connection
            </div>
          </div>
        </div>

        {/* Right Panel - Form (Glassmorphism) */}
        <div style={{ 
          flex: 1, 
          backgroundColor: 'rgba(17, 17, 17, 0.5)', 
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: '4rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }} className="login-right">
          
          <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Welcome Back</h2>
          <p style={{ color: '#aaa', fontSize: '0.95rem', marginBottom: '2.5rem' }}>Please enter your credentials to continue.</p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <input 
                type="email" 
                placeholder="Email Address"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ width: '100%', padding: '1.2rem 1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', transition: 'all 0.3s', outline: 'none' }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.backgroundColor = 'rgba(0,0,0,0.6)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.backgroundColor = 'rgba(0,0,0,0.4)'; }}
              />
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <input 
                type="password" 
                placeholder="Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '1.2rem 1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', transition: 'all 0.3s', outline: 'none' }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.backgroundColor = 'rgba(0,0,0,0.6)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.backgroundColor = 'rgba(0,0,0,0.4)'; }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '1.25rem', backgroundColor: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s', opacity: loading ? 0.7 : 1 }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 10px 20px -10px var(--color-accent)')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

        </div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column !important;
          }
          .login-left {
            padding: 3rem 2rem !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
          .login-right {
            padding: 3rem 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
