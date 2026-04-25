'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--secondary)',
        padding: '120px 20px 80px'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '500px', 
          backgroundColor: 'white', 
          padding: '50px', 
          borderRadius: '24px', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
          border: '1px solid #eee'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Create Your Account</h1>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>The system will automatically assign your architectural project code.</p>
          </div>
          
          {error && (
            <div style={{ padding: '15px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', marginBottom: '30px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#999' }} />
              <input 
                type="text" 
                placeholder="Full Name" 
                style={{ paddingLeft: '45px' }} 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required 
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#999' }} />
              <input 
                type="email" 
                placeholder="Email Address" 
                style={{ paddingLeft: '45px' }} 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required 
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#999' }} />
              <input 
                type="password" 
                placeholder="Choose Password" 
                style={{ paddingLeft: '45px' }} 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required 
              />
            </div>
            
            <button type="submit" disabled={isLoading} className="btn-primary" style={{ justifyContent: 'center', marginTop: '10px', padding: '15px' }}>
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'CREATE ACCOUNT'}
            </button>
          </form>
          
          <p style={{ marginTop: '30px', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
