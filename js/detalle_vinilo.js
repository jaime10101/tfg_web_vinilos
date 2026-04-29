/* ============================================================
   DETALLE_VINILO.JS — Lógica del detalle de vinilo
   Ubicación: pages/detalle/ → rutas relativas con ../../
   ============================================================ */

/* ============================================================
   DATOS
   TODO (Supabase): reemplazar por:
     const id = new URLSearchParams(window.location.search).get('id');
     const { data } = await supabase.from('vinilos').select('*').eq('id', id).single();
   ============================================================ */
const VINYLS = {
    1:  { name: "AM",                        artist: "Arctic Monkeys",    price: 25, genre: "Indie",       format: "LP",    year: 2013, badge: "restock",   popularity: 95, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",  desc: "El quinto álbum de estudio de Arctic Monkeys, grabado en Los Ángeles y Nashville. Un viaje desde el garage rock hasta el hard rock pesado con influencias de hip-hop y R&B." },
    2:  { name: "Currents",                  artist: "Tame Impala",       price: 29, genre: "Indie",       format: "LP",    year: 2015, badge: null,        popularity: 90, image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&q=80",  desc: "El tercer álbum de Tame Impala es un viaje psicodélico hacia el pop electrónico." },
    3:  { name: "Random Access Memories",    artist: "Daft Punk",         price: 32, genre: "Electrónica", format: "Doble", year: 2013, badge: "limitado",  popularity: 98, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",  desc: "La obra maestra de Daft Punk que reinventó la música disco y funk para el siglo XXI." },
    4:  { name: "Born to Die",               artist: "Lana Del Rey",      price: 28, genre: "Pop",         format: "LP",    year: 2012, badge: null,        popularity: 88, image: "https://images.unsplash.com/photo-1500099817043-86d46000d58f?w=800&q=80",  desc: "El álbum debut de Lana Del Rey que la catapultó a la fama mundial." },
    5:  { name: "After Hours",               artist: "The Weeknd",        price: 35, genre: "Pop",         format: "LP",    year: 2020, badge: "limitado",  popularity: 97, image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",  desc: "El cuarto álbum de The Weeknd es un viaje oscuro y cinemático por las noches de Los Ángeles." },
    6:  { name: "Future Nostalgia",          artist: "Dua Lipa",          price: 27, genre: "Pop",         format: "LP",    year: 2020, badge: "restock",   popularity: 92, image: "https://images.unsplash.com/photo-1598387846148-47e82ee120cc?w=800&q=80",  desc: "El segundo álbum de Dua Lipa es un brillante homenaje al pop de los 80 y al disco." },
    7:  { name: "Fine Line",                 artist: "Harry Styles",      price: 29, genre: "Pop",         format: "Doble", year: 2019, badge: null,        popularity: 91, image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",  desc: "El segundo álbum en solitario de Harry Styles es una exploración ecléctica de folk rock, pop, soul y psicodelia." },
    8:  { name: "1989",                      artist: "Taylor Swift",      price: 38, genre: "Pop",         format: "LP",    year: 2014, badge: "restock",   popularity: 96, image: "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=800&q=80",  desc: "El séptimo álbum de Taylor Swift marcó su transición definitiva al pop." },
    9:  { name: "Tranquility Base",          artist: "Arctic Monkeys",    price: 33, genre: "Rock",        format: "LP",    year: 2018, badge: null,        popularity: 85, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",  desc: "Un álbum conceptual ambientado en un hotel lunar del futuro." },
    10: { name: "In Rainbows",               artist: "Radiohead",         price: 45, genre: "Indie",       format: "Doble", year: 2007, badge: null,        popularity: 94, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80",  desc: "El séptimo álbum de Radiohead, famoso por ser lanzado originalmente como descarga de pago libre." },
    11: { name: "Kind of Blue",              artist: "Miles Davis",       price: 38, genre: "Jazz",        format: "LP",    year: 1959, badge: null,        popularity: 93, image: "https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=800&q=80",  desc: "El álbum de jazz más vendido de todos los tiempos." },
    12: { name: "Homework",                  artist: "Daft Punk",         price: 36, genre: "Electrónica", format: "Doble", year: 1997, badge: null,        popularity: 89, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",  desc: "El álbum debut de Daft Punk que revolucionó la música electrónica." },
    13: { name: "To Pimp a Butterfly",       artist: "Kendrick Lamar",    price: 42, genre: "Hip Hop",     format: "Doble", year: 2015, badge: "limitado",  popularity: 99, image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",  desc: "Considerado uno de los mejores álbumes de rap de todos los tiempos." },
    14: { name: "Illmatic",                  artist: "Nas",               price: 31, genre: "Hip Hop",     format: "LP",    year: 1994, badge: null,        popularity: 96, image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",  desc: "El álbum debut de Nas está considerado el mejor álbum de rap de la historia." },
    15: { name: "Motomami",                  artist: "Rosalía",           price: 40, genre: "Pop",         format: "LP",    year: 2022, badge: "nuevo",     popularity: 94, image: "https://images.unsplash.com/photo-1602020919491-6b7696a96ee5?w=800&q=80",  desc: "El tercer álbum de Rosalía es una exploración sin fronteras del flamenco fusionado con reggaetón." },
    16: { name: "Un Verano Sin Ti",          artist: "Bad Bunny",         price: 38, genre: "Latina",      format: "Doble", year: 2022, badge: "nuevo",     popularity: 97, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",  desc: "El álbum más escuchado en Spotify en 2022. Bad Bunny combina reggaetón, salsa, dembow y plena." },
    17: { name: "Blonde",                    artist: "Frank Ocean",       price: 48, genre: "Pop",         format: "Doble", year: 2016, badge: "limitado",  popularity: 98, image: "https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=800&q=80",  desc: "El segundo álbum visual de Frank Ocean, lanzado de forma independiente." },
    18: { name: "The Dark Side of the Moon", artist: "Pink Floyd",        price: 44, genre: "Rock",        format: "LP",    year: 1973, badge: null,        popularity: 99, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",  desc: "El octavo álbum de Pink Floyd permanece como uno de los discos más vendidos de la historia." },
    19: { name: "Nevermind",                 artist: "Nirvana",           price: 30, genre: "Rock",        format: "LP",    year: 1991, badge: null,        popularity: 97, image: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=800&q=80",  desc: "El álbum que llevó el grunge al mainstream mundial." },
    20: { name: "Abbey Road",                artist: "The Beatles",       price: 35, genre: "Rock",        format: "LP",    year: 1969, badge: null,        popularity: 99, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",  desc: "El undécimo y penúltimo álbum de los Beatles." },
    21: { name: "Selected Ambient Works",    artist: "Aphex Twin",        price: 42, genre: "Electrónica", format: "Doble", year: 1992, badge: "pre-orden", popularity: 86, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",  desc: "El debut de Richard D. James como Aphex Twin es una piedra angular de la música electrónica ambiental." },
    22: { name: "Midnights",                 artist: "Taylor Swift",      price: 36, genre: "Pop",         format: "Color", year: 2022, badge: "nuevo",     popularity: 95, image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",  desc: "El décimo álbum de Taylor Swift explora las horas de insomnio y reflexión." },
    23: { name: "Pedrá",                     artist: "Extremoduro",       price: 26, genre: "Rock",        format: "LP",    year: 1993, badge: "limitado",  popularity: 82, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",  desc: "Uno de los álbumes más influyentes del rock español." },
    24: { name: "El Madrileño",              artist: "C. Tangana",        price: 34, genre: "Latina",      format: "LP",    year: 2021, badge: "nuevo",     popularity: 90, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",  desc: "El álbum que reinventó la identidad musical española." },
};

const VELOCIDADES = { LP: '33 rpm', EP: '45 rpm', Single: '45 rpm', Doble: '33 rpm', Color: '33 rpm' };
let cantidad = 1;

/* ── Cargar vinilo ── */
function loadVinilo() {
    const params = new URLSearchParams(window.location.search);
    const id     = parseInt(params.get('id')) || 1;
    const v      = VINYLS[id];
    if (!v) { document.getElementById('nombreAlbum').textContent = 'Vinilo no encontrado'; return; }

    document.title = `${v.name} — ${v.artist} | Vinyl Sounds`;
    document.getElementById('migaNombre').textContent          = v.name;
    document.getElementById('imgPortada').src                  = v.image;
    document.getElementById('imgPortada').alt                  = v.name;
    document.getElementById('portadaFondoBlur').style.backgroundImage = `url(${v.image})`;
    document.getElementById('etiquetaGenero').textContent      = v.genre;
    document.getElementById('nombreAlbum').textContent         = v.name;
    document.getElementById('nombreArtista').textContent       = v.artist;
    document.getElementById('precioPrincipal').textContent     = `€${v.price.toFixed(2)}`;
    document.getElementById('descripcionAlbum').textContent    = v.desc;
    document.getElementById('specFormato').textContent         = v.format;
    document.getElementById('specAnio').textContent            = v.year;
    document.getElementById('specGenero').textContent          = v.genre;
    document.getElementById('specVelocidad').textContent       = VELOCIDADES[v.format] || '33 rpm';
    document.getElementById('fichaFormato').textContent        = v.format;
    document.getElementById('fichaAnio').textContent           = v.year;
    document.getElementById('fichaGenero').textContent         = v.genre;
    document.getElementById('fichaPopularidad').textContent    = `${v.popularity}/100`;

    if (v.badge) {
        const etiquetas = { nuevo: 'NUEVO', limitado: 'LIMITADO', restock: 'RESTOCK', 'pre-orden': 'PRE-ORDEN' };
        const ins = document.getElementById('insigniaDetalle');
        ins.textContent   = etiquetas[v.badge];
        ins.className     = `insignia-detalle ${v.badge}`;
        ins.style.display = 'block';
    }

    cargarRelacionados(id, v.genre);
}

/* ── Relacionados ── */
function cargarRelacionados(idActual, genero) {
    const grid  = document.getElementById('gridRelacionados');
    const todos = Object.entries(VINYLS).map(([key, v]) => ({ ...v, id: parseInt(key) }));
    const relacionados = [...todos.filter(v => v.id !== idActual && v.genre === genero).sort(() => Math.random() - 0.5),
                          ...todos.filter(v => v.id !== idActual && v.genre !== genero).sort(() => Math.random() - 0.5)].slice(0, 6);

    grid.innerHTML = relacionados.map(v => `
        <a href="detalle_vinilo.html?id=${v.id}" class="tarjeta-relacionado">
            <img src="${v.image}" alt="${v.name}" loading="lazy">
            <div class="info-relacionado">
                <h4>${v.name}</h4>
                <p>${v.artist}</p>
                <span class="precio-relacionado">€${v.price.toFixed(2)}</span>
            </div>
        </a>`).join('');
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
    loadVinilo();

    document.getElementById('btnMas').addEventListener('click', () => {
        cantidad++;
        document.getElementById('cantidad').textContent = cantidad;
    });

    document.getElementById('btnMenos').addEventListener('click', () => {
        if (cantidad > 1) { cantidad--; document.getElementById('cantidad').textContent = cantidad; }
    });

    document.getElementById('btnAnadir').addEventListener('click', () => {
        const id = parseInt(new URLSearchParams(window.location.search).get('id')) || 1;
        const v  = VINYLS[id];
        if (!v) return;
        if (typeof Carrito !== 'undefined') {
            Carrito.agregar({ id, nombre: v.name, precio: `€${v.price.toFixed(2)}`, tipo: 'vinilo', imagen: v.image });
        }
        const aviso = document.getElementById('avisoCarrito');
        aviso.style.display = 'flex';
        setTimeout(() => { aviso.style.display = 'none'; }, 3000);
    });
});