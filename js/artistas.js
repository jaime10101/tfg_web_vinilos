/* ============================================================
   ARTISTAS.JS — Lógica de la página de artistas
   Header, footer y btn-subir los gestiona header.js
   ============================================================ */

/* ============================================================
   DATOS
   TODO (Spring Boot): GET /api/artistas
   ============================================================ */
const ARTISTS = [
    { id: 1,  name: "Arctic Monkeys",  genre: "rock",        albums: 7,  popularity: 95, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80" },
    { id: 2,  name: "Taylor Swift",    genre: "pop",         albums: 11, popularity: 99, image: "https://images.unsplash.com/photo-1598387846148-47e82ee120cc?w=400&q=80" },
    { id: 3,  name: "Tame Impala",     genre: "indie",       albums: 5,  popularity: 88, image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&q=80" },
    { id: 4,  name: "Daft Punk",       genre: "electronica", albums: 4,  popularity: 96, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80" },
    { id: 5,  name: "Lana Del Rey",    genre: "pop",         albums: 9,  popularity: 92, image: "https://images.unsplash.com/photo-1500099817043-86d46000d58f?w=400&q=80" },
    { id: 6,  name: "Kendrick Lamar",  genre: "hiphop",      albums: 6,  popularity: 97, image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80" },
    { id: 7,  name: "Radiohead",       genre: "rock",        albums: 9,  popularity: 94, image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80" },
    { id: 8,  name: "Dua Lipa",        genre: "pop",         albums: 3,  popularity: 93, image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&q=80" },
    { id: 9,  name: "The Weeknd",      genre: "pop",         albums: 6,  popularity: 96, image: "https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=400&q=80" },
    { id: 10, name: "Miles Davis",     genre: "jazz",        albums: 12, popularity: 91, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80" },
    { id: 11, name: "Olivia Rodrigo",  genre: "pop",         albums: 2,  popularity: 90, image: "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=400&q=80" },
    { id: 12, name: "Harry Styles",    genre: "pop",         albums: 3,  popularity: 91, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
    { id: 13, name: "Billie Eilish",   genre: "indie",       albums: 3,  popularity: 93, image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80" },
    { id: 14, name: "Bad Bunny",       genre: "latina",      albums: 6,  popularity: 97, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" },
    { id: 15, name: "Rosalía",         genre: "latina",      albums: 3,  popularity: 89, image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80" },
    { id: 16, name: "John Coltrane",   genre: "jazz",        albums: 10, popularity: 87, image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400&q=80" }
];

const GENRES = [
    { id: "rock",        name: "Rock",       icon: "fa-guitar",       color: "linear-gradient(135deg,#FF006E,#FF6B00)", count: 0 },
    { id: "pop",         name: "Pop",         icon: "fa-star",         color: "linear-gradient(135deg,#7B2FFF,#FF006E)", count: 0 },
    { id: "indie",       name: "Indie",       icon: "fa-record-vinyl", color: "linear-gradient(135deg,#00D4FF,#7B2FFF)", count: 0 },
    { id: "electronica", name: "Electrónica", icon: "fa-bolt",         color: "linear-gradient(135deg,#00FF94,#00D4FF)", count: 0 },
    { id: "jazz",        name: "Jazz",        icon: "fa-music",        color: "linear-gradient(135deg,#FFE600,#FF6B00)", count: 0 },
    { id: "latina",      name: "Latina",      icon: "fa-fire",         color: "linear-gradient(135deg,#FF6B00,#FF006E)", count: 0 }
];

const ITEMS_POR_CARGA = 8;

let state = {
    genre:       'all',
    sort:        'popularity',
    search:      '',
    itemsToShow: ITEMS_POR_CARGA
};

function getFiltered() {
    let result = ARTISTS.filter(a => {
        const matchGenre  = state.genre === 'all' || a.genre === state.genre;
        const matchSearch = a.name.toLowerCase().includes(state.search.toLowerCase());
        return matchGenre && matchSearch;
    });
    switch (state.sort) {
        case 'popularity': result.sort((a, b) => b.popularity - a.popularity); break;
        case 'name':       result.sort((a, b) => a.name.localeCompare(b.name)); break;
        case 'albums':     result.sort((a, b) => b.albums - a.albums); break;
    }
    return result;
}

function renderGrid() {
    const rejilla    = document.getElementById('rejilla');
    const contador   = document.getElementById('contadorArtistas');
    const sinRes     = document.getElementById('sinResultados');
    const zonaCargar = document.getElementById('zonaCargarMas');
    const filtered   = getFiltered();
    const visible    = filtered.slice(0, state.itemsToShow);

    contador.textContent = `${filtered.length} artista${filtered.length !== 1 ? 's' : ''}`;

    if (visible.length === 0) {
        rejilla.innerHTML        = '';
        sinRes.style.display     = 'block';
        zonaCargar.style.display = 'none';
        return;
    }

    sinRes.style.display = 'none';

    /* FIX: <div> en lugar de <a href="#"> — las tarjetas no son clicables */
    rejilla.innerHTML = visible.map((a, i) => `
        <div class="tarjeta-artista" style="animation-delay:${i * 0.04}s" data-id="${a.id}">
            <div class="imagen-artista">
                <img src="${a.image}" alt="${a.name}" loading="lazy" onerror="this.style.display='none'">
                <div class="overlay-play">
                    <i class="fa-solid fa-record-vinyl"></i>
                </div>
            </div>
            <div class="nombre-artista">${a.name}</div>
            <div class="meta-artista">
                <span class="tag-genero">${a.genre}</span>
            </div>
            <div class="barra-pop">
                <div class="fill-pop" style="width:${a.popularity}%"></div>
            </div>
        </div>
    `).join('');

    const quedan = filtered.length - state.itemsToShow;
    const btn    = document.getElementById('btnCargarMas');
    if (quedan <= 0) {
        zonaCargar.style.display = 'none';
    } else {
        zonaCargar.style.display = 'block';
        btn.innerHTML = `Ver más artistas (${quedan} restantes) <i class="fas fa-chevron-down"></i>`;
        btn.disabled  = false;
    }
}

function renderGeneros() {
    GENRES.forEach(g => { g.count = ARTISTS.filter(a => a.genre === g.id).length; });

    const grid = document.getElementById('gridGeneros');
    if (!grid) return;

    grid.innerHTML = GENRES.map(g => `
        <div class="tarjeta-genero" style="--color-genero:${g.color}" data-genre="${g.id}">
            <div class="genero-linea" style="background:${g.color}"></div>
            <i class="fa-solid ${g.icon} genero-icono-fa" style="--color-genero:${g.color}"></i>
            <div class="genero-nombre">${g.name}</div>
            <div class="genero-count">${g.count} artistas</div>
        </div>
    `).join('');

    grid.querySelectorAll('.tarjeta-genero').forEach(card => {
        card.addEventListener('click', () => {
            state.genre       = card.dataset.genre;
            state.itemsToShow = ITEMS_POR_CARGA;
            document.querySelectorAll('.btn-genero').forEach(b => {
                b.classList.toggle('activo', b.dataset.genre === state.genre);
            });
            renderGrid();
            document.querySelector('.seccion-explorar').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderGrid();
    renderGeneros();

    document.getElementById('campoBusqueda').addEventListener('input', function () {
        state.search      = this.value.trim();
        state.itemsToShow = ITEMS_POR_CARGA;
        renderGrid();
    });

    document.querySelectorAll('.btn-genero').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.btn-genero').forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');
            state.genre       = this.dataset.genre;
            state.itemsToShow = ITEMS_POR_CARGA;
            renderGrid();
        });
    });

    document.getElementById('selectOrden').addEventListener('change', function () {
        state.sort = this.value;
        renderGrid();
    });

    document.getElementById('btnCargarMas').addEventListener('click', function () {
        state.itemsToShow += ITEMS_POR_CARGA;
        this.innerHTML     = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
        this.disabled      = true;
        setTimeout(renderGrid, 400);
    });
});