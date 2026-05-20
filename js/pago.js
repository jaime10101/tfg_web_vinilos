/* ============================================================
   PAGO.JS — Lógica del checkout (carrito → envío → pago → confirmación)
   Header, footer y btn-subir los gestiona header.js
   ============================================================ */

const FREE_THRESHOLD   = 100;   /* envío gratis desde este importe */
let shippingMethod     = 'std';
let shippingCost       = 4.95;
let promoApplied       = false;
let billingOn          = true;
let userPickedShipping = false;
let shipData           = {};
let cardData           = {};

/* ── Nivel del usuario leído desde localStorage ── */
let nivelUsuario = null;

function cargarNivelUsuario() {
    /* Lee el nivel guardado por cuenta.js en localStorage */
    try {
        const raw = localStorage.getItem('vs_nivel_usuario');
        nivelUsuario = raw ? JSON.parse(raw) : null;
    } catch (e) { nivelUsuario = null; }
}

/* ── Cupón Vinyl Points leído desde localStorage ── */
let cuponActivo = null;

function cargarCupon() {
    try {
        const raw = localStorage.getItem('vs_cupon');
        cuponActivo = raw ? JSON.parse(raw) : null;
    } catch (e) { cuponActivo = null; }
    mostrarFilaCupon();
    mostrarBadgeOro();
}

/* Muestra u oculta la fila del cupón en todos los resúmenes */
function mostrarFilaCupon() {
    document.querySelectorAll('.fila-cupon').forEach(el => {
        if (cuponActivo) {
            el.style.display = '';
            el.querySelector('.cupon-valor').textContent = `−€${cuponActivo.valor.toFixed(2)}`;
        } else {
            el.style.display = 'none';
        }
    });
}

/* Badge VIP Oro — visible si el usuario es nivel Oro y supera 100€ */
function mostrarBadgeOro() {
    const badge = document.getElementById('badge-oro');
    if (!badge) return;
    const esOro   = nivelUsuario?.nombre === 'Oro';
    const supera  = sub() >= FREE_THRESHOLD;
    badge.style.display = (esOro && supera) ? 'flex' : 'none';
}

/* Descuento Oro: 5% adicional si el usuario es Oro y supera 100€ */
function descuentoOro() {
    if (nivelUsuario?.nombre !== 'Oro') return 0;
    if (sub() < FREE_THRESHOLD) return 0;
    return +(sub() * 0.05).toFixed(2);
}

function descuentoCupon() {
    /* Descuento por puntos Vinyl Points canjeados en este checkout */
    return puntosAplicados > 0 ? parseFloat((puntosAplicados / 100).toFixed(2)) : 0;
}

/* Total final con todos los descuentos */
function grandTotal() {
    return Math.max(0, sub() - descuentoCupon() - descuentoOro() + shippingCost);
}


/* ── Carrito ── */
let cart = [
    { id: 1, name: 'Camiseta "Nevermind"',      artist: 'Nirvana',        variant: 'Talla M · Blanco',         icon: 'fa-solid fa-shirt',      price: 29.99, stock: 'in',  qty: 1 },
    { id: 2, name: 'Hoodie "Dark Side"',         artist: 'Pink Floyd',     variant: 'Talla L · Negro',          icon: 'fa-solid fa-shirt',      price: 54.99, stock: 'in',  qty: 1 },
    { id: 3, name: 'Gorra Bordada "AM"',         artist: 'Arctic Monkeys', variant: 'Talla única · Negra',      icon: 'fa-solid fa-hat-cowboy', price: 24.99, stock: 'low', qty: 1 },
    { id: 4, name: 'Chaqueta Bomber "Currents"', artist: 'Tame Impala',    variant: 'Talla S · Verde oliva',    icon: 'fa-solid fa-person',     price: 89.99, stock: 'in',  qty: 1 },
    { id: 5, name: 'Calcetines Pack x3 "Roses"', artist: 'Rosalía',       variant: 'Talla 36-42 · Multicolor', icon: 'fa-solid fa-socks',      price: 14.99, stock: 'low', qty: 1 },
];


/* ── Navegación entre pasos ── */
function goTo(n) {
    const pages = ['cart', 'shipping', 'payment', 'confirm'];
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pages[n - 1]).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (n === 2) renderSidebarSummary('ship');
    if (n === 3) renderSidebarSummary('pay');
    if (n === 4) buildConfirmation();
}


/* ── Helpers ── */
function sub() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }


