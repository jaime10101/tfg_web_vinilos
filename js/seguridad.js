/* ============================================================
   SEGURIDAD.JS — Integración real con Spring Boot + Supabase
   Conecta la sección de Seguridad de cuenta.html con el backend.

   REQUISITOS:
   - Spring Boot corriendo en API_BASE_URL
   - Token de Supabase guardado en localStorage como 'sb_access_token'
   - seguridad.js cargado DESPUÉS de cuenta.js en cuenta.html

   ACTIVAR: quita el comentario del <script> en cuenta.html cuando
   tengas el backend listo.
   ============================================================ */

const API_BASE_URL = 'http://localhost:8080/api'; /* TODO: cambiar a URL de producción */

/* ─── Auth helpers ──────────────────────────────────────────────── */

function getAccessToken() {
    /* El token lo guarda login.js tras el login con Supabase */
    return localStorage.getItem('sb_access_token') || '';
}

function authHeaders(extra = {}) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`,
        ...extra,
    };
}

/* ─── Cambiar contraseña ────────────────────────────────────────── */

async function cambiarPasswordReal() {
    const actual   = document.getElementById('passActual')?.value?.trim();
    const nueva    = document.getElementById('passNueva')?.value;
    const confirma = document.getElementById('passConfirm')?.value;

    /* Validaciones frontend */
    if (!actual)                         { showToast('Introduce tu contraseña actual', 'err'); return; }
    if (!nueva || nueva.length < 8)      { showToast('La nueva contraseña debe tener mínimo 8 caracteres', 'err'); return; }
    if (nueva !== confirma)              { showToast('Las contraseñas no coinciden', 'err'); return; }
    if (!/[A-Z]/.test(nueva))            { showToast('Debe incluir al menos una mayúscula', 'err'); return; }
    if (!/[0-9]/.test(nueva))            { showToast('Debe incluir al menos un número', 'err'); return; }
    if (!/[^A-Za-z0-9]/.test(nueva))     { showToast('Debe incluir al menos un símbolo', 'err'); return; }

    const btnEl = document.getElementById('btnCambiarPass');
    if (btnEl) { btnEl.disabled = true; btnEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...'; }

    try {
        const res  = await fetch(`${API_BASE_URL}/security/change-password`, {
            method:  'POST',
            headers: authHeaders(),
            body:    JSON.stringify({ currentPassword: actual, newPassword: nueva }),
        });
        const data = await res.json();

        if (res.ok) {
            /* Limpiar campos y requisitos */
            ['passActual','passNueva','passConfirm'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            document.querySelectorAll('.req').forEach(el => {
                el.classList.remove('ok');
                el.querySelector('i').className = 'fa-solid fa-circle';
            });
            showToast('Contraseña actualizada correctamente', 'ok');
        } else {
            showToast(data.error || 'Error al cambiar la contraseña', 'err');
        }
    } catch (e) {
        showToast('Error de conexión con el servidor', 'err');
        console.error('cambiarPassword:', e);
    } finally {
        if (btnEl) {
            btnEl.disabled = false;
            btnEl.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Actualizar contraseña';
        }
    }
}


/* ─── Sesiones activas ──────────────────────────────────────────── */

async function cargarSesionesReales() {
    const lista = document.getElementById('listaSesiones');
    if (!lista) return;

    lista.innerHTML = `
        <div style="text-align:center;padding:16px;color:rgba(255,255,255,0.3);font-size:12px">
            <i class="fa-solid fa-spinner fa-spin" style="margin-right:6px"></i>
            Cargando sesiones activas...
        </div>`;

    try {
        const res  = await fetch(`${API_BASE_URL}/security/sessions`, {
            headers: authHeaders(),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Error del servidor');

        if (!data.length) {
            lista.innerHTML = `<p style="font-size:12px;color:rgba(255,255,255,0.25);text-align:center;padding:12px">
                Sin sesiones registradas</p>`;
            return;
        }

        lista.innerHTML = data.map(s => `
            <div class="sesion-item ${s.current ? 'actual' : ''}" data-id="${s.id}">
                <div class="sesion-icono">
                    <i class="fa-solid fa-${s.deviceType === 'mobile' ? 'mobile-screen-button' : 'desktop'}"></i>
                </div>
                <div class="sesion-info">
                    <span class="sesion-dispositivo">${s.deviceName}</span>
                    <span class="sesion-meta">${s.location || 'Ubicación desconocida'} · ${formatRelativo(s.lastActive)}</span>
                </div>
                ${s.current
                    ? '<span class="sesion-badge-actual"><i class="fa-solid fa-circle-check"></i> Sesión actual</span>'
                    : `<button class="btn-cerrar-sesion-item" onclick="cerrarSesionRemota('${s.id}')">
                           <i class="fa-solid fa-xmark"></i>
                       </button>`
                }
            </div>`).join('');

    } catch (e) {
        lista.innerHTML = `<p style="color:rgba(255,80,80,0.7);font-size:12px;padding:8px">
            Error al cargar sesiones: ${e.message}</p>`;
        console.error('cargarSesiones:', e);
    }
}

async function cerrarSesionRemota(sessionId) {
    const el = document.querySelector(`.sesion-item[data-id="${sessionId}"]`);

    try {
        const res = await fetch(`${API_BASE_URL}/security/sessions/${sessionId}`, {
            method:  'DELETE',
            headers: authHeaders(),
        });

        if (res.ok) {
            if (el) { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }
            showToast('Sesión cerrada correctamente', 'ok');
        } else {
            const d = await res.json();
            showToast(d.error || 'Error al cerrar la sesión', 'err');
        }
    } catch (e) {
        showToast('Error de conexión', 'err');
    }
}

async function cerrarTodasSesionesRemoto() {
    const currentSessionId = localStorage.getItem('vs_session_id') || '';

    try {
        const res = await fetch(`${API_BASE_URL}/security/sessions`, {
            method:  'DELETE',
            headers: authHeaders({ 'X-Current-Session': currentSessionId }),
        });

        if (res.ok) {
            document.querySelectorAll('.sesion-item:not(.actual)').forEach(el => {
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 300);
            });
            showToast('Todas las demás sesiones han sido cerradas', 'ok');
        }
    } catch (e) {
        showToast('Error de conexión', 'err');
    }
}


/* ─── 2FA TOTP ──────────────────────────────────────────────────── */

let totp2FASecret = ''; /* secreto temporal durante la configuración */

async function iniciar2FA() {
    const btnEl = document.getElementById('btn2FAToggle');
    if (btnEl) { btnEl.disabled = true; btnEl.textContent = 'Generando QR...'; }

    try {
        const res  = await fetch(`${API_BASE_URL}/security/2fa/setup`, {
            method:  'POST',
            headers: authHeaders(),
        });
        const data = await res.json();

        totp2FASecret = data.secret;

        /* Rellena el modal con el QR */
        const qrEl  = document.getElementById('qrCode2FA');
        const secEl = document.getElementById('secret2FA');
        if (qrEl)  qrEl.src = data.qrCode;
        if (secEl) secEl.textContent = data.secret;

        abrirModal('modal2FA');

    } catch (e) {
        showToast('Error al generar el 2FA', 'err');
        console.error('iniciar2FA:', e);
    } finally {
        if (btnEl) { btnEl.disabled = false; btnEl.textContent = 'Activar 2FA'; }
    }
}

async function verificar2FA() {
    const code  = document.getElementById('codigo2FA')?.value?.trim();
    const btnEl = document.getElementById('btnVerificar2FA');

    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
        showToast('El código debe tener exactamente 6 dígitos', 'err');
        return;
    }

    if (btnEl) { btnEl.disabled = true; btnEl.textContent = 'Verificando...'; }

    try {
        const res  = await fetch(`${API_BASE_URL}/security/2fa/verify`, {
            method:  'POST',
            headers: authHeaders(),
            body:    JSON.stringify({ code }),
        });
        const data = await res.json();

        if (res.ok) {
            cerrarModal('modal2FA');
            /* Muestra los códigos de respaldo */
            mostrarCodigosRespaldo(data.backupCodes);
            /* Actualiza el estado del botón en la UI */
            actualizar2FAEstado(true);
            showToast('2FA activado correctamente', 'ok');
        } else {
            showToast(data.error || 'Código incorrecto', 'err');
            document.getElementById('codigo2FA').value = '';
            document.getElementById('codigo2FA').focus();
        }
    } catch (e) {
        showToast('Error de conexión', 'err');
    } finally {
        if (btnEl) { btnEl.disabled = false; btnEl.textContent = 'Verificar'; }
    }
}

async function desactivar2FA() {
    const code  = prompt('Introduce tu código de Google Authenticator para desactivar el 2FA:');
    if (!code) return;

    try {
        const res  = await fetch(`${API_BASE_URL}/security/2fa`, {
            method:  'DELETE',
            headers: authHeaders(),
            body:    JSON.stringify({ code }),
        });
        const data = await res.json();

        if (res.ok) {
            actualizar2FAEstado(false);
            showToast('2FA desactivado', 'ok');
        } else {
            showToast(data.error || 'Código incorrecto', 'err');
        }
    } catch (e) {
        showToast('Error de conexión', 'err');
    }
}

function mostrarCodigosRespaldo(codes) {
    const contenedor = document.getElementById('codigosRespaldoLista');
    if (contenedor) {
        contenedor.innerHTML = codes.map(c =>
            `<span class="codigo-respaldo">${c}</span>`
        ).join('');
    }
    abrirModal('modalCodigosRespaldo');
}

function actualizar2FAEstado(activo) {
    /* btn2FAToggle — cambia el texto del botón */
    const btn = document.getElementById('btn2FAToggle');
    if (btn) btn.innerHTML = activo
        ? '<i class="fa-solid fa-shield-halved"></i> Desactivar 2FA'
        : '<i class="fa-solid fa-shield-halved"></i> Activar 2FA';

    /* badge2FAEstado — muestra Activo / Inactivo */
    const badge = document.getElementById('badge2FAEstado');
    if (badge) {
        badge.textContent    = activo ? 'Activo' : 'Inactivo';
        badge.style.color    = activo ? '#4ade80' : 'rgba(255,255,255,0.3)';
        badge.style.borderColor = activo
            ? 'rgba(74,222,128,0.3)'
            : 'rgba(255,255,255,0.1)';
        badge.style.background = activo
            ? 'rgba(74,222,128,0.08)'
            : 'transparent';
    }

    localStorage.setItem('vs_2fa_activo', activo ? '1' : '0');
}

/* ─── Verificar 2FA al hacer login ─────────────────────────────── */

async function verificarLogin2FA(code) {
    /* Llamado desde login.js después de que Supabase autentica correctamente */
    try {
        const res  = await fetch(`${API_BASE_URL}/security/2fa/check`, {
            method:  'POST',
            headers: authHeaders(),
            body:    JSON.stringify({ code }),
        });
        return res.ok;
    } catch (e) {
        return false;
    }
}


/* ─── Helpers ───────────────────────────────────────────────────── */

function formatRelativo(isoDate) {
    if (!isoDate) return '–';
    const diff = Date.now() - new Date(isoDate).getTime();
    const min  = Math.floor(diff / 60000);
    if (min < 1)  return 'Ahora mismo';
    if (min < 60) return `Hace ${min} min`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return hrs === 1 ? 'Hace 1 hora' : `Hace ${hrs} horas`;
    const dias = Math.floor(hrs / 24);
    return dias === 1 ? 'Ayer' : `Hace ${dias} días`;
}


/* ─── Sobreescribir los listeners de cuenta.js cuando se carga este archivo ── */
/* Solo se activan cuando seguridad.js está incluido en cuenta.html            */

document.addEventListener('DOMContentLoaded', () => {
    /* Cambiar contraseña — reemplaza el simulado de cuenta.js */
    document.getElementById('btnCambiarPass')
        ?.addEventListener('click', cambiarPasswordReal);

    /* Sesiones — carga reales cuando el usuario navega a Seguridad */
    document.querySelectorAll('.nav-item[data-sec]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.sec === 'seguridad') cargarSesionesReales();
        });
    });

    /* Cerrar todas las sesiones */
    document.getElementById('btnCerrarSesiones')
        ?.addEventListener('click', cerrarTodasSesionesRemoto);

    /* 2FA — botón toggle (Activar / Desactivar) */
    document.getElementById('btn2FAToggle')
        ?.addEventListener('click', () => {
            const activo = localStorage.getItem('vs_2fa_activo') === '1';
            activo ? desactivar2FA() : iniciar2FA();
        });

    /* Verificar código TOTP */
    document.getElementById('btnVerificar2FA')
        ?.addEventListener('click', verificar2FA);

    /* Input TOTP — solo dígitos, máx 6, Enter para verificar */
    const inputTotp = document.getElementById('codigo2FA');
    if (inputTotp) {
        inputTotp.addEventListener('input', e => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
        });
        inputTotp.addEventListener('keydown', e => {
            if (e.key === 'Enter') verificar2FA();
        });
    }
});