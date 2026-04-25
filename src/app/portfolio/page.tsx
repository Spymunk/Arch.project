import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PortfolioPage() {
  const projects = [
    { title: 'The Sky Penthouse', location: 'New York, USA', img: '/p1.png', category: 'RESIDENTIAL' },
    { title: 'Helix Corporate Center', location: 'Dubai, UAE', img: '/p2.png', category: 'COMMERCIAL' },
    { title: 'Skyline Villa', location: 'London, UK', img: '/hero.png', category: 'RESIDENTIAL' },
  ];

  return (
    <main style={{ backgroundColor: 'white' }}>
      <Navbar />
      <section style={{ paddingTop: '150px' }}>
        <div className="container">
          <header style={{ marginBottom: '80px' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Our Portfolio</h1>
            <p style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
              A curated selection of our most ambitious projects, where visionary design meets engineering excellence.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
            {projects.map((p, i) => (
              <div key={i} style={{ 
                position: 'relative', 
                height: '500px', 
                overflow: 'hidden',
                borderRadius: '24px',
                group: 'true'
              }} className="portfolio-item">
                <Image 
                  src={p.img} 
                  alt={p.title} 
                  fill 
                  style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  className="portfolio-img"
                />
                <div style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  width: '100%', 
                  padding: '40px', 
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  color: 'white'
                }}>
                  <p style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px' }}>{p.category}</p>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{p.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{p.location}</p>
                    <Link href="#" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                      VIEW PROJECT <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </main>
  );
}
