document.addEventListener('DOMContentLoaded', () => {
    // Función para activar pantalla completa (multiplataforma)
    function activarPantallaCompleta() {
        const elem = document.documentElement;

        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.log('No se pudo activar pantalla completa:', err);
            });
        } else if (elem.webkitRequestFullscreen) { // Safari
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE11
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        }
    }

    // Intentar activar pantalla completa al cargar
    // Nota: Algunos navegadores requieren interacción del usuario
    setTimeout(() => {
        activarPantallaCompleta();
    }, 100);

    // También intentar al hacer clic en cualquier parte (por si falla el automático)
    let fullscreenActivated = false;
    document.addEventListener('click', function activateOnce() {
        if (!fullscreenActivated) {
            activarPantallaCompleta();
            fullscreenActivated = true;
            // Remover el listener después del primer clic
            document.removeEventListener('click', activateOnce);
        }
    }, { once: true });

    // Referencias al modal de login
    const loginModal = document.getElementById('loginModal');
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const mainContainer = document.getElementById('container');

    // Ocultar el contenido principal al inicio
    mainContainer.style.display = 'none';

    // Variable para guardar el nombre de usuario
    let nombreUsuario = '';

    // Función para validar login
    function validateLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (username === '') {
            alert('Por favor ingresa tu nombre 💕');
            return;
        }

        if (password === 'teamo') {
            // Guardar el nombre de usuario
            nombreUsuario = username;

            // Login exitoso
            loginModal.classList.add('hidden');
            mainContainer.style.display = 'block';

            // Animación de entrada del contenido principal
            mainContainer.style.animation = 'fadeInScale 1s ease-out';
        } else {
            alert('Contraseña incorrecta 😢\nPista: La contraseña es "teamo"');
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    // Event listener para el botón de login
    loginButton.addEventListener('click', validateLogin);

    // Permitir login con Enter
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            validateLogin();
        }
    });

    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            passwordInput.focus();
        }
    });

    // Referencias a elementos principales
    const noButton = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    const mainContent = document.getElementById('mainContent');
    const container = document.getElementById('container');
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');

    // Configurar canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Sistema de partículas de corazones
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 15 + 10;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;

            if (this.y > canvas.height) {
                this.reset();
            }

            if (this.x < 0 || this.x > canvas.width) {
                this.speedX *= -1;
            }
        }

        draw() {
            ctx.font = `${this.size}px Arial`;
            ctx.globalAlpha = this.opacity;

            const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝'];
            const heart = hearts[Math.floor(Math.random() * hearts.length)];

            ctx.fillText(heart, this.x, this.y);
        }
    }

    // Crear partículas
    const particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle());
    }

    // Animar partículas
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Redimensionar canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Referencias al modal de error
    const errorModal = document.getElementById('errorModal');
    const closeModal = document.getElementById('closeModal');
    const acceptError = document.getElementById('acceptError');

    // Función para mostrar el modal de error
    function showErrorModal() {
        errorModal.classList.add('show');
    }

    // Función para cerrar el modal de error
    function hideErrorModal() {
        errorModal.classList.remove('show');
    }

    // Cerrar modal con la X
    closeModal.addEventListener('click', hideErrorModal);

    // Cerrar modal con el botón Aceptar
    acceptError.addEventListener('click', hideErrorModal);

    // Cerrar modal al hacer clic fuera de él
    errorModal.addEventListener('click', (e) => {
        if (e.target === errorModal) {
            hideErrorModal();
        }
    });

    // Lógica del botón "No" que se mueve
    noButton.addEventListener('mouseover', () => {
        const containerRect = container.getBoundingClientRect();
        const noButtonRect = noButton.getBoundingClientRect();

        // Calcular posiciones aleatorias dentro del contenedor
        const maxX = containerRect.width - noButtonRect.width - 20;
        const maxY = containerRect.height - noButtonRect.height - 20;

        const randomX = Math.floor(Math.random() * maxX) + 10;
        const randomY = Math.floor(Math.random() * maxY) + 10;

        noButton.style.left = randomX + 'px';
        noButton.style.top = randomY + 'px';
        noButton.style.bottom = 'auto';
        noButton.style.marginLeft = '0';
    });

    // Mostrar modal de error si logran hacer clic en "No"
    noButton.addEventListener('click', (e) => {
        e.preventDefault();
        showErrorModal();
    });

    // También mover en dispositivos móviles al intentar tocar
    let touchMoveCount = 0;
    noButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchMoveCount++;

        // Si intentan tocar muchas veces, mostrar el modal
        if (touchMoveCount > 5) {
            showErrorModal();
            touchMoveCount = 0;
            return;
        }

        const containerRect = container.getBoundingClientRect();
        const noButtonRect = noButton.getBoundingClientRect();

        const maxX = containerRect.width - noButtonRect.width - 20;
        const maxY = containerRect.height - noButtonRect.height - 20;

        const randomX = Math.floor(Math.random() * maxX) + 10;
        const randomY = Math.floor(Math.random() * maxY) + 10;

        noButton.style.left = randomX + 'px';
        noButton.style.top = randomY + 'px';
        noButton.style.bottom = 'auto';
        noButton.style.marginLeft = '0';
        noButton.style.transform = 'none';
    });

    // Crear lluvia de besos y flores
    function createConfetti() {
        // Array de rutas de imágenes de besos y flores
        const images = [
            'img/kiss.png',
            'img/flower.png',
            'img/heart.png'
        ];

        for (let i = 0; i < 60; i++) {
            const confetti = document.createElement('img');
            confetti.className = 'confetti-image';
            confetti.src = images[Math.floor(Math.random() * images.length)];
            confetti.alt = 'confetti';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-50px';
            confetti.style.width = (Math.random() * 30 + 30) + 'px';
            confetti.style.height = (Math.random() * 30 + 30) + 'px';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 3) + 's';

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 6000);
        }
    }

    // Lógica del botón "Sí"
    yesButton.addEventListener('click', () => {
        // Convertir nombre a mayúsculas
        const nombreMayusculas = nombreUsuario.toUpperCase();

        mainContent.innerHTML = `
            <div id="successMessage">
                ¡Sabía que dirías que sí!
                <div class="success-image-container">
                    <img src="img/feliz.jpg" alt="Feliz" class="success-image" id="successImage">
                </div>
                <div style="margin-top: 20px; font-size: 3.5rem; opacity: 0.9; font-weight: 700;">
                    ¡TE AMO${nombreUsuario ? ', ' + nombreMayusculas : ''}! 💕
                </div>
            </div>
        `;

        // Agregar evento click a la imagen para cerrar el navegador
        setTimeout(() => {
            const successImage = document.getElementById('successImage');
            if (successImage) {
                successImage.style.cursor = 'pointer';
                successImage.addEventListener('click', () => {
                    // Intentar cerrar la ventana/pestaña
                    window.close();

                    // Si no se puede cerrar (por restricciones del navegador), mostrar mensaje
                    setTimeout(() => {
                        alert('Por favor cierra esta pestaña manualmente 💕');
                    }, 100);
                });
            }
        }, 100);

        // Crear confetti
        createConfetti();

        // Aumentar partículas temporalmente
        for (let i = 0; i < 20; i++) {
            particles.push(new Particle());
        }

        // Remover partículas extra después de 3 segundos
        setTimeout(() => {
            particles.splice(30, 20);
        }, 3000);
    });
});
