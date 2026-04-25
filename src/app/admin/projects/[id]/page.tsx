'use client';

import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, Plus, Trash2, Video, FileText, ChevronLeft, Loader2, MessageSquare, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminProjectManagement() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // New Update Form State
  const [newUpdate, setNewUpdate] = useState({ 
    title: '', 
    description: '', 
    engrComment: '', 
    videoUrl: '' 
  });

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/projects/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load project');
        return res.json();
      })
      .then(data => {
        setProject(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [id]);

  const handleUpdateProgress = async (val: number) => {
    setProject({ ...project, progress: val });
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch(`/api/admin/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUpdate, projectId: id })
      });
      
      if (res.ok) {
        // Refresh project data
        const updated = await (await fetch(`/api/projects/${id}`)).json();
        setProject(updated);
        setNewUpdate({ title: '', description: '', engrComment: '', videoUrl: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: project.progress, status: project.status })
      });
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" /></div>;

  if (!project) return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
      <p style={{ color: '#64748b' }}>Project not found or you don't have access.</p>
      <Link href="/admin" className="btn-primary">BACK TO ADMIN</Link>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', marginBottom: '30px', fontWeight: 500, textDecoration: 'none' }}>
          <ChevronLeft size={18} /> BACK TO ADMIN
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
          <div>
            <header style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px' }}>
                 <ShieldCheck size={16} /> PROJECT CODE: {project.projectCode}
              </div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{project.title}</h1>
              <p style={{ color: '#64748b' }}>Client: {project.user?.name} ({project.user?.email})</p>
            </header>

            {/* Post New Update */}
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', border: '1px solid var(--border)', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={20} color="var(--primary)" /> Post New Construction Update
              </h3>
              <form onSubmit={handleAddUpdate} style={{ display: 'grid', gap: '20px' }}>
                <input 
                  type="text" 
                  placeholder="Update Title (e.g., Foundation Complete)" 
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                  required
                />
                <textarea 
                  placeholder="Detailed description for the customer..." 
                  rows={3}
                  value={newUpdate.description}
                  onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
                  required
                />
                <div style={{ position: 'relative' }}>
                  <MessageSquare size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#94a3b8' }} />
                  <textarea 
                    placeholder="Engineer's Technical Comment (Visible in Blue box)" 
                    rows={2}
                    style={{ paddingLeft: '45px' }}
                    value={newUpdate.engrComment}
                    onChange={(e) => setNewUpdate({ ...newUpdate, engrComment: e.target.value })}
                  />
                </div>
                <div style={{ position: 'relative', border: '2px dashed #e2e8f0', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                  <Video size={24} style={{ color: '#94a3b8', marginBottom: '10px' }} />
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>UPLOAD CONSTRUCTION VIDEO</p>
                  <input 
                    type="file" 
                    accept="video/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      setIsSaving(true);
                      const formData = new FormData();
                      formData.append('file', file);
                      
                      try {
                        const res = await fetch('/api/admin/upload', {
                          method: 'POST',
                          body: formData
                        });
                        const data = await res.json();
                        if (data.url) {
                          setNewUpdate({ ...newUpdate, videoUrl: data.url });
                        }
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    style={{ fontSize: '0.8rem' }}
                  />
                  {newUpdate.videoUrl && (
                    <div style={{ marginTop: '10px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                      ✓ Video uploaded successfully
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <input 
                    type="url" 
                    placeholder="Or paste video URL (YouTube/Vimeo)" 
                    value={newUpdate.videoUrl}
                    onChange={(e) => setNewUpdate({ ...newUpdate, videoUrl: e.target.value })}
                  />
                </div>
                <button type="submit" disabled={isSaving} className="btn-primary" style={{ width: 'fit-content' }}>
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : 'POST UPDATE TO CUSTOMER'}
                </button>
              </form>
            </div>

            {/* Timeline Preview */}
            <div>
               <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Project Timeline</h3>
               {project.updates.map((u: any) => (
                 <div key={u.id} style={{ padding: '20px', borderLeft: '2px solid var(--primary)', marginLeft: '10px', marginBottom: '20px', background: '#fff', borderRadius: '0 12px 12px 0', border: '1px solid #eee' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                     <div style={{ fontWeight: 700 }}>{u.title}</div>
                     <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(u.createdAt).toLocaleDateString()}</div>
                   </div>
                   <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{u.description}</div>
                   {u.engrComment && (
                     <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, fontStyle: 'italic' }}>
                       " {u.engrComment} "
                     </div>
                   )}
                 </div>
               ))}
            </div>
          </div>

          {/* Settings Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)' }}>
               <h3 style={{ fontSize: '1.1rem', marginBottom: '24px' }}>Status & Progress</h3>
               
               <div style={{ marginBottom: '30px' }}>
                 <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '10px' }}>CURRENT STATUS</label>
                 <select 
                   value={project.status} 
                   onChange={(e) => setProject({ ...project, status: e.target.value })}
                   style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 600 }}
                 >
                   <option value="PLANNING">PLANNING</option>
                   <option value="FOUNDATION">FOUNDATION</option>
                   <option value="STRUCTURAL">STRUCTURAL</option>
                   <option value="FINISHING">FINISHING</option>
                   <option value="COMPLETED">COMPLETED</option>
                 </select>
               </div>

               <div style={{ marginBottom: '30px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>OVERALL PROGRESS</label>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{project.progress}%</span>
                 </div>
                 <input 
                   type="range" 
                   min="0" max="100" 
                   value={project.progress} 
                   onChange={(e) => handleUpdateProgress(parseInt(e.target.value))}
                   style={{ width: '100%' }}
                 />
               </div>

               <button onClick={handleSaveProject} disabled={isSaving} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                 <Save size={18} /> SAVE CHANGES
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
