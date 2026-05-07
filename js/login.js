/* ============================================================
   LOGIN.JS — Lógica de la página de inicio de sesión
   ============================================================ */


document.addEventListener('DOMContentLoaded', () => {

    /* Toggle mostrar / ocultar contraseña */
    const inputPassword = document.getElementById('password');
    const btnToggle     = document.getElementById('togglePassword');

    if (inputPassword && btnToggle) {
        btnToggle.addEventListener('click', () => {
            const visible      = inputPassword.type === 'text';
            inputPassword.type = visible ? 'password' : 'text';
            /* Cambia icono entre ojo abierto y tachado */
            btnToggle.innerHTML = visible
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';
        });
    }


    /* ============================================================
       ENVÍO DEL FORMULARIO — validaciones básicas
       TODO (Spring Boot): POST /api/auth/login { email, password }
       TODO (Supabase): supabase.auth.signInWithPassword({ email, password })
       ============================================================ */
    const formLogin = document.getElementById('formLogin');

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            /* Validación — campos vacíos */
            if (!email || !password) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            /* TODO (Spring Boot): POST /api/auth/login */
            /* TODO (Supabase): supabase.auth.signInWithPassword() */
        });
    }


    /* ============================================================
       BOTÓN GOOGLE
       TODO (Spring Boot): OAuth2 Google login
       TODO (Supabase): supabase.auth.signInWithOAuth({ provider: 'google' })
       ============================================================ */
    const btnGoogle = document.getElementById('btnGoogle');

    if (btnGoogle) {
        btnGoogle.addEventListener('click', () => {
            /* TODO (Spring Boot): OAuth2 Google login */
            /* TODO (Supabase): supabase.auth.signInWithOAuth({ provider: 'google' }) */
        });
    }

});