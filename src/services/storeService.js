import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const DEFAULT_STORE_SETTINGS = {
  id: 'default-store-settings',
  whatsapp_number: '6285797987872',
  whatsapp_display: '+62 857-9798-7872',
  instagram_handle: '@saymacaroni',
  instagram_url: 'https://instagram.com/saymacaroni',
  email_address: 'hello@saymacaroni.com',
  operational_weekdays: 'Senin - Sabtu (09:00 - 21:00 WIB)',
  operational_weekends: 'Minggu / Hari Libur (10:00 - 17:00 WIB)',
  store_address: 'Kompleks Ruko Primarasa, Blok B-10, Jl. Macaroni Raya No. 45, Jakarta Selatan',
  maps_url: 'https://maps.google.com',
};

/**
 * Fetch store settings and contact info from Supabase with fallback
 */
export async function fetchStoreSettings() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          ...DEFAULT_STORE_SETTINGS,
          ...data,
        };
      }
    } catch (err) {
      console.warn('Supabase fetch store settings failed, using fallback:', err.message);
    }
  }

  return DEFAULT_STORE_SETTINGS;
}
