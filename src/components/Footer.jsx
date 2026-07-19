import React from 'react';
import { Phone, Clock, Instagram, Send, Star } from 'lucide-react';

const Footer = ({ setPage }) => {
  const handleNav = (page) => {
    setPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <footer
      style={{
        backgroundColor: '#050811',
        borderTop: '1px solid var(--color-border)',
        padding: '60px 0 30px 0',
        marginTop: '80px',
        color: 'var(--color-text-muted)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* Column 1: Brand USP */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.4rem',
                color: '#fff',
                marginBottom: '16px',
              }}
            >
              <img
                src="/images/say_macaroni_logo-removebg.png"
                alt="Say! Macaroni"
                style={{
                  height: '42px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Camilan makaroni goreng premium dengan rasa gurih juara, bumbu rempah pilihan, dan sensasi pedas yang bisa Anda sesuaikan sendiri. Nikmati kenikmatan kriuk sejati di setiap gigitannya!
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://instagram.com/saymacaroni"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.2s ease',
                }}
                className="social-icon"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.2s ease',
                }}
                className="social-icon"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>Tautan Cepat</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <button
                  onClick={() => handleNav('home')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', transition: 'color 0.2s' }}
                  className="footer-link"
                >
                  Halaman Utama
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('catalog')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', transition: 'color 0.2s' }}
                  className="footer-link"
                >
                  Katalog Produk
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', transition: 'color 0.2s' }}
                  className="footer-link"
                >
                  Tentang Kami
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', transition: 'color 0.2s' }}
                  className="footer-link"
                >
                  Hubungi Kami
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Jam Operasional */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>Jam Operasional</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Clock size={18} style={{ color: 'var(--color-primary)', marginTop: '2px' }} />
                <div>
                  <span style={{ display: 'block', color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Senin - Sabtu:</span>
                  <span style={{ fontSize: '0.85rem' }}>09:00 - 21:00 WIB</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Clock size={18} style={{ color: 'var(--color-spicy)', marginTop: '2px' }} />
                <div>
                  <span style={{ display: 'block', color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Minggu / Hari Libur:</span>
                  <span style={{ fontSize: '0.85rem' }}>10:00 - 17:00 WIB (Slow Response)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingMinutes: '20px', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <p style={{ fontSize: '0.8rem' }}>
            &copy; {new Date().getFullYear()} Say! Macaroni. All Rights Reserved.
          </p>
          <p style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Made with <Star size={12} fill="var(--color-primary)" color="var(--color-primary)" /> for premium snack lovers.
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .footer-link:hover {
          color: var(--color-primary) !important;
          padding-left: 4px;
        }
        .footer-link {
          transition: all 0.2s ease !important;
        }
        .social-icon:hover {
          background: var(--color-primary) !important;
          color: #000 !important;
          border-color: var(--color-primary) !important;
          transform: translateY(-2px);
        }
      `}} />
    </footer>
  );
};

export default Footer;
