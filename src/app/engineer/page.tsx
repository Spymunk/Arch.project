import prisma from '@/lib/prisma';
import Link from 'next/link';
import { HardHat, ChevronRight, Building2, User, MessageSquare, Plus, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function EngineerDashboardPage() {
  const session = await auth();

  if (session?.user?.role !== 'ENGINEER' && session?.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Get active projects
  const projects = await prisma.project.findMany({
    include: {
      user: true,
      _count: { select: { updates: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Get all registered clients
  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    include: { _count: { select: { projects: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <header style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px' }}>
               <HardHat size={16} /> SITE ENGINEER PORTAL
            </div>
            <h1 style={{ fontSize: '2.5rem' }}>Project Oversight</h1>
            <p style={{ color: '#64748b' }}>Manage assigned projects and assign new projects to registered clients.</p>
          </div>
          <Link href="/engineer/create-project" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <Plus size={18} /> ASSIGN NEW PROJECT
          </Link>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
          
          {/* Sidebar: Client Directory */}
          <div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="var(--primary)" /> Registered Clients
              </h3>
              
              <div style={{ display: 'grid', gap: '15px' }}>
                {clients.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No clients registered yet.</p>
                ) : (
                  clients.map(client => (
                    <div key={client.id} style={{ padding: '12px', border: '1px solid #f1f5f9', borderRadius: '12px', background: client._count.projects === 0 ? '#f0fdf4' : '#f8fafc' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{client.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>{client.email}</div>
                      {client._count.projects === 0 ? (
                        <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>NEEDS PROJECT</div>
                      ) : (
                        <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>ASSIGNED ({client._count.projects})</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main: Active Projects */}
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={20} color="var(--primary)" /> Active Projects
            </h3>
            
            {projects.length === 0 ? (
              <div style={{ backgroundColor: 'white', padding: '60px', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <p style={{ color: '#64748b', marginBottom: '20px' }}>No projects have been created yet.</p>
                <Link href="/engineer/create-project" className="btn-primary" style={{ display: 'inline-flex' }}>
                  CREATE FIRST PROJECT
                </Link>
              </div>
            ) : (
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
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
