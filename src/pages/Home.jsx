import React, { useState, useEffect } from 'react';
import { fetchAllProducts, getPriceDisplay } from '../services/productService';
import { fetchActiveCampaign } from '../services/campaignService';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Award, ShoppingBag, Send } from 'lucide-react';

const Home = ({ setPage }) => {
  const [productsData, setProductsData] = useState([]);
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [products, campaignData] = await Promise.all([
          fetchAllProducts(),
          fetchActiveCampaign()
        ]);
        if (isMounted) {
          setProductsData(products);
          setCampaign(campaignData);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const featuredProducts = productsData.filter((p) => p.unggulan && p.stok_tampil).slice(0, 3);

  const handleProductClick = (id) => {
    setPage('detail', id);
    window.scrollTo(0, 0);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '120px 0 80px 0',
          background: 'linear-gradient(180deg, rgba(33, 158, 188, 0.08) 0%, rgba(10, 15, 29, 0) 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Decorative Blobs */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255, 183, 3, 0.1) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '-10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(230, 57, 70, 0.08) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          {/* Text Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 183, 3, 0.1)',
                border: '1px solid rgba(255, 183, 3, 0.2)',
                color: 'var(--color-primary)',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                alignSelf: 'flex-start',
              }}
            >
              <Sparkles size={14} /> Camilan Premium No. 1
            </div>

            <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: '1.15' }}>
              Sensasi <span className="gradient-text-spicy">Kriuk Juara</span> & Bumbu Premium Sejati
            </h1>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Say Macaroni menghadirkan makaroni goreng berkualitas tinggi dengan tekstur super renyah, dibalur bumbu garlic & rempah alami melimpah, lengkap dengan level pedas yang bisa kamu tentukan sendiri!
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setPage('catalog'); window.scrollTo(0, 0); }}
                className="btn btn-primary"
                style={{ fontSize: '1rem', padding: '14px 32px' }}
              >
                Lihat Katalog <ArrowRight size={18} />
              </button>
              <button
                onClick={() => { setPage('contact'); window.scrollTo(0, 0); }}
                className="btn btn-secondary"
                style={{ fontSize: '1rem', padding: '14px 32px' }}
              >
                Hubungi Kami
              </button>
            </div>

            {/* Micro Badges */}
            <div style={{ display: 'flex', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>100% Bahan Alami</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} style={{ color: 'var(--color-secondary)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Kriuk Tidak Serak</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={20} style={{ color: 'var(--color-spicy)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Level Pedas 0-5</span>
              </div>
            </div>
          </div>

          {/* Image Showcase */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            className="hero-image-wrapper"
          >
            {/* Pulsing glow behind image */}
            <div
              style={{
                position: 'absolute',
                width: '320px',
                height: '320px',
                background: 'rgba(255, 183, 3, 0.15)',
                filter: 'blur(60px)',
                borderRadius: '50%',
                zIndex: 0,
              }}
              className="animate-pulse-glow"
            />
            {/* Main Image */}
            <img
              src="/images/garlic_butter_1.jpg"
              alt="Say Macaroni Garlic"
              style={{
                width: '100%',
                maxWidth: '420px',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(255, 183, 3, 0.15)',
                border: '1px solid rgba(255,255,255,0.1)',
                zIndex: 1,
              }}
              className="animate-float"
            />
          </div>
        </div>
      </section>

      {/* Featured Products / Produk Unggulan */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menu Andalan</span>
              <h2 style={{ fontSize: '2.2rem', marginTop: '4px' }}>Produk Unggulan Kami</h2>
            </div>
            <button
              onClick={() => { setPage('catalog'); window.scrollTo(0, 0); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.95rem',
              }}
              className="hover-underline"
            >
              Lihat Semua Produk <ArrowRight size={16} />
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid-layout">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="glass-panel product-card animate-slide-up"
                onClick={() => handleProductClick(product.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image-container">
                  <div className="product-badge">{product.kategori}</div>
                  <div className="spicy-badge spice-hover">
                    <Flame size={12} fill="currentColor" /> Level Max {Math.max(...product.level_pedas)}
                  </div>
                  <img src={product.foto[0]} alt={product.nama} className="product-image" />
                </div>
                <div className="product-info">
                  <h3 className="product-title" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{product.nama}</h3>
                  <p className="product-desc" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>{product.deskripsi}</p>
                  <div className="product-footer">
                    <div>
                      <span className="product-price">{getPriceDisplay(product)}</span>
                      <span className="weight-info" style={{ display: 'block', marginTop: '2px' }}>Netto: {product.berat}</span>
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: 'var(--radius-md)' }}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Theme Campaign Banner (Dynamic from CMS) */}
      {campaign && campaign.is_active !== false && (
        <section style={{ padding: '40px 0' }}>
          <div className="container">
            <div
              className="glass-panel campaign-banner"
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: '48px',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, var(--color-bg-card) 0%, rgba(33, 158, 188, 0.15) 100%)',
                border: '1px solid rgba(255, 183, 3, 0.15)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                gap: '32px',
                alignItems: 'center',
              }}
            >
              <div>
                {campaign.badge_text && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255, 183, 3, 0.15)',
                      color: 'var(--color-primary)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      marginBottom: '16px',
                    }}
                  >
                    {campaign.badge_text}
                  </div>
                )}
                <h2 style={{ fontSize: '2rem', marginBottom: '16px', fontWeight: 800 }}>
                  {campaign.title || 'Say Macaroni Hampers Pack'}
                </h2>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '24px', fontSize: '0.95rem' }}>
                  {campaign.description}
                </p>
                <button
                  onClick={() => {
                    const target = campaign.cta_link || 'catalog';
                    if (target.startsWith('http://') || target.startsWith('https://')) {
                      window.open(target, '_blank');
                    } else {
                      setPage(target);
                      window.scrollTo(0, 0);
                    }
                  }}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', gap: '8px', fontWeight: 700 }}
                >
                  {campaign.cta_text || 'Lihat Promo'} <ShoppingBag size={18} />
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src={campaign.image_url || '/images/balado_jeruk_1.jpg'}
                  alt={campaign.title || 'Promo Say Macaroni'}
                  style={{
                    width: '100%',
                    maxWidth: '280px',
                    borderRadius: 'var(--radius-md)',
                    transform: 'rotate(2deg)',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                    border: '4px solid rgba(255, 255, 255, 0.05)',
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Brand Story / Cerita Singkat */}
      <section style={{ padding: '60px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <img
              src="/images/original_1.jpg"
              alt="Say Macaroni Crispy"
              style={{
                width: '100%',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kisah Di Balik Kriuk</span>
            <h2 style={{ fontSize: '2.2rem' }}>Dibuat dengan Bahan Terbaik & Cinta Sejati</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Perjalanan Say Macaroni dimulai dari keinginan sederhana: menciptakan camilan makaroni yang gurih pas, renyah luar biasa, dan aman dinikmati setiap hari tanpa membuat serak atau gatal di tenggorokan. 
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Kami memilih gandum berkualitas tinggi, menggorengnya dengan teknik pemanasan suhu stabil agar minyak tidak mengendap, dan membumbuinya dengan rempah alami pilihan—terutama bawang putih segar untuk varian Garlic Butter andalan kami.
            </p>
            <button
              onClick={() => { setPage('about'); window.scrollTo(0,0); }}
              className="btn btn-secondary"
              style={{ alignSelf: 'flex-start' }}
            >
              Selengkapnya Tentang Kami
            </button>
          </div>
        </div>
      </section>

      {/* Embedded styles for responsive grid */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .hero-image-wrapper {
            grid-row: 1;
            margin-bottom: 24px;
          }
          .hero-image-wrapper img {
            max-width: 280px !important;
          }
          section {
            padding: 40px 0 !important;
          }
          section h1 {
            font-size: 2.2rem !important;
            text-align: center;
          }
          section p {
            text-align: center;
          }
          section .container {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .campaign-banner {
            grid-template-columns: 1fr !important;
            padding: 24px !important;
            text-align: center;
          }
          .campaign-banner img {
            max-width: 180px !important;
          }
          .btn {
            width: 100%;
          }
          .hover-underline {
            margin: 0 auto;
          }
        }
      `}} />
    </div>
  );
};

export default Home;
