import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { fetchStoreSettings, DEFAULT_STORE_SETTINGS } from '../services/storeService';
import { Trash2, Send, ShoppingBag, MapPin, ClipboardList, User } from 'lucide-react';

const Cart = ({ setPage }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  // Customer Form State
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [storeSettings, setStoreSettings] = useState(DEFAULT_STORE_SETTINGS);

  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const settings = await fetchStoreSettings();
        if (isMounted) setStoreSettings(settings);
      } catch (err) {
        console.error('Error loading store settings in Cart:', err);
      }
    }
    loadSettings();
    return () => { isMounted = false; };
  }, []);

  const handleCheckout = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) return;

    // 1. Build Cart Items Text
    let itemsText = '';
    cartItems.forEach((item, index) => {
      const levelText = item.level_pedas === 0 ? 'Tanpa Pedas' : `Level Pedas ${item.level_pedas}`;
      const subtotal = item.harga * item.quantity;
      itemsText += `${index + 1}. ${item.nama} (${levelText}) x${item.quantity} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    // 2. Build Full Message
    const totalAmount = getCartTotal();
    const message = `Halo Say Macaroni, saya ingin memesan:

${itemsText}
Total: Rp ${totalAmount.toLocaleString('id-ID')}

Nama: ${customerName || '-'}
Alamat: ${customerAddress || '-'}
Catatan: ${customerNotes || '-'}

Mohon info ongkir & total pembayaran. Terima kasih!`;

    // 3. Encode URI
    const encodedMessage = encodeURIComponent(message);
    const targetWaNumber = storeSettings.whatsapp_number || '6285797987872';
    const whatsappUrl = `https://wa.me/${targetWaNumber}?text=${encodedMessage}`;

    // 4. Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');

    // Optional: Clear cart after checkout redirect
    // clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div
          className="glass-panel"
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '48px 24px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255, 183, 3, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
            }}
          >
            <ShoppingBag size={36} />
          </div>
          <h2 style={{ fontSize: '1.6rem' }}>Keranjang Belanja Kosong</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Anda belum menambahkan produk apa pun ke keranjang belanja Anda. Mari lihat katalog lezat kami!
          </p>
          <button
            onClick={() => { setPage('catalog'); window.scrollTo(0, 0); }}
            className="btn btn-primary"
            style={{ padding: '12px 32px' }}
          >
            Mulai Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.2rem', marginBottom: '32px', textAlign: 'center' }}>Keranjang Belanja</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }} className="cart-grid">
          {/* Column 1: Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="glass-panel cart-item"
                style={{
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {/* Product Thumbnail */}
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    background: 'rgba(0,0,0,0.2)',
                    flexShrink: 0,
                  }}
                >
                  <img src={item.foto} alt={item.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Details */}
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h3 style={{ fontSize: '1.1rem', paddingRight: '30px' }}>{item.nama}</h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span
                      style={{
                        background: 'rgba(230, 57, 70, 0.15)',
                        color: 'var(--color-spicy)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {item.level_pedas === 0 ? 'Tanpa Pedas' : `Lvl ${item.level_pedas}`}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Netto: {item.berat}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Rp {item.harga.toLocaleString('id-ID')} / pack
                  </div>
                </div>

                {/* Stepper & Trash */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px', justifyContent: 'space-between', height: '100%' }} className="cart-controls-wrap">
                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                    }}
                    className="trash-btn"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Stepper */}
                    <div className="qty-stepper">
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="qty-btn">-</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="qty-btn">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Column 2: Order Summary & Checkout Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Summary details */}
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>Ringkasan Pesanan</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Jumlah Item</span>
                  <span>{cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} Pcs</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Total Harga Produk</span>
                  <span>Rp {getCartTotal().toLocaleString('id-ID')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Ongkos Kirim</span>
                  <span style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--color-secondary)' }}>Dihitung oleh Admin</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '16px',
                    marginTop: '8px',
                    color: 'var(--color-primary)',
                  }}
                >
                  <span>Estimasi Total</span>
                  <span>Rp {getCartTotal().toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>Form Data Pembeli</h3>
              <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Name */}
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} /> Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama Anda..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                {/* Address */}
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> Alamat Pengiriman
                  </label>
                  <textarea
                    placeholder="Alamat lengkap (nama jalan, RT/RW, kelurahan, kecamatan, kota)..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="input-field"
                    rows="3"
                    style={{ resize: 'none', fontFamily: 'var(--font-body)' }}
                    required
                  ></textarea>
                </div>

                {/* Notes */}
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ClipboardList size={14} /> Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    placeholder="Contoh: Level 3 pedasnya agak dikurangi, kirim sore hari..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="input-field"
                    rows="2"
                    style={{ resize: 'none', fontFamily: 'var(--font-body)' }}
                  ></textarea>
                </div>

                {/* Checkout button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px 28px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  <Send size={18} /> Pesan via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 900px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .cart-item {
            flex-direction: column;
            align-items: flex-start !important;
            padding: 16px !important;
          }
          .cart-controls-wrap {
            flex-direction: row-reverse !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
            border-top: 1px solid var(--color-border);
            padding-top: 12px;
            margin-top: 8px;
          }
          .trash-btn {
            padding: 4px;
          }
        }
        .trash-btn:hover {
          color: var(--color-spicy) !important;
        }
      `}} />
    </div>
  );
};

export default Cart;
