/* ============================================================
   CUENTA.JS — Lógica de la página de cuenta de usuario
   TODO (Supabase): conectar con supabase.auth para datos reales
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Navegación entre secciones ── */
    const btnNav     = document.querySelectorAll('.cuenta-nav-btn[data-seccion]');
    const secciones  = document.querySelectorAll('.seccion-cuenta');

    btnNav.forEach(btn => {
        btn.addEventListener('click', () => {
            btnNav.forEach(b => b.classList.remove('activo'));
            secciones.forEach(s => s.classList.remove('activa'));
            btn.classList.add('activo');
            const seccion = document.getElementById(`sec-${btn.dataset.seccion}`);
            if (seccion) seccion.classList.add('activa');
        });
    });

    /* ── Cerrar sesión ── */
    /* TODO (Supabase): reemplazar por supabase.auth.signOut() */
    document.getElementById('btnCerrarSesion')?.addEventListener('click', () => {
        if (confirm('¿Seguro que quieres cerrar sesión?')) {
            window.location.href = 'login.html';
        }
    });

    /* ── Guardar perfil ── */
    /* TODO (Supabase): reemplazar por supabase.from('perfiles').upsert({...}) */
    document.getElementById('btnGuardarPerfil')?.addEventListener('click', () => {
        if (typeof mostrarToast !== 'undefined') {
            mostrarToast('Perfil actualizado correctamente');
        }
    });

    /* ── Cargar datos del usuario ── */
    /* TODO (Supabase): reemplazar por:
       const { data: { user } } = await supabase.auth.getUser();
       if (user) {
           document.getElementById('nombreUsuario').textContent = user.user_metadata?.nombre || 'Usuario';
           document.getElementById('emailUsuario').textContent  = user.email;
       } else {
           window.location.href = 'login.html'; // redirigir si no hay sesión
       }
    */
    document.getElementById('nombreUsuario').textContent = 'Usuario';
    document.getElementById('emailUsuario').textContent  = 'usuario@email.com';
});