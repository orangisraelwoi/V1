import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Supabase & QRISpy ngambil dari Env Vercel biar rahasia
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const QRISPY_TOKEN = process.env.QRISPY_TOKEN;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Cuma bisa POST');
  
  const { product_id } = req.body;

  // 1. Cek Harga Produk
  const { data: product } = await supabase.from('products').select('*').eq('id', product_id).single();
  if (!product) return res.status(400).json({ error: 'Produk ga ketemu' });

  // 2. Cek apakah ada Key yang masih kosong (is_used = false)
  const { data: keyData } = await supabase.from('keys').select('*').eq('product_id', product_id).eq('is_used', false).limit(1).single();
  if (!keyData) return res.status(400).json({ error: 'Stok Key Habis, lapor admin!' });

  // 3. Tembak API QRISpy
  try {
    const qrisRes = await axios.post('https://api.qrispy.id/v1/create-qris', {
      amount: product.price,
      reference: `RZN-${Date.now()}`
    }, {
      headers: { 'Authorization': `Bearer ${QRISPY_TOKEN}` }
    });

    const trxId = qrisRes.data.transaction_id;
    const qrUrl = qrisRes.data.qr_url;

    // 4. Catat ke database transaksi (status masih PENDING)
    await supabase.from('transactions').insert([{ trx_id: trxId, product_id: product_id }]);

    res.json({ success: true, qr_url: qrUrl, trx_id: trxId });
  } catch (err) {
    res.status(500).json({ error: 'Gagal bikin QR' });
  }
}
