import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowRight, Play, CheckCircle2, Building2, Ruler, ShieldCheck, Star, Users, Globe, Award } from 'lucide-react';
import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();
  
  let ctaLink = "/signup";
  let ctaText = "START YOUR PROJECT";
  
  if (session?.user) {
    ctaText = "GO TO DASHBOARD";
    if (session.user.role === 'ADMIN') ctaLink = "/admin";
    else if (session.user.role === 'ENGINEER') ctaLink = "/engineer";
    else ctaLink = "/dashboard";
  }

  return (
    <main style={{ backgroundColor: 'white' }}>
      <Navbar />
      
      {/* Hero Section - Heavy Graphics */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        position: 'relative',
        paddingTop: '100px',
        paddingBottom: '100px',
        background: 'radial-gradient(circle at top right, #e0f2fe, #ffffff 50%)',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(0, 51, 153, 0.03)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '300px', height: '300px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '50%', filter: 'blur(60px)' }}></div>

        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <div className="animate-fade">
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '10px 20px', 
              background: 'white', 
              color: 'var(--primary)',
              borderRadius: '50px',
              fontSize: '0.8rem',
              fontWeight: 800,
              marginBottom: '32px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              border: '1px solid #eee'
            }}>
              <Award size={16} /> #1 ARCHITECTURAL FIRM 2026
            </div>
            <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 5.5rem)', lineHeight: 0.95, marginBottom: '32px', letterSpacing: '-0.04em' }}>
              We Design <br/> <span style={{ color: 'var(--primary)', position: 'relative' }}>
                Masterpieces.
                <span style={{ position: 'absolute', bottom: '10px', left: 0, width: '100%', height: '8px', background: 'rgba(56, 189, 248, 0.2)', zIndex: -1 }}></span>
              </span>
            </h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '48px', maxWidth: '600px', color: '#475569', lineHeight: 1.6 }}>
              Transcend traditional boundaries. Experience a new era of architectural transparency with our signature real-time project portal.
            </p>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <Link href={ctaLink} className="btn-primary" style={{ padding: '20px 40px', fontSize: '1.1rem' }}>
                {ctaText} <ArrowRight size={20} />
              </Link>
              <Link href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={20} fill="var(--primary)" />
                </div>
                WATCH SHOWREEL
              </Link>
            </div>
            
            <div style={{ display: 'flex', gap: '50px', marginTop: '80px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
              <div><h4 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '4px' }}>250+</h4><p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Luxury Villas</p></div>
              <div><h4 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '4px' }}>12</h4><p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Global Offices</p></div>
              <div><h4 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '4px' }}>98%</h4><p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Client Retention</p></div>
            </div>
          </div>
          
          <div className="animate-fade" style={{ position: 'relative' }}>
            <div className="animate-float" style={{ 
              position: 'relative',
              borderRadius: '40px', 
              overflow: 'hidden',
              boxShadow: '0 50px 100px rgba(0, 51, 153, 0.2)',
              border: '8px solid white',
              aspectRatio: '4/5'
            }}>
              <Image 
                src="/hero.png" 
                alt="Modern Luxury Architecture" 
                fill 
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            
            {/* Floating Info Cards */}
            <div className="glass" style={{ 
              position: 'absolute', 
              top: '15%', 
              right: '-30px', 
              padding: '24px', 
              borderRadius: '24px',
              maxWidth: '220px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />)}
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.4 }}>"The most transparent process we've ever experienced."</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>— Sarah Jenkins, CEO</p>
            </div>

            <div className="glass" style={{ 
              position: 'absolute', 
              bottom: '10%', 
              left: '-40px', 
              padding: '20px 30px', 
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              zIndex: 10
            }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Users size={24} />
              </div>
              <div>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>4.9/5</p>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Google Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Marquee */}
      <div style={{ padding: '40px 0', borderBottom: '1px solid #eee', background: 'white' }}>
        <div className="container">
          <p style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', marginBottom: '30px', letterSpacing: '2px' }}>TRUSTED BY GLOBAL VISIONARIES</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.4, filter: 'grayscale(1)' }}>
             <h3 style={{ fontSize: '1.5rem' }}>METROPOLIS</h3>
             <h3 style={{ fontSize: '1.5rem' }}>HORIZON GROUP</h3>
             <h3 style={{ fontSize: '1.5rem' }}>AZURE ESTATES</h3>
             <h3 style={{ fontSize: '1.5rem' }}>VANGUARD</h3>
             <h3 style={{ fontSize: '1.5rem' }}>SKYLINE</h3>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section style={{ background: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginBottom: '80px', alignItems: 'end' }}>
            <div>
              <h2 style={{ fontSize: '3rem', marginBottom: '24px' }}>Our Expertise <br/> In Every Detail.</h2>
              <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '500px' }}>We don't just build structures; we curate environments that inspire the human spirit.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Link href="#" className="btn-secondary">EXPLORE ALL SERVICES <ArrowRight size={18} /></Link>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {[
              { icon: Building2, title: 'Commercial Icons', desc: 'Landmark skyscrapers and corporate headquarters that define city skylines.', color: '#003399' },
              { icon: Ruler, title: 'Private Residences', desc: 'Bespoke luxury estates tailored to the unique lifestyle of our distinguished clients.', color: '#0ea5e9' },
              { icon: Globe, title: 'Sustainable Cities', desc: 'Forward-thinking urban planning focused on carbon-neutral living and green spaces.', color: '#10b981' }
            ].map((service, i) => (
              <div key={i} style={{ 
                padding: '60px 40px', 
                background: 'white', 
                borderRadius: '32px',
                border: '1px solid #eef2f6',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }} className="service-card">
                <div style={{ width: '70px', height: '70px', background: `${service.color}10`, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                  <service.icon size={32} color={service.color} />
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>{service.title}</h3>
                <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '1rem', lineHeight: 1.6 }}>{service.desc}</p>
                <Link href="#" style={{ color: service.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', fontSize: '0.9rem' }}>
                  LEARN MORE <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advertising / Portal Highlight */}
      <section style={{ background: 'var(--blue-gradient)', color: 'white', overflow: 'hidden', position: 'relative' }}>
        {/* Decorative Grid */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ background: 'rgba(255,255,255,0.1)', display: 'inline-block', padding: '6px 15px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '24px', letterSpacing: '1px' }}>REVOLUTIONARY CLIENT PORTAL</div>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '32px', color: 'white', lineHeight: 1.1 }}>Watch Your <br/> Vision Rise.</h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '40px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              Stay connected to your build site from anywhere in the world. Our award-winning portal provides complete visual and technical transparency.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '50px' }}>
              {[
                { title: 'Live Site Feeds', icon: Video },
                { title: 'Milestone Alerts', icon: CheckCircle2 },
                { title: 'Technical Vault', icon: ShieldCheck },
                { title: 'Direct Access', icon: Users }
              ].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '10px' }}>
                    <feature.icon size={20} color="white" />
                  </div>
                  <span style={{ fontWeight: 600 }}>{feature.title}</span>
                </div>
              ))}
            </div>
            <Link href={ctaLink} className="btn-secondary" style={{ border: 'none', background: 'white', color: 'var(--primary)', padding: '20px 45px' }}>
              {ctaText}
            </Link>
          </div>
          
          <div style={{ position: 'relative' }}>
             {/* Dashboard Mockup - Ultra Premium */}
             <div style={{ 
               background: 'rgba(255,255,255,0.05)', 
               backdropFilter: 'blur(30px)',
               padding: '40px',
               borderRadius: '40px',
               border: '1px solid rgba(255,255,255,0.15)',
               boxShadow: '0 60px 120px rgba(0,0,0,0.4)'
             }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                 <div>
                   <h5 style={{ fontSize: '1.3rem', marginBottom: '6px', fontWeight: 800 }}>Penthouse Elite Project</h5>
                   <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Site ID: PRJ-9902 • Verified Status</p>
                 </div>
                 <div style={{ background: '#38bdf8', color: 'white', padding: '8px 20px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800 }}>
                   85% COMPLETE
                 </div>
               </div>
               
               <div style={{ width: '100%', height: '300px', background: '#000', borderRadius: '24px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
                 <Image src="/hero.png" alt="Site Feed" fill style={{ objectFit: 'cover', opacity: 0.6 }} />
                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                   <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
                     <Play fill="white" size={32} />
                   </div>
                 </div>
                 <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: '50px', fontSize: '0.7rem' }}>
                    <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div> LIVE FEED
                 </div>
               </div>
               
               <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px' }}>
                 <p style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '10px', color: '#38bdf8' }}>LATEST ENGINEER COMMENT</p>
                 <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>"Structural steel framing for the rooftop garden is now complete. Quality inspection passed today."</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '100px 0 50px', background: '#0f172a', color: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '60px', marginBottom: '80px' }}>
            <div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Arch.Project</h3>
              <p style={{ color: '#94a3b8', maxWidth: '300px', lineHeight: 1.8 }}>Redefining the relationship between architect and client through transparency and excellence.</p>
            </div>
            <div>
              <h5 style={{ marginBottom: '24px', fontSize: '1rem' }}>FIRM</h5>
              <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', color: '#94a3b8' }}>
                <li>About Us</li>
                <li>Our Process</li>
                <li>Global Awards</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h5 style={{ marginBottom: '24px', fontSize: '1rem' }}>SERVICES</h5>
              <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', color: '#94a3b8' }}>
                <li>Residential</li>
                <li>Commercial</li>
                <li>Industrial</li>
                <li>Interior</li>
              </ul>
            </div>
            <div>
              <h5 style={{ marginBottom: '24px', fontSize: '1rem' }}>SOCIAL</h5>
              <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', color: '#94a3b8' }}>
                <li>Instagram</li>
                <li>LinkedIn</li>
                <li>Pinterest</li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.9rem' }}>
            <p>&copy; 2026 Arch.Project International. All rights reserved.</p>
            <p>Privacy Policy • Terms of Service</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

const Video = ({ size, color, style }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
  </svg>
);
