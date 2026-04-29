/* ============================================================
   LOGIN.JS — Lógica de la página de inicio de sesión
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------
       MOSTRAR / OCULTAR CONTRASEÑA
       Usa iconos de Font Awesome en lugar de emojis
    ---------------------------------------------------------- */
    const inputPassword  = document.getElementById('password');
    const btnToggle      = document.getElementById('togglePassword');

    if (inputPassword && btnToggle) {
        btnToggle.addEventListener('click', () => {
            const visible = inputPassword.type === 'text';
            inputPassword.type = visible ? 'password' : 'text';

            // Cambia el icono entre ojo abierto y tachado
            btnToggle.innerHTML = visible
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';
        });
    }


    /* ----------------------------------------------------------
       ENVÍO DEL FORMULARIO
       TODO (Supabase): reemplazar el console.log por:
         const { data, error } = await supabase.auth.signInWithPassword({
           email: email.value,
           password: password.value
         });
         if (error) { mostrarError(error.message); return; }
         window.location.href = '../index.html';
    ---------------------------------------------------------- */
    const formLogin = document.getElementById('formLogin');

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!email || !password) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            // Placeholder hasta conectar Supabase
            console.log('Login con:', email);
            // TODO: llamada a Supabase aquí
        });
    }


    /* ----------------------------------------------------------
       BOTÓN GOOGLE
       TODO (Supabase): reemplazar por:
         supabase.auth.signInWithOAuth({ provider: 'google' })
    ---------------------------------------------------------- */
    const btnGoogle = document.getElementById('btnGoogle');

    if (btnGoogle) {
        btnGoogle.addEventListener('click', () => {
            console.log('Login con Google — pendiente de Supabase');
            // TODO: supabase.auth.signInWithOAuth({ provider: 'google' })
        });
    }

});