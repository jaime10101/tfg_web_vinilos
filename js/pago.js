/* ============================================================
   PAGO.JS — Lógica del checkout (carrito → envío → pago → confirmación)
   Nota: header, footer, hamburguesa y btn-subir los gestiona header.js
   ============================================================ */

const FREE_THRESHOLD   = 100;
let shippingMethod     = 'std';
let shippingCost       = 4.95;
let promoApplied       = false;
let billingOn          = true;
let userPickedShipping = false;
let shipData           = {};
let cardData           = {};

let cart = [
    { id: 1, name: 'Camiseta "Nevermind"',      artist: 'Nirvana',        variant: 'Talla M · Blanco',        icon: 'fa-solid fa-shirt',      price: 29.99, stock: 'in',  qty: 1 },
    { id: 2, name: 'Hoodie "Dark Side"',         artist: 'Pink Floyd',     variant: 'Talla L · Negro',         icon: 'fa-solid fa-shirt',      price: 54.99, stock: 'in',  qty: 1 },
    { id: 3, name: 'Gorra Bordada "AM"',         artist: 'Arctic Monkeys', variant: 'Talla única · Negra',     icon: 'fa-solid fa-hat-cowboy', price: 24.99, stock: 'low', qty: 1 },
    { id: 4, name: 'Chaqueta Bomber "Currents"', artist: 'Tame Impala',    variant: 'Talla S · Verde oliva',   icon: 'fa-solid fa-person',     price: 89.99, stock: 'in',  qty: 1 },
    { id: 5, name: 'Calcetines Pack x3 "Roses"', artist: 'Rosalía',       variant: 'Talla 36-42 · Multicolor',icon: 'fa-solid fa-socks',      price: 14.99, stock: 'low', qty: 1 },
];

/* ── Navegación entre páginas ── */
function goTo(n) {
    const pages = ['cart', 'shipping', 'payment', 'confirm'];
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pages[n - 1]).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (n === 2) renderSidebarSummary('ship');
    if (n === 3) renderSidebarSummary('pay');
    if (n === 4) buildConfirmation();
}

/* ── Helpers precio ── */
function sub()        { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function grandTotal() { return sub() + shippingCost; }

/* ── Render carrito ── */
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
                        ${item.stock === 'in' ? '<i class="fa-solid fa-circle-check"></i> En stock' : '<i class="fa-solid fa-triangle-exclamation"></i> Últimas unidades'}
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

    const s = sub(), ship = shippingCost, total = s + ship;
    document.getElementById('cart-count').textContent  = `(${count})`;
    document.getElementById('s-count-lbl').textContent = `Subtotal (${count} artículo${count !== 1 ? 's' : ''})`;
    document.getElementById('s-sub').textContent       = '€' + s.toFixed(2);
    document.getElementById('s-ship').textContent      = ship === 0 ? 'Gratis' : '€' + ship.toFixed(2);
    document.getElementById('s-total').textContent     = '€' + total.toFixed(2);

    const pct = Math.min(100, (s / FREE_THRESHOLD) * 100);
    document.getElementById('ship-fill').style.width = pct + '%';
    document.getElementById('free-msg-bar').innerHTML = s >= FREE_THRESHOLD
        ? '<i class="fa-solid fa-circle-check" style="color:var(--verde)"></i> ¡Tienes <span class="hl">envío gratis</span>!'
        : `Te faltan <span class="hl">€${(FREE_THRESHOLD - s).toFixed(2)}</span> para envío gratis`;

    const freeEl = document.getElementById('ship-free');
    if (freeEl) freeEl.style.display = s >= FREE_THRESHOLD ? 'flex' : 'none';
    if (s >= FREE_THRESHOLD && !userPickedShipping) {
        shippingMethod = 'free'; shippingCost = 0;
        ['std', 'exp', 'free'].forEach(t => document.getElementById('ship-' + t)?.classList.remove('selected'));
        document.getElementById('ship-free')?.classList.add('selected');
    }
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
        { id: 1, name: 'Camiseta "Nevermind"',      artist: 'Nirvana',        variant: 'Talla M · Blanco',        icon: 'fa-solid fa-shirt',      price: 29.99, stock: 'in',  qty: 1 },
        { id: 2, name: 'Hoodie "Dark Side"',         artist: 'Pink Floyd',     variant: 'Talla L · Negro',         icon: 'fa-solid fa-shirt',      price: 54.99, stock: 'in',  qty: 1 },
        { id: 3, name: 'Gorra Bordada "AM"',         artist: 'Arctic Monkeys', variant: 'Talla única · Negra',     icon: 'fa-solid fa-hat-cowboy', price: 24.99, stock: 'low', qty: 1 },
        { id: 4, name: 'Chaqueta Bomber "Currents"', artist: 'Tame Impala',    variant: 'Talla S · Verde oliva',   icon: 'fa-solid fa-person',     price: 89.99, stock: 'in',  qty: 1 },
        { id: 5, name: 'Calcetines Pack x3 "Roses"', artist: 'Rosalía',       variant: 'Talla 36-42 · Multicolor',icon: 'fa-solid fa-socks',      price: 14.99, stock: 'low', qty: 1 },
    ];
    promoApplied = false; userPickedShipping = false; shippingMethod = 'std'; shippingCost = 4.95;
    selectShipping('std'); renderCart();
}

