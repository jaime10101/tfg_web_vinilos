/* ============================================================
   CUENTA.JS — Lógica completa de la página de cuenta
   ============================================================ */

/* ── DATOS MOCK ─────────────────────────────────────────── */
/* Niveles: Bronce 0-499 | Plata 500-1499 | Oro 1500+ */
const NIVELES = [
    { nombre: 'Bronce',  min: 0,    max: 499,  siguiente: 500,  color: '#cd7f32', colorBg: 'rgba(205,127,50,0.10)', colorBorder: 'rgba(205,127,50,0.22)' },
    { nombre: 'Plata',   min: 500,  max: 1499, siguiente: 1500, color: '#a8b8c8', colorBg: 'rgba(168,184,200,0.10)', colorBorder: 'rgba(168,184,200,0.22)' },
    { nombre: 'Oro',     min: 1500, max: Infinity, siguiente: null, color: '#f0b429', colorBg: 'rgba(240,180,41,0.10)', colorBorder: 'rgba(240,180,41,0.22)' },
];

function getNivel(pts) {
    return NIVELES.find(n => pts >= n.min && pts <= n.max) || NIVELES[0];
}

const USUARIO = {
    nombre: 'Alex', apellidos: 'Rodríguez',
    email: 'alex.music@ejemplo.com', telefono: '+34 600 000 000',
    puntos: 1250,
};

const PEDIDOS = [
    {
        id: '#4024', estado: 'en-camino', estadoLabel: 'EN CAMINO',
        items: [
            { nombre: 'Tame Impala – Currents', tipo: 'LP Edición Limitada', precio: 32.00 },
            { nombre: 'The Strokes – The New Abnormal', tipo: 'Cassette', precio: 14.00 },
            { nombre: 'Arctic Monkeys – AM', tipo: 'LP', precio: 12.50 },
        ],
        total: 58.50, fecha: '28 Oct 2023', puntos: 58,
        seguimiento: 'TRK4024ES',
        pasos: [
            { titulo: 'Pedido confirmado',       fecha: '20 Oct 2023 · 10:22',  estado: 'done' },
            { titulo: 'Preparando envío',         fecha: '21 Oct 2023 · 14:05',  estado: 'done' },
            { titulo: 'Recogido por transportista',fecha: '22 Oct 2023 · 09:30', estado: 'done' },
            { titulo: 'En tránsito',              fecha: '24 Oct 2023 · 07:00',  estado: 'actual' },
            { titulo: 'Entregado',                fecha: 'Estimado: 28 Oct 2023', estado: 'pendiente' },
        ],
    },
    {
        id: '#4023', estado: 'entregado', estadoLabel: 'ENTREGADO',
        items: [
            { nombre: 'Arctic Monkeys – AM', tipo: 'LP', precio: 25.00 },
            { nombre: 'Gorillaz – Cracker Island', tipo: 'Camiseta Talla M', precio: 20.00 },
        ],
        total: 45.00, fecha: '24 Oct 2023', puntos: 45,
        seguimiento: null,
        pasos: [
            { titulo: 'Pedido confirmado',  fecha: '18 Oct 2023', estado: 'done' },
            { titulo: 'Preparando envío',   fecha: '19 Oct 2023', estado: 'done' },
            { titulo: 'En tránsito',        fecha: '21 Oct 2023', estado: 'done' },
            { titulo: 'Entregado',          fecha: '24 Oct 2023', estado: 'done' },
        ],
    },
    {
        id: '#4021', estado: 'entregado', estadoLabel: 'ENTREGADO',
        items: [
            { nombre: 'Rosalía – Motomami', tipo: 'Vinilo Color', precio: 40.00 },
            { nombre: 'Daft Punk – Random Access Memories', tipo: 'Doble LP', precio: 32.00 },
        ],
        total: 72.00, fecha: '10 Oct 2023', puntos: 72,
        seguimiento: null,
        pasos: [
            { titulo: 'Pedido confirmado', fecha: '05 Oct 2023', estado: 'done' },
            { titulo: 'En tránsito',       fecha: '07 Oct 2023', estado: 'done' },
            { titulo: 'Entregado',         fecha: '10 Oct 2023', estado: 'done' },
        ],
    },
];

