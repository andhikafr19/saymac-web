import React, { useState, useEffect } from 'react';
import { fetchProductByIdOrSlug, fetchAllProducts, getProductPriceForLevel } from '../services/productService';
import { useCart } from '../context/CartContext';
import { Flame, ShoppingCart, ArrowLeft, ShieldCheck, Scale, Check, Loader2 } from 'lucide-react';

const ProductDetail = ({ productId, setPage, setSelectedProductId }) => {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState('');
  const [selectedSpice, setSelectedSpice] = useState(0);
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const targetProduct = await fetchProductByIdOrSlug(productId);
        const list = await fetchAllProducts();
        if (isMounted) {
          setProduct(targetProduct);
          setAllProducts(list);
          if (targetProduct) {
            setActiveImage(targetProduct.foto?.[0] || '');
            setSelectedSpice(targetProduct.level_pedas?.[0] ?? 0);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    setQty(1);
    setIsAdded(false);
    return () => { isMounted = false; };
  }, [productId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <Loader2 className="animate-spin" size={36} style={{ color: 'var(--color-primary)' }} />
        <p style={{ color: 'var(--color-text-muted)' }}>Memuat detail produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Produk Tidak Ditemukan</h2>
        <button onClick={() => setPage('catalog')} className="btn btn-secondary" style={{ marginTop: '16px' }}>
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const activePrice = getProductPriceForLevel(product, selectedSpice);

  const handleAddToCart = () => {
    addToCart(product, qty, selectedSpice, activePrice);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleRelatedClick = (id) => {
    setSelectedProductId(id);
    window.scrollTo(0, 0);
  };

  // Get related products (same category or general products except current)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.stok_tampil)
    .slice(0, 3);


  return (
    <div className="animate-fade-in" style={{ padding: '40px 0' }}>
      <div className="container">
        {/* Back Link */}
        <button
          onClick={() => { setPage('catalog'); window.scrollTo(0, 0); }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.95rem',
            fontWeight: 600,
            marginBottom: '32px',
            transition: 'color 0.2s',
          }}
          className="back-btn-hover"
        >
          <ArrowLeft size={16} /> Kembali ke Katalog
        </button>

        {/* Product Details Section */}
        <div
          className="glass-panel detail-wrapper"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: '48px',
            marginBottom: '60px',
          }}
        >
          {/* Column 1: Image Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--color-border)',
              }}
            >
              <img
                src={activeImage}
                alt={product.nama}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* Thumbnails */}
            {product.foto.length > 1 && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {product.foto.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: activeImage === imgUrl ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: 'rgba(0,0,0,0.2)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <img src={imgUrl} alt={`${product.nama} thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Information & Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span
                  style={{
                    background: 'rgba(33, 158, 188, 0.15)',
                    color: 'var(--color-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {product.kategori}
                </span>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Scale size={12} /> {product.berat}
                </span>
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{product.nama}</h1>
              <div style={{ color: 'var(--color-primary)', fontSize: '2rem', fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span>Rp {activePrice.toLocaleString('id-ID')}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                  (Harga Level {selectedSpice})
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Deskripsi</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{product.deskripsi}</p>
            </div>

            {/* Composition */}
            {product.komposisi && (
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Komposisi</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{product.komposisi}</p>
              </div>
            )}

            {/* Spice Level Selector */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={16} style={{ color: 'var(--color-spicy)' }} /> Pilih Level Pedas
              </h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {product.level_pedas.map((lvl) => {
                  const isSelected = selectedSpice === lvl;
                  const lvlPrice = getProductPriceForLevel(product, lvl);
                  return (
                    <button
                      key={lvl}
                      onClick={() => setSelectedSpice(lvl)}
                      style={{
                        background: isSelected ? 'linear-gradient(135deg, var(--color-spicy), var(--color-spicy-dark))' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '1px solid var(--color-spicy)' : '1px solid var(--color-border)',
                        color: isSelected ? '#fff' : 'var(--color-text-muted)',
                        padding: '10px 16px',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '2px',
                      }}
                      className="spice-hover"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {lvl === 0 ? 'Lvl 0 (Tanpa Pedas)' : `Level ${lvl}`}
                        {lvl > 0 && (
                          <div style={{ display: 'flex', gap: '1px' }}>
                            {Array.from({ length: Math.min(lvl, 3) }).map((_, i) => (
                              <Flame key={i} size={12} fill={isSelected ? 'white' : 'var(--color-spicy)'} stroke="none" />
                            ))}
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '0.75rem', opacity: isSelected ? 0.9 : 0.7, fontWeight: 600 }}>
                        Rp {lvlPrice.toLocaleString('id-ID')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stepper & Cart Button Wrapper */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
              {/* Stepper */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Jumlah</span>
                <div className="qty-stepper">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="qty-btn">-</button>
                  <span className="qty-val">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="qty-btn">+</button>
                </div>
              </div>

              {/* Add to Cart button */}
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'flex-end', height: '100%' }}>
                <span style={{ height: '18px' }} /> {/* Spacer matching label height */}
                <button
                  onClick={handleAddToCart}
                  className={`btn ${isAdded ? 'btn-secondary' : 'btn-primary'}`}
                  style={{
                    width: '100%',
                    padding: '14px 28px',
                    fontSize: '1rem',
                    borderColor: isAdded ? 'var(--color-primary)' : 'transparent',
                    color: isAdded ? 'var(--color-primary)' : '#050a14',
                  }}
                >
                  {isAdded ? (
                    <>
                      <Check size={18} /> Berhasil Ditambahkan
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} /> Tambah ke Keranjang
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Rekomendasi Lainnya</h2>
          <div className="grid-layout">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="glass-panel product-card animate-slide-up"
                onClick={() => handleRelatedClick(p.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image-container">
                  <div className="product-badge">{p.kategori}</div>
                  <img src={p.foto[0]} alt={p.nama} className="product-image" />
                </div>
                <div className="product-info">
                  <h3 className="product-title" style={{ fontSize: '1.15rem' }}>{p.nama}</h3>
                  <p className="product-desc" style={{ fontSize: '0.85rem' }}>{p.deskripsi}</p>
                  <div className="product-footer">
                    <span className="product-price">Rp {p.harga.toLocaleString('id-ID')}</span>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Detail</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 900px) {
          .detail-wrapper {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 24px !important;
          }
        }
        .back-btn-hover:hover {
          color: var(--color-primary) !important;
        }
      `}} />
    </div>
  );
};

export default ProductDetail;
