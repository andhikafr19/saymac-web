import React, { useState } from 'react';
import { Phone, Clock, Mail, Instagram, MapPin, Send, HelpCircle } from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');

  const WHATSAPP_ADMIN_NUMBER = '6281234567890';

  const handleAskQuestion = (e) => {
    e.preventDefault();
    const message = `Halo Say Macaroni, saya ${name} (${email || 'tidak mencantumkan email'}) ingin bertanya:

"${question}"

Mohon informasinya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_ADMIN_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0' }}>
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hubungi Kami</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '6px' }}>Ada Pertanyaan? Hubungi Admin Kami</h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '12px auto 0 auto', fontSize: '0.95rem' }}>
            Butuh info kemitraan, reseller, atau pesanan khusus hampers? Hubungi tim respons cepat kami.
          </p>
        </div>

        {/* Contact Info and Form Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '0.9fr 1.1fr',
            gap: '32px',
            marginBottom: '60px',
          }}
          className="contact-grid"
        >
          {/* Column 1: Info Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '1.3rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>Kontak Resmi</h3>

              {/* Info Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* WhatsApp */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,183,3,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>WhatsApp Chat</span>
                    <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }} className="contact-link">
                      +62 812-3456-7890
                    </a>
                  </div>
                </div>

                {/* Instagram */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(33,158,188,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)', flexShrink: 0 }}>
                    <Instagram size={20} />
                  </div>
                  <div>
                    <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Instagram</span>
                    <a href="https://instagram.com/saymacaroni" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }} className="contact-link">
                      @saymacaroni
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(230,57,70,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-spicy)', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Email</span>
                    <a href="mailto:hello@saymacaroni.com" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }} className="contact-link">
                      hello@saymacaroni.com
                    </a>
                  </div>
                </div>

                {/* Operational hours */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', flexShrink: 0, border: '1px solid var(--color-border)' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Jam Operasional</span>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Senin - Sabtu (09:00 - 21:00)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Contact Form */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '20px' }}>Kirim Pertanyaan Langsung</h3>
            <form onSubmit={handleAskQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Nama Anda</label>
                <input
                  type="text"
                  placeholder="Masukkan nama Anda..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Email Anda (Opsional)</label>
                <input
                  type="email"
                  placeholder="Masukkan alamat email Anda..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Pertanyaan / Pesan</label>
                <textarea
                  placeholder="Ketik pertanyaan Anda di sini..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="input-field"
                  rows="4"
                  style={{ resize: 'none', fontFamily: 'var(--font-body)' }}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px',
                }}
              >
                <Send size={18} /> Kirim via WhatsApp
              </button>
            </form>
          </div>
        </div>

        {/* Map Location Section */}
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '32px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
            <MapPin size={24} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: '1.6rem' }}>Lokasi Toko & Produksi Kami</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 24px auto', fontSize: '0.95rem' }}>
            Kompleks Ruko Primarasa, Blok B-10, Jl. Macaroni Raya No. 45, Jakarta Selatan. Silakan mampir untuk menikmati makaroni hangat yang baru selesai digoreng!
          </p>

          {/* Mock Map View (Premium design) */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '350px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #1c2541 0%, #0b1329 100%)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Abstract grid network lines representing map grid */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.15,
                backgroundSize: '30px 30px',
                backgroundImage: 'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
              }}
            />
            {/* Map point marker */}
            <div
              style={{
                zIndex: 1,
                background: 'rgba(255, 183, 3, 0.2)',
                borderRadius: '50%',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="animate-pulse-glow"
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#050a14',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                }}
              >
                <MapPin size={22} />
              </div>
            </div>
            <div style={{ zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Say! Macaroni Headquarters</h4>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Jakarta Selatan, Indonesia</span>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ zIndex: 1, fontSize: '0.85rem', padding: '10px 20px', display: 'flex', gap: '6px', alignItems: 'center' }}
            >
              Buka di Google Maps <Send size={14} />
            </a>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
        .contact-link:hover {
          color: var(--color-primary) !important;
        }
      `}} />
    </div>
  );
};

export default Contact;