/* ── Render del carrito ── */
function renderCart() {
    const list  = document.getElementById('cart-list');
    const empty = document.getElementById('empty-state');
    const count = cart.reduce((s, i) => s + i.qty, 0);
    list.innerHTML = '';

    if (cart.length === 0) {
        empty.style.display = 'block';
    } else {
        empty.style.display = 'none';
        cart.forEach(item => {
            const d = document.createElement('div');
            d.className = 'cart-item';
            d.id = 'ci-' + item.id;
            d.innerHTML = `
                <div class="item-thumb"><i class="${item.icon}"></i></div>
                <div>
                    <div class="item-name">${esc(item.name)}</div>
                    <div class="item-artist">${esc(item.artist)}</div>
                    <span class="item-tag">${esc(item.variant)}</span>
                    <div class="item-stock ${item.stock}">
                        ${item.stock === 'in'
                            ? '<i class="fa-solid fa-circle-check"></i> En stock'
                            : '<i class="fa-solid fa-triangle-exclamation"></i> Últimas unidades'}
                    </div>
                </div>
                <div class="item-right">
                    <button class="btn-del" onclick="removeItem(${item.id})"><i class="fa-solid fa-trash"></i></button>
                    <div class="qty-ctrl">
                        <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
                        <span class="qty-num" id="qty-${item.id}">${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${item.id},+1)">+</button>
                    </div>
                    <div class="item-price" id="ip-${item.id}">€${(item.price * item.qty).toFixed(2)}</div>
                </div>`;
            list.appendChild(d);
        });
    }

    const s     = sub();

    /* Calcula el envío efectivo ANTES de calcular el total
       para garantizar que ambos números sean consistentes */
    if (s >= FREE_THRESHOLD && !userPickedShipping) {
        shippingMethod = 'free';
        shippingCost   = 0;
        ['std', 'exp', 'free'].forEach(t => document.getElementById('ship-' + t)?.classList.remove('selected'));
        document.getElementById('ship-free')?.classList.add('selected');
    }

    const desc  = descuentoCupon();
    const oro   = descuentoOro();
    const ship  = shippingCost;
    const total = Math.max(0, s - desc - oro + ship);

    document.getElementById('cart-count').textContent  = `(${count})`;
    document.getElementById('s-count-lbl').textContent = `Subtotal (${count} artículo${count !== 1 ? 's' : ''})`;
    document.getElementById('s-sub').textContent       = '€' + s.toFixed(2);
    document.getElementById('s-ship').textContent      = ship === 0 ? 'Gratis' : '€' + ship.toFixed(2);
    document.getElementById('s-total').textContent     = '€' + total.toFixed(2);

    /* Fila cupón Vinyl Points */
    mostrarFilaCupon();

    /* Fila descuento Oro */
    const filaOro = document.getElementById('fila-oro');
    if (filaOro) {
        if (oro > 0) {
            filaOro.style.display = '';
            filaOro.querySelector('.oro-valor').textContent = `−€${oro.toFixed(2)}`;
        } else {
            filaOro.style.display = 'none';
        }
    }

    /* Badge VIP Oro */
    mostrarBadgeOro();

    /* Barra de progreso envío gratis */
    const pct = Math.min(100, (s / FREE_THRESHOLD) * 100);
    document.getElementById('ship-fill').style.width = pct + '%';
    document.getElementById('free-msg-bar').innerHTML = s >= FREE_THRESHOLD
        ? '<i class="fa-solid fa-circle-check" style="color:var(--verde)"></i> ¡Tienes <span class="hl">envío gratis</span>!'
        : `Te faltan <span class="hl">€${(FREE_THRESHOLD - s).toFixed(2)}</span> para envío gratis`;

    const freeEl = document.getElementById('ship-free');
    if (freeEl) freeEl.style.display = s >= FREE_THRESHOLD ? 'flex' : 'none';
}

function changeQty(id, d) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + d);
    renderCart();
}

function removeItem(id) {
    const el = document.getElementById('ci-' + id);
    if (el) { el.style.transition = 'all .25s'; el.style.opacity = '0'; el.style.transform = 'translateX(18px)'; }
    setTimeout(() => { cart = cart.filter(i => i.id !== id); renderCart(); }, 260);
    showToast('fa-trash', 'Producto eliminado');
}

function applyPromo() {
    const code = document.getElementById('promo-input').value.trim().toUpperCase();
    if (code === 'VINYL20') {
        if (promoApplied) { showToast('fa-circle-info', 'Código ya aplicado'); return; }
        promoApplied = true;
        cart.forEach(i => i.price = +(i.price * 0.8).toFixed(2));
        renderCart();
        showToast('fa-tag', '¡Descuento 20% aplicado!');
    } else { showToast('fa-xmark', 'Código no válido'); }
}

