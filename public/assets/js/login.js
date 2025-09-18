// public/assets/js/login.js

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    errorDiv.style.display = 'none';
    
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            // Redirección según el rol
            switch (data.role) {
                case 'admin':
                    window.location.href = '/public/pages/admin.page.html';
                    break;
                case 'docente':
                    window.location.href = '/public/pages/docentes.page.html';
                    break;
                case 'moderador':
                    window.location.href = '/public/pages/mod.page.html';
                    break;
                case 'usuario':
                default:
                    window.location.href = '/public/pages/user.page.html';
            }
        } else {
            errorDiv.textContent = data.message || 'Credenciales incorrectas';
            errorDiv.style.display = 'block';
        }
    } catch (err) {
        errorDiv.textContent = 'Error de conexión con el servidor';
        errorDiv.style.display = 'block';
    }
});
