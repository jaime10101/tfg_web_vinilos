/* ============================================================
   HEADER.JS — Carga automática de header y footer
   Incluir este script en TODAS las páginas del proyecto.
   Se encarga de:
     1. Inyectar components/header.html y components/footer.html
     2. Marcar el enlace activo según la URL actual
     3. Menú hamburguesa (móvil)
     4. Animación de entrada de la cabecera
     5. Botón "Volver arriba"
   ============================================================ */

(function () {

    /* ----------------------------------------------------------
       Calcula la ruta relativa a la raíz del proyecto.
       Funciona aunque la página esté en /pages/ o /pages/detalle/
    ---------------------------------------------------------- */
    function rutaBase() {
        const profundidad = window.location.pathname.split('/').filter(Boolean).length;
        // index.html está en la raíz → profundidad 0 o 1
        if (profundidad <= 1) return './';
        return '../'.repeat(profundidad - 1);
    }

    /* ----------------------------------------------------------
       Inyecta el HTML de un componente en el elemento indicado
    ---------------------------------------------------------- */
    async function cargarComponente(url, insertarAntes) {
        try {
            const res  = await fetch(url);
            const html = await res.text();
            const div  = document.createElement('div');
            div.innerHTML = html;
            // Insertamos antes del primer hijo del body (o al final si no hay referencia)
            document.body.insertBefore(div.firstElementChild, insertarAntes || null);
        } catch (e) {
            console.warn(`[header.js] No se pudo cargar ${url}`, e);
        }
    }

    /* ----------------------------------------------------------
       Marca como activo el enlace del menú que coincide con
       la URL actual
    ---------------------------------------------------------- */
    function marcarEnlaceActivo() {
        const ruta = window.location.pathname;
        document.querySelectorAll('.menu a').forEach(a => {
            const href = a.getAttribute('href') || '';
            // Coincidencia exacta o por segmento de ruta
            if (
                href === ruta ||
                (href !== '/' && href !== '/index.html' && ruta.includes(href.replace('/index.html', '')))
            ) {
                a.classList.add('activo');
            }
        });
    }

    /* ----------------------------------------------------------
       Menú hamburguesa para móvil
    ---------------------------------------------------------- */
    function iniciarHamburguesa() {
        const btn  = document.getElementById('btnHamburguesa');
        const menu = document.getElementById('menu-nav');
        if (!btn || !menu) return;

        btn.addEventListener('click', () => {
            btn.classList.toggle('abierto');
            menu.classList.toggle('abierto');
        });

        // Cierra al pulsar un enlace
        menu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                btn.classList.remove('abierto');
                menu.classList.remove('abierto');
            });
        });

        // Cierra al pulsar fuera
        document.addEventListener('click', e => {
            if (!btn.contains(e.target) && !menu.contains(e.target)) {
                btn.classList.remove('abierto');
                menu.classList.remove('abierto');
            }
        });
    }

    /* ----------------------------------------------------------
       Animación de entrada del header
    ---------------------------------------------------------- */
    function animarHeader() {
        const cabecera = document.querySelector('.header-transparent');
        if (!cabecera) return;
        setTimeout(() => cabecera.classList.add('visible'), 200);
    }

    /* ----------------------------------------------------------
       Botón "Volver arriba"
    ---------------------------------------------------------- */
    function iniciarBtnSubir() {
        const btn = document.getElementById('btnSubir');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 400);
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ----------------------------------------------------------
       INICIALIZACIÓN PRINCIPAL
       Carga header → footer → activa funcionalidades
    ---------------------------------------------------------- */
    async function init() {
        const base        = rutaBase();
        const primerHijo  = document.body.firstElementChild;

        // 1. Inyectar header al principio del body
        await cargarComponente(`${base}components/header.html`, primerHijo);

        // 2. Inyectar footer al final del body
        await cargarComponente(`${base}components/footer.html`, null);

        // 3. Activar funcionalidades tras inyectar el HTML
        marcarEnlaceActivo();
        iniciarHamburguesa();
        animarHeader();
        iniciarBtnSubir();
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();