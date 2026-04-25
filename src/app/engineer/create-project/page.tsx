'use client';

import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, FileText, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateProjectPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [form, setForm] = useState({ clientId: '', title: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(() => {})
      .catch(() => {});

    // Load clients
    fetch('/api/admin/clients')
      .then(res => res.json())
      .then(data => setClients(Array.isArray(data) ? data : []))
      .catch(() => setClients([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create project');

      setSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', paddingTop: '80px' }}>
          <div style={{ background: 'white', padding: '60px', borderRadius: '32px', maxWidth: '480px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '70px', height: '70px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle2 size={36} color="#16a34a" />
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Project Created!</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>The client has been notified by email with their project code.</p>

            <div style={{ background: '#eff6ff', padding: '30px', borderRadius: '20px', border: '1px solid #bfdbfe', marginBottom: '30px' }}>
              <p style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px' }}>PROJECT CODE</p>
              <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#003399', letterSpacing: '6px' }}>{success.projectCode}</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>{success.title}</p>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <Link href="/engineer" style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', textAlign: 'center', textDecoration: 'none', color: '#334155', fontWeight: 700, fontSize: '0.9rem' }}>
                ENGINEER PORTAL
              </Link>
              <button
                onClick={() => { setSuccess(null); setForm({ clientId: '', title: '', description: '' }); }}
                className="btn-primary"
                style={{ flex: 1, padding: '14px', justifyContent: 'center' }}
              >
                NEW PROJECT
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', paddingTop: '80px', padding: '120px 20px 80px' }}>
        <div style={{ width: '100%', maxWidth: '560px', background: 'white', padding: '50px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          
          <Link href="/engineer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '32px' }}>
            <ArrowLeft size={16} /> Back to Engineer Portal
          </Link>

          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Create New Project</h1>
          <p style={{ color: '#64748b', marginBottom: '40px', fontSize: '0.95rem' }}>Assign a project to a registered client. The system will generate a unique project code and notify the client by email.</p>

          {error && (
            <div style={{ padding: '15px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', marginBottom: '24px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '10px', letterSpacing: '0.5px' }}>SELECT CLIENT *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#94a3b8' }} />
                <select
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  style={{ paddingLeft: '45px', appearance: 'none' }}
                  required
                >
                  <option value="">-- Select a registered client --</option>
                  {clients.map((client: any) => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.email})
                    </option>
                  ))}
                </select>
              </div>
              {clients.length === 0 && (
                <p style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: '6px' }}>No registered clients found. Ask clients to sign up first.</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '10px', letterSpacing: '0.5px' }}>PROJECT TITLE *</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="e.g. Ikeja 5-Bedroom Duplex"
                  style={{ paddingLeft: '45px' }}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '10px', letterSpacing: '0.5px' }}>PROJECT DESCRIPTION</label>
              <div style={{ position: 'relative' }}>
                <FileText size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#94a3b8' }} />
                <textarea
                  placeholder="Brief description of the project scope and location..."
                  style={{ paddingLeft: '45px', minHeight: '100px', resize: 'vertical' }}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            <div style={{ background: '#f0f9ff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #bae6fd', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', background: '#0284c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Building2 size={18} color="white" />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#075985', margin: 0, lineHeight: 1.5 }}>
                The project code (e.g. <strong>ARC-7832</strong>) will be <strong>automatically generated</strong> by the system and emailed directly to the client.
              </p>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary" style={{ justifyContent: 'center', padding: '18px', fontSize: '1rem', marginTop: '8px' }}>
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'CREATE PROJECT & NOTIFY CLIENT'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
