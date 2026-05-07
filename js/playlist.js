/* ============================================================
   PLAYLIST.JS — Lógica del reproductor de música
   Header, footer y btn-subir los gestiona header.js
   ============================================================ */


/* ============================================================
   DATOS
   TODO (Spring Boot): GET /api/playlist
   ============================================================ */
const CANCIONES = [
    { id: 1,  titulo: 'De Ti Depende',                artista: 'Héctor Lavoe',          album: 'De Ti Depende',          genero: 'Salsa',       duracion: '4:12', portada: '../img/disc5.jpg',  audio: '../audio/pista1.mp3'  },
    { id: 2,  titulo: 'YHLQMDLG',                     artista: 'Bad Bunny',             album: 'YHLQMDLG',               genero: 'Reggaeton',   duracion: '3:58', portada: '../img/disc3.png',  audio: '../audio/pista2.mp3'  },
    { id: 3,  titulo: 'Sr. Santos',                   artista: 'Arcángel',              album: 'Sr. Santos',             genero: 'Trap',        duracion: '4:30', portada: '../img/disc1.png',  audio: '../audio/pista3.mp3'  },
    { id: 4,  titulo: 'Random Access Memories',       artista: 'Daft Punk',             album: 'Random Access Memories', genero: 'Electronic',  duracion: '5:21', portada: '../img/disc2.png',  audio: '../audio/pista4.mp3'  },
    { id: 5,  titulo: 'Alright',                      artista: 'Kendrick Lamar',        album: 'To Pimp a Butterfly',    genero: 'Hip-Hop',     duracion: '3:39', portada: '../img/disc4.png',  audio: '../audio/pista5.mp3'  },
    { id: 6,  titulo: 'Get Lucky',                    artista: 'Daft Punk ft. Pharrell', album: 'Random Access Memories', genero: 'Electronic', duracion: '4:08', portada: '../img/disc6.png',  audio: '../audio/pista6.mp3'  },
    { id: 7,  titulo: 'Midnight Blue',                artista: 'Kenny Burrell',         album: 'Midnight Blue',          genero: 'Jazz',        duracion: '5:45', portada: '../img/disc7.png',  audio: '../audio/pista7.mp3'  },
    { id: 8,  titulo: 'El Presente Es lo Que Tenemos',artista: 'Shinova',               album: 'El Presente...',         genero: 'Rock',        duracion: '4:02', portada: '../img/disc8.png',  audio: '../audio/pista8.mp3'  },
    { id: 9,  titulo: 'Let It Happen',                artista: 'Tame Impala',           album: 'Currents',               genero: 'Psychedelic', duracion: '7:47', portada: '../img/disc9.png',  audio: '../audio/pista9.mp3'  },
    { id: 10, titulo: 'Do I Wanna Know?',             artista: 'Arctic Monkeys',        album: 'AM',                     genero: 'Rock',        duracion: '4:32', portada: '../img/disc10.png', audio: '../audio/pista10.mp3' }
];


/* Estado del reproductor */
let indiceActual        = -1;
let estaReproduciendo   = false;
let modoAleatorio       = false;
let modoRepetir         = false;
let arrastrandoProgreso = false;


/* Referencias a elementos del DOM */
const audio           = document.getElementById('audioPlayer');
const btnPlay         = document.getElementById('btnPlay');
const iconoPlay       = document.getElementById('iconoPlay');
const btnSig          = document.getElementById('btnSiguiente');
const btnAnt          = document.getElementById('btnAnterior');
const btnAleatorio    = document.getElementById('btnAleatorio');
const btnRepetir      = document.getElementById('btnRepetir');
const barraReprod     = document.getElementById('barraReproductor');
const reproTitulo     = document.getElementById('reproductorTitulo');
const reproArtista    = document.getElementById('reproductorArtista');
const reproPortada    = document.getElementById('reproductorPortada');
const barraProgreso   = document.getElementById('barraProgreso');
const progresoRelleno = document.getElementById('progresoRelleno');
const progresoPunto   = document.getElementById('progresoPunto');
const tiempoActual    = document.getElementById('tiempoActual');
const tiempoTotal     = document.getElementById('tiempoTotal');
const sliderVolumen   = document.getElementById('sliderVolumen');
const iconoVolumen    = document.getElementById('iconoVolumen');
const viniloDiscoEl   = document.querySelector('.vinilo-disco');
const viniloTituloEl  = document.getElementById('viniloTitulo');
const portadaViniloEl = document.getElementById('portadaVinilo');
const listaCanciones  = document.getElementById('listaCanciones');


