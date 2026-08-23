/* ==========================================================================
   SUPABASE CLIENT INITIALIZER & INTEGRATION ENGINE
   ========================================================================== */

const SUPABASE_CONFIG = {
  url: window.SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE',
  anonKey: window.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE'
};

let supabaseClient = null;

if (typeof supabase !== 'undefined' && SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL_HERE') {
  try {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('⚡ Supabase Client Connected Successfully!');
  } catch (err) {
    console.warn('⚠️ Supabase connection failed, falling back to LocalStorage:', err);
  }
}

window.dbHelper = {
  async fetchFranchises(localData) {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.from('franchises').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return localData;
  },

  async fetchOrders(localData) {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.from('orders').select('*');
      if (!error && data && data.length > 0) {
        return data.map(o => ({
          id: o.id,
          franchiseId: o.franchise_id,
          customer: o.customer_name,
          item: o.item_details,
          amount: Number(o.revenue_amount),
          status: o.status
        }));
      }
    }
    return localData;
  },

  async createFranchise(newFranchise) {
    if (supabaseClient) {
      await supabaseClient.from('franchises').insert([{
        id: newFranchise.id,
        name: newFranchise.name,
        location: newFranchise.location,
        pin: newFranchise.pin,
        type: newFranchise.type
      }]);
    }
  },

  async createOrder(newOrder) {
    if (supabaseClient) {
      await supabaseClient.from('orders').insert([{
        id: newOrder.id,
        franchise_id: newOrder.franchiseId,
        customer_name: newOrder.customer,
        item_details: newOrder.item,
        revenue_amount: newOrder.amount,
        status: newOrder.status
      }]);
    }
  },

  async updateOrderStatus(orderId, newStatus) {
    if (supabaseClient) {
      await supabaseClient.from('orders').update({ status: newStatus }).eq('id', orderId);
    }
  }
};
