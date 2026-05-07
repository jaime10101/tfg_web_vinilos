
/* ============================================================
   DATOS DE VINILOS
   TODO (Spring Boot): GET /api/productos?categoria=vinilo
   ============================================================ */
const VINYLS = [
    { id: 1,  name: "AM",                        artist: "Arctic Monkeys",    price: 25, genre: "indie",       format: "LP",    year: 2013, badge: "restock",   popularity: 95, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80" },
    { id: 2,  name: "Currents",                  artist: "Tame Impala",       price: 29, genre: "indie",       format: "LP",    year: 2015, badge: null,        popularity: 90, image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=600&q=80" },
    { id: 3,  name: "Random Access Memories",    artist: "Daft Punk",         price: 32, genre: "electronica", format: "Doble", year: 2013, badge: "limitado",  popularity: 98, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80" },
    { id: 4,  name: "Born to Die",               artist: "Lana Del Rey",      price: 28, genre: "pop",         format: "LP",    year: 2012, badge: null,        popularity: 88, image: "https://images.unsplash.com/photo-1500099817043-86d46000d58f?w=600&q=80" },
    { id: 5,  name: "After Hours",               artist: "The Weeknd",        price: 35, genre: "pop",         format: "LP",    year: 2020, badge: "limitado",  popularity: 97, image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80" },
    { id: 6,  name: "Future Nostalgia",          artist: "Dua Lipa",          price: 27, genre: "pop",         format: "LP",    year: 2020, badge: "restock",   popularity: 92, image: "https://images.unsplash.com/photo-1598387846148-47e82ee120cc?w=600&q=80" },
    { id: 7,  name: "Fine Line",                 artist: "Harry Styles",      price: 29, genre: "pop",         format: "Doble", year: 2019, badge: null,        popularity: 91, image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&q=80" },
    { id: 8,  name: "1989",                      artist: "Taylor Swift",      price: 38, genre: "pop",         format: "LP",    year: 2014, badge: "restock",   popularity: 96, image: "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=600&q=80" },
    { id: 9,  name: "Tranquility Base",          artist: "Arctic Monkeys",    price: 33, genre: "rock",        format: "LP",    year: 2018, badge: null,        popularity: 85, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
    { id: 10, name: "In Rainbows",               artist: "Radiohead",         price: 45, genre: "indie",       format: "Doble", year: 2007, badge: null,        popularity: 94, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80" },
    { id: 11, name: "Kind of Blue",              artist: "Miles Davis",       price: 38, genre: "jazz",        format: "LP",    year: 1959, badge: null,        popularity: 93, image: "https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=600&q=80" },
    { id: 12, name: "Homework",                  artist: "Daft Punk",         price: 36, genre: "electronica", format: "Doble", year: 1997, badge: null,        popularity: 89, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80" },
    { id: 13, name: "To Pimp a Butterfly",       artist: "Kendrick Lamar",    price: 42, genre: "hiphop",      format: "Doble", year: 2015, badge: "limitado",  popularity: 99, image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80" },
    { id: 14, name: "Illmatic",                  artist: "Nas",               price: 31, genre: "hiphop",      format: "LP",    year: 1994, badge: null,        popularity: 96, image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&q=80" },
    { id: 15, name: "Motomami",                  artist: "Rosalía",           price: 40, genre: "pop",         format: "LP",    year: 2022, badge: "nuevo",     popularity: 94, image: "https://images.unsplash.com/photo-1602020919491-6b7696a96ee5?w=600&q=80" },
    { id: 16, name: "Un Verano Sin Ti",          artist: "Bad Bunny",         price: 38, genre: "latina",      format: "Doble", year: 2022, badge: "nuevo",     popularity: 97, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80" },
    { id: 17, name: "Blonde",                    artist: "Frank Ocean",       price: 48, genre: "pop",         format: "Doble", year: 2016, badge: "limitado",  popularity: 98, image: "https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=600&q=80" },
    { id: 18, name: "The Dark Side of the Moon", artist: "Pink Floyd",        price: 44, genre: "rock",        format: "LP",    year: 1973, badge: null,        popularity: 99, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80" },
    { id: 19, name: "Nevermind",                 artist: "Nirvana",           price: 30, genre: "rock",        format: "LP",    year: 1991, badge: null,        popularity: 97, image: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=600&q=80" },
    { id: 20, name: "Abbey Road",                artist: "The Beatles",       price: 35, genre: "rock",        format: "LP",    year: 1969, badge: null,        popularity: 99, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80" },
    { id: 21, name: "Selected Ambient Works",    artist: "Aphex Twin",        price: 42, genre: "electronica", format: "Doble", year: 1992, badge: "pre-orden", popularity: 86, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
    { id: 22, name: "Midnights",                 artist: "Taylor Swift",      price: 36, genre: "pop",         format: "Color", year: 2022, badge: "nuevo",     popularity: 95, image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80" },
    { id: 23, name: "Pedrá",                     artist: "Extremoduro",       price: 26, genre: "rock",        format: "LP",    year: 1993, badge: "limitado",  popularity: 82, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80" },
    { id: 24, name: "El Madrileño",              artist: "C. Tangana",        price: 34, genre: "latina",      format: "LP",    year: 2021, badge: "nuevo",     popularity: 90, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80" },
];

const POR_PAGINA = 12;

/* Estado global de filtros y vista */
let state = {
    genero:      'todos',
    formatos:    [],
    epocas:      [],
    maxPrecio:   100,
    busqueda:    '',
    orden:       'recientes',
    soloNuevos:  false,
    soloLimit:   false,
    soloRestock: false,
    vista:       'rejilla',
    pagina:      POR_PAGINA
};

let filtrados = [];


/* Lee parámetro ?artista= de la URL — viene desde artistas.html */
function aplicarParamsURL() {
    const params  = new URLSearchParams(window.location.search);
    const artista = params.get('artista');

    if (artista) {
        const campo = document.getElementById('campoBusqueda');
        if (campo) {
            campo.value    = artista;
            state.busqueda = artista.toLowerCase().trim();
        }
        state.genero = 'todos';
        document.querySelectorAll('.btn-genero').forEach(b => b.classList.remove('activo'));
        document.querySelector('[data-genero="todos"]')?.classList.add('activo');
    }
}


/* ============================================================
   FILTRAR Y ORDENAR — devuelve el array filtrado y ordenado
   ============================================================ */
function getFiltered() {
    let result = [...VINYLS];

    /* Filtro por género */
    if (state.genero !== 'todos') result = result.filter(v => v.genre === state.genero);

    /* Filtro por formato */
    if (state.formatos.length > 0) result = result.filter(v => state.formatos.includes(v.format));

    /* Filtro por precio máximo */
    result = result.filter(v => v.price <= state.maxPrecio);

    /* Filtro por búsqueda de texto */
    if (state.busqueda) result = result.filter(v =>
        v.name.toLowerCase().includes(state.busqueda) ||
        v.artist.toLowerCase().includes(state.busqueda)
    );

    /* Filtros especiales — badges */
    if (state.soloNuevos)  result = result.filter(v => v.badge === 'nuevo');
    if (state.soloLimit)   result = result.filter(v => v.badge === 'limitado');
    if (state.soloRestock) result = result.filter(v => v.badge === 'restock');

    /* Filtro por época */
    if (state.epocas.length > 0) {
        result = result.filter(v => state.epocas.some(ep => {
            if (ep === 'nuevo')   return v.year >= 2020;
            if (ep === '2010')    return v.year >= 2010 && v.year < 2020;
            if (ep === '2000')    return v.year >= 2000 && v.year < 2010;
            if (ep === '90')      return v.year >= 1990 && v.year < 2000;
            if (ep === '80')      return v.year >= 1980 && v.year < 1990;
            if (ep === 'clasico') return v.year < 1980;
            return true;
        }));
    }

    /* Ordenación */
    switch (state.orden) {
        case 'precio-asc':  result.sort((a, b) => a.price - b.price); break;
        case 'precio-desc': result.sort((a, b) => b.price - a.price); break;
        case 'nombre':      result.sort((a, b) => a.name.localeCompare(b.name)); break;
        case 'popularidad': result.sort((a, b) => b.popularity - a.popularity); break;
        default:            result.sort((a, b) => b.id - a.id);
    }

    return result;
}


/* ============================================================
   RENDERIZAR REJILLA — pinta las tarjetas de vinilos
   ============================================================ */
function renderGrid() {
    const rejilla    = document.getElementById('rejillaVinilos');
    const sinResult  = document.getElementById('sinResultados');
    const zonaCargar = document.getElementById('zonaCargarMas');
    const contador   = document.getElementById('contadorResultados');

    const visibles = filtrados.slice(0, state.pagina);
    contador.innerHTML = `Mostrando <strong>${visibles.length}</strong> de <strong>${filtrados.length}</strong> vinilos`;

    /* Sin resultados */
    if (filtrados.length === 0) {
        rejilla.innerHTML = '';
        sinResult.style.display  = 'block';
        zonaCargar.style.display = 'none';
        return;
    }

    sinResult.style.display = 'none';
    rejilla.className = state.vista === 'lista' ? 'rejilla-vinilos vista-lista' : 'rejilla-vinilos';

    /* Etiquetas de badge por tipo */
    const etiquetasBadge = {
        nuevo:       'NUEVO',
        limitado:    'LIMITADO',
        restock:     'RESTOCK',
        'pre-orden': 'PRE-ORDEN'
    };

    rejilla.innerHTML = visibles.map((v, i) => {
        const badgeHTML = v.badge
            ? `<span class="insignia-vinilo ${v.badge}">${etiquetasBadge[v.badge]}</span>`
            : '';

        return `
        <div class="tarjeta-vinilo" data-id="${v.id}" style="animation-delay:${i * 0.04}s">
            <div class="portada-vinilo">
                ${badgeHTML}
                <img src="${v.image}" alt="${v.name}" loading="lazy" onerror="this.style.display='none'">
                <div class="overlay-vinilo">
                    <button class="btn-carrito-overlay" data-id="${v.id}" title="Añadir al carrito">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                </div>
            </div>
            <div class="info-vinilo">
                <div class="nombre-vinilo">${v.name}</div>
                <div class="artista-vinilo">${v.artist}</div>
                <div class="pie-vinilo">
                    <span class="etiqueta-formato">${v.format}</span>
                    <span class="precio-vinilo">€${v.price.toFixed(2)}</span>
                </div>
            </div>
        </div>`;
    }).join('');

    /* Evento — botón añadir al carrito */
    rejilla.querySelectorAll('.btn-carrito-overlay').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const vinilo = VINYLS.find(v => v.id === parseInt(btn.dataset.id));
            if (!vinilo) return;
            if (typeof Carrito !== 'undefined') {
                Carrito.agregar({
                    id:     vinilo.id,
                    nombre: vinilo.name,
                    precio: `€${vinilo.price.toFixed(2)}`,
                    tipo:   'vinilo',
                    imagen: vinilo.image
                });
            }
            mostrarToastTienda(`"${vinilo.name}" añadido al carrito`);
        });
    });

    /* Mostrar / ocultar botón cargar más */
    zonaCargar.style.display = filtrados.length > state.pagina ? 'block' : 'none';
}


/* ============================================================
   ETIQUETAS DE FILTROS ACTIVOS — chips clicables para quitar filtros
   ============================================================ */
function renderFiltrosActivos() {
    const zona = document.getElementById('filtrosActivos');
    const tags = [];

    if (state.genero !== 'todos') tags.push({ label: `Género: ${state.genero}`, tipo: 'genero' });
    if (state.soloNuevos)         tags.push({ label: 'Solo nuevos',    tipo: 'soloNuevos' });
    if (state.soloLimit)          tags.push({ label: 'Solo limitados', tipo: 'soloLimit' });
    if (state.soloRestock)        tags.push({ label: 'Solo restock',   tipo: 'soloRestock' });
    if (state.maxPrecio < 100)    tags.push({ label: `Hasta €${state.maxPrecio}`, tipo: 'precio' });
    if (state.busqueda)           tags.push({ label: `"${state.busqueda}"`, tipo: 'busqueda' });

    zona.innerHTML = tags.map(t => `
        <span class="etiqueta-activa" data-tipo="${t.tipo}">
            ${t.label} <i class="fa-solid fa-times"></i>
        </span>
    `).join('');

    /* Evento — quitar filtro al hacer clic en la etiqueta */
    zona.querySelectorAll('.etiqueta-activa').forEach(tag => {
        tag.addEventListener('click', () => {
            const tipo = tag.dataset.tipo;
            if (tipo === 'genero')      { state.genero = 'todos'; document.querySelectorAll('.btn-genero').forEach(b => b.classList.remove('activo')); document.querySelector('[data-genero="todos"]').classList.add('activo'); }
            if (tipo === 'soloNuevos')  { state.soloNuevos  = false; document.getElementById('soloNuevos').checked    = false; }
            if (tipo === 'soloLimit')   { state.soloLimit   = false; document.getElementById('soloLimitados').checked = false; }
            if (tipo === 'soloRestock') { state.soloRestock = false; document.getElementById('soloRestock').checked   = false; }
            if (tipo === 'precio')      { state.maxPrecio = 100; document.getElementById('sliderPrecio').value = 100; document.getElementById('valorPrecio').textContent = '100€+'; }
            if (tipo === 'busqueda')    { state.busqueda = ''; const campo = document.getElementById('campoBusqueda'); if (campo) campo.value = ''; }
            update();
        });
    });
}


/* Toast — notificación de producto añadido al carrito */
function mostrarToastTienda(msg) {
    let toast = document.getElementById('toastTienda');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastTienda';
        toast.style.cssText = `
            position:fixed; bottom:30px; right:30px;
            background:#12103A; border:1px solid #FF006E;
            color:#F0EBFF; font-size:13px; padding:13px 20px;
            border-radius:12px; display:flex; align-items:center;
            gap:10px; z-index:1000; opacity:0;
            transform:translateY(16px); transition:all 0.3s ease;
            pointer-events:none; font-family:inherit;
        `;
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-record-vinyl" style="color:#FF006E"></i> ${msg}`;
    toast.style.opacity   = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
        toast.style.opacity   = '0';
        toast.style.transform = 'translateY(16px)';
    }, 2600);
}


/* Aplica filtros, renderiza rejilla y etiquetas activas */
function update() {
    filtrados = getFiltered();
    renderGrid();
    renderFiltrosActivos();
}


/* ============================================================
   EVENTOS E INICIALIZACIÓN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    aplicarParamsURL();

    /* Filtro — género */
    document.getElementById('listaGeneros').addEventListener('click', e => {
        const btn = e.target.closest('.btn-genero');
        if (!btn) return;
        document.querySelectorAll('.btn-genero').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        state.genero = btn.dataset.genero;
        state.pagina = POR_PAGINA;
        update();
    });

    /* Filtro — búsqueda de texto */
    document.getElementById('campoBusqueda').addEventListener('input', function () {
        state.busqueda = this.value.toLowerCase().trim();
        state.pagina   = POR_PAGINA;
        update();
    });

    /* Filtro — orden */
    document.getElementById('selectorOrden').addEventListener('change', function () {
        state.orden = this.value;
        update();
    });

    /* Filtro — precio máximo */
    document.getElementById('sliderPrecio').addEventListener('input', function () {
        state.maxPrecio = parseInt(this.value);
        document.getElementById('valorPrecio').textContent = `${state.maxPrecio}€${state.maxPrecio >= 100 ? '+' : ''}`;
        state.pagina = POR_PAGINA;
        update();
    });

    /* Filtro — formato */
    document.querySelectorAll('[data-formato]').forEach(cb => {
        cb.addEventListener('change', function () {
            const fmt    = this.dataset.formato;
            state.formatos = this.checked
                ? [...state.formatos, fmt]
                : state.formatos.filter(f => f !== fmt);
            state.pagina = POR_PAGINA;
            update();
        });
    });

    /* Filtro — época */
    document.querySelectorAll('[data-epoca]').forEach(cb => {
        cb.addEventListener('change', function () {
            const ep     = this.dataset.epoca;
            state.epocas = this.checked
                ? [...state.epocas, ep]
                : state.epocas.filter(e => e !== ep);
            state.pagina = POR_PAGINA;
            update();
        });
    });

    /* Filtros — toggles especiales */
    document.getElementById('soloNuevos').addEventListener('change',    function () { state.soloNuevos  = this.checked; state.pagina = POR_PAGINA; update(); });
    document.getElementById('soloLimitados').addEventListener('change', function () { state.soloLimit   = this.checked; state.pagina = POR_PAGINA; update(); });
    document.getElementById('soloRestock').addEventListener('change',   function () { state.soloRestock = this.checked; state.pagina = POR_PAGINA; update(); });

    /* Vista — rejilla */
    document.getElementById('vistaRejilla').addEventListener('click', () => {
        state.vista = 'rejilla';
        document.getElementById('vistaRejilla').classList.add('activo');
        document.getElementById('vistaLista').classList.remove('activo');
        renderGrid();
    });

    /* Vista — lista */
    document.getElementById('vistaLista').addEventListener('click', () => {
        state.vista = 'lista';
        document.getElementById('vistaLista').classList.add('activo');
        document.getElementById('vistaRejilla').classList.remove('activo');
        renderGrid();
    });

    /* Botón cargar más */
    document.getElementById('btnCargarMas').addEventListener('click', function () {
        state.pagina    += POR_PAGINA;
        this.innerHTML   = '<i class="fa-solid fa-spinner fa-spin"></i> Cargando...';
        this.disabled    = true;
        setTimeout(() => {
            renderGrid();
            this.innerHTML = '<i class="fa-solid fa-chevron-down"></i> Cargar más vinilos';
            this.disabled  = false;
        }, 400);
    });

    /* Newsletter — validar email y suscribir */
    document.getElementById('btnSuscribirBanner').addEventListener('click', () => {
        const input = document.getElementById('emailBanner');
        if (input.value && input.value.includes('@')) {
            mostrarToastTienda('¡Suscripción confirmada!');
            input.value = '';
        } else {
            input.style.borderColor = '#FF006E';
            setTimeout(() => input.style.borderColor = '', 1500);
        }
    });

    update();
});

/* Delegación de clic — tarjeta vinilo → página de detalle */
document.addEventListener('DOMContentLoaded', () => {
    const rejilla = document.getElementById('rejillaVinilos');
    if (!rejilla) return;
    rejilla.addEventListener('click', (e) => {
        if (e.target.closest('.btn-carrito-overlay')) return;
        const card = e.target.closest('.tarjeta-vinilo');
        if (!card) return;
        window.location.href = `detalle/detalle_vinilo.html?id=${card.dataset.id}`;
    });
});