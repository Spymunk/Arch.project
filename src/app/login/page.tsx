'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('client@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'Email not verified') {
           router.push(`/verify-email?email=${encodeURIComponent(email)}`);
           return;
        }
        throw new Error(result.error);
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
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
        backgroundColor: 'var(--secondary)',
        paddingTop: '80px'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '450px', 
          backgroundColor: 'white', 
          padding: '50px', 
          borderRadius: '20px', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
          border: '1px solid #eee',
          textAlign: 'center'
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'var(--secondary)', 
            borderRadius: '15px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: 'var(--primary)'
          }}>
            <LogIn size={30} />
          </div>
          
          <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Welcome Back</h1>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '40px' }}>Sign in to continue to your project dashboard.</p>
          
          {error && (
            <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', textAlign: 'left' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#999' }} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '45px' }} 
                required
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#999' }} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '45px' }} 
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px' }} /> Remember me
              </label>
              <Link href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Forgot password?</Link>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary" 
              style={{ justifyContent: 'center', marginTop: '10px', width: '100%' }}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'SIGN IN'}
            </button>
          </form>
          
          <p style={{ marginTop: '30px', fontSize: '0.9rem', color: '#666' }}>
            Don't have an account? <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create Account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
