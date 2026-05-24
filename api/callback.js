import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { trx_id, status } = req.body; // QRISpy ngirim data ini

  if (status === 'SUKSES') {
    // 1. Cek produk apa yang dibeli dari tabel transaksi
    const { data: trx } = await supabase.from('transactions').select('*').eq('trx_id', trx_id).single();
    
    // 2. Ambil 1 Key nganggur
    const { data: keyData } = await supabase.from('keys').select('*').eq('product_id', trx.product_id).eq('is_used', false).single();
    
    // 3. Ubah status transaksi jadi PAID dan masukin key-nya
    await supabase.from('transactions').update({ status: 'PAID', given_key: keyData.license_key }).eq('trx_id', trx_id);
    
    // 4. Tandain Key jadi TERPAKAI biar ga kejual 2x
    await supabase.from('keys').update({ is_used: true }).eq('id', keyData.id);

    return res.status(200).send('OK');
  }
  res.status(200).send('Ignored');
}
