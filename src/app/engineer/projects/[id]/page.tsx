'use client';

import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Play, MessageSquare, Save, Loader2, HardHat } from 'lucide-react';
import Link from 'next/link';

export default function EngineerProjectReview() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setIsLoading(false);
      });
  }, [id]);

  const handleUpdateComment = async (updateId: string, comment: string) => {
    // Update local state
    const newUpdates = project.updates.map((u: any) => 
      u.id === updateId ? { ...u, engrComment: comment } : u
    );
    setProject({ ...project, updates: newUpdates });
  };

  const handleSaveComment = async (updateId: string, comment: string) => {
    setIsSaving(updateId);
    try {
      const res = await fetch(`/api/engineer/updates/${updateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engrComment: comment })
      });
      if (!res.ok) throw new Error('Failed to save');
    } catch (err) {
      alert('Error saving comment');
    } finally {
      setIsSaving(null);
    }
  };

  if (isLoading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <Link href="/engineer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', marginBottom: '30px', fontWeight: 500, textDecoration: 'none' }}>
          <ChevronLeft size={18} /> BACK TO OVERVIEW
        </Link>

        <header style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px' }}>
             <HardHat size={16} /> SITE ENGINEER REVIEW
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{project.title}</h1>
          <p style={{ color: '#64748b' }}>Client: {project.user?.name} • Code: {project.projectCode}</p>
        </header>

        <div style={{ display: 'grid', gap: '40px' }}>
          {project.updates.map((update: any) => (
            <div key={update.id} style={{ 
              backgroundColor: 'white', 
              borderRadius: '24px', 
              border: '1px solid var(--border)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: update.videoUrl ? '400px 1fr' : '1fr'
            }}>
              {/* Video Preview */}
              {update.videoUrl && (
                <div style={{ backgroundColor: '#000', position: 'relative' }}>
                  <video src={update.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                    CONSTRUCTION FEED
                  </div>
                </div>
              )}

              {/* Commenting Area */}
              <div style={{ padding: '40px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{update.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{update.description}</p>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <MessageSquare size={16} /> ENGINEER'S TECHNICAL COMMENT
                  </div>
                  <textarea 
                    value={update.engrComment || ''}
                    onChange={(e) => handleUpdateComment(update.id, e.target.value)}
                    placeholder="Provide technical feedback, quality assurance notes, or instructions for the client..."
                    style={{ 
                      width: '100%', 
                      border: '1px solid #cbd5e1', 
                      borderRadius: '12px', 
                      padding: '15px', 
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      minHeight: '100px',
                      marginBottom: '15px'
                    }}
                  />
                  <button 
                    onClick={() => handleSaveComment(update.id, update.engrComment)}
                    disabled={isSaving === update.id}
                    className="btn-primary" 
                    style={{ width: 'fit-content' }}
                  >
                    {isSaving === update.id ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> SAVE COMMENT</>}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {project.updates.length === 0 && (
            <div style={{ padding: '100px', textAlign: 'center', color: '#94a3b8' }}>
              <MessageSquare size={48} style={{ marginBottom: '20px', opacity: 0.3 }} />
              <h3>No construction feeds available to comment on yet.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
