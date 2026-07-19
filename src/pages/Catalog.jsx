import React, { useState } from 'react';
import productsData from '../data/products.json';
import { Search, Flame, Filter, HelpCircle } from 'lucide-react';

const Catalog = ({ setPage, setSelectedProductId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedSpiceFilter, setSelectedSpiceFilter] = useState('Semua'); // 'Semua', '0', '1-3', '4-5'

  const categories = ['Semua', 'Best Seller', 'Classic', 'Spicy Fusion', 'Cheese Lover', 'Specialty'];

  const handleProductClick = (id) => {
    setSelectedProductId(id);
    setPage('detail');
    window.scrollTo(0, 0);
  };

  // Filtering Logic
  const filteredProducts = productsData.filter((product) => {
    // Search query match
    const matchesSearch =
      product.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.varian_rasa.toLowerCase().includes(searchQuery.toLowerCase());

    // Category match
    const matchesCategory = selectedCategory === 'Semua' || product.kategori === selectedCategory;

    // Spice match
    let matchesSpice = true;
    if (selectedSpiceFilter === '0') {
      matchesSpice = product.level_pedas.includes(0);
    } else if (selectedSpiceFilter === '1-3') {
      matchesSpice = product.level_pedas.some((lvl) => lvl >= 1 && lvl <= 3);
    } else if (selectedSpiceFilter === '4-5') {
      matchesSpice = product.level_pedas.some((lvl) => lvl >= 4 && lvl <= 5);
    }

    return product.stok_tampil && matchesSearch && matchesCategory && matchesSpice;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Katalog Resmi</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '6px' }}>Varian Rasa Say Macaroni</h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '12px auto 0 auto', fontSize: '0.95rem' }}>
            Temukan camilan renyah impian Anda. Pilih rasa kesukaanmu dan tentukan level pedas yang menantang adrenalin!
          </p>
        </div>

        {/* Search and Filters Section */}
        <div
          className="glass-panel"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }} className="search-filter-grid">
            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                type="text"
                placeholder="Cari rasa atau nama makaroni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ width: '100%', paddingLeft: '48px', marginBottom: 0 }}
              />
            </div>

            {/* Spice Filter Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }} className="spice-selector-wrap">
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Flame size={16} style={{ color: 'var(--color-spicy)' }} /> Level Pedas:
              </span>
              <div style={{ display: 'flex', gap: '8px', background: 'rgba(10, 15, 29, 0.6)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
                {['Semua', '0', '1-3', '4-5'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedSpiceFilter(opt)}
                    style={{
                      background: selectedSpiceFilter === opt ? 'linear-gradient(135deg, var(--color-spicy), var(--color-spicy-dark))' : 'none',
                      border: 'none',
                      color: selectedSpiceFilter === opt ? 'white' : 'var(--color-text-muted)',
                      padding: '4px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-full)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {opt === 'Semua' ? 'Semua' : opt === '0' ? 'Lvl 0' : opt === '1-3' ? 'Lvl 1-3' : 'Lvl 4-5'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter Tags */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }} className="custom-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  background: selectedCategory === category ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid',
                  borderColor: selectedCategory === category ? 'var(--color-primary)' : 'var(--color-border)',
                  color: selectedCategory === category ? '#050a14' : 'var(--color-text-muted)',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                className="category-btn-hover"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid-layout">
            {filteredProducts.map((product) => (
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
                      <span className="product-price">Rp {product.harga.toLocaleString('id-ID')}</span>
                      <span className="weight-info" style={{ display: 'block', marginTop: '2px' }}>Netto: {product.berat}</span>
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: 'var(--radius-md)' }}
                    >
                      Beli / Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="glass-panel"
            style={{
              textAlign: 'center',
              padding: '60px 24px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <HelpCircle size={48} style={{ color: 'var(--color-text-muted)' }} />
            <h3 style={{ fontSize: '1.4rem' }}>Produk Tidak Ditemukan</h3>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px' }}>
              Maaf, tidak ada produk Say Macaroni yang cocok dengan pencarian atau filter yang Anda pilih saat ini. Coba ubah filter Anda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
                setSelectedSpiceFilter('Semua');
              }}
              className="btn btn-secondary"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .search-filter-grid {
            grid-template-columns: 1fr !important;
          }
          .spice-selector-wrap {
            justify-content: flex-start !important;
          }
        }
        .category-btn-hover:hover {
          border-color: var(--color-primary) !important;
          color: #fff !important;
        }
      `}} />
    </div>
  );
};

export default Catalog;
