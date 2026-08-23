/* ==========================================================================
   SUPABASE CLIENT INITIALIZER & INTEGRATION ENGINE (GUS DUAL SYSTEM)
   ========================================================================== */

const SUPABASE_CONFIG = {
  url: 'https://gwkbljewihaayqwfquua.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3a2JsamV3aWhhYXlxd2ZxdXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NjU0NjcsImV4cCI6MjA5MzA0MTQ2N30.nK6ZjXXu5OMipAzdCdkqSHdaCacfscyh8URqxhZ2uMQ'
};

let supabaseClient = null;

if (typeof supabase !== 'undefined' && SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL_HERE') {
  try {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('⚡ Supabase Client Connected Successfully to Cloud Database!');
  } catch (err) {
    console.warn('⚠️ Supabase connection failed, falling back to LocalStorage:', err);
  }
}

window.dbHelper = {
  // --- B2B Wholesale Data Operations ---
  async fetchB2BFranchises(localData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('b2b_franchises').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (err) { console.warn('Supabase fetch B2B franchises error:', err); }
    }
    return localData;
  },

  async fetchB2BOrders(localData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('b2b_orders').select('*');
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
      } catch (err) { console.warn('Supabase fetch B2B orders error:', err); }
    }
    return localData;
  },

  async createB2BFranchise(newFranchise) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('b2b_franchises').insert([{
          id: newFranchise.id,
          name: newFranchise.name,
          location: newFranchise.location,
          pin: newFranchise.pin,
          type: newFranchise.type
        }]);
      } catch (err) { console.warn('Supabase create B2B franchise error:', err); }
    }
  },

  async createB2BOrder(newOrder) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('b2b_orders').insert([{
          id: newOrder.id,
          franchise_id: newOrder.franchiseId,
          customer_name: newOrder.customer,
          item_details: newOrder.item,
          revenue_amount: newOrder.amount,
          status: newOrder.status
        }]);
      } catch (err) { console.warn('Supabase create B2B order error:', err); }
    }
  },

  async updateB2BOrderStatus(orderId, newStatus) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('b2b_orders').update({ status: newStatus }).eq('id', orderId);
      } catch (err) { console.warn('Supabase update B2B order error:', err); }
    }
  },

  // --- B2C Retail Store Data Operations ---
  async fetchB2CFranchises(localData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('b2c_franchises').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (err) { console.warn('Supabase fetch B2C franchises error:', err); }
    }
    return localData;
  },

  async fetchB2COrders(localData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('b2c_orders').select('*');
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
      } catch (err) { console.warn('Supabase fetch B2C orders error:', err); }
    }
    return localData;
  },

  async createB2CFranchise(newFranchise) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('b2c_franchises').insert([{
          id: newFranchise.id,
          name: newFranchise.name,
          location: newFranchise.location,
          pin: newFranchise.pin,
          type: newFranchise.type
        }]);
      } catch (err) { console.warn('Supabase create B2C franchise error:', err); }
    }
  },

  async createB2COrder(newOrder) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('b2c_orders').insert([{
          id: newOrder.id,
          franchise_id: newOrder.franchiseId,
          customer_name: newOrder.customer,
          item_details: newOrder.item,
          revenue_amount: newOrder.amount,
          status: newOrder.status
        }]);
      } catch (err) { console.warn('Supabase create B2C order error:', err); }
    }
  },

  async updateB2COrderStatus(orderId, newStatus) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('b2c_orders').update({ status: newStatus }).eq('id', orderId);
      } catch (err) { console.warn('Supabase update B2C order error:', err); }
    }
  }
};
