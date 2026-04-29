/* ============================================================
   ARTISTAS.JS — Lógica específica de la página de artistas
   Nota: header, footer, hamburguesa y btn-subir los gestiona header.js
   ============================================================ */

/* ============================================================
   DATOS: ARTISTAS
   TODO (Supabase): reemplazar por:
     const { data } = await supabase.from('artistas').select('*');
   ============================================================ */
const TODOS_LOS_ARTISTAS = [
    { id: 1,  nombre: "The Beatles",    albums: 14, genero: "rock",        pop: 98, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Beatles_ad_1965_just_the_beatles_crop.jpg/400px-Beatles_ad_1965_just_the_beatles_crop.jpg" },
    { id: 2,  nombre: "Rosalía",        albums: 4,  genero: "pop",         pop: 91, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Rosal%C3%ADa_%28cropped%29.jpg/400px-Rosal%C3%ADa_%28cropped%29.jpg" },
    { id: 3,  nombre: "Dua Lipa",       albums: 3,  genero: "pop",         pop: 95, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Dua_Lipa_in_2018_%28cropped%29.jpg/400px-Dua_Lipa_in_2018_%28cropped%29.jpg" },
    { id: 4,  nombre: "Arctic Monkeys", albums: 7,  genero: "indie",       pop: 90, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Arctic_Monkeys_2013.jpg/400px-Arctic_Monkeys_2013.jpg" },
    { id: 5,  nombre: "Queen",          albums: 15, genero: "rock",        pop: 97, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Freddie_Mercury_performing_in_New_Haven,_CT_crop.jpg/400px-Freddie_Mercury_performing_in_New_Haven,_CT_crop.jpg" },
    { id: 6,  nombre: "Pink Floyd",     albums: 11, genero: "rock",        pop: 94, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Dark_side_of_the_moon.jpg/400px-Dark_side_of_the_moon.jpg" },
    { id: 7,  nombre: "Bad Bunny",      albums: 5,  genero: "pop",         pop: 96, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bad_Bunny_2020.jpg/400px-Bad_Bunny_2020.jpg" },
    { id: 8,  nombre: "C. Tangana",     albums: 4,  genero: "pop",         pop: 85, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/C._Tangana_en_el_Pabellón_de_la_Navegación_de_Sevilla_%28cropped%29.jpg/400px-C._Tangana_en_el_Pabellón_de_la_Navegación_de_Sevilla_%28cropped%29.jpg" },
    { id: 9,  nombre: "Tame Impala",    albums: 4,  genero: "indie",       pop: 88, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Tame_Impala_02.jpg/400px-Tame_Impala_02.jpg" },
    { id: 10, nombre: "Taylor Swift",   albums: 10, genero: "pop",         pop: 99, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/400px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png" },
    { id: 11, nombre: "Miles Davis",    albums: 8,  genero: "jazz",        pop: 83, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Miles_Davis_by_Palumbo.jpg/400px-Miles_Davis_by_Palumbo.jpg" },
    { id: 12, nombre: "Daft Punk",      albums: 4,  genero: "electronica", pop: 93, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Daft_Punk_BRIT_Awards_2007_%28cropped%29.jpg/400px-Daft_Punk_BRIT_Awards_2007_%28cropped%29.jpg" },
    { id: 13, nombre: "Radiohead",      albums: 9,  genero: "indie",       pop: 89, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Radioheadhp.jpg/400px-Radioheadhp.jpg" },
    { id: 14, nombre: "Björk",          albums: 10, genero: "electronica", pop: 82, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bjork_2_20070601.jpg/400px-Bjork_2_20070601.jpg" },
    { id: 15, nombre: "John Coltrane",  albums: 12, genero: "jazz",        pop: 80, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/John_Coltrane_1963.jpg/400px-John_Coltrane_1963.jpg" },
    { id: 16, nombre: "Nirvana",        albums: 3,  genero: "rock",        pop: 95, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Nirvana_around_1992.jpg/400px-Nirvana_around_1992.jpg" },
    { id: 17, nombre: "The Weeknd",     albums: 5,  genero: "pop",         pop: 96, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/The_Weeknd_2017_%28cropped%29.jpg/400px-The_Weeknd_2017_%28cropped%29.jpg" },
    { id: 18, nombre: "Kendrick Lamar", albums: 5,  genero: "indie",       pop: 97, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Kendrick_Lamar_2014_%28cropped%29.jpg/400px-Kendrick_Lamar_2014_%28cropped%29.jpg" },
    { id: 19, nombre: "Frank Ocean",    albums: 2,  genero: "pop",         pop: 92, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Frank_Ocean_2012.jpg/400px-Frank_Ocean_2012.jpg" },
    { id: 20, nombre: "Extremoduro",    albums: 9,  genero: "rock",        pop: 78, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Extremoduro_-_Robe_%282%29.jpg/400px-Extremoduro_-_Robe_%282%29.jpg" },
];

const GENEROS_META = [
    { id: "rock",        nombre: "Rock",        icono: "fa-solid fa-guitar",       color: "linear-gradient(135deg,#FF006E,#FF6B00)" },
    { id: "pop",         nombre: "Pop",         icono: "fa-solid fa-microphone",   color: "linear-gradient(135deg,#7B2FFF,#FF006E)" },
    { id: "indie",       nombre: "Indie",       icono: "fa-solid fa-record-vinyl", color: "linear-gradient(135deg,#00D4FF,#7B2FFF)" },
    { id: "jazz",        nombre: "Jazz",        icono: "fa-solid fa-music",        color: "linear-gradient(135deg,#FFE600,#FF6B00)" },
    { id: "electronica", nombre: "Electrónica", icono: "fa-solid fa-headphones",   color: "linear-gradient(135deg,#00FF94,#00D4FF)" },
];

const imagenFallback = (nombre) =>
    `https://via.placeholder.com/300x300/12103A/7B2FFF?text=${encodeURIComponent(nombre)}`;

const POR_PAGINA = 12;

let state = {
    genero:   'all',
    orden:    'popularity',
    busqueda: '',
    pagina:   POR_PAGINA,
};

/* ============================================================
   FILTRAR Y ORDENAR
   ============================================================ */
function getFiltrados() {
    let lista = [...TODOS_LOS_ARTISTAS];
    if (state.genero !== 'all') lista = lista.filter(a => a.genero === state.genero);
    if (state.busqueda) lista = lista.filter(a => a.nombre.toLowerCase().includes(state.busqueda.toLowerCase()));
    if (state.orden === 'name')   lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
    else if (state.orden === 'albums') lista.sort((a, b) => b.albums - a.albums);
    else lista.sort((a, b) => b.pop - a.pop);
    return lista;
}

/* ============================================================
   TIRA DE FOTOS DEL HERO
   ============================================================ */
function renderTira() {
    const contenedor = document.getElementById('tiraFotos');
    if (!contenedor) return;
    const imagenes = TODOS_LOS_ARTISTAS.map(a => a.img);
    contenedor.innerHTML = '';
    for (let col = 0; col < 3; col++) {
        const columna = document.createElement('div');
        columna.className = 'tira-col';
        [...imagenes, ...imagenes].forEach(src => {
            const img     = document.createElement('img');
            img.className = 'tira-foto';
            img.src       = src;
            img.alt       = '';
            img.loading   = 'lazy';
            img.onerror   = function () { this.style.display = 'none'; };
            columna.appendChild(img);
        });
        contenedor.appendChild(columna);
    }
}

/* ============================================================
   REJILLA DE ARTISTAS
   ============================================================ */
function renderRejilla() {
    const rejilla       = document.getElementById('rejilla');
    const sinResultados = document.getElementById('sinResultados');
    const zonaCargarMas = document.getElementById('zonaCargarMas');
    const contador      = document.getElementById('contadorArtistas');

    const listaFiltrada = getFiltrados();
    const listaVisible  = listaFiltrada.slice(0, state.pagina);

    contador.innerHTML = `Mostrando <strong>${listaVisible.length}</strong> de <strong>${listaFiltrada.length}</strong> artistas`;

    if (listaFiltrada.length === 0) {
        rejilla.innerHTML = '';
        sinResultados.style.display = 'block';
        zonaCargarMas.style.display = 'none';
        return;
    }

    sinResultados.style.display = 'none';

    rejilla.innerHTML = listaVisible.map((artista, indice) => `
        <div class="tarjeta-artista"
             style="animation-delay: ${indice * 0.04}s"
             data-genero="${artista.genero}"
             onclick="irATienda('${encodeURIComponent(artista.nombre)}')">
            <div class="imagen-artista">
                <img src="${artista.img}" alt="${artista.nombre}" loading="lazy"
                     onerror="this.src='${imagenFallback(artista.nombre)}'">
                <div class="overlay-play">
                    <i class="fa-solid fa-record-vinyl"></i>
                </div>
            </div>
            <div class="nombre-artista">${artista.nombre}</div>
            <div class="meta-artista">
                <span class="tag-genero">${artista.genero}</span>
                <span class="albums-count">${artista.albums} álbumes</span>
            </div>
            <div class="barra-pop">
                <div class="fill-pop" style="width: ${artista.pop}%"></div>
            </div>
        </div>
    `).join('');

    zonaCargarMas.style.display = listaFiltrada.length > state.pagina ? 'block' : 'none';
}

/* ============================================================
   NAVEGAR A TIENDA
   ============================================================ */
function irATienda(nombreCodificado) {
    const nombre = decodeURIComponent(nombreCodificado);
    window.location.href = `tienda.html?artista=${encodeURIComponent(nombre)}`;
}

/* ============================================================
   SECCIÓN DE GÉNEROS
   ============================================================ */
function renderGeneros() {
    const cuadricula = document.getElementById('gridGeneros');
    if (!cuadricula) return;

    cuadricula.innerHTML = GENEROS_META.map(genero => {
        const total = TODOS_LOS_ARTISTAS.filter(a => a.genero === genero.id).length;
        return `
        <div class="tarjeta-genero"
             style="--color-genero: ${genero.color}"
             data-genero="${genero.id}">
            <div class="genero-linea"></div>
            <i class="${genero.icono} genero-icono-fa"></i>
            <div class="genero-nombre">${genero.nombre}</div>
            <div class="genero-count">${total} artistas</div>
        </div>`;
    }).join('');

    cuadricula.querySelectorAll('.tarjeta-genero').forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            state.genero = tarjeta.dataset.genero;
            state.pagina = POR_PAGINA;
            document.querySelectorAll('.btn-genero').forEach(b => b.classList.remove('activo'));
            const btnFiltro = document.querySelector(`.btn-genero[data-genre="${state.genero}"]`);
            if (btnFiltro) btnFiltro.classList.add('activo');
            renderRejilla();
            document.querySelector('.seccion-explorar').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function resetearPagina() {
    state.pagina = POR_PAGINA;
    renderRejilla();
}

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    renderTira();
    renderRejilla();
    renderGeneros();

    document.getElementById('campoBusqueda').addEventListener('input', function () {
        state.busqueda = this.value.trim();
        resetearPagina();
    });

    document.getElementById('filtrosGenero').addEventListener('click', evento => {
        const boton = evento.target.closest('.btn-genero');
        if (!boton) return;
        document.querySelectorAll('.btn-genero').forEach(b => b.classList.remove('activo'));
        boton.classList.add('activo');
        state.genero = boton.dataset.genre;
        resetearPagina();
    });

    document.getElementById('selectOrden').addEventListener('change', function () {
        state.orden = this.value;
        resetearPagina();
    });

    document.getElementById('btnCargarMas').addEventListener('click', function () {
        state.pagina += POR_PAGINA;
        this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cargando...';
        this.disabled  = true;
        setTimeout(() => {
            renderRejilla();
            this.innerHTML = '<i class="fa-solid fa-chevron-down"></i> Ver más artistas';
            this.disabled  = false;
        }, 400);
    });
});