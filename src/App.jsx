import React, { useState, useEffect, useCallback } from 'react';
import { CartProvider } from './context/CartContext';
import { useSEO } from './hooks/useSEO';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';

const HASH_PAGE_MAP = {
  '#katalog': 'catalog',
  '#tentang': 'about',
  '#kontak': 'contact',
  '#keranjang': 'cart',
  '#home': 'home',
};

const PAGE_HASH_MAP = {
  home: '',
  catalog: '#katalog',
  about: '#tentang',
  contact: '#kontak',
  cart: '#keranjang',
  detail: '#detail',
};

const AppContent = () => {
  // Initialize page state from URL hash
  const getInitialPageState = () => {
    const hash = window.location.hash;
    if (hash.startsWith('#produk-')) {
      const id = hash.replace('#produk-', '');
      return { page: 'detail', productId: id || null };
    }
    return { page: HASH_PAGE_MAP[hash] || 'home', productId: null };
  };

  const [currentPage, setCurrentPageState] = useState(() => getInitialPageState().page);
  const [selectedProductId, setSelectedProductId] = useState(() => getInitialPageState().productId);

  // Apply SEO dynamic meta tag hook
  useSEO(currentPage);

  const navigateToPage = useCallback((newPage, productId = null) => {
    setCurrentPageState(newPage);
    if (newPage === 'detail' && productId) {
      setSelectedProductId(productId);
      const newHash = `#produk-${productId}`;
      if (window.location.hash !== newHash) {
        window.location.hash = newHash;
      }
    } else {
      const newHash = PAGE_HASH_MAP[newPage] || '';
      if (window.location.hash !== newHash) {
        if (newHash === '') {
          history.pushState('', document.title, window.location.pathname + window.location.search);
        } else {
          window.location.hash = newHash;
        }
      }
    }
  }, []);

  // Listen for browser back/forward navigation or hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const { page, productId } = getInitialPageState();
      setCurrentPageState(page);
      if (productId) setSelectedProductId(productId);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Theme State (Dark theme default, check localStorage first)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Render current page view
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setPage={navigateToPage} />;
      case 'catalog':
        return <Catalog setPage={navigateToPage} />;
      case 'detail':
        return (
          <ProductDetail
            productId={selectedProductId}
            setPage={navigateToPage}
          />
        );
      case 'cart':
        return <Cart setPage={navigateToPage} />;
      case 'about':
        return <About setPage={navigateToPage} />;
      case 'contact':
        return <Contact />;
      default:
        return <Home setPage={navigateToPage} />;
    }
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <Navbar 
        currentPage={currentPage} 
        setPage={navigateToPage} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* Main Content Router */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer setPage={navigateToPage} />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
