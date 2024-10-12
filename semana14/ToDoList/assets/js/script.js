import { registerUser, loginUser, loginWithGoogle } from "./config.js";

// Mostrar formulario de registro al hacer clic
document.getElementById('showRegisterForm').addEventListener('click', () => {
    document.getElementById('loginForm').classList.add('d-none');
    document.getElementById('registerForm').classList.remove('d-none');
});

// Volver al formulario de inicio de sesión
document.getElementById('backToLogin').addEventListener('click', () => {
    document.getElementById('registerForm').classList.add('d-none');
    document.getElementById('loginForm').classList.remove('d-none');
});

// Manejar el envío del formulario de registro
document.getElementById('register').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (email && password) {
        registerUser(email, password)
            .then(() => {
                document.getElementById('register').reset();
            })
            .catch((error) => {
                alert(`Error: ${error.message}`);
            });
    } else {
        alert('Por favor, completa todos los campos.');
    }
});

// Manejar el envío del formulario de inicio de sesión
document.getElementById('login').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (email && password) {
        loginUser(email, password)
            .then(() => {
                document.getElementById('login').reset();
            })
            .catch((error) => {
                alert(`Error: ${error.message}`);
            });
    } else {
        alert('Por favor, completa todos los campos.');
    }
});

// Iniciar sesión con Google
document.getElementById('loginGoogleBtn').addEventListener('click', (event) => {
    event.preventDefault();
    loginWithGoogle();
});
