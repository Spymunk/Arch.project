import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { Ruler, Building2, ShieldCheck, PencilRuler, Users2, HardHat } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    { 
      icon: Building2, 
      title: 'Architectural Design', 
      desc: 'Conceptualizing and designing structures that push the boundaries of modern aesthetics.',
      drawing: '/d1.png'
    },
    { 
      icon: Ruler, 
      title: 'Master Planning', 
      desc: 'Large-scale urban planning and landscape design for sustainable communities.',
      drawing: '/d2.png'
    },
    { 
      icon: PencilRuler, 
      title: 'Interior Architecture', 
      desc: 'Curating internal spaces that harmonize with the external structure and client lifestyle.',
      drawing: '/d3.png'
    },
    { 
      icon: ShieldCheck, 
      title: 'Structural Integrity', 
      desc: 'Advanced engineering analysis to ensure every build stands the test of time.',
      drawing: '/d1.png'
    },
    { 
      icon: Users2, 
      title: 'Project Consultation', 
      desc: 'Direct collaboration with stakeholders from initial sketch to final walkthrough.',
      drawing: '/d2.png'
    },
    { 
      icon: HardHat, 
      title: 'Construction Management', 
      desc: 'Overseeing the build process with real-time digital tracking for clients.',
      drawing: '/d3.png'
    },
  ];

  return (
    <main style={{ backgroundColor: '#f8fafc' }}>
      <Navbar />
      <section style={{ paddingTop: '150px', paddingBottom: '100px' }}>
        <div className="container">
          <header style={{ marginBottom: '80px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Our Services</h1>
            <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: '#64748b' }}>
              We provide a comprehensive suite of architectural and engineering services, integrated with state-of-the-art digital tracking.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            {services.map((s, i) => (
              <div key={i} style={{ 
                backgroundColor: 'white', 
                borderRadius: '24px', 
                border: '1px solid var(--border)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }} className="service-card">
                {/* Architectural Drawing Header */}
                <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#001a4d' }}>
                  <Image 
                    src={s.drawing} 
                    alt="Architectural Drawing" 
                    fill 
                    style={{ objectFit: 'cover', opacity: 0.6 }}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '20px', 
                    left: '20px',
                    width: '50px', 
                    height: '50px', 
                    background: 'white', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }}>
                    <s.icon size={24} />
                  </div>
                </div>

                <div style={{ padding: '40px' }}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>{s.title}</h3>
                  <p style={{ color: '#64748b', lineHeight: '1.6' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
