import prisma from '@/lib/prisma';
import Link from 'next/link';
import { HardHat, ChevronRight, Building2, User, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function EngineerDashboardPage() {
  const session = await auth();

  if (session?.user?.role !== 'ENGINEER' && session?.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const projects = await prisma.project.findMany({
    include: {
      user: true,
      _count: {
        select: { updates: true }
      }
    }
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <header style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px' }}>
             <HardHat size={16} /> SITE ENGINEER PORTAL
          </div>
          <h1 style={{ fontSize: '2.5rem' }}>Project Oversight</h1>
          <p style={{ color: '#64748b' }}>Select a project to review construction videos and provide technical comments.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
          {projects.map((project) => (
            <div key={project.id} style={{ 
              backgroundColor: 'white', 
              borderRadius: '24px', 
              border: '1px solid var(--border)',
              padding: '30px',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--secondary)', padding: '4px 10px', borderRadius: '6px' }}>
                  {project.projectCode}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                  {project.progress}% Complete
                </span>
              </div>

              <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{project.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} /> {project.user?.name}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                  <MessageSquare size={16} /> {project._count.updates} Updates
                </div>
                <Link href={`/engineer/projects/${project.id}`} style={{ 
                  color: 'var(--primary)', 
                  fontWeight: 700, 
                  fontSize: '0.85rem', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  ADD COMMENTS <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
