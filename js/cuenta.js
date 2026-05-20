/* ============================================================
   CUENTA.JS — Lógica completa de la página de cuenta
   ============================================================ */


/* ============================================================
   SISTEMA DE NIVELES Y BENEFICIOS
   Bronce: 0–499 pts  |  Plata: 500–1499 pts  |  Oro: 1500+
   ============================================================ */
const NIVELES = [
    {
        nombre:      'Bronce',
        min:         0,
        max:         499,
        siguiente:   500,
        color:       '#cd7f32',
        colorBg:     'rgba(205,127,50,0.10)',
        colorBorder: 'rgba(205,127,50,0.22)',
        beneficios:  [
            '1 punto por cada €1 gastado',
            'Acceso a novedades 24h antes que el público',
            '5% de descuento exclusivo en tu cumpleaños',
            'Devoluciones en 30 días sin preguntas',
            'Envío gratis en compras superiores a €100',
            'Acceso a la playlist exclusiva de Vinyl Sounds',
        ],
    },
    {
        nombre:      'Plata',
        min:         500,
        max:         1499,
        siguiente:   1500,
        color:       '#a8b8c8',
        colorBg:     'rgba(168,184,200,0.10)',
        colorBorder: 'rgba(168,184,200,0.22)',
        beneficios:  [
            'Todo lo de Bronce +',
            '10% de descuento en todas tus compras',
            'Preventas exclusivas 48h antes que nadie',
            'Devoluciones gratuitas — sin pagar el envío de vuelta',
            'Acceso a vinilos de edición limitada antes de agotarse',
            '+10 pts de bienvenida al subir a este nivel',
        ],
    },
    {
        nombre:      'Oro',
        min:         1500,
        max:         Infinity,
        siguiente:   null,
        color:       '#f0b429',
        colorBg:     'rgba(240,180,41,0.10)',
        colorBorder: 'rgba(240,180,41,0.22)',
        beneficios:  [
            'Todo lo de Plata +',
            '15% de descuento en toda la tienda siempre',
            'Envío gratis permanente — sin mínimo de compra',
            'Acceso VIP 72h antes a lanzamientos exclusivos',
            'Regalo sorpresa en cada pedido (+€10 de valor)',
            'Gestor de cuenta personal — atención directa',
            'Invitación a eventos y escuchas privadas',
            '+25 pts de bienvenida al subir a este nivel',
        ],
    },
];

function getNivel(pts) {
    return NIVELES.find(n => pts >= n.min && pts <= n.max) || NIVELES[0];
}

/* Descuento automático por nivel sobre el total de compra */
function getDescuentoNivel(pts, total) {
    const nv = getNivel(pts);
    if (nv.nombre === 'Oro')   return +(total * 0.15).toFixed(2);
    if (nv.nombre === 'Plata') return +(total * 0.10).toFixed(2);
    return 0;
}


/* ============================================================
   DATOS DEL USUARIO
   ============================================================ */
const USUARIO = {
    nombre:    'Alex',
    apellidos: 'Rodríguez',
    email:     'alex.music@ejemplo.com',
    telefono:  '+34 600 000 000',
    /* puntosHistorico — total acumulado de por vida → determina el nivel, NUNCA baja */
    puntosHistorico:    1250,
    /* puntosDisponibles — saldo para canjear = histórico − ya canjeados */
    puntosDisponibles:  1250,
    nivelAnterior:      'Plata',
};

/* Alias para compatibilidad con getNivel() que usa USUARIO.puntos */
Object.defineProperty(USUARIO, 'puntos', {
    get() { return this.puntosHistorico; },
    set(v) { this.puntosHistorico = v; },
});

/* Contador de pedidos para generar IDs */
let contadorPedidos = 4024;


/* ============================================================
   PEDIDOS
   ============================================================ */
