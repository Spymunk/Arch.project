import prisma from '@/lib/prisma';
import Link from 'next/link';
import { LayoutDashboard, Users, Plus, ChevronRight, Building2, User, ShieldCheck, Clock, Hash } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const session = await auth();

  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const projects = await prisma.project.findMany({
    include: {
      user: true,
      _count: {
        select: { updates: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalClients = await prisma.user.count({ where: { role: 'CLIENT' } });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px' }}>
               <ShieldCheck size={16} /> ADMINISTRATOR PORTAL
            </div>
            <h1 style={{ fontSize: '2.5rem' }}>Portfolio Overview</h1>
          </div>
          <button className="btn-primary" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <Plus size={18} /> CREATE PROJECT
          </button>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '50px' }}>
          {[
            { label: 'Active Projects', value: projects.length, icon: Building2 },
            { label: 'Total Clients', value: totalClients, icon: Users },
            { label: 'Pending Updates', value: '12', icon: Clock },
            { label: 'System Health', value: '100%', icon: ShieldCheck }
          ].map((stat, i) => (
            <div key={i} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <stat.icon size={24} color="var(--primary)" style={{ marginBottom: '16px' }} />
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{stat.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Project List */}
        <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <th style={{ padding: '20px 30px', fontSize: '0.75rem', color: '#64748b' }}>PROJECT & CODE</th>
                <th style={{ padding: '20px 30px', fontSize: '0.75rem', color: '#64748b' }}>CLIENT</th>
                <th style={{ padding: '20px 30px', fontSize: '0.75rem', color: '#64748b' }}>STATUS</th>
                <th style={{ padding: '20px 30px', fontSize: '0.75rem', color: '#64748b' }}>UPDATES</th>
                <th style={{ padding: '20px 30px', fontSize: '0.75rem', color: '#64748b' }}>PROGRESS</th>
                <th style={{ padding: '20px 30px', fontSize: '0.75rem', color: '#64748b' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '25px 30px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Hash size={14} /> {project.projectCode}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>{project.title}</div>
                  </td>
                  <td style={{ padding: '25px 30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={14} color="#94a3b8" /> {project.user?.name || 'Unassigned'}
                    </div>
                  </td>
                  <td style={{ padding: '25px 30px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '50px', 
                      fontSize: '0.7rem', 
                      fontWeight: 700,
                      background: '#e0f2fe',
                      color: '#0369a1'
                    }}>{project.status}</span>
                  </td>
                  <td style={{ padding: '25px 30px' }}>{project._count.updates} posts</td>
                  <td style={{ padding: '25px 30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '100px', height: '6px', background: '#f1f5f9', borderRadius: '10px' }}>
                        <div style={{ width: `${project.progress}%`, height: '100%', background: 'var(--primary)', borderRadius: '10px' }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{project.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '25px 30px' }}>
                    <Link href={`/admin/projects/${project.id}`} style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                      MANAGE <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
