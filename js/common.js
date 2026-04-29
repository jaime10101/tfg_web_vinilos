/* ============================================================
   COMMON.JS — Funciones de utilidad compartidas
   Disponible en todas las páginas del proyecto.
   ============================================================ */

/* ----------------------------------------------------------
   CARRITO (simulado — TODO: conectar a Supabase)
   Estructura de cada ítem:
   { id, nombre, precio, tipo, imagen, cantidad }
---------------------------------------------------------- */
const Carrito = {

    /* Lee el carrito del localStorage */
    obtener() {
        try {
            return JSON.parse(localStorage.getItem('vs_carrito') || '[]');
        } catch {
            return [];
        }
    },

    /* Guarda el carrito en localStorage */
    guardar(items) {
        localStorage.setItem('vs_carrito', JSON.stringify(items));
        this.actualizarContador();
    },

    /* Añade o incrementa un producto */
    agregar(producto) {
        const items = this.obtener();
        const idx   = items.findIndex(i => i.id === producto.id);
        if (idx >= 0) {
            items[idx].cantidad += 1;
        } else {
            items.push({ ...producto, cantidad: 1 });
        }
        this.guardar(items);
        mostrarToast(`${producto.nombre} añadido al carrito`);
    },

    /* Elimina un producto por id */
    eliminar(id) {
        this.guardar(this.obtener().filter(i => i.id !== id));
    },

    /* Total de unidades en el carrito */
    totalUnidades() {
        return this.obtener().reduce((acc, i) => acc + i.cantidad, 0);
    },

    /* Precio total */
    totalPrecio() {
        return this.obtener().reduce((acc, i) => {
            const num = parseFloat(String(i.precio).replace('€', '').replace(',', '.'));
            return acc + (isNaN(num) ? 0 : num * i.cantidad);
        }, 0).toFixed(2);
    },

    /* Actualiza el contador visual del icono de carrito en el header */
    actualizarContador() {
        const n    = this.totalUnidades();
        let badge  = document.getElementById('carrito-badge');

        if (!badge) {
            // Crea el badge si no existe
            const iconoCarrito = document.querySelector('.iconos-nav a[href*="pago"]');
            if (!iconoCarrito) return;
            badge = document.createElement('span');
            badge.id = 'carrito-badge';
            badge.style.cssText = `
                position: absolute;
                top: -6px;
                right: -6px;
                background: var(--grad-fuego);
                color: #fff;
                font-size: 10px;
                font-weight: 800;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: none;
            `;
            iconoCarrito.style.position = 'relative';
            iconoCarrito.appendChild(badge);
        }

        badge.textContent  = n > 99 ? '99+' : n;
        badge.style.display = n > 0 ? 'flex' : 'none';
    }
};


/* ----------------------------------------------------------
   TOAST — Notificación temporal en pantalla
   Uso: mostrarToast('Mensaje aquí')
---------------------------------------------------------- */
function mostrarToast(mensaje, tipo = 'exito') {
    // Elimina toast anterior si existía
    document.getElementById('vs-toast')?.remove();

    const toast = document.createElement('div');
    toast.id = 'vs-toast';
    toast.textContent = mensaje;

    const color = tipo === 'error' ? '#FF006E' : '#00FF94';

    toast.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 30px;
        background: rgba(12, 9, 24, 0.96);
        color: ${color};
        border: 1px solid ${color}44;
        padding: 12px 22px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 600;
        z-index: 9999;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;

    document.body.appendChild(toast);

    // Anima entrada
    requestAnimationFrame(() => {
        toast.style.opacity   = '1';
        toast.style.transform = 'translateY(0)';
    });

    // Desaparece a los 3 segundos
    setTimeout(() => {
        toast.style.opacity   = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


/* ----------------------------------------------------------
   FORMATEAR PRECIO
   Uso: formatearPrecio(35) → '€35,00'
---------------------------------------------------------- */
function formatearPrecio(num) {
    return '€' + parseFloat(num).toFixed(2).replace('.', ',');
}


/* ----------------------------------------------------------
   TRUNCAR TEXTO
   Uso: truncar('Texto muy largo', 40) → 'Texto muy...'
---------------------------------------------------------- */
function truncar(texto, max = 60) {
    return texto.length > max ? texto.slice(0, max).trimEnd() + '…' : texto;
}


/* ----------------------------------------------------------
   DEBOUNCE — evita ejecuciones excesivas en resize/scroll
   Uso: window.addEventListener('resize', debounce(fn, 200))
---------------------------------------------------------- */
function debounce(fn, delay = 200) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}


/* ----------------------------------------------------------
   INICIALIZACIÓN: actualiza el contador del carrito al cargar
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    // Pequeño retraso para que el header.js haya inyectado el header
    setTimeout(() => Carrito.actualizarContador(), 500);
});