const PEDIDOS = [
    {
        id: '#4024', estado: 'en-camino', estadoLabel: 'EN CAMINO',
        items: [
            { nombre: 'Tame Impala – Currents',          tipo: 'LP Edición Limitada', precio: 32.00 },
            { nombre: 'The Strokes – The New Abnormal',  tipo: 'Cassette',            precio: 14.00 },
            { nombre: 'Arctic Monkeys – AM',             tipo: 'LP',                  precio: 12.50 },
        ],
        total: 58.50, fecha: '28 Oct 2023', puntos: 58,
        seguimiento: 'TRK4024ES',
        pasos: [
            { titulo: 'Pedido confirmado',          fecha: '20 Oct 2023 · 10:22',  estado: 'done' },
            { titulo: 'Preparando envío',            fecha: '21 Oct 2023 · 14:05',  estado: 'done' },
            { titulo: 'Recogido por transportista',  fecha: '22 Oct 2023 · 09:30',  estado: 'done' },
            { titulo: 'En tránsito',                 fecha: '24 Oct 2023 · 07:00',  estado: 'actual' },
            { titulo: 'Entregado',                   fecha: 'Estimado: 28 Oct 2023', estado: 'pendiente' },
        ],
    },
    {
        id: '#4023', estado: 'entregado', estadoLabel: 'ENTREGADO',
        items: [
            { nombre: 'Arctic Monkeys – AM',         tipo: 'LP',             precio: 25.00 },
            { nombre: 'Gorillaz – Cracker Island',   tipo: 'Camiseta Talla M', precio: 20.00 },
        ],
        total: 45.00, fecha: '24 Oct 2023', puntos: 45, seguimiento: null,
        pasos: [
            { titulo: 'Pedido confirmado', fecha: '18 Oct 2023', estado: 'done' },
            { titulo: 'Preparando envío',  fecha: '19 Oct 2023', estado: 'done' },
            { titulo: 'En tránsito',       fecha: '21 Oct 2023', estado: 'done' },
            { titulo: 'Entregado',         fecha: '24 Oct 2023', estado: 'done' },
        ],
    },
    {
        id: '#4021', estado: 'entregado', estadoLabel: 'ENTREGADO',
        items: [
            { nombre: 'Rosalía – Motomami',                    tipo: 'Vinilo Color', precio: 40.00 },
            { nombre: 'Daft Punk – Random Access Memories',    tipo: 'Doble LP',     precio: 32.00 },
        ],
        total: 72.00, fecha: '10 Oct 2023', puntos: 72, seguimiento: null,
        pasos: [
            { titulo: 'Pedido confirmado', fecha: '05 Oct 2023', estado: 'done' },
            { titulo: 'En tránsito',       fecha: '07 Oct 2023', estado: 'done' },
            { titulo: 'Entregado',         fecha: '10 Oct 2023', estado: 'done' },
        ],
    },
];


/* ============================================================
   HISTORIAL DE PUNTOS
   Tipos: compra | canje | bonus | registro | nivel
   ============================================================ */
const HISTORIAL_PUNTOS = [
    { desc: 'Compra #4024 — 3 artículos',  fecha: '22 Oct 2023', pts: +58,  tipo: 'positivo', icono: 'fa-bag-shopping' },
    { desc: 'Compra #4023 — 2 artículos',  fecha: '18 Oct 2023', pts: +45,  tipo: 'positivo', icono: 'fa-bag-shopping' },
    { desc: 'Compra #4021 — 2 artículos',  fecha: '05 Oct 2023', pts: +72,  tipo: 'positivo', icono: 'fa-bag-shopping' },
    { desc: 'Canje — cupón de €7,50 (disponibles: 1.175 pts)',  fecha: '01 Oct 2023', pts: -75, tipo: 'negativo', icono: 'fa-tag' },
    { desc: 'Bonus — subida a nivel Plata', fecha: '01 Oct 2023', pts: +50,  tipo: 'positivo', icono: 'fa-crown' },
    { desc: 'Bonus — registro en Vinyl Sounds', fecha: '15 Sep 2023', pts: +100, tipo: 'positivo', icono: 'fa-star' },
];





/* ============================================================
   DIRECCIONES
   ============================================================ */
let DIRECCIONES = [
    { id: 1, icono: 'fa-house',     titulo: 'Casa',    nombre: 'Alex Rodríguez',  linea1: 'Calle Gran Vía 24, 3ªA',    linea2: '28013 Madrid',    pais: 'España', predeterminada: true  },
    { id: 2, icono: 'fa-briefcase', titulo: 'Oficina', nombre: 'Vinyl Sounds HQ', linea1: 'Avenida de la Música 10',   linea2: '08001 Barcelona', pais: 'España', predeterminada: false },
];

let editandoDirId = null;


/* ============================================================
   NAVEGACIÓN ENTRE SECCIONES
   ============================================================ */
document.querySelectorAll('.nav-item[data-sec]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item[data-sec]').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        document.querySelectorAll('.sec').forEach(s => s.classList.add('oculta'));
        document.getElementById('sec-' + btn.dataset.sec)?.classList.remove('oculta');
    });
});


/* ============================================================
   MODALES — abrir / cerrar
   ============================================================ */
function abrirModal(id) {
    document.getElementById(id)?.classList.add('abierto');
    document.body.style.overflow = 'hidden';
}

function cerrarModal(id) {
    document.getElementById(id)?.classList.remove('abierto');
    document.body.style.overflow = '';
}

document.querySelectorAll('.modal-cerrar, .mpx-cerrar').forEach(btn => {
    btn.addEventListener('click', () => cerrarModal(btn.dataset.modal));
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) cerrarModal(overlay.id);
    });
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.abierto').forEach(m => cerrarModal(m.id));
    }
});


/* ============================================================
   INICIALIZACIÓN DEL USUARIO
   ============================================================ */
function iniciales(n, a) { return ((n[0] || '') + (a[0] || '')).toUpperCase(); }