/* Genera las filas de canciones en la lista */
function renderLista() {
    if (!listaCanciones) return;
    listaCanciones.innerHTML = CANCIONES.map((c, i) => `
        <div class="fila-cancion" id="fila-${i}" data-index="${i}" onclick="seleccionarCancion(${i})">
            <div class="col-num-valor">
                <span class="num-texto">${i + 1}</span>
                <i class="fa-solid fa-play icono-play-fila"></i>
            </div>
            <div class="col-titulo-valor">
                <img src="${c.portada}" alt="${c.titulo}" class="portada-mini"
                    onerror="this.src='https://via.placeholder.com/44x44/12103A/7B2FFF?text=♪'">
                <div class="titulo-info">
                    <span class="nombre-cancion">${c.titulo}</span>
                    <span class="nombre-artista">${c.artista}</span>
                </div>
            </div>
            <div class="col-album-valor">${c.album}</div>
            <div class="col-genero-valor">${c.genero}</div>
            <div class="col-duracion-valor">${c.duracion}</div>
        </div>`).join('');
}


/* Carga una canción en el reproductor sin reproducirla */
function cargarCancion(index) {
    const cancion = CANCIONES[index];
    if (!cancion) return;
    indiceActual = index;

    /* Actualizar info del reproductor */
    reproTitulo.textContent    = cancion.titulo;
    reproArtista.textContent   = cancion.artista;
    reproPortada.src           = cancion.portada;

    /* Actualizar vinilo del hero */
    viniloTituloEl.textContent = cancion.titulo;
    portadaViniloEl.src        = cancion.portada;

    audio.src = cancion.audio;
    audio.load();
    tiempoTotal.textContent = cancion.duracion;

    /* Marcar fila activa en la lista */
    document.querySelectorAll('.fila-cancion').forEach(f => f.classList.remove('activa'));
    const filaActiva = document.getElementById(`fila-${index}`);
    if (filaActiva) {
        filaActiva.classList.add('activa');
        filaActiva.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
}


/* Iniciar reproducción */
function reproducir() {
    const promesa = audio.play();
    if (promesa !== undefined) promesa.catch(() => {});
    estaReproduciendo   = true;
    iconoPlay.className = 'fa-solid fa-pause';
    viniloDiscoEl?.classList.add('girando');
    barraReprod?.classList.add('reproduciendo');
}

/* Pausar reproducción */
function pausar() {
    audio.pause();
    estaReproduciendo   = false;
    iconoPlay.className = 'fa-solid fa-play';
    viniloDiscoEl?.classList.remove('girando');
    barraReprod?.classList.remove('reproduciendo');
}

/* Toggle play/pausa */
function togglePlay() {
    if (indiceActual === -1) { seleccionarCancion(0); return; }
    estaReproduciendo ? pausar() : reproducir();
}

/* Selecciona y reproduce una canción de la lista */
function seleccionarCancion(index) {
    if (index === indiceActual && estaReproduciendo) { pausar(); return; }
    cargarCancion(index);
    reproducir();
}

/* Ir a la canción anterior */
function cancionAnterior() {
    let siguiente = indiceActual - 1;
    if (siguiente < 0) siguiente = CANCIONES.length - 1;
    seleccionarCancion(siguiente);
}

/* Ir a la siguiente canción — aleatoria o secuencial */
function cancionSiguiente() {
    let siguiente;
    if (modoAleatorio) {
        do {
            siguiente = Math.floor(Math.random() * CANCIONES.length);
        } while (siguiente === indiceActual && CANCIONES.length > 1);
    } else {
        siguiente = (indiceActual + 1) % CANCIONES.length;
    }
    seleccionarCancion(siguiente);
}


/* Formatea segundos a formato M:SS */
function formatearTiempo(seg) {
    if (isNaN(seg)) return '0:00';
    return `${Math.floor(seg / 60)}:${Math.floor(seg % 60).toString().padStart(2, '0')}`;
}

/* Actualiza la barra de progreso en tiempo real */
audio.addEventListener('timeupdate', () => {
    if (arrastrandoProgreso || !audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progresoRelleno.style.width = `${pct}%`;
    progresoPunto.style.left    = `${pct}%`;
    tiempoActual.textContent    = formatearTiempo(audio.currentTime);
    tiempoTotal.textContent     = formatearTiempo(audio.duration);
});

/* Al terminar la canción — repetir o pasar a la siguiente */
audio.addEventListener('ended', () => {
    modoRepetir ? (audio.currentTime = 0, reproducir()) : cancionSiguiente();
});

/* Clic en la barra de progreso — saltar a ese punto */
barraProgreso.addEventListener('click', e => {
    if (!audio.duration) return;
    const rect = barraProgreso.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
});

/* Arrastrar la barra de progreso */
barraProgreso.addEventListener('mousedown', () => { arrastrandoProgreso = true; });
document.addEventListener('mouseup',   () => { arrastrandoProgreso = false; });
document.addEventListener('mousemove', e => {
    if (!arrastrandoProgreso || !audio.duration) return;
    const rect = barraProgreso.getBoundingClientRect();
    audio.currentTime = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)) * audio.duration;
});


