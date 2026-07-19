import React from 'react';
import { ShieldCheck, Flame, Heart, Sparkles, Award, Utensils } from 'lucide-react';

const About = ({ setPage }) => {
  const features = [
    {
      icon: <ShieldCheck size={28} style={{ color: 'var(--color-primary)' }} />,
      title: 'Bahan Baku Premium',
      desc: 'Diproduksi menggunakan gandum pilihan dan bumbu alami bermutu tinggi. Bebas bahan pengawet kimia berbahaya.',
    },
    {
      icon: <Award size={28} style={{ color: 'var(--color-secondary)' }} />,
      title: 'Kriuk Sempurna',
      desc: 'Diproses dengan teknik penggorengan suhu tinggi yang stabil, menghasilkan makaroni renyah tahan lama tanpa sisa minyak berlebih.',
    },
    {
      icon: <Flame size={28} style={{ color: 'var(--color-spicy)' }} />,
      title: 'Level Pedas Fleksibel',
      desc: 'Mulai dari Level 0 yang murni gurih asin, hingga Level 5 yang siap membakar lidah para pecinta pedas ekstrem.',
    },
    {
      icon: <Utensils size={28} style={{ color: 'var(--color-primary)' }} />,
      title: 'Bumbu Merata',
      desc: 'Setiap butir makaroni dibalur bumbu secara presisi, memberikan kelezatan gurih gurih asin yang konsisten dari atas hingga dasar kemasan.',
    },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0' }}>
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mengenal Kami</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '6px' }}>Cerita Say! Macaroni</h1>
        </div>

        {/* Story Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
            marginBottom: '60px',
          }}
          className="about-grid"
        >
          <div>
            <img
              src="/images/original_2.jpg"
              alt="Menggoreng Makaroni Say Macaroni"
              style={{
                width: '100%',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                border: '1px solid var(--color-border)',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)' }}>Renyah, Gurih, Juara!</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Say Macaroni lahir dari sebuah dapur sederhana dengan visi besar: merevolusi jajanan makaroni goreng di Indonesia. Kebanyakan makaroni yang dijual di pasaran terasa keras saat digigit, atau menggunakan minyak curah berkualitas rendah yang membuat tenggorokan gatal.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Kami berkomitmen untuk menepis semua itu. Dengan formula adonan khusus dan teknik pengeringan gandum yang ketat, Say Macaroni berhasil menyajikan makaroni yang renyah namun renyah empuk (kriuk sejati) dan gurih alami bumbu rempah pilihan.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Setiap kemasan Say Macaroni merepresentasikan kerja keras dan dedikasi kami untuk memberikan pengalaman ngemil premium bagi Anda, keluarga, dan teman-teman tercinta.
            </p>
          </div>
        </div>

        {/* Core Values / Features Grid */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '32px' }}>Keunggulan Say! Macaroni</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  borderRadius: 'var(--radius-md)',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem' }}>{feat.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA section */}
        <div
          className="glass-panel"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(255,183,3,0.05) 0%, rgba(10,15,29,0.8) 100%)',
            border: '1px solid rgba(255, 183, 3, 0.15)',
          }}
        >
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Ingin Mencicipi Kriuk Juara?</h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto 24px auto', fontSize: '0.95rem' }}>
            Pilih varian rasa favorit Anda di katalog kami dan nikmati sensasi kemewahan camilan makaroni hari ini.
          </p>
          <button
            onClick={() => { setPage('catalog'); window.scrollTo(0, 0); }}
            className="btn btn-primary"
            style={{ display: 'inline-flex', gap: '8px' }}
          >
            Lihat Katalog Sekarang <Sparkles size={18} />
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}} />
    </div>
  );
};

export default About;