/* ── Envío ── */
function selectShipping(type, userAction = false) {
    if (userAction) userPickedShipping = true;
    shippingMethod = type;
    shippingCost   = type === 'exp' ? 9.95 : type === 'free' ? 0 : 4.95;
    ['std', 'exp', 'free'].forEach(t => document.getElementById('ship-' + t)?.classList.remove('selected'));
    document.getElementById('ship-' + type)?.classList.add('selected');
    renderSidebarSummary('ship');
    document.getElementById('s-ship').textContent  = shippingCost === 0 ? 'Gratis' : '€' + shippingCost.toFixed(2);
    document.getElementById('s-total').textContent = '€' + grandTotal().toFixed(2);
}

function goToPayment() {
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

function renderSidebarSummary(which) {
    const s = sub(), ship = shippingCost, total = s + ship;
    let html = '';
    cart.forEach(i => {
        html += `<div style="display:flex;align-items:center;gap:12px;padding:12px 10px;background:rgba(18,16,58,0.6);border:1px solid var(--borde);border-radius:12px;margin-bottom:10px;">
            <div style="width:52px;height:52px;border-radius:9px;background:var(--superficie);border:1px solid var(--borde);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="${i.icon}" style="font-size:1.5rem;color:var(--rojo);"></i>
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
}

/* ── Validación tarjeta ── */
function fmtCard(el) {
    let v = el.value.replace(/\D/g, '').slice(0, 16);
    el.value = v.replace(/(.{4})/g, '$1 ').trim();
    document.getElementById('wrap-cn').classList.toggle('valid', v.length === 16);
}
function chkHolder(el) { document.getElementById('wrap-ch').classList.toggle('valid', el.value.trim().length > 2); }
function fmtExp(el) {
    let v = el.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2);
    el.value = v;
    document.getElementById('wrap-ex').classList.toggle('valid', v.replace(/\D/g, '').length === 4);
}
function chkCVV(el) {
    el.value = el.value.replace(/\D/g, '').slice(0, 4);
    document.getElementById('wrap-cv').classList.toggle('valid', el.value.length >= 3);
}
function toggleBill() { billingOn = !billingOn; document.getElementById('bill-toggle').classList.toggle('off', !billingOn); }

function processPay() {
    const num = document.getElementById('card-num').value.replace(/\s/g, '');
    if (num.length < 16)                                                          { showToast('fa-triangle-exclamation', 'Introduce un número de tarjeta válido'); return; }
    if (!document.getElementById('card-holder').value.trim())                    { showToast('fa-triangle-exclamation', 'Introduce el nombre del titular'); return; }
    if (document.getElementById('card-exp').value.replace(/\D/g, '').length < 4) { showToast('fa-triangle-exclamation', 'Introduce la fecha de caducidad'); return; }
    if (document.getElementById('card-cvv').value.length < 3)                    { showToast('fa-triangle-exclamation', 'Introduce el CVV'); return; }
    cardData = { last4: num.slice(-4), holder: document.getElementById('card-holder').value };
    goTo(4);
    showToast('fa-circle-check', '¡Pedido confirmado!');
}

/* ── Confirmación ── */
function buildConfirmation() {
    const s = sub(), ship = shippingCost, total = s + ship;
    document.getElementById('conf-order-id').textContent = '#VS-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('conf-email-msg').innerHTML = `Hemos enviado los detalles a <strong>${esc(shipData.email || 'usuario@ejemplo.com')}</strong>`;

    let html = '';
    cart.forEach(i => {
        html += `<div class="conf-item">
            <div class="conf-thumb"><i class="${i.icon}"></i></div>
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
    document.getElementById('conf-addr').innerHTML   = `${esc(shipData.street)}<br>${esc(shipData.cp)} ${esc(shipData.city)}<br>${esc(shipData.country)}`;

    const today = new Date();
    const d1 = new Date(today); d1.setDate(today.getDate() + (shippingMethod === 'exp' ? 1 : 3));
    const d2 = new Date(today); d2.setDate(today.getDate() + (shippingMethod === 'exp' ? 1 : 5));
    const fmt = d => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    document.getElementById('conf-date').textContent   = `${fmt(d1)} – ${fmt(d2)}`;
    document.getElementById('conf-method').textContent = shippingMethod === 'exp' ? 'Envío Express (24h)' : shippingMethod === 'free' ? 'Envío Gratuito' : 'Envío Estándar (Correos)';
    document.getElementById('cf-sub').textContent      = '€' + s.toFixed(2);
    document.getElementById('cf-ship').textContent     = ship === 0 ? 'Gratis' : '€' + ship.toFixed(2);
    document.getElementById('cf-total').textContent    = '€' + total.toFixed(2);
    document.getElementById('conf-card').textContent   = '•••• ' + (cardData.last4 || '0000');
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

/* ── Init ── */
selectShipping('std');
renderCart();