import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import ReceiptModal from '../components/ReceiptModal';
import { 
  Trash2, 
  Send, 
  ShoppingBag, 
  MapPin, 
  ClipboardList, 
  User, 
  Phone, 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  Loader2 
} from 'lucide-react';

const Cart = ({ setPage }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  // Customer Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Processing & Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Default WhatsApp Admin Number
  const WHATSAPP_ADMIN_NUMBER = '6285797987872';

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 1. Calculate & Save Order to Database (Supabase + Local Fallback)
      const totalAmount = getCartTotal();
      const result = await createOrder({
        customerName,
        customerPhone,
        customerAddress,
        customerNotes,
        cartItems,
        totalAmount,
      });

      const orderData = result?.order || {
        order_code: `#SAY-${Date.now().toString().slice(-6)}`,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        customer_notes: customerNotes,
        total_amount: totalAmount,
        items: cartItems,
      };

      setCreatedOrder(orderData);

      // 2. Clear cart items
      clearCart();
    } catch (err) {
      console.error('Error during checkout process:', err);
      alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendToWhatsApp = () => {
    if (!createdOrder) return;

    let itemsText = '';
    (createdOrder.items || []).forEach((item, index) => {
      const levelText = item.spicy_level === 0 || item.level_pedas === 0 ? 'Tanpa Pedas' : `Level Pedas ${item.spicy_level ?? item.level_pedas}`;
      const itemPrice = item.price || item.harga || 0;
      const subtotal = itemPrice * (item.quantity || 1);
      itemsText += `${index + 1}. ${item.product_name || item.nama} (${levelText}) x${item.quantity} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    const message = `Halo Say Macaroni, saya ingin mengonfirmasi pesanan saya:

*KODE PESANAN: ${createdOrder.order_code}*

${itemsText}
*Total Estimasi: Rp ${(createdOrder.total_amount || 0).toLocaleString('id-ID')}*

*Data Pemesan:*
- Nama: ${createdOrder.customer_name || '-'}
- No. WhatsApp: ${createdOrder.customer_phone || '-'}
- Alamat: ${createdOrder.customer_address || '-'}
- Catatan: ${createdOrder.customer_notes || '-'}

Mohon info ongkir dan petunjuk pembayarannya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_ADMIN_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // SUCCESS CONFIRMATION VIEW
  if (createdOrder) {
    return (
      <div className="container animate-fade-in" style={{ padding: '60px 24px' }}>
        <div
          className="glass-panel"
          style={{
            maxWidth: '650px',
            margin: '0 auto',
            padding: '40px 32px',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}
        >
          {/* Success Badge */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(46, 196, 182, 0.15)',
              color: '#2ec4b6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <CheckCircle2 size={44} />
          </div>

          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Pesanan Berhasil Dicatat!</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
            Data pesanan Anda telah tersimpan di sistem kami. Silakan lanjutkan konfirmasi ke WhatsApp Admin dan cetak/simpan struk belanja Anda.
          </p>

          {/* Order Code Box */}
          <div
            style={{
              background: 'rgba(255, 183, 3, 0.08)',
              border: '1px dashed var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '28px',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Kode Pesanan Anda
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-primary)', marginTop: '4px', letterSpacing: '1px' }}>
              {createdOrder.order_code}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Total: <strong>Rp {Number(createdOrder.total_amount || 0).toLocaleString('id-ID')}</strong> ({createdOrder.items?.length || 0} varian)
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleSendToWhatsApp}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px 24px',
                fontSize: '1.05rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <Send size={18} /> Lanjut Konfirmasi ke WhatsApp Admin
            </button>

            <button
              onClick={() => setShowReceiptModal(true)}
              className="btn"
              style={{
                width: '100%',
                padding: '12px 24px',
                fontSize: '0.95rem',
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--color-text-main)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Printer size={18} /> Cetak / Simpan Struk PDF
            </button>

            <button
              onClick={() => {
                setCreatedOrder(null);
                setPage('catalog');
                window.scrollTo(0, 0);
              }}
              className="btn"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '0.9rem',
                color: 'var(--color-text-muted)',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              Belanja Lagi <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Receipt Print / PDF Modal */}
        {showReceiptModal && (
          <ReceiptModal order={createdOrder} onClose={() => setShowReceiptModal(false)} />
        )}
      </div>
    );
  }

  // EMPTY CART VIEW
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
                  <span style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--color-secondary)' }}>Dikonfirmasi oleh Admin via WA</span>
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
                    <User size={14} /> Nama Lengkap <span style={{ color: 'var(--color-spicy)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama pemesan..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                {/* WhatsApp Phone Number */}
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} /> No. WhatsApp Aktif <span style={{ color: 'var(--color-spicy)' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                {/* Address */}
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> Alamat Pengiriman <span style={{ color: 'var(--color-spicy)' }}>*</span>
                  </label>
                  <textarea
                    placeholder="Alamat lengkap (nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota)..."
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
                    placeholder="Contoh: Sambal dipisah, kirim setelah jam 2 siang..."
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
                  disabled={isSubmitting}
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
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Menyimpan Pesanan...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Simpan & Pesan via WhatsApp
                    </>
                  )}
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
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default Cart;
