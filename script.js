import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://fssmnyetjalplqsvxfbc.supabase.co'
const supabaseKey = 'Cki_HMCYssRML7ih1FKr8I4bDuj3QHX9Js8du8KfnvwvcgNGlAFL'
const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchProducts() {
    const { data: products, error } = await supabase
        .from('products')
        .select('*')

    if (error) {
        console.error('Error:', error)
        return
    }

    const productList = document.getElementById('product-list')
    productList.innerHTML = '' // Kosongin dulu

    products.forEach(product => {
        const card = document.createElement('div')
        card.className = 'card'
        card.innerHTML = `
            <img src="drip.jpeg" class="card-img" style="object-fit: cover;">
            <div class="card-body">
                <div class="card-title">${product.name}</div>
                <div class="card-price">Rp ${product.price.toLocaleString()}</div>
                <button class="btn-buy" onclick="alert('Beli ${product.name}')">Beli Sekarang</button>
            </div>
        `
        productList.appendChild(card)
    })
}

fetchProducts()