function cargarUsuario() {
    const ini  = iniciales(USUARIO.nombre, USUARIO.apellidos);
    const nv   = getNivel(USUARIO.puntos);
    const sigNv = NIVELES.find(n => n.min === nv.siguiente);

    /* Sidebar — nombre, email, nivel */
    document.getElementById('sidebarNombre').textContent = `${USUARIO.nombre} ${USUARIO.apellidos}`;
    document.getElementById('sidebarEmail').textContent  = USUARIO.email;

    const badgeEl = document.getElementById('sidebarNivel');
    badgeEl.innerHTML      = `<i class="fa-solid fa-crown"></i> ${nv.nombre}`;
    badgeEl.style.background   = nv.colorBg;
    badgeEl.style.borderColor  = nv.colorBorder;
    badgeEl.style.color        = nv.color;

    /* Iniciales del avatar */
    document.getElementById('avatarIniciales').textContent = ini;
    document.getElementById('perfilIniciales').textContent = ini;

    /* Puntos en sidebar */
    const puntosFillEl = document.getElementById('puntosFill');
    const pct = nv.siguiente
        ? Math.min(100, ((USUARIO.puntos - nv.min) / (nv.siguiente - nv.min)) * 100)
        : 100;

    /* Sidebar muestra los puntos disponibles para canjear */
    document.getElementById('sidebarPuntos').textContent  = USUARIO.puntosDisponibles.toLocaleString('es-ES');
    document.getElementById('sidebarPuntos').style.color  = nv.color;
    puntosFillEl.style.background = `linear-gradient(90deg, ${nv.color}, ${nv.color}aa)`;
    setTimeout(() => { puntosFillEl.style.width = pct + '%'; }, 400);

    document.getElementById('puntosMeta').textContent = nv.siguiente
        ? `${nv.siguiente - USUARIO.puntosHistorico} pts para ${sigNv?.nombre}`
        : '¡Nivel máximo alcanzado!';

    /* KPI puntos */
    document.getElementById('kpiPuntos').textContent = `${USUARIO.puntosDisponibles.toLocaleString('es-ES')} pts`;

    /* KPI en curso */
    const enCurso = PEDIDOS.filter(p => p.estado !== 'entregado').length;
    document.getElementById('kpiEnCurso').textContent = `${enCurso} Pedido${enCurso !== 1 ? 's' : ''}`;

    /* Formulario de perfil */
    /* Guarda puntos en localStorage para que pago.js los lea */
    localStorage.setItem('vs_puntos_usuario', JSON.stringify({
        puntosHistorico:   USUARIO.puntosHistorico,
        puntosDisponibles: USUARIO.puntosDisponibles,
        nivel:             nv.nombre,
    }));
    /* Guarda también el nivel por separado (usado por pago.js para descuento Oro) */
    localStorage.setItem('vs_nivel_usuario', JSON.stringify({ nombre: nv.nombre }));

    document.getElementById('perfNombre').value    = USUARIO.nombre;
    document.getElementById('perfApellidos').value = USUARIO.apellidos;
    document.getElementById('perfEmail').value     = USUARIO.email;
    document.getElementById('perfTelefono').value  = USUARIO.telefono;

    /* Detectar subida de nivel */
    const nivelActual = nv.nombre;
    if (nivelActual !== USUARIO.nivelAnterior) {
        USUARIO.nivelAnterior = nivelActual;
        const bonus = nivelActual === 'Oro' ? 25 : nivelActual === 'Plata' ? 10 : 0;
        if (bonus > 0) {
            USUARIO.puntosHistorico   += bonus;
            USUARIO.puntosDisponibles += bonus;
            HISTORIAL_PUNTOS.unshift({
                desc: `Bonus — subida a nivel ${nivelActual}`,
                fecha: fechaHoy(),
                pts:  +bonus,
                tipo: 'positivo',
                icono: 'fa-crown',
            });
            showToast(`¡Subiste a ${nivelActual}! +${bonus} pts de bonus`, 'ok');
        }
    }
}


/* ============================================================
   MODAL VINYL POINTS — con anillo, canje y filtros
   ============================================================ */

