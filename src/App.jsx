import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';

const AppContent = () => {
  const [currentPage, setPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState('1');
  
  // Theme State (Dark theme default, check localStorage first)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    // Default to dark mode as it is the brand primary theme
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
        return <Home setPage={setPage} setSelectedProductId={setSelectedProductId} />;
      case 'catalog':
        return <Catalog setPage={setPage} setSelectedProductId={setSelectedProductId} />;
      case 'detail':
        return (
          <ProductDetail
            productId={selectedProductId}
            setPage={setPage}
            setSelectedProductId={setSelectedProductId}
          />
        );
      case 'cart':
        return <Cart setPage={setPage} />;
      case 'about':
        return <About setPage={setPage} />;
      case 'contact':
        return <Contact />;
      default:
        return <Home setPage={setPage} setSelectedProductId={setSelectedProductId} />;
    }
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <Navbar 
        currentPage={currentPage} 
        setPage={setPage} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* Main Content Router */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer setPage={setPage} />
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
