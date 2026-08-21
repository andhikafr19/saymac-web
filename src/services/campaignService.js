import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const FALLBACK_CAMPAIGN = {
  id: 'fallback-ramadhan',
  badge_text: '🌙 Edisi Khusus Ramadhan & Lebaran',
  title: 'Say Macaroni Hampers Pack',
  description: 'Bagikan kebahagiaan kriuk premium di hari kemenangan! Dapatkan paket hampers cantik isi 4 botol/pouch varian rasa bebas pilih dengan kartu ucapan Lebaran eksklusif. Stok terbatas selama bulan suci!',
  image_url: '/images/balado_jeruk_1.jpg',
  cta_text: 'Pesan Hampers Sekarang',
  cta_link: 'catalog',
  is_active: true,
};

/**
 * Fetch the currently active campaign banner
 * Returns the latest active campaign or fallback default data
 */
export async function fetchActiveCampaign() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetch active campaign failed, using fallback:', err.message);
    }
  }

  return FALLBACK_CAMPAIGN;
}