/* Anima el conteo de 0 al valor real */
function animarConteo(el, objetivo, color, duracion = 1200) {
    const inicio = performance.now();
    function step(ahora) {
        const progreso = Math.min((ahora - inicio) / duracion, 1);
        const ease     = 1 - Math.pow(1 - progreso, 3);
        el.textContent = Math.round(objetivo * ease).toLocaleString('es-ES') + ' pts';
        el.style.color = color;
        if (progreso < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

/* Anima el gauge tipo velocímetro SVG
   El arco va de -180° (izquierda) a 0° (derecha) — 180° de rango total */
function animarGauge(pct, nv) {
    const progress = document.getElementById('gaugeProgress');
    const aguja    = document.getElementById('gaugeAguja');
    if (!progress || !aguja) return;

    const totalArc = 257;
    const offset   = totalArc - (totalArc * pct / 100);

    progress.style.stroke            = nv.color;
    progress.style.strokeDasharray   = totalArc;
    progress.style.strokeDashoffset  = totalArc;

    setTimeout(() => {
        progress.style.transition       = 'stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)';
        progress.style.strokeDashoffset = offset;
    }, 120);

    const grados = -90 + (180 * pct / 100);
    setTimeout(() => {
        aguja.style.transition = 'transform 1.4s cubic-bezier(0.34,1.56,0.64,1)';
        aguja.setAttribute('transform', `rotate(${grados} 100 112)`);
    }, 120);

    /* Fondo hero dinámico */
    const bg = document.getElementById('mpxHeroBg');
    if (bg) bg.style.background = `radial-gradient(ellipse 80% 60% at 50% 0%, ${nv.color}, transparent)`;

    /* Etiquetas */
    const labelEl  = document.getElementById('gaugeNivelLabel');
    const ptsLabel = document.getElementById('gaugePtsLabel');
    if (labelEl) { labelEl.textContent = nv.nombre.toUpperCase(); labelEl.style.color = nv.color; }
    if (ptsLabel) ptsLabel.textContent = `${USUARIO.puntosHistorico.toLocaleString('es-ES')} pts`;

    const brEl = document.getElementById('gaugeLabelBronce');
    const plEl = document.getElementById('gaugeLabelPlata');
    const orEl = document.getElementById('gaugeLabelOro');
    if (brEl) brEl.textContent = `${NIVELES[0].min}`;
    if (plEl) plEl.textContent = `${NIVELES[1].min.toLocaleString('es-ES')}`;
    if (orEl) orEl.textContent = `${NIVELES[2].min.toLocaleString('es-ES')}+`;
}

function renderHistorial() {
    const hist  = document.getElementById('modalHistPuntos');
    const lista = filtroHist === 'todos'
        ? HISTORIAL_PUNTOS
        : HISTORIAL_PUNTOS.filter(h => filtroHist === 'ganados' ? h.pts > 0 : h.pts < 0);

    if (lista.length === 0) {
        hist.innerHTML = `<p class="hist-vacio">Sin movimientos en esta categoría</p>`;
        return;
    }

    hist.innerHTML = lista.map(h => {
        const esPedido = h.desc.startsWith('Compra #');
        const pid      = esPedido ? h.desc.split('#')[1].split(' ')[0] : null;
        const desc     = esPedido
            ? `<span class="hist-item-desc hist-link" data-pid="#${pid}">${h.desc}</span>`
            : `<span class="hist-item-desc">${h.desc}</span>`;
        return `
        <div class="hist-item">
            <i class="fa-solid ${h.icono || 'fa-circle'} hist-icono ${h.tipo}"></i>
            <div class="hist-item-info">
                ${desc}
                <span class="hist-item-fecha">${h.fecha}</span>
            </div>
            <span class="hist-item-pts ${h.tipo}">${h.pts > 0 ? '+' : ''}${h.pts} pts</span>
        </div>`;
    }).join('');

    /* Pedidos clickables — abren el modal de detalle */
    hist.querySelectorAll('.hist-link').forEach(el => {
        el.addEventListener('click', () => {
            cerrarModal('modalPuntos');
            abrirDetalle(el.dataset.pid);
        });
    });
}

function abrirPuntos() {
    const nv    = getNivel(USUARIO.puntosHistorico);
    const pct   = nv.siguiente
        ? Math.min(100, ((USUARIO.puntosHistorico - nv.min) / (nv.siguiente - nv.min)) * 100)
        : 100;
    const sigNv = NIVELES.find(n => n.min === nv.siguiente);

    /* Número de socio y fecha de alta en tarjeta del modal */
    const socioEl = document.getElementById('modalSocioNum');
    const altaEl  = document.getElementById('modalFechaAlta');
    if (socioEl) socioEl.textContent = document.getElementById('sidebarSocio')?.textContent || '#VS-2847';
    if (altaEl)  altaEl.textContent  = document.getElementById('perfFechaAlta')?.textContent || '–';

    /* Puntos disponibles */
    const dispEl = document.getElementById('modalPtsDisponibles');
    if (dispEl) dispEl.textContent = `${USUARIO.puntosDisponibles.toLocaleString('es-ES')} pts`;

    /* Nivel y puntos del gauge */
    const nivelActualEl = document.getElementById('gaugeNivelActual');
    const puntosEl      = document.getElementById('gaugePuntosTotal');
    if (nivelActualEl) { nivelActualEl.textContent = nv.nombre; nivelActualEl.style.color = nv.color; }
    if (puntosEl) {
        const inicio = performance.now();
        const target = USUARIO.puntosHistorico;
        function step(ahora) {
            const p = Math.min((ahora - inicio) / 1200, 1);
            const e = 1 - Math.pow(1 - p, 3);
            puntosEl.textContent = Math.round(target * e).toLocaleString('es-ES');
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    /* Banner próxima recompensa */
    const proxEl = document.getElementById('proximaRecompensa');
    if (proxEl) {
        if (nv.siguiente && sigNv) {
            const faltan = nv.siguiente - USUARIO.puntosHistorico;
            proxEl.innerHTML     = `
                <i class="fa-solid fa-trophy" style="color:${sigNv.color}"></i>
                <span>¡Solo <strong>${faltan} pts</strong> para <strong style="color:${sigNv.color}">${sigNv.nombre}</strong>
                — desbloquea: ${sigNv.beneficios[1]}</span>`;
            proxEl.style.borderColor = sigNv.color + '44';
            proxEl.style.display     = 'flex';
        } else {
            proxEl.style.display = 'none';
        }
    }

    /* Beneficios del nivel actual */
    const benEl   = document.getElementById('beneficiosActivos');
    const benIcon = document.getElementById('beneficiosIcono');
    if (benEl) {
        benEl.innerHTML = nv.beneficios.map(b =>
            `<li><i class="fa-solid fa-check" style="color:${nv.color}"></i>${b}</li>`
        ).join('');
    }
    if (benIcon) { benIcon.style.color = nv.color; }

    /* Marca la card activa en los niveles */
    ['nivelFilaBronce','nivelFilaPlata','nivelFilaOro'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('activo');
            el.style.borderColor = '';
            el.style.background  = '';
        }
    });
    const cardActiva = { 'Bronce': 'nivelFilaBronce', 'Plata': 'nivelFilaPlata', 'Oro': 'nivelFilaOro' }[nv.nombre];
    if (cardActiva) {
        const el = document.getElementById(cardActiva);
        if (el) {
            el.classList.add('activo');
            el.style.borderColor = nv.color + '55';
            el.style.background  = nv.color + '0a';
        }
    }

    abrirModal('modalPuntos');
    animarGauge(pct, nv);

    /* Historial */
    filtroHist = 'todos';
    document.querySelectorAll('.btn-filtro-hist').forEach(b =>
        b.classList.toggle('activo', b.dataset.filtro === 'todos')
    );
    renderHistorial();
}

document.getElementById('btnPuntos')?.addEventListener('click', abrirPuntos);
document.getElementById('kpiPuntosBtn')?.addEventListener('click', abrirPuntos);


/* ── Filtros del historial ── */
document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-filtro-hist');
    if (!btn) return;
    filtroHist = btn.dataset.filtro;
    document.querySelectorAll('.btn-filtro-hist').forEach(b => b.classList.toggle('activo', b === btn));
    renderHistorial();
});







/* ============================================================
   RENDER DE PEDIDOS
   ============================================================ */
function renderPedidos() {
    const lista = document.getElementById('listaPedidos');
    lista.innerHTML = PEDIDOS.map(p => {
        const nombres = p.items.map(i => i.nombre).join(', ');
        const corto   = nombres.length > 75 ? nombres.slice(0, 75) + '…' : nombres;
        const estadoIcon  = p.estado === 'en-camino' ? 'fa-truck' : 'fa-circle-check';
        const fechaLabel  = p.estado === 'entregado'
            ? `Entregado el ${p.fecha}`
            : `Estimado: ${p.fecha}`;

        return `
        <div class="pedido-card">
            <span class="pedido-badge ${p.estado}">
                <i class="fa-solid ${estadoIcon}"></i> ${p.estadoLabel}
            </span>
            <div class="pedido-info">
                <div class="pedido-num">Pedido ${p.id}</div>
                <div class="pedido-items-lista" title="${nombres}">${corto}</div>
                <div class="pedido-meta">
                    <i class="fa-solid fa-${p.estado === 'entregado' ? 'circle-check' : 'calendar'}"></i>
                    ${fechaLabel} &nbsp;·&nbsp;
                    <span class="pedido-pts">
                        <i class="fa-solid fa-crown"></i> +${p.puntos} pts
                    </span>
                </div>
            </div>
            <div class="pedido-precio">${p.total.toFixed(2)}€</div>
            <div class="pedido-acciones">
                ${p.seguimiento ? `<button class="btn-seguir" data-pid="${p.id}"><i class="fa-solid fa-truck"></i> Seguir Envío</button>` : ''}
                <button class="btn-detalle" data-pid="${p.id}"><i class="fa-solid fa-list-ul"></i> Ver Detalles</button>
                <button class="btn-factura" data-pid="${p.id}"><i class="fa-solid fa-file-pdf"></i> Factura PDF</button>
            </div>
        </div>`;
    }).join('');

    /* Eventos botones */
    lista.querySelectorAll('.btn-seguir').forEach(btn =>
        btn.addEventListener('click', () => abrirSeguimiento(btn.dataset.pid)));
    lista.querySelectorAll('.btn-detalle').forEach(btn =>
        btn.addEventListener('click', () => abrirDetalle(btn.dataset.pid)));
    lista.querySelectorAll('.btn-factura').forEach(btn =>
        btn.addEventListener('click', () => abrirFactura(btn.dataset.pid)));
}


/* ── Modal Seguimiento ── */
function abrirSeguimiento(pid) {
    const p = PEDIDOS.find(x => x.id === pid);
    if (!p) return;
    document.getElementById('segPedidoId').textContent = p.id;
    document.getElementById('segNumero').textContent   = p.seguimiento || '—';
    document.getElementById('btnSeguirExterno').href   =
        `https://www.correos.es/ss/Satellite/site/aplicacion-5138944704257/tracking?tracking=${p.seguimiento}`;

    document.getElementById('segTimeline').innerHTML = p.pasos.map(paso => `
        <div class="seg-paso ${paso.estado}">
            <div class="seg-paso-info">
                <span class="seg-paso-titulo">${paso.titulo}</span>
                <span class="seg-paso-fecha">${paso.fecha}</span>
            </div>
        </div>`).join('');

    abrirModal('modalSeguimiento');
}


/* ── Modal Detalle ── */
function abrirDetalle(pid) {
    const p = PEDIDOS.find(x => x.id === pid);
    if (!p) return;
    document.getElementById('detallePedidoId').textContent = p.id;

    document.getElementById('detalleItems').innerHTML = p.items.map(item => `
        <div class="detalle-item">
            <div>
                <div class="detalle-item-nombre">${item.nombre}</div>
                <div class="detalle-item-tipo">${item.tipo}</div>
            </div>
            <div class="detalle-item-precio">${item.precio.toFixed(2)} €</div>
        </div>`).join('');

    const envio = p.estado === 'entregado' ? 0 : 4.95;
    document.getElementById('detalleResumen').innerHTML = `
        <div class="det-res-fila"><span>Subtotal</span><span>${(p.total - envio).toFixed(2)} €</span></div>
        <div class="det-res-fila"><span>Envío</span><span>${envio === 0 ? 'Gratis' : envio.toFixed(2) + ' €'}</span></div>
        <div class="det-res-fila total"><span>Total</span><span>${p.total.toFixed(2)} €</span></div>
        <div class="det-res-fila"><span>Puntos ganados</span>
            <span class="det-res-pts"><i class="fa-solid fa-crown"></i> +${p.puntos} pts</span>
        </div>`;

    abrirModal('modalDetalle');
}


/* ── Modal Factura ── */
function abrirFactura(pid) {
    const p = PEDIDOS.find(x => x.id === pid);
    if (!p) return;
    const fecha   = fechaHoy();
    const lineas  = p.items.map(i =>
        `<div class="fac-row"><span>${i.nombre} (${i.tipo})</span><span>${i.precio.toFixed(2)} €</span></div>`
    ).join('');
    const envio   = p.estado === 'entregado' ? 0 : 4.95;
    const base    = (p.total / 1.21).toFixed(2);
    const iva     = (p.total - parseFloat(base)).toFixed(2);

    document.getElementById('facturaPreview').innerHTML = `
        <h4>Vinyl Sounds</h4>
        <p>Factura simplificada nº VS-2023-${p.id.replace('#','')}</p>
        <p>Fecha: ${fecha}</p>
        <p>Cliente: ${USUARIO.nombre} ${USUARIO.apellidos}</p>
        <p>${USUARIO.email}</p>
        <hr class="fac-sep">
        <strong>ARTÍCULOS</strong><br><br>
        ${lineas}
        <hr class="fac-sep">
        <div class="fac-row"><span>Envío</span><span>${envio === 0 ? 'Gratis' : envio.toFixed(2) + ' €'}</span></div>
        <div class="fac-row"><span>Base imponible</span><span>${base} €</span></div>
        <div class="fac-row"><span>IVA (21%)</span><span>${iva} €</span></div>
        <hr class="fac-sep">
        <div class="fac-row fac-total"><strong>TOTAL</strong><strong>${p.total.toFixed(2)} €</strong></div>
        <hr class="fac-sep">
        <p style="font-size:10px;color:#666">Vinyl Sounds S.L. — CIF: B12345678</p>`;

    document.getElementById('btnDescargarPdf').onclick = () => {
        window.print();
        showToast('Enviando a impresora / Guardar como PDF', 'ok');
    };

    abrirModal('modalFactura');
}


/* ============================================================
   GUARDAR PERFIL
   ============================================================ */
document.getElementById('btnGuardarPerfil')?.addEventListener('click', () => {
    const nombre    = document.getElementById('perfNombre').value.trim();
    const apellidos = document.getElementById('perfApellidos').value.trim();
    if (!nombre) { showToast('El nombre no puede estar vacío', 'err'); return; }

    USUARIO.nombre    = nombre;
    USUARIO.apellidos = apellidos;
    USUARIO.email     = document.getElementById('perfEmail').value;
    USUARIO.telefono  = document.getElementById('perfTelefono').value;

    document.getElementById('sidebarNombre').textContent   = `${nombre} ${apellidos}`;
    document.getElementById('sidebarEmail').textContent    = USUARIO.email;
    const ini = iniciales(nombre, apellidos);
    document.getElementById('avatarIniciales').textContent = ini;
    document.getElementById('perfilIniciales').textContent = ini;
    showToast('Perfil guardado correctamente', 'ok');
});


/* ============================================================
   CAMBIAR FOTO DE AVATAR
   ============================================================ */
document.getElementById('inputFoto')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('La imagen debe ser menor de 2MB', 'err'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
        const src = ev.target.result;
        const ini  = document.getElementById('avatarIniciales');
        const img  = document.getElementById('avatarImg');
        ini.style.display = 'none';
        img.src = src;
        img.classList.remove('oculta');
        const pini = document.getElementById('perfilIniciales');
        const pimg = document.getElementById('perfilAvatar');
        pini.style.display = 'none';
        pimg.src = src;
        pimg.classList.remove('oculta');
        showToast('Foto actualizada correctamente', 'ok');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
});


