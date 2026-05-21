/* ============================================================
   LOGIN.JS — Lógica de la página de inicio de sesión
   TODO (Spring Boot): POST /api/auth/login
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* Toggle mostrar / ocultar contraseña */
    const inputPassword = document.getElementById('password');
    const btnToggle     = document.getElementById('togglePassword');

    if (inputPassword && btnToggle) {
        btnToggle.addEventListener('click', () => {
            const visible      = inputPassword.type === 'text';
            inputPassword.type = visible ? 'password' : 'text';
            btnToggle.innerHTML = visible
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';
        });
    }


    /* ============================================================
       ENVÍO DEL FORMULARIO
       TODO (Spring Boot): POST /api/auth/login { email, password }
       ============================================================ */
    const formLogin = document.getElementById('formLogin');

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const btnSubmit = formLogin.querySelector('button[type="submit"]');

            /* Validación — campos vacíos */
            if (!email || !password) {
                mostrarError('Por favor, completa todos los campos.');
                return;
            }

            /* Validación — formato email */
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                mostrarError('Introduce un correo electrónico válido.');
                return;
            }

            /* Estado cargando */
            btnSubmit.disabled     = true;
            btnSubmit.innerHTML    = '<i class="fa-solid fa-spinner fa-spin"></i> Iniciando sesión...';

            /* ── Modo local (sin Spring Boot) ──────────────────────
               Simula login guardando usuario en localStorage
               Eliminar este bloque cuando Spring Boot esté listo    */
            const usuarioLocal = {
                nombre:   email.split('@')[0],
                email:    email,
                socioNum: 'VS-' + Math.floor(1000 + Math.random() * 9000)
            };
            localStorage.setItem('vs_usuario', JSON.stringify(usuarioLocal));
            localStorage.setItem('sb_access_token', 'local_token_' + Date.now());
            window.location.href = '../index.html';
            /* ── Fin modo local ─────────────────────────────────── */

            /* TODO (Spring Boot): descomentar cuando el backend esté listo
            try {
                const response = await fetch('/api/auth/login', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.message || 'Credenciales incorrectas');
                }

                const data = await response.json();
                localStorage.setItem('sb_access_token', data.token);
                localStorage.setItem('vs_usuario', JSON.stringify(data.usuario));
                window.location.href = '../index.html';

            } catch (err) {
                mostrarError(err.message);
                btnSubmit.disabled  = false;
                btnSubmit.innerHTML = 'Iniciar Sesión';
            }
            */
        });
    }


    /* ============================================================
       BOTÓN GOOGLE
       TODO (Spring Boot): OAuth2 Google login
       ============================================================ */
    const btnGoogle = document.getElementById('btnGoogle');

    if (btnGoogle) {
        btnGoogle.addEventListener('click', () => {
            /* TODO (Spring Boot): window.location.href = '/oauth2/authorization/google'; */
            alert('Login con Google disponible próximamente.');
        });
    }


    /* Muestra un mensaje de error bajo el formulario */
    function mostrarError(msg) {
        let errDiv = document.getElementById('loginError');
        if (!errDiv) {
            errDiv = document.createElement('div');
            errDiv.id = 'loginError';
            errDiv.style.cssText = `
                background: rgba(255,80,80,0.1);
                border: 1px solid rgba(255,80,80,0.4);
                color: rgba(255,100,100,0.9);
                padding: 10px 16px;
                border-radius: 8px;
                font-size: 13px;
                margin-top: 12px;
            `;
            document.getElementById('formLogin').appendChild(errDiv);
        }
        errDiv.textContent = msg;
        setTimeout(() => { if (errDiv) errDiv.remove(); }, 4000);
    }

});