'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Building2, Play, MessageSquare, Loader2, HardHat, Clock, CheckCircle2, ChevronRight, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/projects')
        .then(res => res.json())
        .then(data => {
          const list = Array.isArray(data) ? data : [];
          setProjects(list);
          if (list.length > 0) setSelectedProject(list[0]);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [status]);

  useEffect(() => {
    if (selectedProject) {
      const latestUpdate = selectedProject?.updates?.[0];
      setFeedbackText(latestUpdate?.clientFeedback || '');
      setFeedbackSaved(false);
    }
  }, [selectedProject]);

  if (status === 'loading' || isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <Loader2 className="animate-spin" size={32} color="var(--primary)" />
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (projects.length === 0) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', padding: '20px' }}>
          <div style={{ width: '90px', height: '90px', background: 'linear-gradient(135deg,#003399,#335cad)', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px', boxShadow: '0 12px 24px rgba(0,51,153,0.2)' }}>
            <Building2 size={44} color="white" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '14px', color: '#0f172a' }}>Welcome, {session?.user?.name?.split(' ')[0]}!</h2>
          <p style={{ color: '#64748b', maxWidth: '440px', lineHeight: 1.8, fontSize: '1rem' }}>
            Your account is active and verified. An engineer will review your registration and assign your personalised project shortly.
          </p>
          <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', maxWidth: '520px' }}>
            {[
              { icon: CheckCircle2, label: 'Account Verified', color: '#16a34a', bg: '#f0fdf4' },
              { icon: Clock, label: 'Project Pending', color: '#d97706', bg: '#fffbeb' },
              { icon: HardHat, label: 'Engineer Notified', color: '#003399', bg: '#eff6ff' },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, padding: '20px 16px', borderRadius: '16px', textAlign: 'center' }}>
                <item.icon size={24} color={item.color} style={{ marginBottom: '10px' }} />
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: item.color, margin: 0 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const latestUpdate = selectedProject?.updates?.[0];

  const statusColors: Record<string, string> = {
    PLANNING: '#f59e0b',
    IN_PROGRESS: '#3b82f6',
    COMPLETED: '#16a34a',
    ON_HOLD: '#ef4444',
  };

  const saveFeedback = async () => {
    if (!latestUpdate || !feedbackText.trim()) return;
    setFeedbackSaving(true);
    await fetch(`/api/projects/updates/${latestUpdate.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientFeedback: feedbackText }),
    });
    setFeedbackSaving(false);
    setFeedbackSaved(true);
    setTimeout(() => setFeedbackSaved(false), 3000);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', paddingTop: '72px', minHeight: '100vh' }}>

        {/* ── Sidebar ── */}
        <aside style={{ backgroundColor: 'white', borderRight: '1px solid #e5e7eb', padding: '28px 0', overflowY: 'auto', position: 'sticky', top: '72px', height: 'calc(100vh - 72px)' }}>
          <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1.5px', marginBottom: '6px' }}>MY PROJECTS</p>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{projects.length} project{projects.length !== 1 ? 's' : ''} assigned</p>
          </div>

          <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p)}
                style={{
                  width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: '14px',
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
                  background: selectedProject?.id === p.id ? 'linear-gradient(135deg,#003399,#335cad)' : 'transparent',
                  color: selectedProject?.id === p.id ? 'white' : '#334155',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', margin: '0 0 4px' }}>{p.title}</p>
                    <p style={{ fontSize: '0.7rem', opacity: 0.7, margin: 0, fontWeight: 600 }}>{p.projectCode}</p>
                  </div>
                  <ChevronRight size={16} style={{ opacity: selectedProject?.id === p.id ? 1 : 0.3 }} />
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ padding: '32px', overflowY: 'auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>{selectedProject?.title}</h1>
                <span style={{ padding: '4px 14px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, background: `${statusColors[selectedProject?.status] || '#64748b'}15`, color: statusColors[selectedProject?.status] || '#64748b', letterSpacing: '0.5px' }}>
                  {selectedProject?.status?.replace('_', ' ')}
                </span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Project Code: <strong style={{ color: 'var(--primary)' }}>{selectedProject?.projectCode}</strong></p>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', marginBottom: '24px', border: '1px solid #eef2f6', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BarChart3 size={18} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Project Progress</span>
              </div>
              <span style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--primary)' }}>{selectedProject?.progress || 0}%</span>
            </div>
            <div style={{ background: '#f1f5f9', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${selectedProject?.progress || 0}%`, background: 'linear-gradient(90deg,#003399,#38bdf8)', borderRadius: '8px', transition: 'width 0.8s ease' }} />
            </div>
          </div>

          {/* Updates & Feedback */}
          {selectedProject?.updates?.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '20px', padding: '50px', textAlign: 'center', border: '1px solid #eef2f6' }}>
              <Clock size={36} color="#94a3b8" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#334155' }}>No updates yet</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Your engineer will post the first construction update soon.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '24px' }}>
              {selectedProject?.updates?.map((update: any) => (
                <div key={update.id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #eef2f6', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  
                  {/* Video — only if videoUrl exists */}
                  {update.videoUrl && (
                    <div style={{ position: 'relative', background: '#000', aspectRatio: '16/9', maxHeight: '340px' }}>
                      {update.videoUrl.startsWith('/uploads/') || update.videoUrl.includes('blob') ? (
                        <video src={update.videoUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <iframe
                          src={update.videoUrl.replace('watch?v=', 'embed/')}
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          allowFullScreen
                        />
                      )}
                    </div>
                  )}

                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>{update.title}</h3>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(update.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>

                    {update.description && (
                      <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '20px' }}>{update.description}</p>
                    )}

                    {update.engrComment && (
                      <div style={{ background: '#eff6ff', padding: '18px 20px', borderRadius: '14px', border: '1px solid #bfdbfe', marginBottom: '20px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-10px', left: '16px', background: 'var(--primary)', color: 'white', fontSize: '0.6rem', padding: '2px 10px', borderRadius: '4px', fontWeight: 800, letterSpacing: '1px' }}>ENGINEER</div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <HardHat size={18} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <p style={{ margin: 0, color: '#1e40af', fontSize: '0.875rem', lineHeight: 1.6, fontWeight: 500 }}>{update.engrComment}</p>
                        </div>
                      </div>
                    )}

                    {/* Client Feedback */}
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MessageSquare size={15} color="#64748b" />
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>YOUR FEEDBACK</span>
                        </div>
                        {update.id === latestUpdate?.id && feedbackSaved && (
                          <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>✓ Saved</span>
                        )}
                      </div>
                      {update.id === latestUpdate?.id ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <textarea
                            placeholder="Reply to the engineer or ask a question…"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            style={{ flex: 1, padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.85rem', resize: 'vertical', minHeight: '80px' }}
                          />
                          <button
                            onClick={saveFeedback}
                            disabled={feedbackSaving}
                            className="btn-primary"
                            style={{ padding: '12px 20px', alignSelf: 'flex-end', fontSize: '0.8rem' }}
                          >
                            {feedbackSaving ? <Loader2 className="animate-spin" size={14} /> : 'SEND'}
                          </button>
                        </div>
                      ) : (
                        update.clientFeedback ? (
                          <p style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', fontSize: '0.85rem', color: '#334155', margin: 0 }}>{update.clientFeedback}</p>
                        ) : (
                          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', fontStyle: 'italic' }}>No feedback given for this update.</p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