/* ============================================================
   DEVOLUCIÓN
   ============================================================ */
document.getElementById('btnComenzarDev')?.addEventListener('click', () => {
    const sel = document.getElementById('devPedidoSel');
    sel.innerHTML = PEDIDOS.map(p =>
        `<option value="${p.id}">Pedido ${p.id} — ${p.total.toFixed(2)}€</option>`
    ).join('');
    abrirModal('modalDevolucion');
});

document.getElementById('btnEnviarDevolucion')?.addEventListener('click', () => {
    const motivo = document.getElementById('devMotivo').value;
    if (!motivo) { showToast('Selecciona un motivo', 'err'); return; }
    cerrarModal('modalDevolucion');
    showToast('Solicitud de devolución enviada', 'ok');
});


/* ============================================================
   DIRECCIONES
   ============================================================ */
function renderDirecciones() {
    const grid = document.getElementById('gridDirecciones');
    grid.innerHTML = DIRECCIONES.map(d => `
        <div class="dir-card ${d.predeterminada ? 'predeterminada' : ''}" data-id="${d.id}">
            <div class="dir-header">
                <div class="dir-titulo"><i class="fa-solid ${d.icono}"></i> ${d.titulo}</div>
                ${d.predeterminada ? '<span class="badge-predeterminada">Predeterminada</span>' : ''}
            </div>
            <div class="dir-info">${d.nombre}<br>${d.linea1}<br>${d.linea2}<br>${d.pais}</div>
            <div class="dir-acciones">
                <button class="btn-dir btn-dir-editar"   data-id="${d.id}"><i class="fa-regular fa-pen-to-square"></i> Editar</button>
                <button class="btn-dir btn-dir-eliminar" data-id="${d.id}"><i class="fa-solid fa-trash"></i> Eliminar</button>
                ${!d.predeterminada ? `<button class="btn-dir btn-dir-predet" data-id="${d.id}"><i class="fa-solid fa-crown"></i> Predeterminar</button>` : ''}
            </div>
        </div>`).join('');

    grid.querySelectorAll('.btn-dir-editar').forEach(btn => {
        btn.addEventListener('click', () => {
            const d = DIRECCIONES.find(x => x.id === parseInt(btn.dataset.id));
            if (!d) return;
            editandoDirId = d.id;
            document.getElementById('modalDirTitulo').innerHTML = '<i class="fa-solid fa-map-pin"></i> Editar dirección';
            document.getElementById('dirNombre').value = d.nombre;
            document.getElementById('dirTitulo').value = d.titulo;
            document.getElementById('dirLinea1').value = d.linea1;
            document.getElementById('dirLinea2').value = d.linea2;
            document.getElementById('dirPais').value   = d.pais;
            abrirModal('modalDireccion');
        });
    });

    grid.querySelectorAll('.btn-dir-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
            const d = DIRECCIONES.find(x => x.id === parseInt(btn.dataset.id));
            if (d?.predeterminada) { showToast('No puedes eliminar la dirección predeterminada', 'err'); return; }
            if (confirm('¿Eliminar esta dirección?')) {
                DIRECCIONES = DIRECCIONES.filter(x => x.id !== parseInt(btn.dataset.id));
                renderDirecciones();
                showToast('Dirección eliminada', 'ok');
            }
        });
    });

    grid.querySelectorAll('.btn-dir-predet').forEach(btn => {
        btn.addEventListener('click', () => {
            DIRECCIONES.forEach(d => d.predeterminada = (d.id === parseInt(btn.dataset.id)));
            renderDirecciones();
            showToast('Dirección predeterminada actualizada', 'ok');
        });
    });
}

