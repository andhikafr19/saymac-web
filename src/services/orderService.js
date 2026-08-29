import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_ORDERS_KEY = 'saymac_local_orders';

// Helper to generate readable and unique order code: #SAY-YYMMDD-XXXX
export function generateOrderCode() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `#SAY-${year}${month}${day}-${randomChars}`;
}

// Helper to get cached local orders
export function getLocalOrders() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read local orders:', err);
    return [];
  }
}

// Helper to save cached local orders
function saveLocalOrders(orders) {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save local orders:', err);
  }
}

/**
 * Create a new order (saves to Supabase & Local Cache fallback)
 */
export async function createOrder({
  customerName,
  customerPhone,
  customerAddress = '',
  customerNotes = '',
  cartItems = [],
  totalAmount = 0,
}) {
  const orderCode = generateOrderCode();
  const now = new Date().toISOString();

  const formattedItems = cartItems.map((item) => ({
    product_id: String(item.id || item.cartItemId || ''),
    product_name: item.nama || item.name || 'Say Macaroni',
    spicy_level: Number(item.level_pedas ?? 0),
    price: Number(item.harga || 0),
    quantity: Number(item.quantity || 1),
    subtotal: Number((item.harga || 0) * (item.quantity || 1)),
    weight: item.berat || '150g',
  }));

  const calculatedTotal = totalAmount || formattedItems.reduce((sum, it) => sum + it.subtotal, 0);

  const localOrderData = {
    id: 'loc-' + Date.now(),
    order_code: orderCode,
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_address: customerAddress,
    customer_notes: customerNotes,
    total_amount: calculatedTotal,
    status: 'pending',
    payment_status: 'unpaid',
    created_at: now,
    updated_at: now,
    items: formattedItems,
  };

  // Always save to local cache for resilience
  const existingLocal = getLocalOrders();
  saveLocalOrders([localOrderData, ...existingLocal]);

  // Try persisting to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Generate client UUID for order header
      const orderId = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
        ? crypto.randomUUID()
        : ('ord-' + Date.now());

      const orderPayload = {
        id: orderId,
        order_code: orderCode,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        customer_notes: customerNotes,
        total_amount: calculatedTotal,
        status: 'pending',
        payment_status: 'unpaid',
      };

      // 1. Insert order header
      const { error: headerError } = await supabase
        .from('orders')
        .insert(orderPayload);

      if (headerError) {
        console.error('Supabase order insert error:', headerError);
        return { success: true, order: localOrderData, source: 'local' };
      }

      // 2. Insert order items
      if (formattedItems.length > 0) {
        const itemsToInsert = formattedItems.map((item) => ({
          order_id: orderId,
          product_id: item.product_id,
          product_name: item.product_name,
          spicy_level: item.spicy_level,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
          weight: item.weight,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(itemsToInsert);

        if (itemsError) {
          console.error('Supabase order_items insert error:', itemsError);
        }
      }

      const fullOrder = {
        ...orderPayload,
        created_at: now,
        items: formattedItems,
      };

      return { success: true, order: fullOrder, source: 'supabase' };
    } catch (err) {
      console.error('Error saving order to Supabase, fallback to local:', err);
      return { success: true, order: localOrderData, source: 'local' };
    }
  }

  return { success: true, order: localOrderData, source: 'local' };
}

/**
 * Fetch orders list for Admin Dashboard
 */
export async function getOrders({ status = 'all', search = '', dateFilter = 'all' } = {}) {
  let combinedOrders = [];

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        combinedOrders = data.map((o) => ({
          ...o,
          items: Array.isArray(o.order_items) && o.order_items.length > 0
            ? o.order_items
            : o.items || [],
        }));
      }
    } catch (err) {
      console.warn('Could not fetch orders from Supabase:', err);
    }
  }

  // Merge with local orders fallback
  const localOrders = getLocalOrders();
  const existingCodes = new Set(combinedOrders.map((o) => o.order_code));
  localOrders.forEach((lo) => {
    if (!existingCodes.has(lo.order_code)) {
      combinedOrders.push(lo);
    }
  });

  // Filter in-memory if needed
  let results = [...combinedOrders];

  if (status && status !== 'all') {
    results = results.filter((o) => o.status === status);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    results = results.filter(
      (o) =>
        (o.order_code && o.order_code.toLowerCase().includes(q)) ||
        (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
        (o.customer_phone && o.customer_phone.toLowerCase().includes(q))
    );
  }

  if (dateFilter && dateFilter !== 'all') {
    const now = new Date();
    results = results.filter((o) => {
      const orderDate = new Date(o.created_at);
      if (dateFilter === 'today') {
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      } else if (dateFilter === 'month') {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  }

  // Sort newest first
  results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return results;
}

/**
 * Update order status (pending -> processing -> completed -> cancelled)
 */
export async function updateOrderStatus(orderId, newStatus, paymentStatus = null) {
  // Update local cache
  const localOrders = getLocalOrders();
  const updatedLocal = localOrders.map((o) => {
    if (o.id === orderId || o.order_code === orderId) {
      return {
        ...o,
        status: newStatus,
        payment_status: paymentStatus || o.payment_status,
        updated_at: new Date().toISOString(),
      };
    }
    return o;
  });
  saveLocalOrders(updatedLocal);

  // Update in Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
      if (paymentStatus) payload.payment_status = paymentStatus;

      const { error } = await supabase
        .from('orders')
        .update(payload)
        .eq('id', orderId);

      if (error) {
        // Try fallback update by order_code
        await supabase
          .from('orders')
          .update(payload)
          .eq('order_code', orderId);
      }
    } catch (err) {
      console.warn('Error updating status in Supabase:', err);
    }
  }

  return true;
}

/**
 * Delete order
 */
export async function deleteOrder(orderId) {
  // Remove from local cache
  const localOrders = getLocalOrders();
  const filtered = localOrders.filter((o) => o.id !== orderId && o.order_code !== orderId);
  saveLocalOrders(filtered);

  // Remove from Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').delete().eq('id', orderId);
    } catch (err) {
      console.warn('Error deleting order in Supabase:', err);
    }
  }

  return true;
}

