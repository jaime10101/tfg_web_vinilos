/* ============================================================
   MERCH.JS — Lógica de la tienda de merchandising
   Header, footer y btn-subir los gestiona header.js
   ============================================================ */


/* ============================================================
   DATOS
   TODO (Spring Boot): GET /api/productos?categoria=merch
   ============================================================ */
const PRODUCTS = [
    { id: 1,  name: "Camiseta The Car Tour",      artist: "Arctic Monkeys",  price: 35, oldPrice: null, badge: "new",      category: "shirts",      filter: "new",     image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80" },
    { id: 2,  name: "Sudadera Motomami",           artist: "Rosalía",         price: 65, oldPrice: null, badge: null,       category: "hoodies",     filter: "all",     image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80" },
    { id: 3,  name: "Tote Bag Dawn FM",            artist: "The Weeknd",      price: 12, oldPrice: 20,   badge: "discount", category: "accessories", filter: "all",     image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80" },
    { id: 4,  name: "Eras Tour T-Shirt Black",     artist: "Taylor Swift",    price: 45, oldPrice: null, badge: null,       category: "shirts",      filter: "tour",    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80" },
    { id: 5,  name: "Set de Pines Coleccionables", artist: "Varios Artistas", price: 15, oldPrice: null, badge: null,       category: "accessories", filter: "limited", image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600&q=80" },
    { id: 6,  name: "Taza Un Verano Sin Ti",       artist: "Bad Bunny",       price: 18, oldPrice: null, badge: null,       category: "accessories", filter: "all",     image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80" },
    { id: 7,  name: "Poster Edición Limitada",     artist: "Arctic Monkeys",  price: 25, oldPrice: null, badge: null,       category: "posters",     filter: "limited", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80" },
    { id: 8,  name: "Gorra Tour 2024",             artist: "Rosalía",         price: 30, oldPrice: null, badge: null,       category: "accessories", filter: "tour",    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80" },
    { id: 9,  name: "Vinilo Motomami",             artist: "Rosalía",         price: 40, oldPrice: null, badge: "new",      category: "accessories", filter: "new",     image: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=600&q=80" },
    { id: 10, name: "Hoodie Eras Tour",            artist: "Taylor Swift",    price: 70, oldPrice: null, badge: null,       category: "hoodies",     filter: "tour",    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&q=80" },
    { id: 11, name: "Camiseta Bad Bunny",          artist: "Bad Bunny",       price: 38, oldPrice: null, badge: "new",      category: "shirts",      filter: "new",     image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&q=80" },
    { id: 12, name: "Poster The Weeknd",           artist: "The Weeknd",      price: 20, oldPrice: null, badge: null,       category: "posters",     filter: "limited", image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&q=80" },
    { id: 13, name: "Sudadera Arctic Monkeys",     artist: "Arctic Monkeys",  price: 68, oldPrice: null, badge: null,       category: "hoodies",     filter: "all",     image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80" },
    { id: 14, name: "Camiseta Tour Rosalía",       artist: "Rosalía",         price: 42, oldPrice: null, badge: null,       category: "shirts",      filter: "tour",    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
    { id: 15, name: "Gorra Bad Bunny",             artist: "Bad Bunny",       price: 28, oldPrice: null, badge: "new",      category: "accessories", filter: "new",     image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&q=80" },
    { id: 16, name: "Poster Taylor Swift",         artist: "Taylor Swift",    price: 22, oldPrice: null, badge: null,       category: "posters",     filter: "limited", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80" },
    { id: 17, name: "Tote Bag Arctic",             artist: "Arctic Monkeys",  price: 16, oldPrice: null, badge: null,       category: "accessories", filter: "all",     image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80" },
    { id: 18, name: "Vinilo The Weeknd",           artist: "The Weeknd",      price: 45, oldPrice: null, badge: "new",      category: "accessories", filter: "new",     image: "https://images.unsplash.com/photo-1500099817043-86d46000d58f?w=600&q=80" },
    { id: 20, name: "Eras Tour Hoodie",            artist: "Taylor Swift",    price: 65, oldPrice: null, badge: "new",      category: "hoodies",     filter: "new",     image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&q=80" },
    { id: 21, name: "Folklore Cardigan",           artist: "Taylor Swift",    price: 75, oldPrice: null, badge: null,       category: "hoodies",     filter: "all",     image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80" },
    { id: 22, name: "Blinding Lights Tee",         artist: "The Weeknd",      price: 40, oldPrice: null, badge: "new",      category: "shirts",      filter: "new",     image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
    { id: 23, name: "Starboy Hoodie",              artist: "The Weeknd",      price: 70, oldPrice: null, badge: null,       category: "hoodies",     filter: "all",     image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80" }
];

const ITEMS_POR_PAGINA = 6;

/* Estado global de filtros y paginación */
let state = {
    tab:        'all',
    categories: [],
    artists:    [],
    maxPrice:   100,
    query:      '',
    sort:       'popular',
    page:       1
};

let productosFiltrados = [];


/* Toggle panel de filtros en móvil */
document.addEventListener('DOMContentLoaded', () => {
    const btnToggle    = document.getElementById('btnToggleFiltros');
    const panelFiltros = document.getElementById('panelFiltros');
    if (btnToggle && panelFiltros) {
        btnToggle.addEventListener('click', () => {
            panelFiltros.classList.toggle('abierto');
            btnToggle.classList.toggle('activo');
            /* Cambia texto del botón según estado */
            btnToggle.innerHTML = panelFiltros.classList.contains('abierto')
                ? '<i class="fas fa-times"></i> Cerrar filtros'
                : '<i class="fas fa-sliders-h"></i> Filtros';
        });
    }
});


/* Filtra y ordena el array PRODUCTS según el estado */
function getFiltered() {
    let result = [...PRODUCTS];

    /* Filtros activos */
    if (state.tab !== 'all') result = result.filter(p => p.filter === state.tab);
    if (state.categories.length > 0 && !state.categories.includes('all')) {
        result = result.filter(p => state.categories.includes(p.category));
    }
    if (state.artists.length > 0)  result = result.filter(p => state.artists.includes(p.artist));
    result = result.filter(p => p.price <= state.maxPrice);
    if (state.query) result = result.filter(p =>
        p.name.toLowerCase().includes(state.query) ||
        p.artist.toLowerCase().includes(state.query)
    );

    /* Ordenación */
    if (state.sort === 'price-low')  result.sort((a, b) => a.price - b.price);
    if (state.sort === 'price-high') result.sort((a, b) => b.price - a.price);

    return result;
}


/* Pinta las tarjetas de productos en la rejilla */
function renderGrid(items) {
    const grid = document.getElementById('rejillaProductos');

    /* Sin resultados */
    if (items.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--apagado);">
            <p style="font-size:18px;">No se encontraron productos</p>
        </div>`;
        return;
    }

    grid.innerHTML = items.map(p => {
        /* Porcentaje de descuento si hay precio anterior */
        const descuentoPct = p.oldPrice
            ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
            : null;

        /* Badge — nuevo o descuento */
        const badgeHTML = p.badge === 'new'
            ? `<span class="insignia-producto nuevo">NUEVO</span>`
            : p.badge === 'discount'
                ? `<span class="insignia-producto descuento">-${descuentoPct}%</span>`
                : '';

        /* Destino según categoría */
        const destino = p.category === 'posters'
            ? `detalle/detalle.html?id=${p.id}`
            : `detalle/detalle_merch.html?id=${p.id}`;

        return `
        <div class="tarjeta-producto" data-id="${p.id}" data-category="${p.category}">
            <div class="imagen-producto">
                ${badgeHTML}
                <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">
                <!-- Capa hover con botón ver detalle -->
                <div class="capa-carrito">
                    <a href="${destino}" class="btn-anadir-carrito">
                        <i class="fas fa-eye"></i> Ver detalle
                    </a>
                </div>
            </div>
            <div class="info-producto">
                <div class="artista-producto">${p.artist}</div>
                <div class="nombre-producto">${p.name}</div>
                <div class="precios-producto">
                    <span class="precio-actual">${p.price},00 €</span>
                    ${p.oldPrice ? `<span class="precio-antes">${p.oldPrice},00 €</span>` : ''}
                </div>
            </div>
        </div>`;
    }).join('');

    /* Clic en tarjeta — navega al detalle correspondiente */
    grid.querySelectorAll('.tarjeta-producto').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('.btn-anadir-carrito')) return;
            const id  = card.dataset.id;
            const cat = card.dataset.category;
            window.location.href = cat === 'posters'
                ? `detalle/detalle.html?id=${id}`
                : `detalle/detalle_merch.html?id=${id}`;
        });
    });
}


/* Genera los botones de paginación */
function renderPagination(total) {
    const totalPaginas = Math.ceil(total / ITEMS_POR_PAGINA);
    const container    = document.getElementById('paginacion');

    if (totalPaginas <= 1) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';
    let html = `<button class="btn-pagina" id="btnAnterior" ${state.page === 1 ? 'disabled' : ''}>‹</button>`;

    for (let i = 1; i <= totalPaginas; i++) {
        html += `<button class="btn-pagina ${i === state.page ? 'activa' : ''}" data-page="${i}">${i}</button>`;
    }

    html += `<button class="btn-pagina" id="btnSiguiente" ${state.page === totalPaginas ? 'disabled' : ''}>›</button>`;
    container.innerHTML = html;

    /* Eventos de paginación */
    document.getElementById('btnAnterior').addEventListener('click', () => {
        if (state.page > 1) { state.page--; update(); }
    });
    document.getElementById('btnSiguiente').addEventListener('click', () => {
        if (state.page < totalPaginas) { state.page++; update(); }
    });
    container.querySelectorAll('.btn-pagina[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            state.page = parseInt(btn.dataset.page);
            update();
        });
    });
}


/* Aplica filtros, renderiza rejilla y paginación */
function update() {
    productosFiltrados = getFiltered();
    const inicio = (state.page - 1) * ITEMS_POR_PAGINA;
    renderGrid(productosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA));
    renderPagination(productosFiltrados.length);
}


/* Eventos e inicialización */
document.addEventListener('DOMContentLoaded', () => {

    /* Pestañas de filtro rápido */
    document.querySelectorAll('.pestaña').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.pestaña').forEach(t => t.classList.remove('activa'));
            tab.classList.add('activa');
            state.tab  = tab.dataset.filter;
            state.page = 1;
            update();
        });
    });

    /* Checkbox "Ver Todo" — desactiva el resto */
    document.getElementById('cat-all').addEventListener('change', function () {
        if (this.checked) {
            document.querySelectorAll('[id^="cat-"]:not(#cat-all)').forEach(cb => cb.checked = false);
            state.categories = [];
        }
        state.page = 1;
        update();
    });

    /* Checkboxes de categoría individual */
    document.querySelectorAll('[id^="cat-"]:not(#cat-all)').forEach(cb => {
        cb.addEventListener('change', function () {
            const cat = this.id.replace('cat-', '');
            if (this.checked) {
                document.getElementById('cat-all').checked = false;
                state.categories.push(cat);
            } else {
                state.categories = state.categories.filter(c => c !== cat);
                if (state.categories.length === 0) document.getElementById('cat-all').checked = true;
            }
            state.page = 1;
            update();
        });
    });

    /* Checkboxes de artista */
    const mapaArtistas = {
        'art-rosalia': 'Rosalía',
        'art-arctic':  'Arctic Monkeys',
        'art-taylor':  'Taylor Swift',
        'art-bad':     'Bad Bunny',
        'art-weeknd':  'The Weeknd'
    };

    document.querySelectorAll('[id^="art-"]').forEach(cb => {
        cb.addEventListener('change', function () {
            const artista  = mapaArtistas[this.id];
            state.artists  = this.checked
                ? [...state.artists, artista]
                : state.artists.filter(a => a !== artista);
            state.page = 1;
            update();
        });
    });

    /* Slider de precio máximo */
    document.getElementById('sliderPrecio').addEventListener('input', function () {
        state.maxPrice = parseInt(this.value);
        document.getElementById('precioMax').textContent =
            `${state.maxPrice}€${state.maxPrice >= 100 ? '+' : ''}`;
        state.page = 1;
        update();
    });

    /* Selector de orden */
    document.getElementById('selectorOrden').addEventListener('change', function () {
        state.sort = this.value;
        state.page = 1;
        update();
    });

    /* Búsqueda por texto */
    document.getElementById('campoBusqueda').addEventListener('input', function () {
        state.query = this.value.toLowerCase();
        state.page  = 1;
        update();
    });

    update();
});