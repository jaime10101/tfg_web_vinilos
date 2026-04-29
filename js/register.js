/* ============================================================
   REGISTER.JS — Lógica de la página de registro
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------
       MOSTRAR / OCULTAR CONTRASEÑA
       Maneja todos los campos .toggle-pass de la página
    ---------------------------------------------------------- */
    document.querySelectorAll('.toggle-pass').forEach(btn => {
        btn.addEventListener('click', () => {
            const input   = document.getElementById(btn.dataset.target);
            if (!input) return;
            const visible = input.type === 'text';
            input.type    = visible ? 'password' : 'text';

            // Cambia el icono entre ojo abierto y tachado
            btn.innerHTML = visible
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';
        });
    });


    /* ----------------------------------------------------------
       VALIDACIÓN Y ENVÍO DEL FORMULARIO
       TODO (Supabase): reemplazar el console.log por:
         const { data, error } = await supabase.auth.signUp({
           email,
           password,
           options: { data: { nombre, apellido } }
         });
         if (error) { mostrarError(error.message); return; }
         window.location.href = '../index.html';
    ---------------------------------------------------------- */
    const formRegister = document.getElementById('formRegister');

    if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre   = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const email    = document.getElementById('email').value.trim();
            const pass1    = document.getElementById('pass1').value;
            const pass2    = document.getElementById('pass2').value;
            const terminos = document.getElementById('terminos').checked;

            // Validaciones básicas
            if (!nombre || !apellido || !email || !pass1 || !pass2) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            if (pass1.length < 8) {
                alert('La contraseña debe tener al menos 8 caracteres.');
                return;
            }

            if (pass1 !== pass2) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            if (!terminos) {
                alert('Debes aceptar los Términos y Condiciones.');
                return;
            }

            // Placeholder hasta conectar Supabase
            console.log('Registro con:', { nombre, apellido, email });
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
            console.log('Registro con Google — pendiente de Supabase');
            // TODO: supabase.auth.signInWithOAuth({ provider: 'google' })
        });
    }

});