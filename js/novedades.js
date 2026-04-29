/* ============================================================
   NOVEDADES.JS — Lógica de la página de novedades
   ============================================================ */

/* ============================================================
   DATOS
   TODO (Supabase): reemplazar por:
     const { data } = await supabase.from('novedades').select('*').order('created_at', { ascending: false });
   ============================================================ */
const PRODUCTS = [
    { id: 1,  name: "AM",                    artist: "Arctic Monkeys", price: 25.00, badge: "Best Selling",    badgeType: "lanzamiento", format: "VINILO", category: "vinyl",  image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80" },
    { id: 20, name: "Eras Tour Hoodie",      artist: "Taylor Swift",   price: 65.00, badge: "Pre Order",       badgeType: "deluxe",      format: "MERCH",  category: "merch",  image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&q=80" },
    { id: 3,  name: "Currents (Poster A2)",  artist: "Tame Impala",    price: 15.00, badge: null,              badgeType: null,          format: "POSTER", category: "poster", image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=600&q=80" },
    { id: 4,  name: "Midnomani",             artist: "Lorde",          price: 30.00, badge: "Gold Pressing",   badgeType: "exclusivo",   format: "POSTER", category: "poster", image: "https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=600&q=80" },
    { id: 5,  name: "Random Access Memories",artist: "Daft Punk",      price: 32.00, badge: null,              badgeType: null,          format: "VINILO", category: "vinyl",  image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80" },
    { id: 6,  name: "Born to Die",           artist: "Lana Del Rey",   price: 28.00, badge: null,              badgeType: null,          format: "VINILO", category: "vinyl",  image: "https://images.unsplash.com/photo-1500099817043-86d46000d58f?w=600&q=80" },
    { id: 7,  name: "Future Nostalgia",      artist: "Dua Lipa",       price: 27.00, badge: "Restock",         badgeType: "deluxe",      format: "VINILO", category: "vinyl",  image: "https://images.unsplash.com/photo-1598387846148-47e82ee120cc?w=600&q=80" },
    { id: 8,  name: "Fine Line",             artist: "Harry Styles",   price: 29.00, badge: null,              badgeType: null,          format: "VINILO", category: "vinyl",  image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&q=80" },
    { id: 9,  name: "After Hours Vinyl",     artist: "The Weeknd",     price: 35.00, badge: "Limited Edition", badgeType: "exclusivo",   format: "VINILO", category: "vinyl",  image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80" },
    { id: 21, name: "Folklore Cardigan",     artist: "Taylor Swift",   price: 75.00, badge: null,              badgeType: null,          format: "MERCH",  category: "merch",  image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80" },
    { id: 11, name: "DAMN Poster",           artist: "Kendrick Lamar", price: 18.00, badge: null,              badgeType: null,          format: "POSTER", category: "poster", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80" },
    { id: 22, name: "Blinding Lights Tee",   artist: "The Weeknd",     price: 40.00, badge: "New Arrival",     badgeType: "lanzamiento", format: "MERCH",  category: "merch",  image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
    { id: 23, name: "Starboy Hoodie",        artist: "The Weeknd",     price: 70.00, badge: null,              badgeType: null,          format: "MERCH",  category: "merch",  image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80" },
    { id: 14, name: "1989 Vinyl",            artist: "Taylor Swift",   price: 38.00, badge: "Restock",         badgeType: "deluxe",      format: "VINILO", category: "vinyl",  image: "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=600&q=80" },
    { id: 15, name: "Sour Poster",           artist: "Olivia Rodrigo", price: 16.00, badge: null,              badgeType: null,          format: "POSTER", category: "poster", image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80" },
    { id: 16, name: "Tranquility Base",      artist: "Arctic Monkeys", price: 33.00, badge: null,              badgeType: null,          format: "VINILO", category: "vinyl",  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" }
];

const ITEMS_PER_LOAD = 6;

let state = { filter: 'all', sort: 'recent', itemsToShow: ITEMS_PER_LOAD };
let filteredProducts = [...PRODUCTS];

function getFiltered() {
    let result = state.filter === 'all' ? [...PRODUCTS] : PRODUCTS.filter(p => p.category === state.filter);
    switch (state.sort) {
        case 'recent':     result.sort((a, b) => b.id - a.id); break;
        case 'price-low':  result.sort((a, b) => a.price - b.price); break;
        case 'price-high': result.sort((a, b) => b.price - a.price); break;
        case 'name-asc':   result.sort((a, b) => a.name.localeCompare(b.name)); break;
        case 'name-desc':  result.sort((a, b) => b.name.localeCompare(a.name)); break;
    }
    return result;
}

function renderGrid() {
    const grid    = document.getElementById('rejillaProductos');
    const visible = filteredProducts.slice(0, state.itemsToShow);

    if (visible.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;"><p style="font-size:18px;color:var(--apagado);">No se encontraron productos</p></div>`;
        updateLoadMore();
        return;
    }

    grid.innerHTML = visible.map(p => {
        const badgeHTML = p.badge ? `<span class="insignia-producto ${p.badgeType}">${p.badge}</span>` : '';
        const destino   = p.category === 'poster' ? `detalle/detalle.html?id=${p.id}` :
                          p.category === 'merch'  ? `detalle/detalle_merch.html?id=${p.id}` :
                                                    `detalle/detalle_vinilo.html?id=${p.id}`;
        const imgHTML   = p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">` : `<div class="icono-placeholder"><i class="fas fa-music"></i></div>`;

        return `
        <div class="tarjeta-producto" data-id="${p.id}" data-category="${p.category}" style="cursor:pointer">
            <div class="imagen-producto">
                ${badgeHTML}
                ${imgHTML}
                <div class="capa-hover">
                    <a href="${destino}" class="btn-accion"><i class="fas fa-eye"></i> Ver detalle</a>
                </div>
            </div>
            <div class="info-producto">
                <div class="titulo-producto">${p.name}</div>
                <div class="artista-producto">${p.artist}</div>
                <div class="pie-producto">
                    <span class="etiqueta-formato">${p.format}</span>
                    <span class="precio-producto">€${p.price.toFixed(2)}</span>
                </div>
            </div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.tarjeta-producto').forEach(card => {
        card.addEventListener('click', () => {
            const id  = card.dataset.id;
            const cat = card.dataset.category;
            if (cat === 'poster')     window.location.href = `detalle/detalle.html?id=${id}`;
            else if (cat === 'merch') window.location.href = `detalle/detalle_merch.html?id=${id}`;
            else                      window.location.href = `detalle/detalle_vinilo.html?id=${id}`;
        });
    });

    updateLoadMore();
}

function updateLoadMore() {
    const zona = document.querySelector('.zona-cargar-mas');
    const btn  = document.getElementById('btnCargarMas');
    const quedan = filteredProducts.length - state.itemsToShow;
    if (quedan <= 0) { zona.style.display = 'none'; }
    else { zona.style.display = 'block'; btn.innerHTML = `Cargar Más Novedades (${quedan} restantes) <i class="fas fa-chevron-down"></i>`; }
}

function update() { filteredProducts = getFiltered(); renderGrid(); }

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.tagName === 'SELECT') return;
            document.querySelectorAll('.btn-filtro').forEach(b => { if (b.tagName !== 'SELECT') b.classList.remove('activo'); });
            this.classList.add('activo');
            const icon = this.querySelector('i');
            if (!icon)                              state.filter = 'all';
            else if (icon.className.includes('record-vinyl')) state.filter = 'vinyl';
            else if (icon.className.includes('tshirt'))       state.filter = 'merch';
            else if (icon.className.includes('image'))        state.filter = 'poster';
            state.itemsToShow = ITEMS_PER_LOAD;
            update();
        });
    });

    document.getElementById('selectorOrden').addEventListener('change', function () { state.sort = this.value; update(); });

    document.getElementById('btnCargarMas').addEventListener('click', function () {
        state.itemsToShow += ITEMS_PER_LOAD;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
        this.disabled  = true;
        setTimeout(() => { renderGrid(); this.disabled = false; }, 500);
    });

    document.getElementById('btnSuscribir').addEventListener('click', () => {
        const email = document.getElementById('inputEmail').value;
        if (email) { document.getElementById('inputEmail').value = ''; }
    });

    update();
});