/* Control de volumen — slider */
audio.volume = parseFloat(sliderVolumen.value);
sliderVolumen.addEventListener('input', () => {
    audio.volume = parseFloat(sliderVolumen.value);
    /* Actualiza icono según nivel de volumen */
    iconoVolumen.className = audio.volume === 0
        ? 'fa-solid fa-volume-xmark'
        : audio.volume < 0.5
            ? 'fa-solid fa-volume-low'
            : 'fa-solid fa-volume-high';
});

/* Toggle mute al hacer clic en el icono de volumen */
iconoVolumen.addEventListener('click', () => {
    if (audio.volume > 0) {
        iconoVolumen.dataset.prevVol = audio.volume;
        audio.volume        = 0;
        sliderVolumen.value = 0;
        iconoVolumen.className = 'fa-solid fa-volume-xmark';
    } else {
        const prev          = parseFloat(iconoVolumen.dataset.prevVol || 0.8);
        audio.volume        = prev;
        sliderVolumen.value = prev;
        iconoVolumen.className = 'fa-solid fa-volume-high';
    }
});


/* Botones de control del reproductor */
btnPlay.addEventListener('click',      togglePlay);
btnSig.addEventListener('click',       cancionSiguiente);
btnAnt.addEventListener('click',       cancionAnterior);

/* Toggle modo aleatorio */
btnAleatorio.addEventListener('click', () => {
    modoAleatorio = !modoAleatorio;
    btnAleatorio.classList.toggle('activo', modoAleatorio);
});

/* Toggle modo repetir */
btnRepetir.addEventListener('click', () => {
    modoRepetir = !modoRepetir;
    btnRepetir.classList.toggle('activo', modoRepetir);
});


/* Atajos de teclado — espacio, flecha izquierda, flecha derecha */
document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space')      { e.preventDefault(); togglePlay(); }
    if (e.code === 'ArrowRight') { e.preventDefault(); cancionSiguiente(); }
    if (e.code === 'ArrowLeft')  { e.preventDefault(); cancionAnterior(); }
});


/* Actualiza el contador de canciones en el hero */
function actualizarStats() {
    const el = document.getElementById('statCanciones');
    if (el) el.textContent = CANCIONES.length;
}


/* Inicialización — animación del hero, lista y stats */
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.getElementById('playlistHero');
    setTimeout(() => hero?.classList.add('visible'), 250);
    renderLista();
    actualizarStats();
});