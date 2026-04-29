/* ============================================================
   DETALLE_POSTER.JS — Lógica del detalle de poster
   Ubicación: pages/detalle/ → rutas relativas con ../../
   ============================================================ */

/* ============================================================
   DATOS
   TODO (Supabase): reemplazar por:
     const id = new URLSearchParams(window.location.search).get('id');
     const { data } = await supabase.from('posters').select('*').eq('id', id).single();
   ============================================================ */
const POSTERS = {
    1:  { id: 1,  titulo: "Nirvana - Smiley Squares", artista: "Nirvana",        precio: "€5,99", imagen: "../../img/post1.png", popular: false, medidas: "61 × 91,5 cm", descripcion: "Poster oficial de Nirvana con el icónico diseño Smiley Squares. Impreso en papel satinado de alta calidad." },
    2:  { id: 2,  titulo: "Ramones - Poster Oficial",  artista: "Ramones",        precio: "€5,99", imagen: "../../img/post2.png", popular: true,  medidas: "61 × 91,5 cm", descripcion: "El poster más vendido de nuestra colección. El diseño clásico de los Ramones con su inconfundible logo en blanco y negro." },
    3:  { id: 3,  titulo: "Pink Floyd - The Wall",      artista: "Pink Floyd",     precio: "€5,99", imagen: "../../img/post3.png", popular: false, medidas: "61 × 91,5 cm", descripcion: "Poster oficial basado en el álbum conceptual The Wall de Pink Floyd. El arte icónico de Gerald Scarfe cobra vida en este poster." },
    4:  { id: 4,  titulo: "AC/DC - Black Ice",          artista: "AC/DC",          precio: "€5,99", imagen: "../../img/post4.png", popular: false, medidas: "61 × 91,5 cm", descripcion: "Poster oficial de AC/DC inspirado en el álbum Black Ice. El diseño potente y directo de la banda más electrizante del hard rock." },
    5:  { id: 5,  titulo: "Currents Tour 2024",         artista: "Tame Impala",    precio: "€35,00", imagen: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=600&q=80", popular: false, medidas: "A1 / A2 / A3 / 50x70cm", descripcion: "Poster oficial de la gira Currents Tour 2024 de Tame Impala." },
    6:  { id: 6,  titulo: "Neon Nights",                artista: "The Midnight",   precio: "€42,00", imagen: "https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=600&q=80", popular: true,  medidas: "A2 / A3", descripcion: "Poster de edición limitada de The Midnight inspirado en la estética synthwave." },
    7:  { id: 7,  titulo: "The New Abnormal",           artista: "The Strokes",    precio: "€28,00", imagen: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80", popular: false, medidas: "A1 / A2 / A3 / 50x70cm", descripcion: "Artwork oficial del álbum The New Abnormal de The Strokes." },
    8:  { id: 8,  titulo: "Live at Wembley",            artista: "Queen",          precio: "€50,00", imagen: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80", popular: false, medidas: "A1 / A2 / 50x70cm", descripcion: "Fotografía oficial del legendario concierto de Queen en Wembley." },
    9:  { id: 9,  titulo: "Dreamland",                  artista: "Glass Animals",  precio: "€35,00", imagen: "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=600&q=80", popular: false, medidas: "A2 / A3 / 50x70cm", descripcion: "Poster oficial del álbum Dreamland de Glass Animals." },
    10: { id: 10, titulo: "In Rainbows",                artista: "Radiohead",      precio: "€45,00", imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", popular: false, medidas: "A1 / A2 / A3", descripcion: "Artwork abstracto inspirado en el álbum In Rainbows de Radiohead." },
    11: { id: 11, titulo: "Random Access Memories",     artista: "Daft Punk",      precio: "€55,00", imagen: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80", popular: true,  medidas: "A1 / A2 / 50x70cm", descripcion: "Poster oficial del icónico álbum Random Access Memories de Daft Punk." },
    12: { id: 12, titulo: "AM World Tour",              artista: "Arctic Monkeys", precio: "€38,00", imagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80", popular: false, medidas: "A2 / A3 / 50x70cm", descripcion: "Poster oficial de la gira mundial AM de Arctic Monkeys." },
    19: { id: 19, titulo: "Poster Taylor Swift",        artista: "Taylor Swift",   precio: "€22,00", imagen: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80", popular: true,  medidas: "A2 / A3 / 50x70cm", descripcion: "Poster oficial de Taylor Swift de la gira Eras Tour." },
};

let cantidad = 1;

/* ── Cargar poster ── */
function cargarPoster() {
    const params = new URLSearchParams(window.location.search);
    const id     = parseInt(params.get("id")) || 1;
    const poster = POSTERS[id];
    if (!poster) { document.getElementById("posterTitulo").textContent = "Poster no encontrado"; return; }

    document.title = `${poster.titulo} — Vinyl Sounds`;
    document.getElementById("posterImagen").src              = poster.imagen;
    document.getElementById("posterImagen").alt              = poster.titulo;
    document.getElementById("imagen360").src                 = poster.imagen;
    document.getElementById("posterTitulo").textContent      = poster.titulo;
    document.getElementById("posterArtista").textContent     = poster.artista;
    document.getElementById("posterPrecio").textContent      = poster.precio;
    document.getElementById("posterDescripcion").textContent = poster.descripcion;
    document.getElementById("posterMedidas").textContent     = poster.medidas;
    document.getElementById("migaPosterNombre").textContent  = poster.artista;

    const miniatura = document.getElementById("miniaturaUnica");
    miniatura.style.backgroundImage = `url(${poster.imagen})`;
    miniatura.style.backgroundSize  = "cover";
    miniatura.style.backgroundPosition = "center";

    if (poster.popular) document.getElementById("posterPopular").style.display = "block";

    iniciarZoom(poster.imagen);
    iniciar360();
    cargarRelacionados(id);
}

/* ── Tabs foto/360 ── */
document.getElementById("tabFoto").addEventListener("click", () => {
    document.getElementById("tabFoto").classList.add("activo");
    document.getElementById("tab360").classList.remove("activo");
    document.getElementById("vistaFoto").classList.remove("oculto");
    document.getElementById("vista360").classList.add("oculto");
});

document.getElementById("tab360").addEventListener("click", () => {
    document.getElementById("tab360").classList.add("activo");
    document.getElementById("tabFoto").classList.remove("activo");
    document.getElementById("vista360").classList.remove("oculto");
    document.getElementById("vistaFoto").classList.add("oculto");
});

/* ── Zoom ── */
function iniciarZoom(imgSrc) {
    const zonaZoom  = document.getElementById("zonaZoom");
    const lupa      = document.getElementById("lupa");
    const resultado = document.getElementById("zoomResultado");
    const nivel     = 2.5;

    zonaZoom.addEventListener("mousemove", e => {
        const rect = zonaZoom.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const pctX = (x / rect.width) * 100, pctY = (y / rect.height) * 100;
        lupa.style.left = `${x}px`; lupa.style.top = `${y}px`;
        lupa.style.backgroundImage = `url(${imgSrc})`;
        lupa.style.backgroundSize  = `${rect.width * nivel}px ${rect.height * nivel}px`;
        lupa.style.backgroundPosition = `${pctX}% ${pctY}%`;
        resultado.style.backgroundImage = `url(${imgSrc})`;
        resultado.style.backgroundSize  = `${300 * nivel}px auto`;
        resultado.style.backgroundPosition = `${pctX}% ${pctY}%`;
    });
}

/* ── Vista 360º ── */
function iniciar360() {
    const contenedor = document.querySelector(".contenedor-360");
    const img        = document.getElementById("imagen360");
    const fill       = document.getElementById("progresoFill");
    let arrastrando = false, inicioX = 0, rotacion = 0, velocidad = 0, animacion = null;

    contenedor.style.perspective = "800px";
    img.style.transformOrigin    = "center center";

    function aplicarRotacion(grados) {
        const norm = ((grados % 360) + 360) % 360;
        img.style.transform = `rotateY(${grados}deg)`;
        const cos = Math.cos((grados * Math.PI) / 180);
        img.style.filter    = `brightness(${0.6 + 0.4 * Math.abs(cos)})`;
        fill.style.width    = `${(norm / 360) * 100}%`;
    }

    function inerciaGiro() {
        if (Math.abs(velocidad) < 0.1) return;
        velocidad *= 0.93; rotacion += velocidad;
        aplicarRotacion(rotacion);
        animacion = requestAnimationFrame(inerciaGiro);
    }

    contenedor.addEventListener("mousedown", e => { cancelAnimationFrame(animacion); arrastrando = true; inicioX = e.clientX; contenedor.classList.add("girando"); contenedor.style.cursor = "grabbing"; });
    window.addEventListener("mousemove", e => { if (!arrastrando) return; const diff = e.clientX - inicioX; velocidad = diff * 0.4; rotacion += velocidad; inicioX = e.clientX; aplicarRotacion(rotacion); });
    window.addEventListener("mouseup",   () => { if (!arrastrando) return; arrastrando = false; contenedor.style.cursor = "grab"; inerciaGiro(); });
    contenedor.addEventListener("touchstart", e => { cancelAnimationFrame(animacion); inicioX = e.touches[0].clientX; contenedor.classList.add("girando"); }, { passive: true });
    contenedor.addEventListener("touchmove",  e => { const diff = e.touches[0].clientX - inicioX; velocidad = diff * 0.4; rotacion += velocidad; inicioX = e.touches[0].clientX; aplicarRotacion(rotacion); e.preventDefault(); }, { passive: false });
    contenedor.addEventListener("touchend",   () => { inerciaGiro(); });

    function autoGiro() { rotacion += 0.3; aplicarRotacion(rotacion); animacion = requestAnimationFrame(autoGiro); }
    autoGiro();
    contenedor.addEventListener("mousedown",  () => cancelAnimationFrame(animacion));
    contenedor.addEventListener("touchstart", () => cancelAnimationFrame(animacion));
}

/* ── Relacionados ── */
function cargarRelacionados(idActual) {
    const grid = document.getElementById("gridRelacionados");
    const relacionados = Object.values(POSTERS).filter(p => p.id !== idActual).sort(() => Math.random() - 0.5).slice(0, 4);
    grid.innerHTML = relacionados.map(p => `
        <a href="detalle.html?id=${p.id}" class="tarjeta-relacionado">
            <div class="imagen-relacionado"><img src="${p.imagen}" alt="${p.titulo}" loading="lazy"></div>
            <div class="info-relacionado">
                <h4>${p.titulo}</h4>
                <p>${p.artista}</p>
                <span class="precio-relacionado">${p.precio}</span>
            </div>
        </a>`).join('');
}

/* ── Cantidad y carrito ── */
document.getElementById("btnMas").addEventListener("click",   () => { cantidad++; document.getElementById("cantidad").textContent = cantidad; });
document.getElementById("btnMenos").addEventListener("click", () => { if (cantidad > 1) { cantidad--; document.getElementById("cantidad").textContent = cantidad; } });

document.getElementById("btnAnadirCarrito").addEventListener("click", () => {
    const params  = new URLSearchParams(window.location.search);
    const id      = parseInt(params.get("id")) || 1;
    const poster  = POSTERS[id];
    if (!poster) return;
    if (typeof Carrito !== 'undefined') {
        Carrito.agregar({ id: poster.id, nombre: poster.titulo, precio: poster.precio, tipo: 'poster', imagen: poster.imagen });
    }
    const aviso = document.getElementById("avisoCarrito");
    aviso.style.display = "flex";
    setTimeout(() => { aviso.style.display = "none"; }, 3000);
});

document.addEventListener("DOMContentLoaded", cargarPoster);