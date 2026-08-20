import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sanityClient, urlFor } from '../lib/sanity';
import fallbackProducts from '../data/products.json';

export function normalizeProduct(p) {
  if (!p) return null;

  // Process images / photos array (supports English 'images' and legacy 'foto')
  let rawPhotos = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    rawPhotos = p.images;
  } else if (Array.isArray(p.foto) && p.foto.length > 0) {
    rawPhotos = p.foto;
  }

  let photos = [];
  if (rawPhotos.length > 0) {
    photos = rawPhotos.map(img => {
      if (typeof img === 'string') return img;
      const built = urlFor(img);
      return built ? built.url() : '';
    }).filter(Boolean);
  }

  const defaultFallbackPhotos = rawPhotos.length > 0 && typeof rawPhotos[0] === 'string'
    ? rawPhotos
    : ['/images/placeholder.svg'];

  const finalPhotos = photos.length > 0 ? photos : defaultFallbackPhotos;

  // Process level_prices / harga_level
  let rawHargaLevel = p.level_prices || p.harga_level || [];
  if (typeof rawHargaLevel === 'string') {
    try {
      rawHargaLevel = JSON.parse(rawHargaLevel);
    } catch {
      rawHargaLevel = [];
    }
  }

  const harga_level = (Array.isArray(rawHargaLevel) ? rawHargaLevel : []).map(item => ({
    level: Number(item.level),
    harga: Number(item.price || item.harga || 0),
    price: Number(item.price || item.harga || 0),
  }));

  // Process spicy_levels / level_pedas array
  let rawSpicyLevels = p.spicy_levels || p.level_pedas || [0, 1, 2, 3, 4, 5];
  let level_pedas = [0, 1, 2, 3, 4, 5];
  if (Array.isArray(rawSpicyLevels) && rawSpicyLevels.length > 0) {
    level_pedas = rawSpicyLevels.map(Number);
  }

  const isActive = p.is_active !== undefined 
    ? Boolean(p.is_active) 
    : (p.stok_tampil !== undefined ? Boolean(p.stok_tampil) : true);

  const isFeatured = p.is_featured !== undefined 
    ? Boolean(p.is_featured) 
    : Boolean(p.unggulan);

  return {
    id: p.id || p._id,
    nama: p.name || p.nama || '',
    name: p.name || p.nama || '',
    slug: p.slug?.current || p.slug || String(p.id || p._id || ''),
    varian_rasa: p.flavor_variant || p.varian_rasa || '',
    flavor_variant: p.flavor_variant || p.varian_rasa || '',
    level_pedas,
    spicy_levels: level_pedas,
    harga: Number(p.price || p.harga || 0),
    price: Number(p.price || p.harga || 0),
    harga_level,
    level_prices: harga_level,
    berat: p.weight || p.berat || '150g',
    weight: p.weight || p.berat || '150g',
    stok_tampil: isActive,
    is_active: isActive,
    deskripsi: p.description || p.deskripsi || '',
    description: p.description || p.deskripsi || '',
    komposisi: p.ingredients || p.komposisi || '',
    ingredients: p.ingredients || p.komposisi || '',
    foto: finalPhotos,
    images: finalPhotos,
    kategori: p.category || p.kategori || 'Umum',
    category: p.category || p.kategori || 'Umum',
    unggulan: isFeatured,
    is_featured: isFeatured,
  };
}

export function getProductPriceForLevel(product, level) {
  if (!product) return 0;
  const levelPrices = product.level_prices || product.harga_level;
  if (Array.isArray(levelPrices) && levelPrices.length > 0) {
    const found = levelPrices.find(item => Number(item.level) === Number(level));
    if (found && typeof (found.price || found.harga) === 'number' && (found.price || found.harga) > 0) {
      return found.price || found.harga;
    }
  }
  return product.price || product.harga || 0;
}

export function getPriceDisplay(product) {
  if (!product) return 'Rp 0';
  const levelPrices = product.level_prices || product.harga_level;
  if (Array.isArray(levelPrices) && levelPrices.length > 0) {
    const prices = levelPrices.map(item => item.price || item.harga).filter(h => h > 0);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice !== maxPrice) {
        return `Mulai Rp ${minPrice.toLocaleString('id-ID')}`;
      }
      return `Rp ${minPrice.toLocaleString('id-ID')}`;
    }
  }
  return `Rp ${(product.price || product.harga || 0).toLocaleString('id-ID')}`;
}

// ----------------------------------------------------
// PUBLIC READ SERVICES (SUPABASE DB -> SANITY -> FALLBACK JSON)
// ----------------------------------------------------

export async function fetchAllProducts() {
  // 1. Try Supabase first if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map(normalizeProduct);
      }
    } catch (err) {
      console.warn('Supabase fetch failed, trying Sanity/Fallback:', err.message);
    }
  }

  // 2. Try Sanity
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
    // Sanity unconfigured or error
  }

  // 3. Fallback local JSON
  return fallbackProducts.map(normalizeProduct);
}

export async function fetchProductByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;

  // 1. Try Supabase first
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return normalizeProduct(data);
      }
    } catch (err) {
      console.warn('Supabase fetch single product failed:', err.message);
    }
  }

  // 2. Try Sanity
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
    // Sanity unconfigured or error
  }

  // 3. Fallback local JSON
  const found = fallbackProducts.find(
    p => p.id === idOrSlug || String(p.id) === String(idOrSlug) || (p.slug && p.slug === idOrSlug) || (p.nama || p.name).toLowerCase().includes(String(idOrSlug).toLowerCase())
  );
  return found ? normalizeProduct(found) : null;
}