document.getElementById('btnAñadirDir')?.addEventListener('click', () => {
    editandoDirId = null;
    document.getElementById('modalDirTitulo').innerHTML = '<i class="fa-solid fa-map-pin"></i> Nueva dirección';
    ['dirNombre','dirTitulo','dirLinea1','dirLinea2'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('dirPais').value = 'España';
    abrirModal('modalDireccion');
});

document.getElementById('btnGuardarDireccion')?.addEventListener('click', () => {
    const nombre = document.getElementById('dirNombre').value.trim();
    const titulo = document.getElementById('dirTitulo').value.trim();
    const linea1 = document.getElementById('dirLinea1').value.trim();
    const linea2 = document.getElementById('dirLinea2').value.trim();
    const pais   = document.getElementById('dirPais').value.trim();
    if (!nombre || !linea1 || !linea2) { showToast('Rellena los campos obligatorios', 'err'); return; }
    if (editandoDirId) {
        const d = DIRECCIONES.find(x => x.id === editandoDirId);
        if (d) { d.nombre = nombre; d.titulo = titulo || d.titulo; d.linea1 = linea1; d.linea2 = linea2; d.pais = pais; }
    } else {
        DIRECCIONES.push({ id: Date.now(), icono: 'fa-location-dot', titulo: titulo || 'Nueva', nombre, linea1, linea2, pais, predeterminada: false });
    }
    cerrarModal('modalDireccion');
    renderDirecciones();
    showToast(editandoDirId ? 'Dirección actualizada' : 'Dirección añadida', 'ok');
});


/* ============================================================
   RELOJ — sección pedidos
   ============================================================ */
function tick() {
    const d  = new Date();
    const t  = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
    const el = document.getElementById('estadoConexion');
    if (el) el.textContent = `Conectado · ${t}`;
}

setInterval(tick, 1000);
document.getElementById('btnActualizar')?.addEventListener('click', tick);


/* ============================================================
   CERRAR SESIÓN
   ============================================================ */
document.getElementById('btnCerrarSesion')?.addEventListener('click', () => {
    if (confirm('¿Seguro que quieres cerrar sesión?')) window.location.href = 'login.html';
});


/* ============================================================
   TOAST — notificación temporal
   ============================================================ */
let toastTimer;
function showToast(msg, tipo = 'ok') {
    const t   = document.getElementById('toast');
    const ico = document.getElementById('toastIcon');
    document.getElementById('toastMsg').textContent = msg;
    ico.className = tipo === 'ok'
        ? 'fa-solid fa-circle-check ok'
        : 'fa-solid fa-circle-xmark err';
    t.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('visible'), 3500);
}