function resetCart() {
    cart = [
        { id: 1, name: 'Camiseta "Nevermind"',      artist: 'Nirvana',        variant: 'Talla M · Blanco',         icon: 'fa-solid fa-shirt',      price: 29.99, stock: 'in',  qty: 1 },
        { id: 2, name: 'Hoodie "Dark Side"',         artist: 'Pink Floyd',     variant: 'Talla L · Negro',          icon: 'fa-solid fa-shirt',      price: 54.99, stock: 'in',  qty: 1 },
        { id: 3, name: 'Gorra Bordada "AM"',         artist: 'Arctic Monkeys', variant: 'Talla única · Negra',      icon: 'fa-solid fa-hat-cowboy', price: 24.99, stock: 'low', qty: 1 },
        { id: 4, name: 'Chaqueta Bomber "Currents"', artist: 'Tame Impala',    variant: 'Talla S · Verde oliva',    icon: 'fa-solid fa-person',     price: 89.99, stock: 'in',  qty: 1 },
        { id: 5, name: 'Calcetines Pack x3 "Roses"', artist: 'Rosalía',       variant: 'Talla 36-42 · Multicolor', icon: 'fa-solid fa-socks',      price: 14.99, stock: 'low', qty: 1 },
    ];
    promoApplied = false; userPickedShipping = false; shippingMethod = 'std'; shippingCost = 4.95;
    selectShipping('std');
    renderCart();
}


/* ── Envío ── */
function selectShipping(type, userAction = false) {
    if (userAction) userPickedShipping = true;
    shippingMethod = type;
    shippingCost   = type === 'exp' ? 9.95 : type === 'free' ? 0 : 4.95;
    ['std', 'exp', 'free'].forEach(t => document.getElementById('ship-' + t)?.classList.remove('selected'));
    document.getElementById('ship-' + type)?.classList.add('selected');
    /* Recalcula todo desde renderCart para garantizar consistencia */
    renderCart();
    renderSidebarSummary('ship');
}

function goToPayment() {
    if (!validarEnvio()) return;
    shipData = {
        name:    (document.getElementById('sh-name').value + ' ' + document.getElementById('sh-surname').value).trim() || 'Cliente',
        email:   document.getElementById('sh-email').value  || 'usuario@ejemplo.com',
        street:  document.getElementById('sh-street').value || '–',
        city:    document.getElementById('sh-city').value   || '–',
        cp:      document.getElementById('sh-cp').value     || '–',
        country: document.getElementById('sh-country').value|| 'ES',
        method:  shippingMethod,
    };
    renderSidebarSummary('pay');
    goTo(3);
}


/* ── Sidebar resumen — pasos 2 y 3 ── */
function renderSidebarSummary(which) {
    const s    = sub();
    const desc = descuentoCupon();
    const oro  = descuentoOro();
    const ship = shippingCost;
    const total = Math.max(0, s - desc - oro + ship);

    let html = '';
    cart.forEach(i => {
        html += `<div style="display:flex;align-items:center;gap:12px;padding:12px 10px;background:rgba(18,16,58,0.6);border:1px solid var(--borde);border-radius:12px;margin-bottom:10px;">
            <div style="width:52px;height:52px;border-radius:9px;background:var(--superficie);border:1px solid var(--borde);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">
                ${i.imagen
                    ? `<img src="${i.imagen}" alt="${esc(i.name)}" style="width:100%;height:100%;object-fit:cover;">`
                    : `<i class="${i.icon}" style="font-size:1.5rem;color:var(--rojo);"></i>`
                }
            </div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:.85rem;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(i.name)}</div>
                <div style="font-size:.72rem;color:var(--apagado);margin-top:2px;">${esc(i.variant)}</div>
            </div>
            <div style="font-size:.88rem;font-weight:700;white-space:nowrap;">€${(i.price * i.qty).toFixed(2)}</div>
        </div>`;
    });

    if (which === 'ship') {
        document.getElementById('ship-summary-items').innerHTML = html;
        document.getElementById('ss-sub').textContent   = '€' + s.toFixed(2);
        document.getElementById('ss-ship').textContent  = ship === 0 ? 'Gratis' : '€' + ship.toFixed(2);
        document.getElementById('ss-total').textContent = '€' + total.toFixed(2);
    } else {
        document.getElementById('pay-summary-items').innerHTML = html;
        document.getElementById('ps-sub').textContent   = '€' + s.toFixed(2);
        document.getElementById('ps-ship').textContent  = ship === 0 ? 'Gratis' : '€' + ship.toFixed(2);
        document.getElementById('ps-total').textContent = '€' + total.toFixed(2);
        document.getElementById('pay-amt').textContent  = '€' + total.toFixed(2);
    }

    /* Filas de descuentos en sidebars */
    mostrarFilaCupon();
    actualizarFilaOroSidebar(which, oro);
}

