/* Animación de entrada de la portada */
document.addEventListener('DOMContentLoaded', () => {
    const portada = document.querySelector('.portada');
    setTimeout(() => {
        if (portada) portada.classList.add('visible');
    }, 200);
});


/* Efecto brillo — sección merch */
const zonaMerch   = document.getElementById('zonaInteractivaMerch');
const brilloMerch = document.getElementById('brilloMerch');

if (zonaMerch && brilloMerch) {
    /* Mover brillo con el cursor */
    zonaMerch.addEventListener('mousemove', (e) => {
        const rect = zonaMerch.getBoundingClientRect();
        brilloMerch.style.opacity = '1';
        brilloMerch.style.left    = `${e.clientX - rect.left}px`;
        brilloMerch.style.top     = `${e.clientY - rect.top}px`;
    });

    /* Ocultar brillo al salir */
    zonaMerch.addEventListener('mouseleave', () => {
        brilloMerch.style.opacity = '0';
    });
}


/* ============================================================
   CATEGORÍAS
   TODO (Spring Boot): GET /api/categorias
   ============================================================ */
const CATEGORIAS = [
    {
        nombre:   'Vinilos',
        etiqueta: 'Colección',
        desc:     'LPs, EPs y ediciones limitadas.',
        enlace:   'pages/tienda.html',
        imagen:   'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=600&q=80'
    },
    {
        nombre:   'Merchandising',
        etiqueta: 'Ropa y Accesorios',
        desc:     'Camisetas, sudaderas, gorras y más.',
        enlace:   'pages/merch.html',
        imagen:   'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'
    },
    {
        nombre:   'Posters',
        etiqueta: 'Arte Visual',
        desc:     'Arte oficial y ediciones limitadas.',
        enlace:   'pages/posters.html',
        imagen:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'
    },
    {
        nombre:   'Novedades',
        etiqueta: 'Lo Último',
        desc:     'Descubre los lanzamientos de la semana.',
        enlace:   'pages/novedades.html',
        imagen:   'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80'
    }
];

/* Genera las tarjetas de categoría en el grid */
function renderCategorias() {
    const grid = document.getElementById('gridCategorias');
    if (!grid) return;

    grid.innerHTML = CATEGORIAS.map((cat, i) => `
        <a href="${cat.enlace}" class="tarjeta-categoria" style="animation-delay: ${i * 0.08}s">
            <div class="imagen-categoria">
                <img src="${cat.imagen}" alt="${cat.nombre}" loading="lazy">
                <div class="overlay-categoria"></div>
            </div>
            <div class="info-categoria">
                <span class="etiqueta-categoria">${cat.etiqueta}</span>
                <h3 class="nombre-categoria">${cat.nombre}</h3>
                <p class="desc-categoria">${cat.desc}</p>
            </div>
        </a>
    `).join('');
}


/* ============================================================
   MÁS VENDIDOS
   TODO (Spring Boot): GET /api/productos?orden=ventas&limite=3
   ============================================================ */
const MAS_VENDIDOS = [
    {
        id:      5,
        nombre:  'After Hours',
        artista: 'The Weeknd',
        precio:  '€35,00',
        tipo:    'vinilo',
        enlace:  'pages/detalle/detalle_vinilo.html?id=5',
        imagen:  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80'
    },
    {
        id:      20,
        nombre:  'Eras Tour Hoodie',
        artista: 'Taylor Swift',
        precio:  '€65,00',
        tipo:    'merch',
        enlace:  'pages/detalle/detalle_merch.html?id=20',
        imagen:  'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400&q=80'
    },
    {
        id:      3,
        nombre:  'Pink Floyd — The Wall',
        artista: 'Pink Floyd',
        precio:  '€5,99',
        tipo:    'poster',
        enlace:  'pages/detalle/detalle.html?id=3',
        imagen:  'img/post3.png'
    }
];

/* Etiquetas y clases por tipo de producto */
const TIPO_LABEL  = { vinilo: 'VINILO', merch: 'MERCH', poster: 'POSTER' };
const TIPO_CLASE  = { vinilo: 'tag-vinilo', merch: 'tag-merch', poster: 'tag-poster' };
const RANGO_CLASE = ['rango-oro', 'rango-plata', 'rango-bronce'];

