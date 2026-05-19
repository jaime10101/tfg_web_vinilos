/* ============================================================
   REGISTER.JS — Lógica de la página de registro
   ============================================================ */


document.addEventListener('DOMContentLoaded', () => {

    /* Toggle mostrar / ocultar contraseña */
    document.querySelectorAll('.toggle-contrasena').forEach(btn => {
        btn.addEventListener('click', () => {
            const input   = document.getElementById(btn.dataset.target);
            if (!input) return;
            const visible = input.type === 'text';
            input.type    = visible ? 'password' : 'text';
            /* Cambia icono entre ojo abierto y tachado */
            btn.innerHTML = visible
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';
        });
    });


    /* ============================================================
       ENVÍO DEL FORMULARIO — validaciones básicas
       TODO (Spring Boot): POST /api/auth/register { nombre, apellido, email, password }
       TODO (Supabase): supabase.auth.signUp({ email, password, options: { data: { nombre, apellido } } })
       ============================================================ */
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

            /* Validación — campos vacíos */
            if (!nombre || !apellido || !email || !pass1 || !pass2) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            /* Validación — contraseña mínimo 8 caracteres */
            if (pass1.length < 8) {
                alert('La contraseña debe tener al menos 8 caracteres.');
                return;
            }

            /* Validación — contraseñas coincidentes */
            if (pass1 !== pass2) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            /* Validación — términos aceptados */
            if (!terminos) {
                alert('Debes aceptar los Términos y Condiciones.');
                return;
            }

            /* Genera número de socio auto-incremental
               TODO (Supabase): el número real será el índice del usuario en auth.users
               Por ahora se auto-incrementa en localStorage entre registros del mismo dispositivo */
            const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
            const ahora = new Date();
            const fechaAlta = `${ahora.getDate()} ${meses[ahora.getMonth()]} ${ahora.getFullYear()}`;

            /* Obtiene el último número de socio y lo incrementa */
            let ultimoNum = parseInt(localStorage.getItem('vs_ultimo_socio_num') || '1000');
            ultimoNum++;
            localStorage.setItem('vs_ultimo_socio_num', String(ultimoNum));
            const socioNum = `#VS-${String(ultimoNum).padStart(4, '0')}`;

            /* Guarda los datos del usuario registrado */
            localStorage.setItem('vs_usuario_registro', JSON.stringify({
                nombre:    nombre,
                apellidos: apellido,
                email:     email,
                socioNum:  socioNum,
                fechaAlta: fechaAlta,
                puntosHistorico:   100,  /* bonus de bienvenida */
                puntosDisponibles: 100,
                nivel:     'Bronce',
            }));

            /* Guarda puntos de bienvenida */
            localStorage.setItem('vs_puntos_usuario', JSON.stringify({
                puntosHistorico:   100,
                puntosDisponibles: 100,
                nivel:             'Bronce',
            }));

            /* TODO (Supabase): supabase.auth.signUp({ email, password, options: { data: { nombre, apellido } } }) */
            /* TODO (Spring Boot): POST /api/auth/register */

            /* Redirige a cuenta con mensaje de bienvenida */
            localStorage.setItem('vs_registro_nuevo', '1');
            window.location.href = '../pages/cuenta.html';
        });
    }


    /* ============================================================
       BOTÓN GOOGLE
       TODO (Spring Boot): OAuth2 Google register
       TODO (Supabase): supabase.auth.signInWithOAuth({ provider: 'google' })
       ============================================================ */
    const btnGoogle = document.getElementById('btnGoogle');

    if (btnGoogle) {
        btnGoogle.addEventListener('click', () => {
            /* TODO (Spring Boot): OAuth2 Google register */
            /* TODO (Supabase): supabase.auth.signInWithOAuth({ provider: 'google' }) */
        });
    }

});