function actualizarFilaOroSidebar(which, oro) {
    const id = which === 'ship' ? 'ss-fila-oro' : 'ps-fila-oro';
    const el = document.getElementById(id);
    if (!el) return;
    if (oro > 0) {
        el.style.display = '';
        el.querySelector('.oro-valor').textContent = `−€${oro.toFixed(2)}`;
    } else {
        el.style.display = 'none';
    }
}


/* ── Validaciones formulario de envío ── */
function chkNombre(el) {
    el.value = el.value.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s\-']/g, '');
}

function chkEmail(el) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
    document.getElementById('wrap-email').classList.toggle('valid', ok);
    document.getElementById('wrap-email').classList.toggle('invalid', el.value.length > 0 && !ok);
}

function chkTelefono(el) {
    el.value = el.value.replace(/[^0-9+\s\-]/g, '');
    const digits = el.value.replace(/\D/g, '');
    const ok = digits.length >= 9 && digits.length <= 15;
    document.getElementById('wrap-telefono').classList.toggle('valid', ok);
    document.getElementById('wrap-telefono').classList.toggle('invalid', el.value.length > 0 && !ok);
}

function chkCP(el) {
    el.value = el.value.replace(/\D/g, '');
}

function validarEnvio() {
    const name  = document.getElementById('sh-name').value.trim();
    const email = document.getElementById('sh-email').value.trim();
    const phone = document.getElementById('sh-phone').value.replace(/\D/g, '');
    const st    = document.getElementById('sh-street').value.trim();
    const city  = document.getElementById('sh-city').value.trim();
    const cp    = document.getElementById('sh-cp').value.trim();
    if (!name)                             { showToast('fa-triangle-exclamation', 'Introduce tu nombre'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('fa-triangle-exclamation', 'Email no válido'); return false; }
    if (phone.length < 9)                  { showToast('fa-triangle-exclamation', 'Teléfono no válido'); return false; }
    if (!st || !city || cp.length < 4)    { showToast('fa-triangle-exclamation', 'Completa la dirección'); return false; }
    return true;
}


/* ── Validaciones formulario de pago ── */
function fmtCard(el) {
    let v = el.value.replace(/\D/g, '').slice(0, 16);
    el.value = v.replace(/(.{4})/g, '$1 ').trim();
    const ok = v.length === 16;
    document.getElementById('wrap-cn').classList.toggle('valid', ok);
    document.getElementById('wrap-cn').classList.toggle('invalid', v.length > 0 && !ok);
}

function chkHolder(el) {
    el.value = el.value.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s\-']/g, '');
    const ok = el.value.trim().length > 1;
    document.getElementById('wrap-ch').classList.toggle('valid', ok);
}

function fmtExp(el) {
    let v = el.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2);
    el.value = v;
    const digits = el.value.replace(/\D/g, '');
    const mes    = parseInt(digits.slice(0, 2), 10);
    const ok     = digits.length === 4 && mes >= 1 && mes <= 12;
    document.getElementById('wrap-ex').classList.toggle('valid', ok);
    document.getElementById('wrap-ex').classList.toggle('invalid', digits.length > 0 && !ok);
}

function chkCVV(el) {
    el.value = el.value.replace(/\D/g, '').slice(0, 4);
    const ok = el.value.length >= 3;
    document.getElementById('wrap-cv').classList.toggle('valid', ok);
    document.getElementById('wrap-cv').classList.toggle('invalid', el.value.length > 0 && !ok);
}

function toggleBill() {
    billingOn = !billingOn;
    document.getElementById('bill-toggle').classList.toggle('on', billingOn);
}