const HISTORIAL_PUNTOS = [
    { desc: 'Pedido #4024', fecha: '22 Oct 2023', pts: +58,  tipo: 'positivo' },
    { desc: 'Pedido #4023', fecha: '18 Oct 2023', pts: +45,  tipo: 'positivo' },
    { desc: 'Pedido #4021', fecha: '05 Oct 2023', pts: +72,  tipo: 'positivo' },
    { desc: 'Canje descuento 10%', fecha: '01 Oct 2023', pts: -75, tipo: 'negativo' },
    { desc: 'Registro en Vinyl Sounds', fecha: '15 Sep 2023', pts: +100, tipo: 'positivo' },
    { desc: 'Subida a nivel Plata', fecha: '01 Oct 2023', pts: +50, tipo: 'positivo' },
];

let DIRECCIONES = [
    { id: 1, icono: 'fa-house',    titulo: 'Casa',    nombre: 'Alex Rodríguez',  linea1: 'Calle Gran Vía 24, 3ªA', linea2: '28013 Madrid',    pais: 'España', predeterminada: true },
    { id: 2, icono: 'fa-briefcase',titulo: 'Oficina', nombre: 'Vinyl Sounds HQ', linea1: 'Avenida de la Música 10', linea2: '08001 Barcelona', pais: 'España', predeterminada: false },
];

let editandoDirId = null;

/* ══════════════════════════════════════════════════════════
   NAVEGACIÓN
══════════════════════════════════════════════════════════ */
document.querySelectorAll('.nav-item[data-sec]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item[data-sec]').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        document.querySelectorAll('.sec').forEach(s => s.classList.add('oculta'));
        document.getElementById('sec-' + btn.dataset.sec)?.classList.remove('oculta');
    });
});

/* ══════════════════════════════════════════════════════════
   MODALES
══════════════════════════════════════════════════════════ */
function abrirModal(id) {
    document.getElementById(id)?.classList.add('abierto');
    document.body.style.overflow = 'hidden';
}
function cerrarModal(id) {
    document.getElementById(id)?.classList.remove('abierto');
    document.body.style.overflow = '';
}

