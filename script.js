// Data produk yang disesuaikan
const products = [
    {
        id: 1,
        name: "Drip Client 1 Hari",
        price: 15000,
        sold: "1.2k+ Terjual",
        rating: "4.7 (86)",
        badge: "ANDROID",
        imageUrl: "drip.jpg", 
        imageText: "DRIP"
    },
    {
        id: 2,
        name: "HG Cheat 1 Hari",
        price: 18000,
        sold: "219 Terjual",
        rating: "5.0 (8)",
        badge: "ANDROID",
        imageColor: "#ec4899", 
        imageText: "HG"
    }
];

// Fungsi untuk memformat angka jadi format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// Menampilkan produk ke HTML
const productList = document.getElementById('product-list');

products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    
    // LOGIKA UNTUK MENAMPILKAN GAMBAR ATAU KOTAK WARNA
    let imageHTML = '';
    if (product.imageUrl) {
        imageHTML = `<img src="${product.imageUrl}" alt="${product.name}" class="card-img" style="object-fit: cover;">`;
    } else {
        imageHTML = `<div class="card-img" style="background-color: ${product.imageColor}; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
            ${product.imageText}
        </div>`;
    }
    
    // Bikin card HTML-nya
    card.innerHTML = `
        ${imageHTML}
        <div class="card-body">
            <div class="card-title">${product.name}</div>
            <div class="card-stats">⭐ ${product.rating} • ${product.sold}</div>
            <div style="font-size: 11px; color: #9ca3af;">Mulai dari</div>
            <div class="card-price">${formatRupiah(product.price)}</div>
            <button class="btn-buy" onclick="alert('Lanjut ke pembayaran untuk ${product.name}?')">Beli Sekarang</button>
        </div>
    `;
    
    productList.appendChild(card);
});