/* ── Confirmar pago ── */
function processPay() {
    let last4, holder;

    if (tarjetaSeleccionada === 'guardada') {
        /* Tarjeta guardada — no necesita validación de formulario */
        try {
            const t = JSON.parse(localStorage.getItem('vs_tarjeta_guardada') || '{}');
            last4  = t.last4  || '0000';
            holder = t.holder || 'Titular';
        } catch (e) {
            showToast('fa-triangle-exclamation', 'Error al leer la tarjeta guardada');
            return;
        }
    } else {
        /* Tarjeta nueva — validar formulario completo */
        const num = document.getElementById('card-num').value.replace(/\s/g, '');
        holder    = document.getElementById('card-holder').value.trim();
        const exp = document.getElementById('card-exp').value.replace(/\D/g, '');
        const cvv = document.getElementById('card-cvv').value;
        const mes = parseInt(exp.slice(0, 2), 10);

        if (num.length < 16)
            { showToast('fa-triangle-exclamation', 'El número de tarjeta debe tener 16 dígitos'); return; }
        if (!/^\d+$/.test(num))
            { showToast('fa-triangle-exclamation', 'El número de tarjeta solo admite dígitos'); return; }
        if (!holder || !/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-']+$/.test(holder))
            { showToast('fa-triangle-exclamation', 'El titular solo puede contener letras'); return; }
        if (exp.length < 4 || mes < 1 || mes > 12)
            { showToast('fa-triangle-exclamation', 'Introduce una fecha de caducidad válida (MM/AA)'); return; }
        if (cvv.length < 3)
            { showToast('fa-triangle-exclamation', 'El CVV debe tener 3 o 4 dígitos'); return; }

        last4 = num.slice(-4);

        /* Guarda la tarjeta si el toggle está activo */
        if (guardarTarjeta) {
            localStorage.setItem('vs_tarjeta_guardada', JSON.stringify({ last4, holder }));
        }
    }

    cardData = { last4, holder };

    /* Consume el cupón y descuenta los puntos usados en localStorage */
    if (cuponActivo) {
        localStorage.removeItem('vs_cupon');
        cuponActivo = null;
    }
    if (puntosAplicados > 0) {
        try {
            const raw  = localStorage.getItem('vs_puntos_usuario');
            const data = raw ? JSON.parse(raw) : { puntosHistorico: 1250, puntosDisponibles: 1250 };
            data.puntosDisponibles = Math.max(0, data.puntosDisponibles - puntosAplicados);
            localStorage.setItem('vs_puntos_usuario', JSON.stringify(data));
        } catch (e) { /* sin localStorage */ }
    }

    goTo(4);
    showToast('fa-circle-check', '¡Pedido confirmado!');
}


/* ── Pantalla de confirmación ── */
function buildConfirmation() {
    const s    = sub();
    const desc = descuentoCupon();
    const oro  = descuentoOro();
    const ship = shippingCost;
    const total = Math.max(0, s - desc - oro + ship);

    document.getElementById('conf-order-id').textContent = '#VS-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('conf-email-msg').innerHTML  =
        `Hemos enviado los detalles a <strong>${esc(shipData.email || 'usuario@ejemplo.com')}</strong>`;

    let html = '';
    cart.forEach(i => {
        html += `<div class="conf-item">
            <div class="conf-thumb">
                ${i.imagen
                    ? `<img src="${i.imagen}" alt="${esc(i.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`
                    : `<i class="${i.icon}"></i>`}
            </div>
            <div>
                <div class="conf-name">${esc(i.name)}</div>
                <div class="conf-artist">${esc(i.artist)}</div>
                <span class="conf-tag">${esc(i.variant)}</span>
                <div class="conf-qty">Cant: ${i.qty}</div>
            </div>
            <div class="conf-price">€${(i.price * i.qty).toFixed(2)}</div>
        </div>`;
    });
    document.getElementById('conf-items').innerHTML = html;
    document.getElementById('conf-name').textContent = shipData.name || '–';
    document.getElementById('conf-addr').innerHTML   =
        `${esc(shipData.street)}<br>${esc(shipData.cp)} ${esc(shipData.city)}<br>${esc(shipData.country)}`;

    const today = new Date();
    const d1 = new Date(today); d1.setDate(today.getDate() + (shippingMethod === 'exp' ? 1 : 3));
    const d2 = new Date(today); d2.setDate(today.getDate() + (shippingMethod === 'exp' ? 1 : 5));
    const fmt = d => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    document.getElementById('conf-date').textContent   = `${fmt(d1)} – ${fmt(d2)}`;
    document.getElementById('conf-method').textContent =
        shippingMethod === 'exp' ? 'Envío Express (24h)' :
        shippingMethod === 'free' ? 'Envío Gratuito' : 'Envío Estándar (Correos)';

    document.getElementById('cf-sub').textContent   = '€' + s.toFixed(2);
    document.getElementById('cf-ship').textContent  = ship === 0 ? 'Gratis' : '€' + ship.toFixed(2);
    document.getElementById('cf-total').textContent = '€' + total.toFixed(2);
    document.getElementById('conf-card').textContent = '•••• ' + (cardData.last4 || '0000');

    /* Fila cupón en confirmación */
    const cfCupon = document.getElementById('cf-cupon-fila');
    if (cfCupon) {
        cfCupon.style.display = desc > 0 ? '' : 'none';
        if (desc > 0) cfCupon.querySelector('.cupon-valor').textContent = `−€${desc.toFixed(2)}`;
    }

    /* Fila descuento Oro en confirmación */
    const cfOro = document.getElementById('cf-oro-fila');
    if (cfOro) {
        cfOro.style.display = oro > 0 ? '' : 'none';
        if (oro > 0) cfOro.querySelector('.oro-valor').textContent = `−€${oro.toFixed(2)}`;
    }
}


/* ── Toast ── */
let toastTimer;
function showToast(icon, msg) {
    const t = document.getElementById('toast');
    document.getElementById('t-icon').className = 'fa-solid ' + icon;
    document.getElementById('t-msg').textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}


/* ── Utils ── */
function esc(s = '') { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }


/* ── Vinyl Points — canje directo en pago ── */
let puntosAplicados = 0; /* pts usados en esta compra */

function cargarPuntosUsuario() {
    try {
        const raw  = localStorage.getItem('vs_puntos_usuario');
        const data = raw ? JSON.parse(raw) : null;
        const disp = data?.puntosDisponibles ?? 1250;
        document.getElementById('puntosDisp').textContent =
            `${disp.toLocaleString('es-ES')} pts disponibles`;
        /* Configura slider y max del input */
        const slider = document.getElementById('pCanjeSlider');
        const input  = document.getElementById('pCanjeInput');
        const maxEl  = document.getElementById('pSliderMax');
        if (slider) { slider.max = disp; slider.value = 0; }
        if (input)  input.max = disp;
        if (maxEl)  maxEl.textContent = disp.toLocaleString('es-ES') + ' pts';
        actualizarPreviewPuntos();
    } catch (e) { /* sin datos previos */ }
}

/* Sincroniza slider → input */
document.addEventListener('input', e => {
    if (e.target.id === 'pCanjeSlider') {
        const v = Math.round(parseInt(e.target.value) / 100) * 100;
        e.target.value = v;
        const inp = document.getElementById('pCanjeInput');
        if (inp) inp.value = v || '';
        actualizarPreviewPuntos();
    }
    if (e.target.id === 'pCanjeInput') {
        const v = parseInt(e.target.value || 0);
        const slider = document.getElementById('pCanjeSlider');
        if (slider) slider.value = v;
        actualizarPreviewPuntos();
    }
});

function getPuntosDisponibles() {
    try {
        const raw  = localStorage.getItem('vs_puntos_usuario');
        const data = raw ? JSON.parse(raw) : null;
        return data?.puntosDisponibles ?? 1250;
    } catch (e) { return 0; }
}

function actualizarPreviewPuntos() {
    const input   = document.getElementById('pCanjeInput');
    const card    = document.getElementById('pCanjePreviewCard');
    const prev    = document.getElementById('pCanjePreview');
    const quedan  = document.getElementById('pCanjeQuedan');
    if (!input) return;
    const pts  = parseInt(input.value || 0);
    const disp = getPuntosDisponibles();

    if (pts >= 100 && pts % 100 === 0 && pts <= disp) {
        if (card)   card.style.display = 'flex';
        if (prev)   { prev.textContent = `−€${(pts / 100).toFixed(2)} de descuento`; prev.style.color = 'var(--verde)'; }
        if (quedan) quedan.textContent = `te quedan ${(disp - pts).toLocaleString('es-ES')} pts`;
    } else if (pts > disp) {
        if (card)   card.style.display = 'flex';
        if (prev)   { prev.textContent = `Solo tienes ${disp.toLocaleString('es-ES')} pts disponibles`; prev.style.color = 'rgba(255,80,80,0.8)'; }
        if (quedan) quedan.textContent = '';
    } else if (pts > 0 && pts % 100 !== 0) {
        if (card)   card.style.display = 'flex';
        if (prev)   { prev.textContent = 'Debe ser múltiplo de 100 pts'; prev.style.color = 'rgba(255,80,80,0.8)'; }
        if (quedan) quedan.textContent = '';
    } else {
        if (card)   card.style.display = 'none';
    }
}

function aplicarPuntos() {
    const input = document.getElementById('pCanjeInput');
    const pts   = parseInt(input?.value || 0);
    const disp  = getPuntosDisponibles();

    if (!pts || pts < 100)    { showToast('fa-triangle-exclamation', 'Mínimo 100 pts'); return; }
    if (pts % 100 !== 0)      { showToast('fa-triangle-exclamation', 'Debe ser múltiplo de 100'); return; }
    if (pts > disp)           { showToast('fa-triangle-exclamation', `Solo tienes ${disp.toLocaleString('es-ES')} pts`); return; }

    puntosAplicados = pts;
    const desc = parseFloat((pts / 100).toFixed(2));

    /* Muestra estado B — puntos aplicados */
    document.getElementById('pCanjeForm').style.display   = 'none';
    document.getElementById('pCanjeActivo').style.display = 'block';
    document.getElementById('pCanjeValorActivo').textContent =
        `€${desc.toFixed(2)} de descuento aplicado`;
    document.getElementById('pCanjePtsActivos').textContent =
        `${pts.toLocaleString('es-ES')} pts usados · quedan ${(disp - pts).toLocaleString('es-ES')} pts`;

    /* Actualiza totales */
    renderCart();
    showToast('fa-circle-check', `€${desc.toFixed(2)} de descuento aplicado`);
}

function quitarPuntos() {
    puntosAplicados = 0;
    document.getElementById('pCanjeActivo').style.display = 'none';
    document.getElementById('pCanjeForm').style.display   = 'block';
    const input = document.getElementById('pCanjeInput');
    if (input) input.value = '';
    actualizarPreviewPuntos();
    renderCart();
    showToast('fa-xmark', 'Descuento de puntos eliminado');
}

document.addEventListener('click', e => {
    if (e.target.closest('#btnAplicarPuntos'))  aplicarPuntos();
    if (e.target.closest('#btnModificarPuntos')) quitarPuntos();
    if (e.target.closest('#btnQuitarPuntos'))    quitarPuntos();
});

/* ── Direcciones guardadas ── */
const DIRS_GUARDADAS = {
    1: { nombre: 'Alex Rodríguez', email: 'alex.music@ejemplo.com', phone: '+34600000000', street: 'Calle Gran Vía 24, 3ªA', city: 'Madrid',    cp: '28013', country: 'ES' },
    2: { nombre: 'Alex Rodríguez', email: 'alex.music@ejemplo.com', phone: '+34600000000', street: 'Avenida de la Música 10', city: 'Barcelona', cp: '08001', country: 'ES' },
};

let dirSeleccionada = null;

function seleccionarDirGuardada(id) {
    dirSeleccionada = id;
    document.querySelectorAll('.dir-guardada-item').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('[id^="dg-radio-"]').forEach(el => el.classList.remove('dg-radio-sel'));
    document.getElementById(`dg-radio-${id}`)?.classList.add('dg-radio-sel');
    document.querySelector(`.dir-guardada-item[data-id="${id}"]`)?.classList.add('selected');

    const panel = document.getElementById('panelContacto');
    if (id === 0) {
        /* Nueva dirección — muestra el formulario */
        if (panel) panel.style.display = 'block';
        return;
    }
    /* Rellena el formulario con la dirección guardada */
    const d = DIRS_GUARDADAS[id];
    if (!d) return;
    const parts = d.nombre.split(' ');
    document.getElementById('sh-name').value    = parts[0] || '';
    document.getElementById('sh-surname').value = parts.slice(1).join(' ') || '';
    document.getElementById('sh-email').value   = d.email;
    document.getElementById('sh-phone').value   = d.phone;
    document.getElementById('sh-street').value  = d.street;
    document.getElementById('sh-city').value    = d.city;
    document.getElementById('sh-cp').value      = d.cp;
    document.getElementById('sh-country').value = d.country;
    if (panel) panel.style.display = 'block';
}


/* ── Tarjetas guardadas ── */
let guardarTarjeta = true;
let tarjetaSeleccionada = 'nueva'; /* 'nueva' | 'guardada' */

function toggleGuardarTarjeta() {
    guardarTarjeta = !guardarTarjeta;
    document.getElementById('save-card-toggle')?.classList.toggle('on', guardarTarjeta);
}

function cargarTarjetaGuardada() {
    /* TODO (Supabase): SELECT * FROM tarjetas_guardadas WHERE user_id = auth.uid() LIMIT 1 */
    try {
        const raw = localStorage.getItem('vs_tarjeta_guardada');
        if (!raw) return;
        const t = JSON.parse(raw);
        const el = document.getElementById('tg-guardada');
        if (!el) return;
        el.style.display = 'flex';
        document.getElementById('tgLast4').textContent   = t.last4;
        document.getElementById('tgTitular').textContent = t.holder;
    } catch (e) { /* sin tarjeta */ }
}

function seleccionarTarjeta(tipo) {
    tarjetaSeleccionada = tipo;
    document.querySelectorAll('.tarjeta-guardada-item').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.tg-radio').forEach(el => el.classList.remove('tg-radio-sel'));

    const el = document.getElementById(tipo === 'nueva' ? 'tg-nueva' : 'tg-guardada');
    el?.classList.add('selected');
    el?.querySelector('.tg-radio')?.classList.add('tg-radio-sel');

    /* Muestra/oculta el formulario de tarjeta */
    const form = document.querySelector('.panel:has(#card-num)') ||
                 document.getElementById('wrap-cn')?.closest('.panel');
    if (form) form.style.display = tipo === 'nueva' ? 'block' : 'none';

    if (tipo === 'guardada') {
        /* Rellena con datos de la tarjeta guardada */
        try {
            const raw = localStorage.getItem('vs_tarjeta_guardada');
            if (!raw) return;
            const t = JSON.parse(raw);
            document.getElementById('card-num').value    = '•••• •••• •••• ' + t.last4;
            document.getElementById('card-holder').value = t.holder;
        } catch (e) { /* sin datos */ }
    }
}

function eliminarTarjetaGuardada(e) {
    e.stopPropagation();
    localStorage.removeItem('vs_tarjeta_guardada');
    document.getElementById('tg-guardada').style.display = 'none';
    seleccionarTarjeta('nueva');
    showToast('fa-trash', 'Tarjeta eliminada');
}


/* ── Modal resumen final — antes de confirmar ── */
function mostrarResumenFinal() {
    /* Validaciones primero */
    const num    = document.getElementById('card-num').value.replace(/[\s•]/g, '');
    const holder = document.getElementById('card-holder').value.trim();
    const exp    = document.getElementById('card-exp').value.replace(/\D/g, '');
    const cvv    = document.getElementById('card-cvv').value;
    const mes    = parseInt(exp.slice(0, 2), 10);

    if (tarjetaSeleccionada === 'nueva') {
        if (num.length < 16)                        { showToast('fa-triangle-exclamation', 'Número de tarjeta incompleto'); return; }
        if (!holder || !/^[a-zA-ZÀ-ÿ\s\-']+$/.test(holder)) { showToast('fa-triangle-exclamation', 'El titular solo puede contener letras'); return; }
        if (exp.length < 4 || mes < 1 || mes > 12) { showToast('fa-triangle-exclamation', 'Fecha de caducidad inválida'); return; }
        if (cvv.length < 3)                         { showToast('fa-triangle-exclamation', 'CVV incompleto'); return; }
    }

    const s     = sub();
    const desc  = descuentoCupon();
    const oro   = descuentoOro();
    const ship  = shippingCost;
    const total = Math.max(0, s - desc - oro + ship);
    const last4 = tarjetaSeleccionada === 'nueva' ? num.slice(-4) : (JSON.parse(localStorage.getItem('vs_tarjeta_guardada') || '{}').last4 || '0000');

    /* Rellena el modal */
    let itemsHtml = '';
    cart.forEach(i => {
        itemsHtml += `<div class="mr-item">
            ${i.imagen
                ? `<img src="${i.imagen}" alt="${esc(i.name)}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;flex-shrink:0;">`
                : `<i class="${i.icon}" style="color:var(--rojo);font-size:1.2rem;flex-shrink:0;"></i>`
            }
            <div class="mr-item-info">
                <span>${esc(i.name)}</span>
                <span class="mr-item-meta">${esc(i.variant)} · Cant: ${i.qty}</span>
            </div>
            <span class="mr-item-precio">€${(i.price * i.qty).toFixed(2)}</span>
        </div>`;
    });
    document.getElementById('mr-items').innerHTML = itemsHtml;

    document.getElementById('mr-metodo-envio').textContent =
        shippingMethod === 'exp' ? 'Envío Express (24h)' :
        shippingMethod === 'free' ? 'Envío Gratuito' : 'Envío Estándar (Correos)';
    document.getElementById('mr-coste-envio').textContent = ship === 0 ? 'Gratis' : `€${ship.toFixed(2)}`;
    document.getElementById('mr-direccion').textContent   = `${shipData.street || '–'}, ${shipData.cp || ''} ${shipData.city || ''}`;
    document.getElementById('mr-tarjeta').textContent     = `•••• •••• •••• ${last4}`;
    document.getElementById('mr-titular-card').textContent = holder || document.getElementById('card-holder').value.trim();

    document.getElementById('mr-sub').textContent       = `€${s.toFixed(2)}`;
    document.getElementById('mr-envio-total').textContent = ship === 0 ? 'Gratis' : `€${ship.toFixed(2)}`;
    document.getElementById('mr-total').textContent     = `€${total.toFixed(2)}`;
    document.getElementById('mr-total-btn').textContent = `€${total.toFixed(2)}`;

    const filaCupon = document.getElementById('mr-fila-cupon');
    if (filaCupon) { filaCupon.style.display = desc > 0 ? 'flex' : 'none'; if (desc > 0) document.getElementById('mr-cupon').textContent = `−€${desc.toFixed(2)}`; }

    const filaOro = document.getElementById('mr-fila-oro');
    if (filaOro) { filaOro.style.display = oro > 0 ? 'flex' : 'none'; if (oro > 0) document.getElementById('mr-oro').textContent = `−€${oro.toFixed(2)}`; }

    document.getElementById('modalResumenFinal').classList.add('visible');
    document.body.style.overflow = 'hidden';
}

function cerrarResumenFinal() {
    document.getElementById('modalResumenFinal').classList.remove('visible');
    document.body.style.overflow = '';
}

/* Cerrar al clicar fuera */
document.addEventListener('click', e => {
    const overlay = document.getElementById('modalResumenFinal');
    if (e.target === overlay) cerrarResumenFinal();
});

/* ── Init ── */
cargarNivelUsuario();
cargarCupon();
cargarPuntosUsuario();
cargarTarjetaGuardada();
selectShipping('std');
renderCart();