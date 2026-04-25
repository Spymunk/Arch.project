import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Play, Calendar, FileText, CheckCircle2, ChevronLeft, Download } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      updates: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!project) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', marginBottom: '30px', fontWeight: 500 }}>
          <ChevronLeft size={18} /> BACK TO DASHBOARD
        </Link>

        <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2.8rem', marginBottom: '12px' }}>{project.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
               <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 16px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 }}>
                 {project.status}
               </div>
               <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Project ID: {project.id}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
             <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>{project.progress}%</div>
             <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>COMPLETION RATE</p>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '50px' }}>
          {/* Main Feed */}
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              Construction Timeline <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }}></div>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', width: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
              
              {project.updates.map((update, index) => (
                <div key={update.id} style={{ position: 'relative', zIndex: 1, paddingLeft: '60px' }}>
                  {/* Timeline Dot */}
                  <div style={{ 
                    position: 'absolute', 
                    left: '11px', 
                    top: '0', 
                    width: '20px', 
                    height: '20px', 
                    background: index === 0 ? 'var(--primary)' : 'white', 
                    border: '4px solid var(--primary)', 
                    borderRadius: '50%' 
                  }}></div>
                  
                  <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '24px', 
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                  }}>
                    {update.videoUrl && (
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
                        <video 
                          src={update.videoUrl} 
                          controls 
                          poster="/hero.png"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    )}
                    
                    <div style={{ padding: '40px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '1.3rem' }}>{update.title}</h4>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={16} /> {update.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ color: '#475569', marginBottom: '24px' }}>{update.description}</p>
                      <button style={{ background: 'transparent', border: '1px solid #e2e8f0', padding: '10px 18px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Download size={16} /> DOWNLOAD REPORT
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', border: '1px solid var(--border)', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '24px' }}>Project Milestones</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { name: 'Initial Design & Render', done: true },
                  { name: 'Site Preparation', done: true },
                  { name: 'Foundation Pouring', done: true },
                  { name: 'Steel Framing', done: false },
                  { name: 'Roofing & Windows', done: false }
                ].map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: m.done ? 'var(--primary)' : '#f1f5f9', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      {m.done && <CheckCircle2 size={14} color="white" />}
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 500, color: m.done ? '#000' : '#94a3b8' }}>{m.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--blue-gradient)', padding: '40px', borderRadius: '24px', color: 'white' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Project Lead</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '30px', opacity: 0.8 }}>Contact your dedicated architect for immediate questions.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
                <div>
                  <div style={{ fontWeight: 700 }}>Sarah Jenkins</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Senior Architect</div>
                </div>
              </div>
              <button className="btn-secondary" style={{ width: '100%', border: 'none', background: 'white', color: 'var(--primary)' }}>
                SEND MESSAGE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