/* ============================================================
   UTILIDADES
   ============================================================ */

/* Devuelve la fecha de hoy en formato "DD Mes AAAA" */
function fechaHoy() {
    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const d = new Date();
    return `${d.getDate().toString().padStart(2,'0')} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}




/* ============================================================
   NÚMERO DE SOCIO — generado o leído desde localStorage
   TODO (Supabase): SELECT id, created_at FROM auth.users WHERE id = auth.uid()
   ============================================================ */
function cargarDatosSocio() {
    /* Lee los datos guardados al registrarse
       TODO (Supabase): SELECT id, created_at FROM auth.users WHERE id = auth.uid()
       El número de socio real será: 'VS-' + ultimos 4 chars del UUID del usuario */

    let id, fechaAlta, ultSesion;

    /* Intenta leer datos reales del registro */
    try {
        const raw  = localStorage.getItem('vs_usuario_registro');
        const data = raw ? JSON.parse(raw) : null;

        if (data?.socioNum && data?.fechaAlta) {
            /* Datos del registro real */
            id        = data.socioNum;
            fechaAlta = data.fechaAlta;
        } else {
            /* Fallback: genera número basado en email hasta tener Supabase */
            const seed = USUARIO.email.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
            const num  = String(2000 + (seed % 8000)).padStart(4, '0');
            id        = `#VS-${num}`;
            fechaAlta = formatFechaAlta(new Date());
        }
    } catch (e) {
        id        = '#VS-0001';
        fechaAlta = formatFechaAlta(new Date());
    }

    /* Última sesión — hora actual */
    const ahora  = new Date();
    ultSesion = `Hoy ${ahora.getHours().toString().padStart(2,'0')}:${ahora.getMinutes().toString().padStart(2,'0')}`;

    /* Sidebar */
    const socioEl = document.getElementById('sidebarSocio');
    if (socioEl) socioEl.textContent = `Socio ${id}`;

    /* Perfil */
    const numEl  = document.getElementById('perfSocioNum');
    const altaEl = document.getElementById('perfFechaAlta');
    const sesEl  = document.getElementById('perfUltimaSesion');
    if (numEl)  numEl.textContent  = id;
    if (altaEl) altaEl.textContent = fechaAlta;
    if (sesEl)  sesEl.textContent  = ultSesion;
}

