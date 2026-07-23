import { sanityClient, urlFor } from '../lib/sanity';
import fallbackProducts from '../data/products.json';

function normalizeProduct(p) {
  const photos = Array.isArray(p.foto) && p.foto.length > 0
    ? p.foto.map(img => {
        if (typeof img === 'string') return img;
        const built = urlFor(img);
        return built ? built.url() : '';
      }).filter(Boolean)
    : [];

  const fallbackPhotos = Array.isArray(p.foto) && typeof p.foto[0] === 'string'
    ? p.foto
    : ['/images/placeholder.jpg'];

  const rawHargaLevel = Array.isArray(p.harga_level) ? p.harga_level : [];
  const harga_level = rawHargaLevel.map(item => ({
    level: Number(item.level),
    harga: Number(item.harga),
  }));

  return {
    id: p._id || p.id,
    nama: p.nama || '',
    slug: p.slug?.current || p.slug || p.id,
    varian_rasa: p.varian_rasa || '',
    level_pedas: Array.isArray(p.level_pedas) ? p.level_pedas : [0, 1, 2, 3, 4, 5],
    harga: Number(p.harga || 0),
    harga_level,
    berat: p.berat || '150g',
    stok_tampil: p.stok_tampil !== undefined ? p.stok_tampil : true,
    deskripsi: p.deskripsi || '',
    komposisi: p.komposisi || '',
    foto: photos.length > 0 ? photos : fallbackPhotos,
    kategori: p.kategori || 'Umum',
    unggulan: Boolean(p.unggulan),
  };
}

export function getProductPriceForLevel(product, level) {
  if (!product) return 0;
  if (Array.isArray(product.harga_level) && product.harga_level.length > 0) {
    const found = product.harga_level.find(item => Number(item.level) === Number(level));
    if (found && typeof found.harga === 'number' && found.harga > 0) {
      return found.harga;
    }
  }
  return product.harga || 0;
}

export function getPriceDisplay(product) {
  if (!product) return 'Rp 0';
  if (Array.isArray(product.harga_level) && product.harga_level.length > 0) {
    const prices = product.harga_level.map(item => item.harga).filter(h => h > 0);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice !== maxPrice) {
        return `Mulai Rp ${minPrice.toLocaleString('id-ID')}`;
      }
      return `Rp ${minPrice.toLocaleString('id-ID')}`;
    }
  }
  return `Rp ${(product.harga || 0).toLocaleString('id-ID')}`;
}

export async function fetchAllProducts() {
  try {
    const query = `*[_type == "product" && stok_tampil == true]{
      _id,
      nama,
      slug,
      varian_rasa,
      level_pedas,
      harga,
      harga_level,
      berat,
      stok_tampil,
      deskripsi,
      komposisi,
      foto,
      kategori,
      unggulan
    }`;
    const data = await sanityClient.fetch(query);
    if (data && data.length > 0) {
      return data.map(normalizeProduct);
    }
  } catch (err) {
    console.warn('Gagal mengambil data dari Sanity, menggunakan data fallback lokal:', err.message);
  }
  return fallbackProducts.map(normalizeProduct);
}

export async function fetchProductByIdOrSlug(idOrSlug) {
  try {
    const query = `*[_type == "product" && (_id == $idOrSlug || slug.current == $idOrSlug)][0]{
      _id,
      nama,
      slug,
      varian_rasa,
      level_pedas,
      harga,
      harga_level,
      berat,
      stok_tampil,
      deskripsi,
      komposisi,
      foto,
      kategori,
      unggulan
    }`;
    const data = await sanityClient.fetch(query, { idOrSlug });
    if (data) {
      return normalizeProduct(data);
    }
  } catch (err) {
    console.warn('Gagal mengambil detail produk dari Sanity, mencari dari fallback lokal:', err.message);
  }

  const found = fallbackProducts.find(
    p => p.id === idOrSlug || String(p.id) === String(idOrSlug) || p.nama.toLowerCase().includes(String(idOrSlug).toLowerCase())
  );
  return found ? normalizeProduct(found) : null;
}
