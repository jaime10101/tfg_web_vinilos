/* ============================================================
   POSTERS.JS — Lógica de la página de posters
   ============================================================ */

/* ============================================================
   DATOS
   TODO (Supabase): reemplazar por:
     const { data } = await supabase.from('posters').select('*');
   ============================================================ */
const POSTERS = [
    { id: 1,  name: "Nirvana - Smiley Squares",   artist: "Nirvana",        price: 5.99,  oldPrice: null, style: "Album Art",    sizes: ["A1","A2","A3","50x70cm"], isNew: false, isSoldOut: false, img: "../img/post1.png" },
    { id: 2,  name: "Ramones - Poster Oficial",    artist: "Ramones",        price: 5.99,  oldPrice: null, style: "Album Art",    sizes: ["A1","A2","A3","50x70cm"], isNew: false, isSoldOut: false, img: "../img/post2.png" },
    { id: 3,  name: "Pink Floyd - The Wall",       artist: "Pink Floyd",     price: 5.99,  oldPrice: null, style: "Album Art",    sizes: ["A1","A2","A3","50x70cm"], isNew: false, isSoldOut: false, img: "../img/post3.png" },
    { id: 4,  name: "AC/DC - Black Ice",           artist: "AC/DC",          price: 5.99,  oldPrice: null, style: "Album Art",    sizes: ["A1","A2","A3","50x70cm"], isNew: false, isSoldOut: false, img: "../img/post4.png" },
    { id: 5,  name: "Currents Tour 2024",          artist: "Tame Impala",    price: 35,    oldPrice: null, style: "Tour Posters", sizes: ["A1","A2","A3","50x70cm"], isNew: false, isSoldOut: false, img: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=600&q=80" },
    { id: 6,  name: "Neon Nights",                 artist: "The Midnight",   price: 42,    oldPrice: null, style: "Tour Posters", sizes: ["A2","A3"],                isNew: true,  isSoldOut: false, img: "https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=600&q=80" },
    { id: 7,  name: "The New Abnormal",            artist: "The Strokes",    price: 28,    oldPrice: 35,   style: "Album Art",    sizes: ["A1","A2","A3","50x70cm"], isNew: false, isSoldOut: false, img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80" },
    { id: 8,  name: "Live at Wembley",             artist: "Queen",          price: 50,    oldPrice: null, style: "Photography",  sizes: ["A1","A2","50x70cm"],      isNew: false, isSoldOut: true,  img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80" },
    { id: 9,  name: "Dreamland",                   artist: "Glass Animals",  price: 35,    oldPrice: null, style: "Album Art",    sizes: ["A2","A3","50x70cm"],      isNew: false, isSoldOut: false, img: "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=600&q=80" },
    { id: 10, name: "In Rainbows",                 artist: "Radiohead",      price: 45,    oldPrice: null, style: "Abstract",     sizes: ["A1","A2","A3"],           isNew: false, isSoldOut: false, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
    { id: 11, name: "Random Access Memories",      artist: "Daft Punk",      price: 55,    oldPrice: 65,   style: "Album Art",    sizes: ["A1","A2","50x70cm"],      isNew: true,  isSoldOut: false, img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80" },
    { id: 12, name: "AM World Tour",               artist: "Arctic Monkeys", price: 38,    oldPrice: null, style: "Tour Posters", sizes: ["A2","A3","50x70cm"],      isNew: false, isSoldOut: false, img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80" },
    { id: 13, name: "Currents",                    artist: "Tame Impala",    price: 32,    oldPrice: null, style: "Album Art",    sizes: ["A2","A3"],                isNew: false, isSoldOut: false, img: "https://images.unsplash.com/photo-1500099817043-86d46000d58f?w=600&q=80" },
    { id: 14, name: "Room On Fire Tour",           artist: "The Strokes",    price: 29,    oldPrice: null, style: "Photography",  sizes: ["A1","A2","A3","50x70cm"], isNew: true,  isSoldOut: false, img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80" },
    { id: 15, name: "OK Computer",                 artist: "Radiohead",      price: 48,    oldPrice: null, style: "Album Art",    sizes: ["A1","A2","50x70cm"],      isNew: false, isSoldOut: false, img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&q=80" },
    { id: 16, name: "Homework Era",                artist: "Daft Punk",      price: 40,    oldPrice: 50,   style: "Abstract",     sizes: ["A2","A3","50x70cm"],      isNew: false, isSoldOut: false, img: "https://images.unsplash.com/photo-1598387846148-47e82ee120cc?w=600&q=80" },
    { id: 17, name: "Poster Edición Limitada",     artist: "Arctic Monkeys", price: 25,    oldPrice: null, style: "Tour Posters", sizes: ["A2","A3","50x70cm"],      isNew: false, isSoldOut: false, img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80" },
    { id: 18, name: "Poster The Weeknd",           artist: "The Weeknd",     price: 20,    oldPrice: null, style: "Photography",  sizes: ["A2","A3"],                isNew: false, isSoldOut: false, img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&q=80" },
    { id: 19, name: "Poster Taylor Swift",         artist: "Taylor Swift",   price: 22,    oldPrice: null, style: "Photography",  sizes: ["A2","A3","50x70cm"],      isNew: true,  isSoldOut: false, img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80" }
];

const artists = [...new Set(POSTERS.map(p => p.artist))].sort();
const styles  = [...new Set(POSTERS.map(p => p.style))].sort();
const sizes   = ["A1", "A2", "A3", "50x70cm"];

let state = { artists: [], styles: [], size: null, query: "", sort: "recientes", page: 6 };

/* ── Toggle filtros móvil ── */
document.addEventListener('DOMContentLoaded', () => {
    const btnToggle    = document.getElementById('btnToggleFiltros');
    const panelFiltros = document.getElementById('panelFiltros');
    if (btnToggle && panelFiltros) {
        btnToggle.addEventListener('click', () => {
            panelFiltros.classList.toggle('abierto');
            btnToggle.classList.toggle('activo');
            btnToggle.innerHTML = panelFiltros.classList.contains('abierto')
                ? '<i class="fas fa-times"></i> Cerrar filtros'
                : '<i class="fas fa-sliders-h"></i> Filtros';
        });
    }
});

/* ── Sidebar ── */
function renderSidebar() {
    document.getElementById('listaArtistas').innerHTML = artists.map(a => `
        <label class="opcion-check">
            <input type="checkbox" data-type="artist" data-val="${a}" ${state.artists.includes(a) ? 'checked' : ''}>
            ${a}
        </label>`).join('');

    document.getElementById('listaEstilos').innerHTML = styles.map(s => `
        <label class="opcion-check">
            <input type="checkbox" data-type="style" data-val="${s}" ${state.styles.includes(s) ? 'checked' : ''}>
            ${s}
        </label>`).join('');

    document.getElementById('listaTamaños').innerHTML = sizes.map(s => `
        <button class="btn-tamaño ${state.size === s ? 'activo' : ''}" data-size="${s}">${s}</button>`).join('');

    document.querySelectorAll('.opcion-check input').forEach(cb => {
        cb.addEventListener('change', e => {
            const type = e.target.dataset.type;
            const val  = e.target.dataset.val;
            if (type === 'artist') state.artists = e.target.checked ? [...state.artists, val] : state.artists.filter(x => x !== val);
            else                   state.styles  = e.target.checked ? [...state.styles,  val] : state.styles.filter(x => x !== val);
            state.page = 6; render();
        });
    });

    document.querySelectorAll('.btn-tamaño').forEach(btn => {
        btn.addEventListener('click', () => { state.size = state.size === btn.dataset.size ? null : btn.dataset.size; state.page = 6; render(); });
    });
}

/* ── Filtrar ── */
function getFiltered() {
    let result = [...POSTERS];
    if (state.artists.length) result = result.filter(p => state.artists.includes(p.artist));
    if (state.styles.length)  result = result.filter(p => state.styles.includes(p.style));
    if (state.size)           result = result.filter(p => p.sizes.includes(state.size));
    if (state.query)          result = result.filter(p => p.artist.toLowerCase().includes(state.query.toLowerCase()) || p.name.toLowerCase().includes(state.query.toLowerCase()));
    if (state.sort === 'precio-asc')  result.sort((a, b) => a.price - b.price);
    if (state.sort === 'precio-desc') result.sort((a, b) => b.price - a.price);
    if (state.sort === 'nombre')      result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
}

/* ── Tags activos ── */
function renderActiveTags() {
    const container = document.getElementById('filtrosActivos');
    const tags = [];
    state.styles.forEach(s  => tags.push({ label: `Estilo: ${s}`,          type: 'style',  val: s,          css: 'rosa' }));
    state.artists.forEach(a => tags.push({ label: `Artista: ${a}`,         type: 'artist', val: a,          css: 'oscuro' }));
    if (state.size)           tags.push({ label: `Tamaño: ${state.size}`,  type: 'size',   val: state.size, css: 'oscuro' });

    container.innerHTML = tags.map(t => `
        <span class="etiqueta-filtro ${t.css}" data-type="${t.type}" data-val="${t.val}">
            ${t.label} <i class="fas fa-times"></i>
        </span>`).join('');

    if (tags.length) container.innerHTML += `<button class="btn-borrar-todo" id="btnClearAll">Borrar todo</button>`;

    container.querySelectorAll('.etiqueta-filtro').forEach(tag => {
        tag.addEventListener('click', () => {
            const { type, val } = tag.dataset;
            if (type === 'style')  state.styles  = state.styles.filter(x => x !== val);
            if (type === 'artist') state.artists = state.artists.filter(x => x !== val);
            if (type === 'size')   state.size    = null;
            state.page = 6; render();
        });
    });

    const clearBtn = document.getElementById('btnClearAll');
    if (clearBtn) clearBtn.addEventListener('click', () => { state.artists = []; state.styles = []; state.size = null; state.page = 6; render(); });
}

/* ── Render rejilla ── */
function renderGrid(filtered) {
    const grid    = document.getElementById('rejillaPosters');
    const visible = filtered.slice(0, state.page);

    document.getElementById('contador').innerHTML =
        `Mostrando <strong>${visible.length}</strong> de <strong>${filtered.length}</strong> resultados`;

    grid.innerHTML = visible.map(p => `
        <a href="detalle/detalle.html?id=${p.id}" class="tarjeta-poster ${p.isSoldOut ? 'agotado-card' : ''}" data-id="${p.id}">
            <div class="imagen-poster">
                ${p.isNew     ? `<span class="insignia-poster novedad">Novedad</span>` : ''}
                ${p.isSoldOut ? `<span class="insignia-poster agotado">Agotado</span>` : ''}
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                ${!p.isSoldOut ? `<div class="capa-detalle"><span class="btn-ver-detalle"><i class="fas fa-eye"></i> Ver detalle</span></div>` : ''}
            </div>
            <div class="info-poster">
                <div class="nombre-poster">${p.name}</div>
                <div class="artista-poster">${p.artist}</div>
                <div class="precios-poster">
                    <span class="precio-actual">€${p.price.toFixed(2)}</span>
                    ${p.oldPrice ? `<span class="precio-antes">€${p.oldPrice.toFixed(2)}</span>` : ''}
                </div>
            </div>
        </a>`).join('');

    document.getElementById('btnCargarMas').style.display = visible.length >= filtered.length ? 'none' : 'flex';
}

/* ── Render completo ── */
function render() {
    const filtered = getFiltered();
    renderSidebar();
    renderActiveTags();
    renderGrid(filtered);
}

/* ── Eventos ── */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('campoBusqueda').addEventListener('input', e => { state.query = e.target.value; state.page = 6; render(); });
    document.getElementById('selectorOrden').addEventListener('change', e => { state.sort = e.target.value; render(); });
    document.getElementById('btnCargarMas').addEventListener('click', () => { state.page += 6; render(); });
    render();
});