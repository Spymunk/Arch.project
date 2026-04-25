'use client';

import Link from 'next/link';
import { Menu, X, ChevronRight, User } from 'lucide-react';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      padding: '15px 60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      borderBottom: '1px solid var(--border)'
    }}>
      <Link href="/" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--foreground)', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <div style={{ width: '12px', height: '12px', background: 'var(--primary)', marginRight: '8px' }}></div>
        ARCH<span style={{ color: 'var(--primary)' }}>PROJECT</span>
      </Link>

      {/* Desktop Menu */}
      <div className="desktop-menu" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#333', textDecoration: 'none' }}>Home</Link>
        <Link href="/portfolio" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#333', textDecoration: 'none' }}>Portfolio</Link>
        <Link href="/services" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#333', textDecoration: 'none' }}>Services</Link>
        
        <div style={{ width: '1px', height: '24px', background: '#ddd', margin: '0 10px' }}></div>
        
        {session ? (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/dashboard" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} /> DASHBOARD
            </Link>
            <button 
              onClick={() => signOut()} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: '#ef4444' }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <Link href="/login" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>Log In</Link>
            <Link href="/signup" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem', textDecoration: 'none' }}>
              Get Started <ChevronRight size={16} />
            </Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="mobile-toggle" style={{ display: 'none' }} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </div>

    </nav>
  );
}
