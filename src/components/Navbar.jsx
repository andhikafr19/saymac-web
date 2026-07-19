import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';

const Navbar = ({ currentPage, setPage }) => {
  const { getCartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', value: 'home' },
    { name: 'Katalog', value: 'catalog' },
    { name: 'Tentang Kami', value: 'about' },
    { name: 'Hubungi Kami', value: 'contact' },
  ];

  const handleNavClick = (page) => {
    setPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <nav
      className={`fixed-nav ${
        isScrolled ? 'nav-scrolled' : ''
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: isScrolled ? 'rgba(10, 15, 29, 0.9)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
        padding: isScrolled ? '12px 0' : '20px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '1.4rem',
            color: '#fff',
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

        {/* Desktop Nav Links */}
        <div className="desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {navLinks.map((link) => (
            <button
              key={link.value}
              onClick={() => handleNavClick(link.value)}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === link.value ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                position: 'relative',
                padding: '4px 0',
              }}
              className="nav-link-hover"
            >
              {link.name}
              {currentPage === link.value && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '2px',
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons (Cart & Mobile Menu Trigger) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Cart Button */}
          <button
            onClick={() => handleNavClick('cart')}
            className="glass-panel"
            style={{
              position: 'relative',
              background: currentPage === 'cart' ? 'rgba(255, 183, 3, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: currentPage === 'cart' ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: currentPage === 'cart' ? 'var(--color-primary)' : '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
            }}
          >
            <ShoppingBag size={18} />
            <span className="cart-text" style={{ fontSize: '0.85rem' }}>Keranjang</span>
            {getCartCount() > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: 'var(--color-spicy)',
                  color: 'white',
                  borderRadius: '50%',
                  minWidth: '20px',
                  height: '20px',
                  padding: '2px 6px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(230, 57, 70, 0.5)',
                }}
                className="animate-fade-in"
              >
                {getCartCount()}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--color-border)',
              color: '#fff',
              padding: '10px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(10, 15, 29, 0.95)',
            backdropFilter: 'blur(20px)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 24px',
            gap: '24px',
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.value}
              onClick={() => handleNavClick(link.value)}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === link.value ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1.5rem',
                textAlign: 'left',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
              }}
            >
              {link.name}
            </button>
          ))}
        </div>
      )}

      {/* Embedded CSS for responsive navbar items */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .desktop-links {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
          .cart-text {
            display: none !important;
          }
        }
        .nav-link-hover:hover {
          color: var(--color-primary) !important;
        }
      `}} />
    </nav>
  );
};

export default Navbar;
