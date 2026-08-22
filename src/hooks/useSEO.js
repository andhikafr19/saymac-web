import { useEffect } from 'react';

const PAGE_SEO_MAP = {
  home: {
    title: 'Say Macaroni - Makaroni Goreng Premium & Level Pedas Juara',
    description: 'Katalog resmi Say Macaroni. Temukan makaroni goreng premium dengan rasa Garlic yang gurih, level pedas yang menantang, dan pesan mudah langsung ke WhatsApp!',
    canonical: 'https://saymacaroni.vercel.app/',
  },
  catalog: {
    title: 'Katalog Produk - Say Macaroni Premium Snack',
    description: 'Jelajahi semua varian makaroni goreng Say Macaroni! Garlic Butter, Balado Daun Jeruk, Pedas Manis, dan Original. Pilih level pedas favoritmu.',
    canonical: 'https://saymacaroni.vercel.app/',
  },
  detail: {
    title: 'Detail Produk - Say Macaroni',
    description: 'Lihat detail rasa, tingkat kepedasan, dan ukuran kemasan makaroni goreng Say Macaroni.',
    canonical: 'https://saymacaroni.vercel.app/',
  },
  about: {
    title: 'Tentang Kami - Say Macaroni Story',
    description: 'Pelajari kisah di balik renyahnya Say Macaroni. Dibuat dari bahan alami berkualitas tinggi dengan bumbu gurih khas tanpa gatal di tenggorokan.',
    canonical: 'https://saymacaroni.vercel.app/',
  },
  contact: {
    title: 'Hubungi Kami - Say Macaroni Official',
    description: 'Hubungi tim Say Macaroni untuk pemesanan, reseller, hampers, atau pertanyaan seputar produk makaroni goreng premium kami.',
    canonical: 'https://saymacaroni.vercel.app/',
  },
  cart: {
    title: 'Keranjang Belanja - Say Macaroni',
    description: 'Ringkasan pesanan makaroni goreng Say Macaroni kamu sebelum melakukan pesan instan via WhatsApp.',
    canonical: 'https://saymacaroni.vercel.app/',
  },
};

export const useSEO = (currentPage, productDetailData = null) => {
  useEffect(() => {
    let seoConfig = PAGE_SEO_MAP[currentPage] || PAGE_SEO_MAP.home;

    // Custom SEO if on product detail page
    if (currentPage === 'detail' && productDetailData) {
      seoConfig = {
        title: `${productDetailData.nama} - Say Macaroni`,
        description: `${productDetailData.deskripsi} Beli ${productDetailData.nama} dengan pilihan level pedas 0-5 online di Say Macaroni!`,
        canonical: `https://saymacaroni.vercel.app/#produk-${productDetailData.id}`,
      };
    }

    // 1. Update Document Title
    document.title = seoConfig.title;

    // Helper to set meta tag content
    const setMetaTag = (selector, contentAttr, value) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute(contentAttr, value);
      }
    };

    // 2. Update Description & Social Metas
    setMetaTag('meta[name="description"]', 'content', seoConfig.description);
    setMetaTag('meta[property="og:title"]', 'content', seoConfig.title);
    setMetaTag('meta[property="og:description"]', 'content', seoConfig.description);
    setMetaTag('meta[property="og:url"]', 'content', seoConfig.canonical);
    setMetaTag('meta[name="twitter:title"]', 'content', seoConfig.title);
    setMetaTag('meta[name="twitter:description"]', 'content', seoConfig.description);
    setMetaTag('meta[name="twitter:url"]', 'content', seoConfig.canonical);

    // 3. Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', seoConfig.canonical);
    }
  }, [currentPage, productDetailData]);
};