document.querySelectorAll('.modal-cerrar').forEach(btn => {
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

/* ══════════════════════════════════════════════════════════
   INIT USUARIO
══════════════════════════════════════════════════════════ */
function iniciales(n, a) { return ((n[0] || '') + (a[0] || '')).toUpperCase(); }

function cargarUsuario() {
    const ini = iniciales(USUARIO.nombre, USUARIO.apellidos);
    document.getElementById('sidebarNombre').textContent = `${USUARIO.nombre} ${USUARIO.apellidos}`;
    document.getElementById('sidebarEmail').textContent  = USUARIO.email;
    const nivel = getNivel(USUARIO.puntos);
    const badgeEl = document.getElementById('sidebarNivel');
    badgeEl.innerHTML = `<i class="fa-solid fa-crown"></i> ${nivel.nombre}`;
    badgeEl.style.background    = nivel.colorBg;
    badgeEl.style.borderColor   = nivel.colorBorder;
    badgeEl.style.color         = nivel.color;
    document.getElementById('avatarIniciales').textContent  = ini;
    document.getElementById('perfilIniciales').textContent  = ini;
    document.getElementById('sidebarPuntos').textContent    = USUARIO.puntos.toLocaleString('es-ES');
    document.getElementById('kpiPuntos').textContent        = `${USUARIO.puntos.toLocaleString('es-ES')} pts`;
    const pct = nivel.siguiente
        ? Math.min(100, ((USUARIO.puntos - nivel.min) / (nivel.siguiente - nivel.min)) * 100)
        : 100;
    const sidebarFill = document.getElementById('puntosFill');
    sidebarFill.style.background = `linear-gradient(90deg, ${nivel.color}, ${nivel.color}aa)`;
    setTimeout(() => { sidebarFill.style.width = pct + '%'; }, 400);
    document.getElementById('sidebarPuntos').style.color = nivel.color;
    document.getElementById('puntosMeta').textContent = nivel.siguiente
        ? `${nivel.siguiente - USUARIO.puntos} pts para ${NIVELES.find(n=>n.min===nivel.siguiente)?.nombre}`
        : '¡Nivel máximo alcanzado!';
    document.getElementById('perfNombre').value    = USUARIO.nombre;
    document.getElementById('perfApellidos').value = USUARIO.apellidos;
    document.getElementById('perfEmail').value     = USUARIO.email;
    document.getElementById('perfTelefono').value  = USUARIO.telefono;
    const enCurso = PEDIDOS.filter(p => p.estado !== 'entregado').length;
    document.getElementById('kpiEnCurso').textContent = `${enCurso} Pedido${enCurso !== 1 ? 's' : ''}`;
}

/* ══════════════════════════════════════════════════════════
   MODAL PUNTOS
══════════════════════════════════════════════════════════ */
function abrirPuntos() {
    const nv = getNivel(USUARIO.puntos);
    const totalEl = document.getElementById('modalPtsTotal');
    totalEl.textContent = `${USUARIO.puntos.toLocaleString('es-ES')} pts`;
    totalEl.style.color = nv.color;
    const starEl = document.querySelector('.modal-star');
    if (starEl) starEl.style.color = nv.color;
    document.getElementById('modalNivel').textContent    = `Nivel ${nv.nombre}`;
    const pct = nv.siguiente
        ? Math.min(100, ((USUARIO.puntos - nv.min) / (nv.siguiente - nv.min)) * 100)
        : 100;
    document.getElementById('modalNivelHint').textContent = nv.siguiente
        ? `Te faltan ${nv.siguiente - USUARIO.puntos} pts para ${NIVELES.find(n=>n.min===nv.siguiente)?.nombre}`
        : '¡Has alcanzado el nivel máximo!';
    abrirModal('modalPuntos');
    const fillEl = document.getElementById('modalNivelFill');
    fillEl.style.background = `linear-gradient(90deg, ${nv.color}, ${nv.color}aa)`;
    setTimeout(() => { fillEl.style.width = pct + '%'; }, 200);
    const hist = document.getElementById('modalHistPuntos');
    hist.innerHTML = HISTORIAL_PUNTOS.map(h => `
        <div class="hist-item">
            <div class="hist-item-info">
                <span class="hist-item-desc">${h.desc}</span>
                <span class="hist-item-fecha">${h.fecha}</span>
            </div>
            <span class="hist-item-pts ${h.tipo}">${h.pts > 0 ? '+' : ''}${h.pts} pts</span>
        </div>`).join('');
}

document.getElementById('btnPuntos')?.addEventListener('click', abrirPuntos);
document.getElementById('kpiPuntosBtn')?.addEventListener('click', abrirPuntos);

/* ══════════════════════════════════════════════════════════
   RENDER PEDIDOS
══════════════════════════════════════════════════════════ */
function renderPedidos() {
    const lista = document.getElementById('listaPedidos');
    lista.innerHTML = PEDIDOS.map(p => {
        const nombres = p.items.map(i => i.nombre).join(', ');
        const corto   = nombres.length > 75 ? nombres.slice(0, 75) + '…' : nombres;
        const fechaIcon  = p.estado === 'entregado' ? 'fa-circle-check' : 'fa-calendar';
        const fechaLabel = p.estado === 'entregado' ? `Entregado el ${p.fecha}` : `Estimado: ${p.fecha}`;

        return `
        <div class="pedido-card">
            <span class="pedido-badge ${p.estado}">
                <i class="fa-solid ${p.estado === 'en-camino' ? 'fa-truck' : 'fa-circle-check'}"></i>
                ${p.estadoLabel}
            </span>
            <div class="pedido-info">
                <div class="pedido-num">Pedido ${p.id}</div>
                <div class="pedido-items-lista" title="${nombres}">${corto}</div>
                <div class="pedido-meta">
                    <i class="fa-solid ${fechaIcon}"></i> ${fechaLabel}
                    &nbsp;·&nbsp;
                    <span class="pedido-pts"><i class="fa-solid fa-crown"></i> +${p.puntos} pts</span>
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

    // Eventos botones
    lista.querySelectorAll('.btn-seguir').forEach(btn => {
        btn.addEventListener('click', () => abrirSeguimiento(btn.dataset.pid));
    });
    lista.querySelectorAll('.btn-detalle').forEach(btn => {
        btn.addEventListener('click', () => abrirDetalle(btn.dataset.pid));
    });
    lista.querySelectorAll('.btn-factura').forEach(btn => {
        btn.addEventListener('click', () => abrirFactura(btn.dataset.pid));
    });
}

/* ── Modal Seguimiento ── */
function abrirSeguimiento(pid) {
    const p = PEDIDOS.find(x => x.id === pid);
    if (!p) return;
    document.getElementById('segPedidoId').textContent = p.id;
    document.getElementById('segNumero').textContent   = p.seguimiento || '—';
    document.getElementById('btnSeguirExterno').href   = `https://www.correos.es/ss/Satellite/site/aplicacion-5138944704257/tracking?tracking=${p.seguimiento}`;
    const timeline = document.getElementById('segTimeline');
    timeline.innerHTML = p.pasos.map(paso => `
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
        <div class="det-res-fila"><span>Puntos ganados</span><span class="det-res-pts"><i class="fa-solid fa-crown"></i> +${p.puntos} pts</span></div>`;
    abrirModal('modalDetalle');
}

/* ── Modal Factura ── */
function abrirFactura(pid) {
    const p = PEDIDOS.find(x => x.id === pid);
    if (!p) return;
    const hoy = new Date();
    const fecha = `${hoy.getDate().toString().padStart(2,'0')}/${(hoy.getMonth()+1).toString().padStart(2,'0')}/${hoy.getFullYear()}`;
    const lineas = p.items.map(i =>
        `<div class="fac-row"><span>${i.nombre} (${i.tipo})</span><span>${i.precio.toFixed(2)} €</span></div>`
    ).join('');
    const envio = p.estado === 'entregado' ? 0 : 4.95;
    const base = (p.total / 1.21).toFixed(2);
    const iva  = (p.total - parseFloat(base)).toFixed(2);
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
        <div class="fac-row"><span>Base imponible (21% IVA)</span><span>${base} €</span></div>
        <div class="fac-row"><span>IVA (21%)</span><span>${iva} €</span></div>
        <hr class="fac-sep">
        <div class="fac-row fac-total"><strong>TOTAL</strong><strong>${p.total.toFixed(2)} €</strong></div>
        <hr class="fac-sep">
        <p style="font-size:10px;color:#666">Gracias por tu compra. Vinyl Sounds S.L. — CIF: B12345678</p>`;
    document.getElementById('btnDescargarPdf').onclick = () => {
        window.print();
        showToast('Enviando a impresora / Guardar como PDF', 'ok');
    };
    abrirModal('modalFactura');
}

/* ══════════════════════════════════════════════════════════
   GUARDAR PERFIL
══════════════════════════════════════════════════════════ */
document.getElementById('btnGuardarPerfil')?.addEventListener('click', () => {
    const nombre    = document.getElementById('perfNombre').value.trim();
    const apellidos = document.getElementById('perfApellidos').value.trim();
    if (!nombre) { showToast('El nombre no puede estar vacío', 'err'); return; }
    USUARIO.nombre    = nombre;
    USUARIO.apellidos = apellidos;
    USUARIO.email     = document.getElementById('perfEmail').value;
    USUARIO.telefono  = document.getElementById('perfTelefono').value;
    document.getElementById('sidebarNombre').textContent = `${nombre} ${apellidos}`;
    document.getElementById('sidebarEmail').textContent  = USUARIO.email;
    const ini = iniciales(nombre, apellidos);
    document.getElementById('avatarIniciales').textContent = ini;
    document.getElementById('perfilIniciales').textContent = ini;
    showToast('Perfil guardado correctamente', 'ok');
});

/* ══════════════════════════════════════════════════════════
   CAMBIAR FOTO
══════════════════════════════════════════════════════════ */
document.getElementById('inputFoto')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('La imagen debe ser menor de 2MB', 'err'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
        const src = ev.target.result;
        // Sidebar
        const ini = document.getElementById('avatarIniciales');
        const img = document.getElementById('avatarImg');
        ini.style.display = 'none';
        img.src = src; img.classList.remove('oculta');
        // Perfil
        const pini = document.getElementById('perfilIniciales');
        const pimg = document.getElementById('perfilAvatar');
        pini.style.display = 'none';
        pimg.src = src; pimg.classList.remove('oculta');
        showToast('Foto actualizada correctamente', 'ok');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
});

/* ══════════════════════════════════════════════════════════
   DEVOLUCIÓN
══════════════════════════════════════════════════════════ */
document.getElementById('btnComenzarDev')?.addEventListener('click', () => {
    const sel = document.getElementById('devPedidoSel');
    sel.innerHTML = PEDIDOS.map(p => `<option value="${p.id}">Pedido ${p.id} — ${p.total.toFixed(2)}€</option>`).join('');
    abrirModal('modalDevolucion');
});

document.getElementById('btnEnviarDevolucion')?.addEventListener('click', () => {
    const motivo = document.getElementById('devMotivo').value;
    if (!motivo) { showToast('Selecciona un motivo', 'err'); return; }
    cerrarModal('modalDevolucion');
    showToast('Solicitud de devolución enviada', 'ok');
});

/* ══════════════════════════════════════════════════════════
   DIRECCIONES
══════════════════════════════════════════════════════════ */
function renderDirecciones() {
    const grid = document.getElementById('gridDirecciones');
    grid.innerHTML = DIRECCIONES.map(d => `
        <div class="dir-card ${d.predeterminada ? 'predeterminada' : ''}" data-id="${d.id}">
            <div class="dir-header">
                <div class="dir-titulo">
                    <i class="fa-solid ${d.icono}"></i> ${d.titulo}
                </div>
                ${d.predeterminada ? '<span class="badge-predeterminada">Predeterminada</span>' : ''}
            </div>
            <div class="dir-info">
                ${d.nombre}<br>${d.linea1}<br>${d.linea2}<br>${d.pais}
            </div>
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

/* ══════════════════════════════════════════════════════════
   RELOJ
══════════════════════════════════════════════════════════ */
function tick() {
    const d = new Date();
    const t = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
    const el = document.getElementById('estadoConexion');
    if (el) el.textContent = `Conectado · ${t}`;
}
setInterval(tick, 1000);
document.getElementById('btnActualizar')?.addEventListener('click', tick);

/* ══════════════════════════════════════════════════════════
   CERRAR SESIÓN
══════════════════════════════════════════════════════════ */
document.getElementById('btnCerrarSesion')?.addEventListener('click', () => {
    if (confirm('¿Seguro que quieres cerrar sesión?')) window.location.href = 'login.html';
});

/* ══════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg, tipo = 'ok') {
    const t   = document.getElementById('toast');
    const ico = document.getElementById('toastIcon');
    document.getElementById('toastMsg').textContent = msg;
    ico.className = tipo === 'ok' ? 'fa-solid fa-circle-check ok' : 'fa-solid fa-circle-xmark err';
    t.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('visible'), 3200);
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuario();
    renderPedidos();
    renderDirecciones();
    tick();
});