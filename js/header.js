/* ============================================================
   HEADER.JS — Carga automática de header y footer
   Se incluye en TODAS las páginas del proyecto.
   Gestiona:
     1. Inyectar components/header.html y components/footer.html
     2. Marcar el enlace activo según la URL actual
     3. Menú hamburguesa en móvil
     4. Animación de entrada del header
     5. Botón "Volver arriba"
   ============================================================ */

(function () {

    /* Calcula la ruta relativa a la raíz del proyecto
       — funciona desde /pages/ y /pages/detalle/ */
    function rutaBase() {
    const profundidad = window.location.pathname.split('/').filter(Boolean).length;
        if (profundidad <= 1) return './';
        return '../'.repeat(profundidad - 1);
    }

    /* Inyecta el HTML de un componente antes del elemento indicado */
    async function cargarComponente(url, insertarAntes) {
        try {
            const res  = await fetch(url);
            const html = await res.text();
            const div  = document.createElement('div');
            div.innerHTML = html;
            /* Inserta TODOS los hijos — necesario para el footer + btn-subir */
            while (div.firstElementChild) {
                document.body.insertBefore(div.firstElementChild, insertarAntes || null);
            }
        } catch (e) {
            console.warn(`[header.js] No se pudo cargar ${url}`, e);
        }
    }

    /* Marca como activo el enlace del menú que coincide con la URL actual */
    function marcarEnlaceActivo() {
        const ruta = window.location.pathname;
        document.querySelectorAll('.menu a').forEach(a => {
            const href = a.getAttribute('href') || '';
                      if (
                href === ruta ||
                (href !== '/' && href !== '/index.html' && ruta.includes(href.replace('/index.html', '')))
            ) {
                a.classList.add('activo');
            }
        });
    }

    /* Menú hamburguesa — abre/cierra en móvil */
    function iniciarHamburguesa() {
        const btn  = document.getElementById('btnHamburguesa');
        const menu = document.getElementById('menu-nav');
        if (!btn || !menu) return;

        btn.addEventListener('click', () => {
            btn.classList.toggle('abierto');
            menu.classList.toggle('abierto');
        });

        /* Cierra al pulsar un enlace */
        menu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                btn.classList.remove('abierto');
                menu.classList.remove('abierto');
            });
        });

        /* Cierra al pulsar fuera del menú */
        document.addEventListener('click', e => {
            if (!btn.contains(e.target) && !menu.contains(e.target)) {
                btn.classList.remove('abierto');
                menu.classList.remove('abierto');
            }
        });
    }

    /* Animación de entrada del header */
    function animarHeader() {
        const cabecera = document.querySelector('.header-transparent');
        if (!cabecera) return;
        setTimeout(() => cabecera.classList.add('visible'), 200);
    }

    /* Botón volver arriba — aparece al hacer scroll */
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

    /* ============================================================
       INICIALIZACIÓN — header → footer → funcionalidades
       ============================================================ */
    async function init() {
        const base       = rutaBase();
        const primerHijo = document.body.firstElementChild;

        /* 1. Header al inicio del body */
        await cargarComponente(`${base}components/header.html`, primerHijo);

        /* 2. Footer al final del body — btn-subir viene dentro */
        await cargarComponente(`${base}components/footer.html`, null);

        /* 3. Activar funcionalidades tras inyectar el HTML */
        marcarEnlaceActivo();
        iniciarHamburguesa();
        animarHeader();
        iniciarBtnSubir();
    }

    /* Ejecutar cuando el DOM esté listo */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();