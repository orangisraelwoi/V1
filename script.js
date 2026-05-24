import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://fssmnyetjalplqsvxfbc.supabase.co'
const supabaseKey = 'Cki_HMCYssRML7ih1FKr8I4bDuj3QHX9Js8du8KfnvwvcgNGlAFL'
const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchProducts() {
    const { data: products, error } = await supabase.from('products').select('*')
    if (error) { console.error('Error:', error); return }

    const productList = document.getElementById('product-list')
    productList.innerHTML = ''

    products.forEach(product => {
        const card = document.createElement('div')
        card.className = 'card'
        card.innerHTML = `
            <img src="drip.jpeg" class="card-img" style="object-fit: cover;">
            <div class="card-body">
                <div class="card-title">${product.name}</div>
                <div class="card-price">Rp ${product.price.toLocaleString()}</div>
                <button class="btn-buy" onclick="createTransaction(${product.id})">Beli Sekarang</button>
            </div>
        `
        productList.appendChild(card)
    })
}

// Fungsi buat nambahin transaksi ke database
window.createTransaction = async (productId) => {
    const trxId = 'TRX-' + Date.now() // Bikin ID unik
    const { data, error } = await supabase
        .from('transactions')
        .insert([{ trx_id: trxId, product_id: productId, status: 'PENDING' }])

    if (error) {
        alert('Gagal buat pesanan: ' + error.message)
    } else {
        alert('Pesanan berhasil dibuat! ID: ' + trxId + '\nSilahkan chat admin untuk konfirmasi pembayaran.')
    }
}

fetchProducts()