/* Formatea una fecha como "15 Sep 2023" */
function formatFechaAlta(date) {
    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${date.getDate()} ${meses[date.getMonth()]} ${date.getFullYear()}`;
}


/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    /* Si viene de un registro nuevo, carga los datos reales */
    const esNuevo = localStorage.getItem('vs_registro_nuevo');
    if (esNuevo) {
        localStorage.removeItem('vs_registro_nuevo');
        try {
            const data = JSON.parse(localStorage.getItem('vs_usuario_registro') || '{}');
            if (data.nombre)              USUARIO.nombre              = data.nombre;
            if (data.apellidos)           USUARIO.apellidos            = data.apellidos;
            if (data.email)               USUARIO.email               = data.email;
            if (data.puntosHistorico)     USUARIO.puntosHistorico     = data.puntosHistorico;
            if (data.puntosDisponibles)   USUARIO.puntosDisponibles   = data.puntosDisponibles;
            /* Toast de bienvenida */
            setTimeout(() => showToast(`¡Bienvenido, ${USUARIO.nombre}! +100 pts de regalo`, 'ok'), 800);
        } catch (e) { /* continúa con datos por defecto */ }
    }

    cargarUsuario();
    cargarDatosSocio();
    renderPedidos();
    renderDirecciones();
    tick();
});