/* Genera las tarjetas de más vendidos */
function renderVendidos() {
    const grid = document.getElementById('gridVendidos');
    if (!grid) return;

    grid.innerHTML = MAS_VENDIDOS.map((producto, i) => `
        <a href="${producto.enlace}" class="tarjeta-vendido">
            <div class="imagen-vendido">
                <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy"
                     onerror="this.parentElement.style.background='var(--superficie2)'">
            </div>
            <div class="info-vendido">
                <div class="fila-titulo">
                    <h4>${producto.nombre}</h4>
                    <span class="insignia-rango ${RANGO_CLASE[i]}">#${i + 1}</span>
                </div>
                <p>${producto.artista}</p>
                <div class="fila-precio">
                    <span class="precio-vendido">${producto.precio}</span>
                    <span class="tag-tipo ${TIPO_CLASE[producto.tipo]}">${TIPO_LABEL[producto.tipo]}</span>
                </div>
            </div>
        </a>
    `).join('');
}


/* ============================================================
   NOVEDADES — carrusel
   TODO (Spring Boot): GET /api/productos?orden=reciente&limite=10
   ============================================================ */
const NOVEDADES = [
    { titulo: 'After Hours',         artista: 'The Weeknd',     precio: '€35,00', insignia: 'limitado', tipo: 'vinilo', enlace: 'pages/detalle/detalle_vinilo.html?id=5',  img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80' },
    { titulo: 'Motomami',            artista: 'Rosalía',        precio: '€40,00', insignia: 'nuevo',    tipo: 'vinilo', enlace: 'pages/detalle/detalle_vinilo.html?id=15', img: 'https://images.unsplash.com/photo-1602020919491-6b7696a96ee5?w=400&q=80' },
    { titulo: 'Un Verano Sin Ti',    artista: 'Bad Bunny',      precio: '€38,00', insignia: 'nuevo',    tipo: 'vinilo', enlace: 'pages/detalle/detalle_vinilo.html?id=16', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80' },
    { titulo: 'Eras Tour Hoodie',    artista: 'Taylor Swift',   precio: '€65,00', insignia: 'nuevo',    tipo: 'merch',  enlace: 'pages/detalle/detalle_merch.html?id=20',   img: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400&q=80' },
    { titulo: 'Blinding Lights Tee', artista: 'The Weeknd',     precio: '€35,00', insignia: null,       tipo: 'merch',  enlace: 'pages/detalle/detalle_merch.html?id=22',   img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80' },
    { titulo: 'The Car Tour Tee',    artista: 'Arctic Monkeys', precio: '€35,00', insignia: 'restock',  tipo: 'merch',  enlace: 'pages/detalle/detalle_merch.html?id=3',    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
    { titulo: 'The Dark Side',       artista: 'Pink Floyd',     precio: '€5,99',  insignia: null,       tipo: 'poster', enlace: 'pages/detalle/detalle.html?id=1',          img: 'img/post1.png' },
    { titulo: 'Nevermind',           artista: 'Nirvana',        precio: '€4,99',  insignia: 'limitado', tipo: 'poster', enlace: 'pages/detalle/detalle.html?id=2',          img: 'img/post2.png' },
    { titulo: 'AM Poster',           artista: 'Arctic Monkeys', precio: '€6,99',  insignia: null,       tipo: 'poster', enlace: 'pages/detalle/detalle.html?id=4',          img: 'img/post4.png' },
    { titulo: 'To Pimp a Butterfly', artista: 'Kendrick Lamar', precio: '€42,00', insignia: 'limitado', tipo: 'vinilo', enlace: 'pages/detalle/detalle_vinilo.html?id=13',  img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80' },
];

/* Clases de insignias y tags */
const ETIQUETAS_INSIGNIA = { nuevo: 'insignia-nuevo', limitado: 'insignia-limitado', restock: 'insignia-restock' };
const TAG_CLASE          = { vinilo: 'tag-vinilo', merch: 'tag-merch', poster: 'tag-poster' };
const TAG_TEXTO          = { vinilo: 'Vinilo',     merch: 'Merch',     poster: 'Poster' };


/* ============================================================
   CARRUSEL — slides, puntos y navegación táctil
   ============================================================ */
const rejillaProductos = document.getElementById('rejillaProductos');
const btnSiguiente     = document.getElementById('btnSiguiente');
const btnAnterior      = document.getElementById('btnAnterior');
const puntosCarrusel   = document.getElementById('puntosCarrusel');

if (rejillaProductos && btnSiguiente && btnAnterior) {

    let slideActual = 0;

    /* Crea el HTML de una tarjeta de producto */
    function crearTarjeta(item) {
        const htmlInsignia = item.insignia
            ? `<span class="insignia ${ETIQUETAS_INSIGNIA[item.insignia]}">${item.insignia.toUpperCase().replace('RESTOCK', 'RE-STOCK')}</span>`
            : '';

        return `
            <a href="${item.enlace}" class="tarjeta-producto">
                <div class="imagen-producto">
                    ${htmlInsignia}
                    <img src="${item.img}" alt="${item.titulo}" loading="lazy"
                         onerror="this.parentElement.style.background='var(--superficie2)'">
                    <div class="capa-hover">
                        <button class="btn-anadir-rapido" title="Añadir al carrito"
                                onclick="event.preventDefault(); event.stopPropagation();">
                            <i class="fa-solid fa-cart-shopping"></i>
                        </button>
                    </div>
                </div>
                <div class="info-producto">
                    <span class="artista">${item.artista}</span>
                    <h3>${item.titulo}</h3>
                    <div class="pie-info">
                        <span class="precio">${item.precio}</span>
                        <span class="tag-formato ${TAG_CLASE[item.tipo]}">${TAG_TEXTO[item.tipo]}</span>
                    </div>
                </div>
            </a>
        `;
    }

    /* Pinta todas las tarjetas en el carrusel */
    function mostrarProductos() {
        rejillaProductos.innerHTML = NOVEDADES.map(crearTarjeta).join('');
        rejillaProductos.querySelectorAll('.tarjeta-producto').forEach((tarjeta, i) => {
            tarjeta.style.animationDelay = `${i * 0.07}s`;
        });
    }

    /* Ancho de una tarjeta + gap */
    function anchoCarta() {
        const tarjeta = rejillaProductos.querySelector('.tarjeta-producto');
        return tarjeta ? tarjeta.offsetWidth + 24 : 0;
    }

    /* Total de slides disponibles */
    function totalSlides() {
        const cantidad = NOVEDADES.length;
        const ancho    = anchoCarta();
        if (!ancho) return 1;
        const visibles = Math.floor(rejillaProductos.parentElement.offsetWidth / ancho);
        return Math.max(1, cantidad - visibles + 1);
    }

    /* Crea los puntos indicadores */
    function crearPuntos() {
        if (!puntosCarrusel) return;
        puntosCarrusel.innerHTML = '';
        for (let i = 0; i < totalSlides(); i++) {
            const punto = document.createElement('div');
            punto.className = 'punto' + (i === slideActual ? ' activo' : '');
            punto.addEventListener('click', () => irASlide(i));
            puntosCarrusel.appendChild(punto);
        }
    }

    /* Actualiza el punto activo */
    function actualizarPuntos() {
        if (!puntosCarrusel) return;
        puntosCarrusel.querySelectorAll('.punto').forEach((punto, i) => {
            punto.classList.toggle('activo', i === slideActual);
        });
    }

    /* Activa o desactiva los botones en los extremos */
    function actualizarBotones() {
        btnAnterior.classList.toggle('desactivado', slideActual === 0);
        btnSiguiente.classList.toggle('desactivado', slideActual >= totalSlides() - 1);
    }

    /* Mueve el carrusel al slide indicado */
    function irASlide(index) {
        slideActual = Math.max(0, Math.min(index, totalSlides() - 1));
        rejillaProductos.style.transform = `translateX(-${slideActual * anchoCarta()}px)`;
        actualizarBotones();
        actualizarPuntos();
    }

    /* Botones de navegación */
    btnSiguiente.addEventListener('click', () => irASlide(slideActual + 1));
    btnAnterior.addEventListener('click',  () => irASlide(slideActual - 1));

    /* Soporte táctil — swipe izquierda/derecha */
    let inicioX = 0;
    rejillaProductos.addEventListener('touchstart', e => { inicioX = e.touches[0].clientX; });
    rejillaProductos.addEventListener('touchend', e => {
        const diff = inicioX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? irASlide(slideActual + 1) : irASlide(slideActual - 1);
        }
    });

    /* Inicializar al cargar la página */
    window.addEventListener('load', () => {
        mostrarProductos();
        setTimeout(() => {
            crearPuntos();
            actualizarBotones();
        }, 100);
    });
}


/* Inicialización — renderiza categorías y más vendidos */
document.addEventListener('DOMContentLoaded', () => {
    renderCategorias();
    renderVendidos();
});