/**
 * Export orders to CSV file for Excel Rekap Penjualan
 */
export function exportOrdersToCSV(orders) {
  if (!orders || orders.length === 0) {
    alert('Tidak ada data pesanan untuk diekspor.');
    return;
  }

  const headers = [
    'No',
    'Kode Pesanan',
    'Tanggal & Waktu',
    'Nama Pelanggan',
    'No. WhatsApp',
    'Alamat Pengiriman',
    'Catatan Khusus',
    'Rincian Menu & Level Pedas',
    'Total Item (Pcs)',
    'Total Pembayaran (Rp)',
    'Status Pesanan',
    'Status Bayar',
  ];

  const rows = orders.map((o, idx) => {
    const itemsSummary = (o.items || [])
      .map((it) => {
        const lvl = it.spicy_level === 0 ? 'Tanpa Pedas' : `Lvl ${it.spicy_level}`;
        return `${it.product_name || it.nama} (${lvl}) x${it.quantity}`;
      })
      .join('; ');

    const totalQty = (o.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0);

    const formattedDate = new Date(o.created_at).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const escapeCSV = (val) => {
      const str = String(val ?? '').replace(/"/g, '""');
      return `"${str}"`;
    };

    return [
      idx + 1,
      escapeCSV(o.order_code),
      escapeCSV(formattedDate),
      escapeCSV(o.customer_name),
      escapeCSV(o.customer_phone),
      escapeCSV(o.customer_address || '-'),
      escapeCSV(o.customer_notes || '-'),
      escapeCSV(itemsSummary),
      totalQty,
      o.total_amount,
      escapeCSV(o.status),
      escapeCSV(o.payment_status || 'unpaid'),
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const todayStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Penjualan_SayMacaroni_${todayStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
