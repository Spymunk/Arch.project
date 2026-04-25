'use client';

import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Mail, Loader2, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      router.push('/login?verified=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Resend failed');
      
      setSuccess('A new code has been sent to your inbox!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--secondary)'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '450px', 
          backgroundColor: 'white', 
          padding: '50px', 
          borderRadius: '24px', 
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
          border: '1px solid #eee'
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'var(--secondary)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: 'var(--primary)'
          }}>
            <ShieldCheck size={30} />
          </div>
          
          <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Verify Your Email</h1>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '30px' }}>
            We've sent a 6-digit code to <strong style={{ color: 'var(--primary)' }}>{email}</strong>. 
            Check your inbox for the code.
          </p>

          {error && (
            <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{ padding: '12px', background: '#f0fdf4', color: '#15803d', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="000000" 
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={{ 
                  textAlign: 'center', 
                  fontSize: '2rem', 
                  letterSpacing: '10px',
                  fontWeight: 800,
                  color: 'var(--primary)'
                }} 
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary" 
              style={{ justifyContent: 'center', height: '55px' }}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'VERIFY & LOG IN'}
            </button>
          </form>
          
          <p style={{ marginTop: '30px', fontSize: '0.85rem', color: '#999' }}>
            Didn't receive the code? 
            <button 
              onClick={handleResend}
              disabled={isResending}
              style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', marginLeft: '5px' }}
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
